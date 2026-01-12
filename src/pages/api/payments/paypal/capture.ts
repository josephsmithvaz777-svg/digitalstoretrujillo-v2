import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../../lib/supabase';
import { PaypalService } from '../../../../lib/paypal';

export const GET: APIRoute = async ({ url }) => {
    try {
        const orderId = url.searchParams.get('orderId');
        const paypalOrderId = url.searchParams.get('token'); // PayPal provides 'token' which is the Order ID

        if (!orderId || !paypalOrderId) {
            return new Response(JSON.stringify({ error: 'Missing order information' }), { status: 400 });
        }

        if (!supabaseAdmin) {
            return new Response(JSON.stringify({ error: 'Supabase Admin client not initialized' }), { status: 500 });
        }

        // 1. Capture the PayPal payment
        const capture = await PaypalService.captureOrder(paypalOrderId);

        if (capture.status === 'COMPLETED') {
            // 2. Update order in database
            const { error: updateError } = await supabaseAdmin
                .from('orders')
                .update({
                    payment_status: 'verified',
                    status: 'processing',
                    updated_at: new Date().toISOString()
                })
                .eq('id', orderId);

            if (updateError) {
                console.error('Database update error:', updateError);
                throw new Error('Payment captured but failed to update order in database');
            }

            // Return a success script that can be handled by the parent window (if in iframe/popup)
            return new Response(`
                <html>
                    <body>
                        <script>
                            if (window.opener) {
                                // If opened as a popup
                                window.opener.postMessage({ type: 'paypal_success', orderId: '${orderId}' }, '*');
                                window.close();
                            } else if (window.parent && window.parent !== window) {
                                // If in iframe
                                window.parent.postMessage({ type: 'paypal_success', orderId: '${orderId}' }, '*');
                            } else {
                                // Normal redirect
                                window.location.href = '/payment?status=success&orderId=${orderId}&verified=true';
                            }
                        </script>
                        <div style="font-family: sans-serif; text-align: center; padding-top: 50px;">
                            <h2>Pago Verificado</h2>
                            <p>Procesando tu pedido... Ya puedes cerrar esta ventana.</p>
                        </div>
                    </body>
                </html>
            `, {
                status: 200,
                headers: {
                    'Content-Type': 'text/html'
                }
            });
        } else {
            throw new Error(`PayPal payment status: ${capture.status}`);
        }

    } catch (error: any) {
        console.error('PayPal Capture Error:', error);
        return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { status: 500 });
    }
};
