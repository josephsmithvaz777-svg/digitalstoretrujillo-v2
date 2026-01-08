import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../../lib/supabase';
import { CryptomusService } from '../../../../lib/cryptomus';

export const POST: APIRoute = async ({ request }) => {
    try {
        const payload = await request.json();
        const sign = request.headers.get('sign');

        if (!sign) {
            return new Response(JSON.stringify({ error: 'Missing signature' }), { status: 400 });
        }

        // 1. Verify Signature
        const isValid = CryptomusService.verifySignature(payload, sign);
        if (!isValid) {
            console.warn('Invalid Cryptomus Signature received');
            return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 401 });
        }

        if (!supabaseAdmin) {
            return new Response(JSON.stringify({ error: 'Supabase Admin not initialized' }), { status: 500 });
        }

        const { order_id, status } = payload;

        // 2. Update Order Status
        // Cryptomus statuses: paid, paid_over, partial_paid, cancelled, etc.
        let paymentStatus: 'pending' | 'verified' | 'failed' = 'pending';
        let orderStatus: 'pending' | 'processing' | 'completed' | 'cancelled' = 'pending';

        if (status === 'paid' || status === 'paid_over') {
            paymentStatus = 'verified';
            orderStatus = 'processing';
        } else if (status === 'wrong_amount' || status === 'cancel' || status === 'fail') {
            paymentStatus = 'failed';
            orderStatus = 'cancelled';
        }

        const { error: updateError } = await supabaseAdmin
            .from('orders')
            .update({
                payment_status: paymentStatus,
                status: orderStatus,
                updated_at: new Date().toISOString()
            })
            .eq('id', order_id);

        if (updateError) {
            console.error('Webhook Update Error:', updateError);
            return new Response(JSON.stringify({ error: 'Failed to update order' }), { status: 500 });
        }

        return new Response(JSON.stringify({ success: true }), { status: 200 });

    } catch (error: any) {
        console.error('Webhook Error:', error);
        return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { status: 500 });
    }
};
