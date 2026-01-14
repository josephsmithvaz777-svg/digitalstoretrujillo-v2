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

    // 1. Telegram Message
    const telegramMessage = `
<b>🚨 Nueva Orden Recibida!</b>

<b>Orden:</b> <code>${order.order_number}</code>
<b>Cliente:</b> ${order.customer_name}
<b>Monto:</b> ${currency} ${total}
<b>Pago:</b> ${order.payment_method}
<b>Estado:</b> ${order.payment_status}
<b>Fecha:</b> ${date}

<a href="https://digitalstoretrujillo.com/admin/orders">Ver detalles en Admin</a>
    `.trim();

    // 2. Email Content
    const emailSubject = `Nueva Orden #${order.order_number} - ${order.customer_name}`;
    const emailHtml = `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #0f0f0f; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h2 style="color: #ffffff; margin: 0;">Digital Store Trujillo</h2>
            </div>
            <div style="border: 1px solid #ddd; padding: 20px; border-top: none; border-radius: 0 0 8px 8px;">
                <h3 style="color: #E50914; margin-top: 0;">Nueva Orden Recibida</h3>
                <p>Se ha generado una nueva orden en la tienda.</p>
                
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #eee; width: 40%;"><strong>Orden #:</strong></td>
                        <td style="padding: 8px; border-bottom: 1px solid #eee;">${order.order_number}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Cliente:</strong></td>
                        <td style="padding: 8px; border-bottom: 1px solid #eee;">${order.customer_name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
                        <td style="padding: 8px; border-bottom: 1px solid #eee;">${order.customer_email}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Monto Total:</strong></td>
                        <td style="padding: 8px; border-bottom: 1px solid #eee;">${currency} ${total}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Método de Pago:</strong></td>
                        <td style="padding: 8px; border-bottom: 1px solid #eee;">${order.payment_method}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Estado:</strong></td>
                        <td style="padding: 8px; border-bottom: 1px solid #eee;">${order.payment_status}</td>
                    </tr>
                </table>

                <div style="text-align: center; margin-top: 30px;">
                    <a href="https://digitalstoretrujillo.com/admin/orders" style="background-color: #E50914; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px;">Ver Orden en Admin</a>
                </div>
            </div>
            <p style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
                Este es un mensaje automático del sistema.
            </p>
        </div>
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
