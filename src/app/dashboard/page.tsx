import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { Card, StatCard, Badge } from '@/components/ui/primitives';

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-light text-xl">
            👋
          </span>
          <h1 className="text-2xl font-bold sm:text-3xl">
            Namaste, {session.user.name?.split(' ')[0]}
          </h1>
        </div>
        <Link href="/ai-test" className="btn-primary text-center">+ AI Test Banao</Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard value={tests?.length ?? 0} label="Total Tests" />
        <StatCard value={completed.length} label="Completed" />
        <StatCard value={`${avgAccuracy}%`} label="Avg Accuracy" />
      </div>

      {/* Recent tests */}
      <section>
        <h2 className="mb-4 text-xl font-bold">Recent Tests</h2>
        {tests?.length === 0 ? (
          <Card className="text-center text-brand/50">
            <p>Abhi koi test nahi diya. Pehla test aaj hi do! 🚀</p>
            <div className="mt-4 flex justify-center gap-3">
              <Link href="/exams" className="btn-primary">Preloaded Test</Link>
              <Link href="/pdf-upload" className="btn-outline">PDF Upload</Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {(tests ?? []).map((t) => (
              <Card key={t.id} className="flex items-center justify-between gap-4 p-4 sm:p-5">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{t.title}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-brand/50">
                    <span>{new Date(t.started_at).toLocaleDateString('hi-IN')}</span>
                    <span>·</span>
                    <span>{t.source}</span>
                    <Badge color={t.status === 'completed' ? 'bg-success-light text-success' : 'bg-gold-light text-brand'}>
                      {t.status}
                    </Badge>
                  </div>
                </div>
                {t.status === 'completed' ? (
                  <span className="shrink-0 font-mono text-lg font-semibold text-brand">
                    {t.score}/{t.max_score}
                  </span>
                ) : (
                  <Link href={`/test/${t.id}`} className="btn-primary shrink-0">Continue</Link>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
