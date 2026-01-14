import type { APIRoute } from 'astro';
import { supabaseAdmin, getAdminUserFromToken } from '../../../../lib/supabase';
import { notifyNewOrder } from '../../../../lib/notifications';

export const POST: APIRoute = async ({ request }) => {
    try {
        const formData = await request.formData();
        const screenshot = formData.get('screenshot') as File;
        const referenceCode = formData.get('referenceCode') as string;
        const paymentMethod = formData.get('paymentMethod') as string;
        const buyerInfoRaw = formData.get('buyerInfo') as string;
        const cartItemsRaw = formData.get('cartItems') as string;
        const totalPEN = parseFloat(formData.get('totalPEN') as string);
        const userId = formData.get('userId') as string;

        if (!screenshot || !referenceCode || !paymentMethod || !buyerInfoRaw || !cartItemsRaw || isNaN(totalPEN)) {
            console.error('[Manual Payment] Missing required fields:', {
                hasScreenshot: !!screenshot,
                hasRef: !!referenceCode,
                method: paymentMethod,
                hasBuyer: !!buyerInfoRaw,
                hasItems: !!cartItemsRaw,
                totalPEN
            });
            return new Response(JSON.stringify({ error: 'Faltan datos requeridos' }), { status: 400 });
        }

        const buyerInfo = JSON.parse(buyerInfoRaw);
        const cartItems = JSON.parse(cartItemsRaw);

        // Check for authenticated user
        const authHeader = request.headers.get('Authorization');
        const user = await getAdminUserFromToken(authHeader);
        const finalUserId = user?.id || (userId && userId !== 'null' ? userId : null);

        if (!supabaseAdmin) {
            return new Response(JSON.stringify({ error: 'Supabase Admin client not initialized' }), { status: 500 });
        }

        // 1. Generate Order Number
        const { data: orderNumber, error: rpcError } = await supabaseAdmin.rpc('generate_order_number');
        if (rpcError) {
            console.error('RPC Error:', rpcError);
            throw new Error('Failed to generate order number');
        }
        const finalOrderNumber = orderNumber || `DST-${Date.now()}`;

        // 2. Create Pending Order
        const { data: order, error: orderError } = await supabaseAdmin
            .from('orders')
            .insert({
                order_number: finalOrderNumber,
                user_id: finalUserId,
                customer_email: buyerInfo.email,
                customer_name: `${buyerInfo.firstName} ${buyerInfo.lastName}`,
                customer_phone: buyerInfo.phone || null,
                items: cartItems,
                subtotal: totalPEN,
                total: totalPEN,
                currency: 'PEN',
                payment_method: paymentMethod,
                payment_reference: referenceCode,
                payment_status: 'pending',
                status: 'pending'
            })
            .select()
            .single();

        if (orderError) {
            console.error('Order Insertion Error:', orderError);
            throw new Error('Failed to create order in database');
        }

        // 3. Upload Screenshot to Storage
        const fileExt = screenshot.name.split('.').pop();
        const fileName = `${order.id}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabaseAdmin.storage
            .from('payment-proofs')
            .upload(filePath, screenshot);

        if (uploadError) {
            console.error('Storage Upload Error:', uploadError);
            throw new Error('Failed to upload payment proof');
        }

        // 4. Update order with screenshot URL
        const { data: { publicUrl } } = supabaseAdmin.storage
            .from('payment-proofs')
            .getPublicUrl(filePath);

        const { error: updateError } = await supabaseAdmin
            .from('orders')
            .update({ payment_proof: publicUrl })
            .eq('id', order.id);

        if (updateError) {
            console.error('Order Update Error (Proof URL):', updateError);
            // Non-critical if we have the reference, but good to have
        }

        // 5. Send Notifications (Async)
        notifyNewOrder(order);

        return new Response(JSON.stringify({
            success: true,
            orderId: order.id,
            orderNumber: finalOrderNumber,
            message: 'Comprobante enviado exitosamente. En breve verificaremos su pago.'
        }), { status: 200 });

    } catch (error: any) {
        console.error('Manual Payment Creation Error:', error);
        return new Response(JSON.stringify({ error: error.message || 'Error interno del servidor' }), { status: 500 });
    }
};
