import Link from 'next/link';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { verifyAdminToken } from '@/lib/admin-auth';
import { createClient } from '@/lib/supabase/server';
import { Card, StatCard } from '@/components/ui/primitives';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const isAdmin = verifyAdminToken(cookies().get('admin_session')?.value);
  if (!session?.user && !isAdmin) redirect('/login');

  const supabase = createClient();
  let tests: any[] = [];
  if (session?.user) {
    const { data } = await supabase.from('tests').select('*').eq('user_id', session.user.id);
    tests = data ?? [];
  }
  const completed = tests.filter((t) => t.status === 'completed');
  const avgAccuracy = completed.length
    ? Math.round(completed.reduce((s, t) => s + (t.accuracy ?? 0), 0) / completed.length)
    : 0;

  const name = session?.user?.name ?? 'Admin';
  const email = session?.user?.email ?? process.env.ADMIN_EMAIL ?? '';
  const avatar = session?.user?.image;
  const role = session?.user?.role ?? 'admin';
  const initial = (name ?? 'A').charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Profile card */}
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="h-20 w-20 rounded-full border-4 border-brand/20 object-cover"
            />
          ) : (
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand text-3xl font-bold text-gold">
              {initial}
            </span>
          )}
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-slate-900">{name}</h1>
            <p className="mt-1 text-sm text-slate-500">{email}</p>
            <span className="mt-2 inline-block rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
              {role === 'admin' ? '⭐ Admin' : '🎓 Student'}
            </span>
          </div>
        </div>
      </Card>

      {/* Stats (student ke liye) */}
      {session?.user && (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard value={tests.length} label="Total Tests" />
          <StatCard value={completed.length} label="Completed" />
          <StatCard value={`${avgAccuracy}%`} label="Avg Accuracy" />
        </div>
      )}

      {/* Links */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/dashboard" className="card hover:border-brand">
          <h2 className="text-xl font-bold">📊 Dashboard</h2>
          <p className="text-sm text-slate-500">Apne tests aur progress dekho</p>
        </Link>
        <Link href="/exams" className="card hover:border-brand">
          <h2 className="text-xl font-bold">🏆 Preloaded Tests</h2>
          <p className="text-sm text-slate-500">Naya test do</p>
        </Link>
        {isAdmin && (
          <Link href="/admin" className="card hover:border-brand">
            <h2 className="text-xl font-bold">⭐ Admin Panel</h2>
            <p className="text-sm text-slate-500">Users, tests aur series management</p>
          </Link>
        )}
        <Link href="/contact" className="card hover:border-brand">
          <h2 className="text-xl font-bold">📞 Contact & Support</h2>
          <p className="text-sm text-slate-500">Madad chahiye? Telegram par baat karo</p>
        </Link>
      </div>
    </div>
  );
}
