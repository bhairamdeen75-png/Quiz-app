import Link from 'next/link';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { verifyAdminToken } from '@/lib/admin-auth';
import { createClient } from '@/lib/supabase/server';
import { StatCard } from '@/components/ui/primitives';
import TestSeriesManager from './TestSeriesManager';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = verifyAdminToken(cookies().get('admin_session')?.value) || session?.user?.role === 'admin';
  if (!isAdmin) redirect('/admin-login');

  const supabase = createClient();

  const [
    { count: users },
    { count: tests },
    { count: exams },
    { count: series },
    { count: questions },
    { data: seriesList },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('tests').select('*', { count: 'exact', head: true }),
    supabase.from('exams').select('*', { count: 'exact', head: true }),
    supabase.from('test_series').select('*', { count: 'exact', head: true }),
    supabase.from('questions').select('*', { count: 'exact', head: true }),
    supabase.from('test_series').select('*, exams(name)').order('name'),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Panel ⭐</h1>
        <p className="mt-1 text-sm text-slate-500">
          Site ka pura data ek jagah — users, tests, series management
        </p>
      </div>

      {/* Site stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard value={users ?? 0} label="👥 Total Users" />
        <StatCard value={tests ?? 0} label="📝 Total Tests" />
        <StatCard value={exams ?? 0} label="📚 Exams" />
        <StatCard value={series ?? 0} label="🏆 Test Series" />
        <StatCard value={questions ?? 0} label="❓ Questions" />
      </div>

      {/* Quick links */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/admin/questions" className="card hover:border-brand">
          <h2 className="text-xl font-bold">📝 Questions</h2>
          <p className="text-sm text-slate-500">Approve / edit questions (AI & PDF se aaye hue)</p>
        </Link>
        <Link href="/admin/import" className="card hover:border-brand">
          <h2 className="text-xl font-bold">📥 CSV Import</h2>
          <p className="text-sm text-slate-500">Question bank bulk upload karo</p>
        </Link>
        <Link href="/exams" className="card hover:border-brand">
          <h2 className="text-xl font-bold">🏛️ Exams</h2>
          <p className="text-sm text-slate-500">Site ka public view</p>
        </Link>
      </div>

      {/* Test series management */}
      <TestSeriesManager initialSeries={seriesList ?? []} />
    </div>
  );
}
