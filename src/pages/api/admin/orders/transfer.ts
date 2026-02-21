import type { APIRoute } from 'astro';
import { supabaseAdmin, getAdminUserFromToken } from '../../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
    try {
        // --- Auth check: only admins can transfer orders ---
        const authHeader = request.headers.get('Authorization');
        const user = await getAdminUserFromToken(authHeader);
        if (!user || user.email !== 'admin@digitalstoretrujillo.store') {
            return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
        }

        if (!supabaseAdmin) {
            return new Response(JSON.stringify({ error: 'Supabase Admin no disponible' }), { status: 500 });
        }

        const { orderId, targetEmail } = await request.json();

        if (!orderId || !targetEmail) {
            return new Response(JSON.stringify({ error: 'Faltan campos requeridos: orderId y targetEmail' }), { status: 400 });
        }

        // --- Find the target user by email ---
        const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        if (listError) {
            console.error('Error listing users:', listError);
            return new Response(JSON.stringify({ error: 'Error al buscar usuarios' }), { status: 500 });
        }

        const targetUser = users.find(u => u.email?.toLowerCase() === targetEmail.toLowerCase().trim());
        if (!targetUser) {
            return new Response(JSON.stringify({ error: `No se encontró ningún usuario con el email: ${targetEmail}` }), { status: 404 });
        }

        // --- Update the order's user_id ---
        const { data: updatedOrder, error: updateError } = await supabaseAdmin
            .from('orders')
            .update({ user_id: targetUser.id })
            .eq('id', orderId)
            .select('id, order_number, customer_name')
            .single();

        if (updateError) {
            console.error('Error updating order user_id:', updateError);
            return new Response(JSON.stringify({ error: 'Error al actualizar la orden' }), { status: 500 });
        }

        return new Response(JSON.stringify({
            success: true,
            message: `Orden ${updatedOrder.order_number} transferida a ${targetUser.email} (${targetUser.id.slice(0, 8)}...)`,
            targetUserId: targetUser.id,
            targetUserEmail: targetUser.email,
        }), { status: 200 });

    } catch (error: any) {
        console.error('Transfer Order Error:', error);
        return new Response(JSON.stringify({ error: error.message || 'Error interno del servidor' }), { status: 500 });
    }
};
