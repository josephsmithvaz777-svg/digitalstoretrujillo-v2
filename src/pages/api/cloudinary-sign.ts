import type { APIRoute } from 'astro';
import { v2 as cloudinary } from 'cloudinary';

export const GET: APIRoute = async () => {
    const timestamp = Math.round(new Date().getTime() / 1000);

    // Use both import.meta.env and process.env for maximum compatibility
    const apiSecret = import.meta.env.CLOUDINARY_API_SECRET || (globalThis as any).process?.env?.CLOUDINARY_API_SECRET;
    const apiKey = import.meta.env.PUBLIC_CLOUDINARY_API_KEY || import.meta.env.CLOUDINARY_API_KEY || (globalThis as any).process?.env?.PUBLIC_CLOUDINARY_API_KEY || (globalThis as any).process?.env?.CLOUDINARY_API_KEY;
    const cloudName = import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME || (globalThis as any).process?.env?.PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!apiSecret || !apiKey || !cloudName) {
        const missing = [];
        if (!apiSecret) missing.push('CLOUDINARY_API_SECRET');
        if (!apiKey) missing.push('PUBLIC_CLOUDINARY_API_KEY/CLOUDINARY_API_KEY');
        if (!cloudName) missing.push('PUBLIC_CLOUDINARY_CLOUD_NAME');

        return new Response(JSON.stringify({
            error: `Credenciales de Cloudinary faltantes: ${missing.join(', ')}`
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Generate signature
    // For Media Library, we only need the timestamp for the signature
    const signature = cloudinary.utils.api_sign_request(
        { timestamp },
        apiSecret
    );

    return new Response(JSON.stringify({
        signature,
        timestamp,
        apiKey,
        cloudName
    }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
};
