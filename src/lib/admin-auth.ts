import { createHash } from 'crypto';

// ADMIN_EMAIL + ADMIN_PASSWORD se ek secure token banata hai
export function getAdminToken() {
  const email = process.env.ADMIN_EMAIL ?? '';
  const password = process.env.ADMIN_PASSWORD ?? '';
  return createHash('sha256').update(`${email}:${password}`).digest('hex');
}

// Cookie ka token verify karo
export function verifyAdminToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const expected = getAdminToken();
  return expected.length > 0 && token === expected;
}
