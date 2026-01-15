import { sendEmail } from './mail';

// --- Configuration ---
const TELEGRAM_BOT_TOKEN = import.meta.env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = import.meta.env.TELEGRAM_CHAT_ID || process.env.TELEGRAM_CHAT_ID;
const NOTIFICATION_EMAIL_TO = import.meta.env.NOTIFICATION_EMAIL_TO || process.env.NOTIFICATION_EMAIL_TO || 'admin@digitalstoretrujillo.com';

// --- Telegram Notification ---
export async function sendTelegramNotification(message: string) {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.warn('Telegram notifications skipped: Missing credentials (TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID)');
        return;
    }

    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });

        if (!response.ok) {
            const data = await response.json();
            console.error('Telegram API Error:', data);
        }
    } catch (error) {
        console.error('Failed to send Telegram notification:', error);
    }
}

// --- Main Handler ---
export async function notifyNewOrder(order: any) {
    const currency = order.currency || 'PEN';
    const total = order.total || 0;
    const date = new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' });

    // Format Products List
    const productsList = Array.isArray(order.items) 
        ? order.items.map((item: any) => `• ${item.title} (x${item.quantity})`).join('\n')
        : 'Sin productos';

    const productsHtml = Array.isArray(order.items)
        ? order.items.map((item: any) => `
            <div style="margin-bottom: 8px; font-size: 14px; color: #fff;">
                <span style="color: #a3a3a3;">•</span> ${item.title} <span style="color: #666; font-size: 12px;">(x${item.quantity})</span>
            </div>
        `).join('')
        : '<p style="color: #666; font-size: 14px;">Sin información de productos</p>';

    // 1. Telegram Message
    const telegramMessage = `
<b>🚨 Nueva Orden Recibida!</b>

<b>Orden:</b> <code>${order.order_number}</code>
<b>Cliente:</b> ${order.customer_name}
<b>Email:</b> ${order.customer_email}
<b>Monto:</b> ${currency} ${total}
<b>Pago:</b> ${order.payment_method}
<b>Estado:</b> ${order.payment_status}
<b>Fecha:</b> ${date}

<b>📦 Productos:</b>
${productsList}

<a href="https://digitalstoretrujillo.store/admin/orders">Ver detalles en Admin</a>
    `.trim();

    // 2. Email Content
    const emailSubject = `🔔 Nueva Venta #${order.order_number} - ${currency} ${total}`;
    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nueva Orden Recibida</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0f0f0f; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-font-smoothing: antialiased;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0f0f0f;">
            <tr>
                <td align="center" style="padding: 40px 0;">
                    <!-- Main Container -->
                    <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #1a1a1a; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.5); border: 1px solid #333;">
                        
                        <!-- Header -->
                        <tr>
                            <td align="center" style="padding: 30px 0; background-color: #1a1a1a; border-bottom: 1px solid #333;">
                                <h2 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">
                                    <span style="color: #E50914;">Digital</span>Store
                                </h2>
                            </td>
                        </tr>

                        <!-- Content -->
                        <tr>
                            <td style="padding: 40px 30px;">
                                <!-- Notification Badge -->
                                <div style="text-align: center; margin-bottom: 25px;">
                                    <span style="background-color: rgba(229, 9, 20, 0.1); color: #E50914; padding: 8px 16px; border-radius: 50px; font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; border: 1px solid rgba(229, 9, 20, 0.2);">
                                        Nueva Venta
                                    </span>
                                </div>

                                <!-- Main Title -->
                                <h1 style="color: #ffffff; margin: 0 0 10px 0; font-size: 28px; font-weight: 700; text-align: center;">
                                    ¡Orden Recibida!
                                </h1>
                                <p style="color: #a3a3a3; margin: 0 0 30px 0; font-size: 16px; text-align: center;">
                                    Has recibido una nueva orden <strong>#${order.order_number}</strong>
                                </p>

                                <!-- Order Details Card -->
                                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #252525; border-radius: 12px; margin-bottom: 30px;">
                                    <tr>
                                        <td style="padding: 20px;">
                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                <tr>
                                                    <td style="padding-bottom: 15px; border-bottom: 1px solid #333;">
                                                        <p style="margin: 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Cliente</p>
                                                        <p style="margin: 5px 0 0 0; color: #ffffff; font-size: 16px; font-weight: 600;">${order.customer_name}</p>
                                                        <p style="margin: 2px 0 0 0; color: #a3a3a3; font-size: 14px;">${order.customer_email}</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 15px 0; border-bottom: 1px solid #333;">
                                                        <p style="margin: 0 0 10px 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Productos</p>
                                                        ${productsHtml}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 15px 0; border-bottom: 1px solid #333;">
                                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                            <tr>
                                                                <td width="50%">
                                                                    <p style="margin: 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Monto</p>
                                                                    <p style="margin: 5px 0 0 0; color: #ffffff; font-size: 18px; font-weight: 700;">${currency} ${total}</p>
                                                                </td>
                                                                <td width="50%">
                                                                    <p style="margin: 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Pago</p>
                                                                    <p style="margin: 5px 0 0 0; color: #ffffff; font-size: 16px; font-weight: 600; text-transform: capitalize;">${order.payment_method}</p>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding-top: 15px;">
                                                        <p style="margin: 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Estado</p>
                                                        <p style="margin: 5px 0 0 0; color: #4ade80; font-size: 14px; font-weight: 600; text-transform: uppercase;">● ${order.payment_status}</p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>

                                <!-- CTA Button -->
                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td align="center">
                                            <a href="https://digitalstoretrujillo.store/admin/orders" style="background-color: #E50914; color: #ffffff; display: inline-block; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px; transition: all 0.3s ease;">
                                                Gestionar Orden
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #252525; padding: 20px; text-align: center; border-top: 1px solid #333;">
                                <p style="margin: 0; color: #666; font-size: 12px;">
                                    © 2024 Digital Store Trujillo. Panel de Administración.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    // Send both in parallel
    Promise.allSettled([
        sendTelegramNotification(telegramMessage),
        sendEmail({
            to: NOTIFICATION_EMAIL_TO,
            subject: emailSubject,
            html: emailHtml
        })
    ]).then(results => {
        // Optional: Log failure if needed, but don't block
        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                console.error(`Notification failed (${index === 0 ? 'Telegram' : 'Email'}):`, result.reason);
            }
        });
    });
}
