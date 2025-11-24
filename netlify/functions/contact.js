const nodemailer = require('nodemailer');

const RECIPIENT = process.env.CONTACT_RECIPIENT || 'dalmat.repair@gmail.com';

async function sendWithSendGrid(name, email, message) {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) throw new Error('No SendGrid API key');

    const sg = require('@sendgrid/mail');
    sg.setApiKey(apiKey);

    const subject = `New contact form message from ${name}`;
    const html = `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p><p><strong>Message:</strong></p><div>${message.replace(/\n/g, '<br/>')}</div>`;

    await sg.send({
        to: RECIPIENT,
        from: process.env.SENDGRID_FROM || process.env.SMTP_FROM || 'no-reply@yourdomain.com',
        subject,
        text: `${message}\n\nFrom: ${name} <${email}>`,
        html,
    });

    try {
        await sg.send({
            to: email,
            from: process.env.SENDGRID_FROM || process.env.SMTP_FROM || 'no-reply@yourdomain.com',
            subject: `We've received your message`,
            text: `Hi ${name},\n\nThanks for contacting us. We'll review your message and get back to you shortly.\n\n— CityCare Team`,
        });
    } catch (err) {
        console.error('SendGrid confirmation failed', err);
    }
}

async function createTransporter() {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined;
    const secure = (process.env.SMTP_SECURE || 'false') === 'true';

    if (!host || !port || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        throw new Error('Missing SMTP configuration. Set SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASS.');
    }

    return nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
}

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    let body = {};
    try {
        body = JSON.parse(event.body || '{}');
    } catch (err) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
    }

    const { name, email, message } = body;
    if (!name || !email || !message) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Missing fields' }) };
    }

    try {
        // Prefer SMTP if SMTP env vars are present (Gmail App Passwords, etc.)
        const hasSmtp = !!(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS);

        if (hasSmtp) {
            try {
                const transporter = await createTransporter();

                const html = `
      <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
      <p><strong>Message:</strong></p>
      <div>${message.replace(/\n/g, '<br/>')}</div>
    `;

                await transporter.sendMail({
                    from: process.env.SMTP_FROM || process.env.SMTP_USER,
                    to: RECIPIENT,
                    subject: `New contact form message from ${name}`,
                    text: `${message}\n\nFrom: ${name} <${email}>`,
                    html,
                });

                try {
                    await transporter.sendMail({
                        from: process.env.SMTP_FROM || process.env.SMTP_USER,
                        to: email,
                        subject: `We've received your message`,
                        text: `Hi ${name},\n\nThanks for contacting us. We'll review your message and get back to you shortly.\n\n— CityCare Team`,
                    });
                } catch (err) {
                    console.error('Failed to send confirmation email', err);
                }

                return { statusCode: 200, body: JSON.stringify({ ok: true }) };
            } catch (smtpErr) {
                console.error('SMTP send failed, will try SendGrid if available:', smtpErr);
                // continue to SendGrid fallback
            }
        }

        // If SMTP not configured or failed, try SendGrid
        if (process.env.SENDGRID_API_KEY) {
            await sendWithSendGrid(name, email, message);
            return { statusCode: 200, body: JSON.stringify({ ok: true }) };
        }

        return { statusCode: 500, body: JSON.stringify({ error: 'No email provider configured. Set SMTP_* env vars or SENDGRID_API_KEY.' }) };
    } catch (err) {
        console.error('Contact function error', err);
        return { statusCode: 500, body: JSON.stringify({ error: err.message || 'Failed' }) };
    }
};