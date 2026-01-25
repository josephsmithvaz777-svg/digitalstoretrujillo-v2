import type { APIRoute } from 'astro';
import { supabaseAdmin, getAdminUserFromToken } from '../../../../lib/supabase';
import { PaypalService } from '../../../../lib/paypal';
import { notifyNewOrder } from '../../../../lib/notifications';

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { buyerInfo, cartItems, totalPEN, totalUSD, userId } = body;

        // Check for authenticated user
        const authHeader = request.headers.get('Authorization');
        const user = await getAdminUserFromToken(authHeader);

        // Use authenticated user ID or fallback to provided userId (for pending verification)
        const finalUserId = user?.id || userId || null;

        if (!buyerInfo || !cartItems || !totalPEN) {
            return new Response(JSON.stringify({ error: 'Missing required data' }), { status: 400 });
        }

        if (!supabaseAdmin) {
            return new Response(JSON.stringify({ error: 'Supabase Admin client not initialized' }), { status: 500 });
        }

        // 1. Generate Order Number
        const { data: orderNumber, error: rpcError } = await supabaseAdmin.rpc('generate_order_number');
        const order_number = orderNumber || `DST-${Date.now()}`;

        // 2. Create Pending Order
        // Note: Using 'paypal' as method. Ensure DB schema is updated or handles this.
        const { data: order, error: orderError } = await supabaseAdmin
            .from('orders')
            .insert({
                order_number,
                user_id: finalUserId, // Link to user
                customer_email: buyerInfo.email,
                customer_name: `${buyerInfo.firstName} ${buyerInfo.lastName}`,
                customer_phone: buyerInfo.phone || null,
                items: cartItems,
                subtotal: totalPEN,
                total: totalPEN,
                currency: 'PEN',
                payment_method: 'paypal', // We will update schema to allow this
                payment_status: 'pending',
                status: 'pending'
            })
            .select()
            .single();

        if (orderError) {
            console.error('Order Error:', orderError);
            // If payment_method 'paypal' fails due to constraint, it will error here.
            throw new Error(`Failed to create order: ${orderError.message}`);
        }

        // 3. Create PayPal Order
        const conversionRate = 3.8; // PEN to USD rate fallback
        const amountUSD = totalUSD ? totalUSD.toFixed(2) : (totalPEN / conversionRate).toFixed(2);

        const paypalOrder = await PaypalService.createOrder({
            amount: parseFloat(amountUSD),
            currency: 'USD',
            order_number: order_number,
            redirect_url: `${new URL(request.url).origin}/api/payments/paypal/capture?orderId=${order.id}`,
            cancel_url: `${new URL(request.url).origin}/payment?status=cancel&orderId=${order.id}`
        });

        // 4. Update order with reference (PayPal Order ID)
        await supabaseAdmin
            .from('orders')
            .update({ payment_reference: paypalOrder.id })
            .eq('id', order.id);

        // 5. Send Notifications
        notifyNewOrder(order);

        return new Response(JSON.stringify({
            url: paypalOrder.url,
            orderId: order.id
        }), { status: 200 });

    } catch (error: any) {
        console.error('PayPal Payment Creation Error:', error);
        return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { status: 500 });
    }
};
