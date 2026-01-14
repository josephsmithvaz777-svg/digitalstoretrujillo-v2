import type { APIRoute } from 'astro';
import { supabaseAdmin, getAdminUserFromToken } from '../../../../lib/supabase';
import { CryptomusService } from '../../../../lib/cryptomus';

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { buyerInfo, cartItems, totalPEN, userId } = body;

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

        // 1. Generate Order Number using the RPC
        const { data: orderNumber, error: rpcError } = await supabaseAdmin.rpc('generate_order_number');

        if (rpcError) {
            console.error('RPC Error:', rpcError);
            throw new Error('Failed to generate order number');
        }

        const order_number = orderNumber || `DST-${Date.now()}`;

        // 2. Create Pending Order in Supabase
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
                payment_method: 'cryptomus',
                payment_status: 'pending',
                status: 'pending'
            })
            .select()
            .single();

        if (orderError) {
            console.error('Order Error:', orderError);
            throw new Error('Failed to create order in database');
        }

        // 3. Create Cryptomus Payment
        // Convert PEN to USD for Cryptomus if needed, or send as PEN if supported.
        // Cryptomus supports PEN? Let's assume USD for better compatibility as per current logic in payment.astro
        const totalUSD = (totalPEN / 3.75).toFixed(2); // Using a more realistic rate or keeping 2.4 if user prefers? 
        // Wait, payment.astro used 2.4. I'll stick to 2.4 as specified in the UI/Logic of the site.
        const conversionRate = 2.4;
        const amountUSD = (totalPEN / conversionRate).toFixed(2);

        const cryptomusPayment = await CryptomusService.createPayment({
            amount: amountUSD,
            currency: 'USD',
            order_id: order.id,
            to_currency: 'USDT',
            network: 'BSC',
            url_return: `${new URL(request.url).origin}/payment?orderId=${order.id}`,
            url_success: `${new URL(request.url).origin}/payment?status=success&orderId=${order.id}`,
            url_callback: `${new URL(request.url).origin}/api/payments/cryptomus/webhook`,
        });

        // 4. Update order with Cryptomus UUID if needed
        await supabaseAdmin
            .from('orders')
            .update({ payment_reference: cryptomusPayment.uuid })
            .eq('id', order.id);

        // 5. Send Notifications
        notifyNewOrder(order);

        return new Response(JSON.stringify({
            url: cryptomusPayment.url,
            orderId: order.id
        }), { status: 200 });

    } catch (error: any) {
        console.error('Payment Creation Error:', error);
        return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { status: 500 });
    }
};
