const nodemailer = require('nodemailer');

const RECIPIENT = process.env.CONTACT_RECIPIENT || 'dalmat.repair@gmail.com';

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
    } catch (err) {
        console.error('Contact function error', err);
        return { statusCode: 500, body: JSON.stringify({ error: err.message || 'Failed' }) };
    }
};