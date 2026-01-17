import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const prerender = false;

const mailTo = process.env.BOOKING_MAIL_TO;
const smtpHost = process.env.SMTP_HOST || 'localhost';
const smtpPort = Number(process.env.SMTP_PORT || 1025);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpSecure = process.env.SMTP_SECURE === 'true';
const mailFrom =
  process.env.SMTP_FROM || `Merzouga Tours <no-reply@${smtpHost}>`;

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure,
  auth:
    smtpUser && smtpPass
      ? {
          user: smtpUser,
          pass: smtpPass,
        }
      : undefined,
});

function isValidBody(body: Record<string, unknown>) {
  const required = ['firstName', 'lastName', 'email', 'tour', 'people'];
  return required.every((key) => typeof body[key] === 'string');
}

export const POST: APIRoute = async ({ request }) => {
  if (!mailTo) {
    return new Response(
      JSON.stringify({ error: 'Missing BOOKING_MAIL_TO environment variable' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const body = await request.json().catch(() => null);

  if (!body || !isValidBody(body)) {
    return new Response(
      JSON.stringify({ error: 'Invalid payload' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const { firstName, lastName, email, tour, people, message = '', locale } =
    body as Record<string, string>;

  const subject = `[Booking] ${tour} (${people} guest${people === '1' ? '' : 's'})`;

  const textBody = [
    `Tour: ${tour}`,
    `Name: ${firstName} ${lastName}`,
    `Email: ${email}`,
    `People: ${people}`,
    `Locale: ${locale || 'unknown'}`,
    '',
    'Notes:',
    message || 'No additional message provided.',
  ].join('\n');

  try {
    await transporter.sendMail({
      from: mailFrom,
      to: mailTo,
      subject,
      text: textBody,
      replyTo: email,
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Booking email failed', error);
    return new Response(
      JSON.stringify({ error: 'Unable to send email' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
