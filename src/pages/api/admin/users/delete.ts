import type { APIRoute } from 'astro';
import { supabaseAdmin, getAdminUserFromToken } from '../../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
    // Security Check: Verify admin session via token
    const authHeader = request.headers.get('Authorization');
    const user = await getAdminUserFromToken(authHeader);
    
    // Strict admin check - match email or custom role
    if (!user || user.email !== 'admin@digitalstoretrujillo.com') {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    try {
        const { userId } = await request.json();

        if (!userId) {
            return new Response(JSON.stringify({ error: 'Missing userId' }), { status: 400 });
        }

        if (!supabaseAdmin) {
            throw new Error('Supabase admin client not initialized');
        }

        // Delete user from Auth
        const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error: any) {
        console.error('Delete User Error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};