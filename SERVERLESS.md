Serverless contact endpoint setup

This project includes simple serverless handlers to accept contact form submissions and send email notifications.

Files added:
- `api/contact.ts` — Vercel-compatible serverless function (POST `/api/contact`).
- `netlify/functions/contact.js` — Netlify-compatible serverless function (POST `/.netlify/functions/contact`).

Requirements
- An SMTP server (or SMTP relay) and credentials. Common providers: SendGrid, Mailgun, SES, or your email provider's SMTP.
- Environment variables set in your deployment platform or locally.

Environment variables
- `SMTP_HOST` — SMTP hostname (e.g. `smtp.sendgrid.net`)
- `SMTP_PORT` — SMTP port (e.g. `587`)
- `SMTP_SECURE` — `true` if using secure SSL (465), otherwise `false` (587 will be common)
- `SMTP_USER` — SMTP username
- `SMTP_PASS` — SMTP password
- `SMTP_FROM` — Optional. From address used when sending mail. If not set, `SMTP_USER` is used.
- `CONTACT_RECIPIENT` — Optional. Email that receives contact messages. Defaults to `dalmat.repair@gmail.com`.

Install dependencies (locally for testing)
Run in your project root:

```powershell
pnpm add -D nodemailer
# or
npm install --save nodemailer
# or
yarn add nodemailer
```

Deploy notes
- Vercel: The `api/contact.ts` function will be picked up automatically by Vercel. Set the environment variables in your Vercel project settings.
- Netlify: The `netlify/functions/contact.js` function will be picked up by Netlify when you deploy. Set the environment variables in your Netlify site settings.

Local testing
- You can test the Vercel function locally with `vercel dev` (if you use Vercel CLI) or run a small express proxy that forwards `/api/contact` to the function in development.

Security
- Do not commit your SMTP credentials. Use the hosting platform environment variable configuration.

If you want, I can wire this up to a third-party email API (SendGrid, Mailgun) so you don't need SMTP credentials — tell me which provider you prefer and I can implement it instead.