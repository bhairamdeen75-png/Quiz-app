import { NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'nodejs';

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Naam kam se kam 2 letters ka ho').max(60),
  email: z.string().trim().email('Sahi email address dalo'),
  message: z.string().trim().min(10, 'Message kam se kam 10 letters ka ho').max(2000),
});

export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 });
  }

  const { name, email, message } = parsed.data;
  const to = process.env.CONTACT_EMAIL;
  if (!to) {
    return NextResponse.json({ error: 'CONTACT_EMAIL env set nahi hai (Vercel me add karo)' }, { status: 501 });
  }

  // 1) Resend se email bhejo (free — resend.com, koi npm package nahi chahiye)
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Quiz App <onboarding@resend.dev>',
          to,
          reply_to: email,
          subject: `📬 Quiz App Contact: ${name}`,
          text: `Naam: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        }),
      });
      if (res.ok) return NextResponse.json({ ok: true });
      console.error('Resend error', res.status, await res.text());
    } catch (e) { console.error('Resend failed', e); }
  }

  // 2) Fallback: Telegram bot se message (optional — @BotFather se token lo)
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (token && chatId) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: `📬 Naya Contact Form Message\n\n👤 Naam: ${name}\n📧 Email: ${email}\n\n💬 Message:\n${message}`,
        }),
      });
      if (res.ok) return NextResponse.json({ ok: true });
      console.error('Telegram bot error', res.status, await res.text());
    } catch (e) { console.error('Telegram bot failed', e); }
  }

  return NextResponse.json(
    { error: 'Email service configure nahi hai —  RESEND_API_KEY ya TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID add karo' },
    { status: 501 }
  );
}
