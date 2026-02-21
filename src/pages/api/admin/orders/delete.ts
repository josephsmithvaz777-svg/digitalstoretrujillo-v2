import type { APIRoute } from 'astro';
import { supabaseAdmin, getAdminUserFromToken } from '../../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
    try {
        const authHeader = request.headers.get('Authorization');
        const adminUser = await getAdminUserFromToken(authHeader);

        if (!adminUser || adminUser.email !== 'admin@digitalstoretrujillo.store') {
            return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
        }

        if (!supabaseAdmin) {
            return new Response(JSON.stringify({ error: 'Supabase Admin no disponible' }), { status: 500 });
        }

        const { orderIds } = await request.json();

        if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
            return new Response(JSON.stringify({ error: 'Se requiere un array de orderIds' }), { status: 400 });
        }

        const { error } = await supabaseAdmin
            .from('orders')
            .delete()
            .in('id', orderIds);

        if (error) {
            console.error('Error deleting orders:', error);
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }

        return new Response(JSON.stringify({ success: true, deleted: orderIds.length }), { status: 200 });

    } catch (error: any) {
        console.error('Delete Order Error:', error);
        return new Response(JSON.stringify({ error: error.message || 'Error interno del servidor' }), { status: 500 });
    }
};
