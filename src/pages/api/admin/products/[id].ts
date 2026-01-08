import type { APIRoute } from 'astro';
import { supabaseAdmin, getAdminUser } from '../../../../lib/supabase';

export const GET: APIRoute = async ({ params }) => {
    const { id } = params;

    if (!id) {
        return new Response(JSON.stringify({ error: 'Missing product ID' }), { status: 400 });
    }

    // Security Check: Verify admin session
    const user = await getAdminUser();
    if (!user || user.email !== 'admin@digitalstoretrujillo.com') {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    try {
        if (!supabaseAdmin) {
            throw new Error('Supabase admin client not initialized');
        }

        const { data, error } = await supabaseAdmin
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        if (!data) throw new Error('Product not found');

        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error: any) {
        console.error('API Fetch Error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};

export const PUT: APIRoute = async ({ params, request }) => {
    const { id } = params;

    if (!id) {
        return new Response(JSON.stringify({ error: 'Missing product ID' }), { status: 400 });
    }

    // Security Check: Verify admin session
    const user = await getAdminUser();
    if (!user || user.email !== 'admin@digitalstoretrujillo.com') {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    try {
        const productData = await request.json();

        if (!supabaseAdmin) {
            throw new Error('Supabase admin client not initialized');
        }

        const { error } = await supabaseAdmin
            .from('products')
            .update(productData)
            .eq('id', id);

        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error: any) {
        console.error('API Update Error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
