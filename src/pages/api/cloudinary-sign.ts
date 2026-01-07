import type { APIRoute } from 'astro';
import { v2 as cloudinary } from 'cloudinary';

export const GET: APIRoute = async () => {
    const timestamp = Math.round(new Date().getTime() / 1000);

    // Use the secret from environment variables
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const cloudName = process.env.PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!apiSecret || !apiKey || !cloudName) {
        return new Response(JSON.stringify({
            error: 'Cloudinary credentials not configured on server'
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
