import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../../lib/supabase';
import { WhopService } from '../../../../lib/whop';

export const POST: APIRoute = async ({ request }) => {
    try {
        const payload = await request.text();
        const signature = request.headers.get('x-whop-signature');
        const webhookSecret = import.meta.env.WHOP_WEBHOOK_SECRET;

        // Note: For initial setup without webhook secret in .env, we might skip verification or log it
        if (webhookSecret && signature) {
            const isValid = WhopService.verifyWebhookSignature(payload, signature, webhookSecret);
            if (!isValid) {
                return new Response('Invalid signature', { status: 401 });
            }
        }

        const event = JSON.parse(payload);

        // Whop webhook events for successful payment: "payment.succeeded" or "membership.went_active"
        // Let's check common event types.
        if (event.action === 'payment.succeeded' || event.action === 'membership.went_active') {
            const metadata = event.data.metadata || {};
            const orderId = metadata.order_id;

            if (orderId && supabaseAdmin) {
                const { error: updateError } = await supabaseAdmin
                    .from('orders')
                    .update({
                        payment_status: 'verified',
                        status: 'processing' // Or 'processing' depending on flow
                    })
                    .eq('id', orderId);

                if (updateError) {
                    console.error('Webhook Update Error:', updateError);
                    return new Response('Database error', { status: 500 });
                }
            }
        }

        return new Response('OK', { status: 200 });

    } catch (error: any) {
        console.error('Whop Webhook Error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
};
