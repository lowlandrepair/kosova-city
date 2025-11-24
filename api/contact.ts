import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

// Prefer SendGrid if configured; otherwise fallback to SMTP via nodemailer.
const RECIPIENT = process.env.CONTACT_RECIPIENT || 'dalmat.repair@gmail.com';

async function sendWithSendGrid(name: string, email: string, message: string) {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) throw new Error('No SendGrid API key');

  const sg = await import('@sendgrid/mail');
  sg.default.setApiKey(apiKey);

  const subject = `New contact form message from ${name}`;
  const html = `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p><p><strong>Message:</strong></p><div>${message.replace(/\n/g, '<br/>')}</div>`;

  await sg.default.send({
    to: RECIPIENT,
    from: process.env.SENDGRID_FROM || process.env.SMTP_FROM || 'no-reply@yourdomain.com',
    subject,
    text: `${message}\n\nFrom: ${name} <${email}>`,
    html,
  });

  // send confirmation
  try {
    await sg.default.send({
      to: email,
      from: process.env.SENDGRID_FROM || process.env.SMTP_FROM || 'no-reply@yourdomain.com',
      subject: `We've received your message`,
      text: `Hi ${name},\n\nThanks for contacting us. We'll review your message and get back to you shortly.\n\n— CityCare Team`,
    });
  } catch (e) {
    console.error('SendGrid confirmation failed', e);
  }
}

async function createTransporter() {
  // Expect SMTP settings in environment variables. This works on Vercel and Netlify when configured.
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined;
  const secure = (process.env.SMTP_SECURE || 'false') === 'true';

  if (!host || !port || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    // If SMTP is not configured, nodemailer will throw later; we still provide a helpful error.
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    res.status(400).json({ error: 'Missing fields' });
    return;
  }

  try {
    // Prefer SMTP if SMTP env vars are present (fastest for Gmail App Password use-case)
    const hasSmtp = !!(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS);

    if (hasSmtp) {
      try {
        const transporter = await createTransporter();

        const html = `
      <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
      <p><strong>Message:</strong></p>
      <div>${message.replace(/\n/g, '<br/>')}</div>
    `;

        // Send to site owner
        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: RECIPIENT,
          subject: `New contact form message from ${name}`,
          text: `${message}\n\nFrom: ${name} <${email}>`,
          html,
        });

        // Send confirmation to the submitter (optional)
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

        res.status(200).json({ ok: true });
        return;
      } catch (smtpErr) {
        console.error('SMTP send failed, falling back to SendGrid if available:', smtpErr);
        // continue to SendGrid fallback below
      }
    }

    // If SMTP not configured or it failed, try SendGrid if available
    if (process.env.SENDGRID_API_KEY) {
      await sendWithSendGrid(name, email, message);
      res.status(200).json({ ok: true });
      return;
    }

    // No available delivery mechanism
    throw new Error('No email provider configured. Set SMTP_* env vars or SENDGRID_API_KEY.');
  } catch (err: any) {
    console.error('Contact handler error:', err?.message || err);
    res.status(500).json({ error: err?.message || 'Failed to send message' });
  }
}
