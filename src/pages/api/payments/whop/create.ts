import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../../lib/supabase';
import { WhopService } from '../../../../lib/whop';

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { buyerInfo, cartItems, totalPEN } = body;

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
        const { data: order, error: orderError } = await supabaseAdmin
            .from('orders')
            .insert({
                order_number,
                customer_email: buyerInfo.email,
                customer_name: `${buyerInfo.firstName} ${buyerInfo.lastName}`,
                customer_phone: buyerInfo.phone || null,
                items: cartItems,
                subtotal: totalPEN,
                total: totalPEN,
                currency: 'PEN',
                payment_method: 'whop',
                payment_status: 'pending',
                status: 'pending'
            })
            .select()
            .single();

        if (orderError) {
            console.error('Order Error:', orderError);
            throw new Error('Failed to create order in database');
        }

        // 3. Create Whop Checkout Configuration
        // Using the same rate as others for USD conversion if needed, 
        // but Whop might support PEN. Let's stick to USD for safety if PEN is not default.
        const conversionRate = 2.4;
        const amountUSD = (totalPEN / conversionRate).toFixed(2);

        const checkout = await WhopService.createCheckoutSession({
            amount: parseFloat(amountUSD),
            currency: 'USD',
            description: `Order ${order_number} - Digital Store Trujillo`,
            order_id: order.id,
            redirect_url: `${new URL(request.url).origin}/payment?status=success&orderId=${order.id}`
        });

        // 4. Update order with reference
        await supabaseAdmin
            .from('orders')
            .update({ payment_reference: checkout.id })
            .eq('id', order.id);

        return new Response(JSON.stringify({
            url: checkout.url,
            orderId: order.id
        }), { status: 200 });

    } catch (error: any) {
        console.error('Whop Payment Creation Error:', error);
        return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { status: 500 });
    }
};
