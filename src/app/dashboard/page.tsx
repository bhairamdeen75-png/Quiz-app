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
    .order('started_at', { ascending: false }).limit(10);

  const completed = (tests ?? []).filter((t) => t.status === 'completed');
  const avgAccuracy = completed.length
    ? Math.round(completed.reduce((s, t) => s + (t.accuracy ?? 0), 0) / completed.length)
    : 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Namaste, {session.user.name?.split(' ')[0]} 👋</h1>
        <Link href="/ai-test" className="btn-primary">+ AI Test Banao</Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card text-center">
          <p className="text-3xl font-extrabold text-brand">{tests?.length ?? 0}</p>
          <p className="text-sm text-slate-500">Total Tests</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-extrabold text-brand">{completed.length}</p>
          <p className="text-sm text-slate-500">Completed</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-extrabold text-brand">{avgAccuracy}%</p>
          <p className="text-sm text-slate-500">Avg Accuracy</p>
        </div>
      </div>

      {/* Recent tests */}
      <section>
        <h2 className="mb-4 text-xl font-bold">Recent Tests</h2>
        {tests?.length === 0 ? (
          <div className="card text-center text-slate-500">
            <p>Abhi koi test nahi diya. Pehla test aaj hi do! 🚀</p>
            <div className="mt-4 flex justify-center gap-3">
              <Link href="/exams" className="btn-primary">Preloaded Test</Link>
              <Link href="/pdf-upload" className="btn-outline">PDF Upload</Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {(tests ?? []).map((t) => (
              <div key={t.id} className="card flex items-center justify-between">
                <div>
                  <p className="font-semibold">{t.title}</p>
                  <p className="text-sm text-slate-500">
                    {new Date(t.started_at).toLocaleDateString('hi-IN')} · {t.source} · {t.status}
                  </p>
                </div>
                {t.status === 'completed' ? (
                  <span className="font-bold text-brand">{t.score}/{t.max_score}</span>
                ) : (
                  <Link href={`/test/${t.id}`} className="btn-primary">Continue</Link>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
