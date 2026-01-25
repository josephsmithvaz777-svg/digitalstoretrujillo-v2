import type { APIRoute } from 'astro';
import { supabaseAdmin, getAdminUserFromToken } from '../../../../lib/supabase';

export const GET: APIRoute = async ({ params, request }) => {
    const { id } = params;

    if (!id) {
        return new Response(JSON.stringify({ error: 'Missing product ID' }), { status: 400 });
    }

    // Security Check: Verify admin session via token
    const authHeader = request.headers.get('Authorization');
    console.log('🔐 [GET] Auth Header:', authHeader ? 'Present' : 'Missing');

    const user = await getAdminUserFromToken(authHeader);
    console.log('👤 [GET] User from token:', user ? user.email : 'No user');

    if (!user || user.email !== 'admin@digitalstoretrujillo.com') {
        console.error('❌ [GET] Unauthorized access attempt');
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

    // Security Check: Verify admin session via token
    const authHeader = request.headers.get('Authorization');
    console.log('🔐 Auth Header:', authHeader ? 'Present' : 'Missing');

    const user = await getAdminUserFromToken(authHeader);
    console.log('👤 User from token:', user ? user.email : 'No user');
    console.log('✅ Expected admin email: admin@digitalstoretrujillo.com');

    if (!user) {
        console.error('❌ No user found from token');
        return new Response(JSON.stringify({ error: 'Unauthorized - No user found' }), { status: 401 });
    }

    if (user.email !== 'admin@digitalstoretrujillo.com') {
        console.error('❌ User email mismatch:', user.email, '!== admin@digitalstoretrujillo.com');
        return new Response(JSON.stringify({
            error: 'Unauthorized - Invalid admin user',
            userEmail: user.email
        }), { status: 401 });
    }

    console.log('✅ Auth check passed for user:', user.email);

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
