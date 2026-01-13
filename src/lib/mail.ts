import nodemailer from 'nodemailer';

const smtpHost = import.meta.env.SMTP_HOST;
const smtpPort = parseInt(import.meta.env.SMTP_PORT || '465');
const smtpUser = import.meta.env.SMTP_USER;
const smtpPass = import.meta.env.SMTP_PASS;
const smtpFromEmail = import.meta.env.SMTP_FROM_EMAIL;
const smtpFromName = import.meta.env.SMTP_FROM_NAME || 'Digital Store Trujillo';

const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465, // true for 465, false for other ports
    auth: {
        user: smtpUser,
        pass: smtpPass,
    },
});

interface MailOptions {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail({ to, subject, html }: MailOptions) {
    try {
        const info = await transporter.sendMail({
            from: `"${smtpFromName}" <${smtpFromEmail}>`,
            to,
            subject,
            html,
        });
        console.log('Message sent: %s', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
}

export function getOrderConfirmationTemplate(customerName: string, orderNumber: string, items: any[]) {
    const productListHtml = items.map(item => `
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

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f0f0f; color: #ffffff; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { color: #ffffff; font-size: 24px; font-weight: bold; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 10px; }
        .card { background-color: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 40px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3); }
        .icon { font-size: 48px; margin-bottom: 20px; display: block; }
        h1 { margin: 0 0 15px; font-size: 24px; font-weight: 700; color: #ffffff; }
        p { margin: 0 0 25px; color: #a3a3a3; line-height: 1.6; font-size: 16px; }
        .btn { display: inline-block; background-color: #ef4444; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; transition: background-color 0.2s; }
        .btn:hover { background-color: #dc2626; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        .footer a { color: #888; text-decoration: none; }
        .items-box { background-color: #0f0f0f; border-radius: 8px; padding: 20px; margin-bottom: 25px; border: 1px solid #333; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">
            🛍️ Digital Store Trujillo
          </div>
        </div>
        
        <div class="card">
          <div class="icon">✅</div>
          <h1>¡Pago Confirmado!</h1>
          <p>Hola ${customerName}, hemos verificado tu pago satisfactoriamente para la orden <strong>#${orderNumber}</strong>.</p>
          
          <div class="items-box">
            ${productListHtml}
          </div>

          <p>Ya puedes acceder a tus productos digitales y credenciales directamente desde tu panel de usuario.</p>
          
          <a href="${import.meta.env.PUBLIC_URL || 'https://digitalstoretrujillo.store'}/account" class="btn">Ver Mis Productos</a>
          
          <p style="margin-top: 25px; font-size: 14px; color: #666;">
            Si tienes alguna duda, puedes responder a este correo o contactarnos por WhatsApp.
          </p>
        </div>
        
        <div class="footer">
          <p>&copy; 2024 Digital Store Trujillo. All rights reserved.</p>
          <p>Trujillo, Peru 🇵🇪</p>
        </div>
      </div>
    </body>
    </html>
    `;
}
