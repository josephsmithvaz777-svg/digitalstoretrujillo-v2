import type { APIRoute } from 'astro';

const PAYPAL_CLIENT_ID = import.meta.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = import.meta.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_API_BASE = 'https://api-m.paypal.com'; // Use sandbox if needed: https://api-m.sandbox.paypal.com

export class PaypalService {
    private static async getAccessToken() {
        const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
        const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'grant_type=client_credentials',
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(`Failed to get PayPal access token: ${data.error_description || data.error}`);
        }
        return data.access_token;
    }

    static async createOrder(params: { amount: number; currency: string; order_number: string; redirect_url: string; cancel_url: string }) {
        const accessToken = await this.getAccessToken();
        const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        reference_id: params.order_number,
                        amount: {
                            currency_code: params.currency,
                            value: params.amount.toString(),
                        },
                        description: `Digital Store Trujillo - Order ${params.order_number}`,
                    },
                ],
                application_context: {
                    brand_name: 'Digital Store Trujillo',
                    landing_page: 'NO_PREFERENCE',
                    user_action: 'PAY_NOW',
                    return_url: params.redirect_url,
                    cancel_url: params.cancel_url,
                },
            }),
        });

        const data = await response.json();
        if (!response.ok) {
            console.error('PayPal Order Creation Error:', data);
            throw new Error(`PayPal API Error: ${JSON.stringify(data)}`);
        }

        const approvalUrl = data.links.find((link: any) => link.rel === 'approve')?.href;

        return {
            id: data.id,
            url: approvalUrl,
        };
    }

    static async captureOrder(orderId: string) {
        const accessToken = await this.getAccessToken();
        const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if (!response.ok) {
            console.error('PayPal Order Capture Error:', data);
            throw new Error(`PayPal API Error: ${JSON.stringify(data)}`);
        }

        return data;
    }
}
