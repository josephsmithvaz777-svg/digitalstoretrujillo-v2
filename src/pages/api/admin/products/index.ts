import type { APIRoute } from 'astro';
import { supabaseAdmin, getAdminUserFromToken } from '../../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
    // Security Check: Verify admin session via token
    const authHeader = request.headers.get('Authorization');
    const user = await getAdminUserFromToken(authHeader);
    if (!user || user.email !== 'admin@digitalstoretrujillo.store') {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    try {
        const productData = await request.json();

        if (!supabaseAdmin) {
            throw new Error('Supabase admin client not initialized');
        }

        const { data, error } = await supabaseAdmin
            .from('products')
            .insert(productData)
            .select()
            .single();

        if (error) throw error;

        return new Response(JSON.stringify(data), { status: 201 });
    } catch (error: any) {
        console.error('API Creation Error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
