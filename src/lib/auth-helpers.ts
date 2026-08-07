import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Har protected API route me yeh call karo
export async function requireUser(): Promise<{ id: string; role: string } | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  return { id: session.user.id, role: session.user.role };
}
