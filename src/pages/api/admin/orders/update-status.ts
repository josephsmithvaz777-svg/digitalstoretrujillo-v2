import type { APIRoute } from 'astro';
import { supabaseAdmin, getAdminUserFromToken } from '../../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
    try {
        const { orderId, status, paymentStatus } = await request.json();
        const authHeader = request.headers.get('Authorization');
        const adminUser = await getAdminUserFromToken(authHeader);

        // Simple check - you might want to verify if the user email matches your admin email
        if (!adminUser || adminUser.email !== 'admin@digitalstoretrujillo.com') {
            return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
        }

        if (!supabaseAdmin) {
            return new Response(JSON.stringify({ error: 'Supabase Admin not initialized' }), { status: 500 });
        }

        // 1. Update Order in Database
        const updateData: any = {};
        if (status) updateData.status = status;
        if (paymentStatus) updateData.payment_status = paymentStatus;

        const { data: order, error: updateError } = await supabaseAdmin
            .from('orders')
            .update(updateData)
            .eq('id', orderId)
            .select()
            .single();

        if (updateError) throw updateError;

        // 2. Logic for Automatic Email (Option A)
        // If the payment is verified or order completed, send email
        if (paymentStatus === 'verified' || status === 'completed') {
            const { sendEmail, getOrderConfirmationTemplate } = await import('../../../../lib/mail');

            await sendEmail({
                to: order.customer_email,
                subject: `¡Pago Confirmado! - Orden #${order.order_number}`,
                html: getOrderConfirmationTemplate(
                    order.customer_name,
                    order.order_number,
                    order.items
                )
            });
        }

        return new Response(JSON.stringify({ success: true, order }), { status: 200 });

    } catch (error: any) {
        console.error('Error updating order:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
