import type { APIRoute } from 'astro';
import { supabaseAdmin, getAdminUserFromToken } from '../../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
    // Security Check: Verify admin session via token
    const authHeader = request.headers.get('Authorization');
    const user = await getAdminUserFromToken(authHeader);
    if (!user || user.email !== 'admin@digitalstoretrujillo.com') {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    try {
        const { items } = await request.json(); // Expecting { items: { id: string, sort_order: number }[] }

        if (!supabaseAdmin) {
            throw new Error('Supabase admin client not initialized');
        }

        if (!Array.isArray(items)) {
            throw new Error('Invalid payload: items must be an array');
        }

        // Perform updates in parallel
        const updatePromises = items.map(item => 
            supabaseAdmin
                .from('products')
                .update({ sort_order: item.sort_order })
                .eq('id', item.id)
        );

        await Promise.all(updatePromises);

        return new Response(JSON.stringify({ message: 'Order updated successfully' }), { status: 200 });
    } catch (error: any) {
        console.error('API Reorder Error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
