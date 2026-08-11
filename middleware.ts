import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Edge runtime me Node crypto nahi chalta, isliye Web Crypto use karo
async function adminTokenMatches(cookieValue: string | undefined) {
  if (!cookieValue) return false;
  const email = process.env.ADMIN_EMAIL ?? '';
  const password = process.env.ADMIN_PASSWORD ?? '';
  const data = new TextEncoder().encode(`${email}:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const hex = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return cookieValue === hex;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Admin routes: admin cookie ya admin role wala session
  if (pathname.startsWith('/admin')) {
    const ok =
      (await adminTokenMatches(req.cookies.get('admin_session')?.value)) ||
      token?.role === 'admin';
    if (!ok) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin-login';
      url.search = '';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Student protected routes
  if (
    ['/dashboard', '/test', '/ai-test', '/pdf-upload', '/profile'].some((p) =>
      pathname.startsWith(p)
    )
  ) {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/test/:path*',
    '/ai-test/:path*',
    '/pdf-upload/:path*',
    '/profile/:path*',
  ],
};
