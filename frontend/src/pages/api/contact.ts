import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const prerender = false;

const mailTo = import.meta.env.BOOKING_MAIL_TO;
const smtpHost = import.meta.env.SMTP_HOST || 'localhost';
const smtpPort = Number(import.meta.env.SMTP_PORT || 1025);
const smtpUser = import.meta.env.SMTP_USER;
const smtpPass = import.meta.env.SMTP_PASS;
const smtpSecure = import.meta.env.SMTP_SECURE === 'true';
const mailFrom =
  import.meta.env.SMTP_FROM || `Merzouga Tours <no-reply@${smtpHost}>`;

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

// Rate limiting: 5 requests per 15 minutes per IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000;

function getRateLimitKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  return forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown';
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (rateLimitMap.size > 1000) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (value.resetTime < now) {
        rateLimitMap.delete(key);
      }
    }
  }

  if (!record || record.resetTime < now) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

function isValidBody(body: Record<string, unknown>) {
  const required = ['email', 'message'];
  return required.every((key) => typeof body[key] === 'string');
}

export const POST: APIRoute = async ({ request }) => {
  if (!mailTo) {
    return new Response(
      JSON.stringify({
        error: 'Missing BOOKING_MAIL_TO environment variable',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const ip = getRateLimitKey(request);
  if (!checkRateLimit(ip)) {
    return new Response(
      JSON.stringify({
        error: 'Too many requests',
        message: 'Please wait before submitting another contact request',
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '900',
        },
      }
    );
  }

  const body = await request.json().catch(() => null);

  if (!body || !isValidBody(body)) {
    return new Response(JSON.stringify({ error: 'Invalid payload' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const {
    name = '',
    email,
    hearAbout = '',
    hearAboutOther = '',
    message,
    locale,
  } = body as Record<string, string>;

  const hearAboutText = hearAbout === 'other' ? hearAboutOther : hearAbout;
  const subject = `[Contact] Message from ${name || email}`;

  const textBody = [
    `Contact Form Submission`,
    '',
    name ? `Name: ${name}` : null,
    `Email: ${email}`,
    hearAboutText ? `How they heard about us: ${hearAboutText}` : null,
    `Locale: ${locale || 'unknown'}`,
    '',
    'Message:',
    message,
  ]
    .filter((line) => line !== null)
    .join('\n');

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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return new Response(JSON.stringify({
      error: 'Unable to send email',
      details: errorMessage,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
