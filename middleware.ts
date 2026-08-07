export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/dashboard/:path*', '/test/:path*', '/ai-test/:path*', '/pdf-upload/:path*', '/admin/:path*'],
};
