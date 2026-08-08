import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  const supabase = createClient();
  const { data: tests } = await supabase
    .from('tests').select('*').eq('user_id', session.user.id)
    .order('started_at', { ascending: false }).limit
