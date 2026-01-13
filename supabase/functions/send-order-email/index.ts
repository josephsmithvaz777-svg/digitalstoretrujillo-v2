import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const MAILGUN_API_KEY = Deno.env.get("MAILGUN_API_KEY") || "";
const MAILGUN_DOMAIN = "digitalstoretrujillo.store";
const FROM_EMAIL = "noreply@digitalstoretrujillo.store";

serve(async (req) => {
    try {
        const { customerName, customerEmail, orderNumber, items } = await req.json();

        const productListHtml = items.map((item: any) => `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #333; padding-bottom: 10px;">
            <div style="text-align: left;">
                <p style="margin: 0; color: #ffffff; font-weight: 600;">${item.title}</p>
                <p style="margin: 0; color: #666; font-size: 12px;">Cantidad: ${item.quantity}</p>
            </div>
            <div style="text-align: right; color: #ef4444; font-weight: bold;">
                S/ ${(item.price * item.quantity).toFixed(2)}
            </div>
        </div>
    `).join('');

        const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f0f0f; color: #ffffff; margin: 0; padding: 0;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="color: #ffffff; font-size: 24px; font-weight: bold;">🛍️ Digital Store Trujillo</div>
        </div>
        
        <div style="background-color: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 40px; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 20px;">✅</div>
          <h1 style="margin: 0 0 15px; font-size: 24px; font-weight: 700; color: #ffffff;">¡Pago Confirmado!</h1>
          <p style="color: #a3a3a3; line-height: 1.6; font-size: 16px;">Hola ${customerName}, hemos verificado tu pago para la orden <strong>#${orderNumber}</strong>.</p>
          
          <div style="background-color: #0f0f0f; border-radius: 8px; padding: 20px; margin-bottom: 25px; border: 1px solid #333;">
            ${productListHtml}
          </div>

          <p style="color: #a3a3a3; line-height: 1.6; font-size: 16px;">Ya puedes acceder a tus productos desde tu panel.</p>
          
          <a href="https://digitalstoretrujillo.store/account" style="display: inline-block; background-color: #ef4444; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">Ver Mis Productos</a>
        </div>
      </div>
    </body>
    </html>
    `;

        const formData = new FormData();
        formData.append("from", `Digital Store Trujillo <${FROM_EMAIL}>`);
        formData.append("to", customerEmail);
        formData.append("subject", `¡Pago Confirmado! - Orden #${orderNumber}`);
        formData.append("html", html);

        const auth = btoa(`api:${MAILGUN_API_KEY}`);
        const res = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
            method: "POST",
            headers: {
                Authorization: `Basic ${auth}`,
            },
            body: formData,
        });

        const result = await res.json();

        return new Response(JSON.stringify(result), {
            headers: { "Content-Type": "application/json" },
            status: res.status,
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { "Content-Type": "application/json" },
            status: 500,
        });
    }
})
