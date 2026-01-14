import { notifyNewOrder, sendTelegramNotification } from '../../lib/notifications';
import { sendEmail } from '../../lib/mail';
import { supabaseAdmin } from '../../lib/supabase';

export const GET: APIRoute = async ({ request }) => {
    try {
        const url = new URL(request.url);
        const type = url.searchParams.get('type') || 'all'; // 'telegram', 'email', 'all'
        
        // Load env vars for debug (safely)
        const envDebug = {
             TELEGRAM_BOT_TOKEN: import.meta.env.TELEGRAM_BOT_TOKEN ? 'Set (Hidden)' : 'Missing',
             TELEGRAM_CHAT_ID: import.meta.env.TELEGRAM_CHAT_ID ? import.meta.env.TELEGRAM_CHAT_ID : 'Missing',
             SMTP_HOST: import.meta.env.SMTP_HOST ? import.meta.env.SMTP_HOST : 'Missing',
             SMTP_USER: import.meta.env.SMTP_USER ? 'Set (Hidden)' : 'Missing',
             NOTIFICATION_EMAIL_TO: import.meta.env.NOTIFICATION_EMAIL_TO ? import.meta.env.NOTIFICATION_EMAIL_TO : 'Missing'
        };

        const logs: string[] = [];
        logs.push(`Environment check: ${JSON.stringify(envDebug)}`);

        if (type === 'telegram' || type === 'all') {
            try {
                await sendTelegramNotification(`🔔 <b>Test Notification</b>\nThis is a test message from Digital Store Trujillo.\nEnv Check: ${new Date().toISOString()}`);
                logs.push('✅ Telegram attempt sent (check bot)');
            } catch (e: any) {
                logs.push(`❌ Telegram error: ${e.message}`);
            }
        }

        if (type === 'email' || type === 'all') {
            try {
                const result = await sendEmail({
                    to: import.meta.env.NOTIFICATION_EMAIL_TO || 'admin@digitalstoretrujillo.com',
                    subject: 'Test Notification - Digital Store Trujillo',
                    html: '<h1>Test Email</h1><p>This is a test email to verify configuration.</p>'
                });
                
                if (result.success) {
                    logs.push(`✅ Email sent successfully. ID: ${result.messageId}`);
                } else {
                     // Detailed error logging
                     const err = result.error as any;
                     logs.push(`❌ Email failed details:`);
                     logs.push(`   Code: ${err.code}`);
                     logs.push(`   Response: ${err.response}`);
                     logs.push(`   Command: ${err.command}`);
                     logs.push(`   Message: ${err.message}`);
                     logs.push(`❌ Full error: ${JSON.stringify(result.error)}`);
                }
            } catch (e: any) {
                logs.push(`❌ Email exception: ${e.message}`);
            }
        }

        return new Response(JSON.stringify({ 
            status: 'finished', 
            logs
        }), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message, stack: error.stack }), { status: 500 });
    }
};
