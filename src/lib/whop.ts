import crypto from 'node:crypto';

const WHOP_API_KEY = import.meta.env.WHOP_API_KEY;
const WHOP_COMPANY_ID = import.meta.env.WHOP_COMPANY_ID;

interface CreateCheckoutParams {
    amount: number;
    currency: string;
    description: string;
    order_id: string;
    redirect_url: string;
}

export class WhopService {
    static async createCheckoutSession(params: CreateCheckoutParams) {
        if (!WHOP_API_KEY || !WHOP_COMPANY_ID) {
            throw new Error('Whop credentials not found in environment variables');
        }

        const payload = {
            company_id: WHOP_COMPANY_ID,
            mode: 'payment',
            plan: {
                company_id: WHOP_COMPANY_ID,
                title: params.description,
                initial_price: params.amount,
                currency: params.currency.toLowerCase(),
                plan_type: 'one_time',
                visibility: 'hidden'
            },
            metadata: {
                order_id: params.order_id
            },
            redirect_url: params.redirect_url
        };

        const response = await fetch('https://api.whop.com/api/v2/checkout_configurations', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${WHOP_API_KEY}`,
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Whop Error:', data);
            throw new Error(data.message || 'Failed to create Whop checkout configuration');
        }

        // The checkout URL for a configuration is https://whop.com/checkout/[id]
        return {
            id: data.id,
            url: `https://whop.com/checkout/${data.id}`
        };
    }

    static verifyWebhookSignature(payload: string, signature: string, webhookSecret: string): boolean {
        const hmac = crypto.createHmac('sha256', webhookSecret);
        const digest = Buffer.from(hmac.update(payload).digest('hex'), 'utf8');
        const signatureBuffer = Buffer.from(signature, 'utf8');

        if (digest.length !== signatureBuffer.length) {
            return false;
        }

        return crypto.timingSafeEqual(digest, signatureBuffer);
    }
}
