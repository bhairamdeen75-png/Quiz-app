import { NextResponse } from 'next/server';

// 🔐 Telegram group link sirf server side — env variable se
// Frontend source / HTML me t.me link kahin nahi dikhta
export async function GET() {
  const url = process.env.TELEGRAM_URL ?? 'https://t.me/bkstudyzone';
  return NextResponse.redirect(url);
}
