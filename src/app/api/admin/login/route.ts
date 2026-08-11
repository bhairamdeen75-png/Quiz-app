import { NextResponse } from 'next/server';
import { getAdminToken } from '@/lib/admin-auth';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { email, password } = body as { email?: string; password?: string };

  if (!email || !password) {
    return NextResponse.json({ error: 'Email aur password dono daalo' }, { status: 400 });
  }

  // Env vars se compare — koi aur login NAHI kar sakta
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set('admin_session', getAdminToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 din
    });
    return res;
  }

  return NextResponse.json({ error: 'Galat credentials. Sirf admin login kar sakta hai.' }, { status: 401 });
}
