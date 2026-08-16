import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function LiveTestResultPage({
  params, searchParams,
}: {
  params: { id: string };
  searchParams: { testId?: string };
}) {
  const session = await getServerSession(authOptions);
  const supabase = createClient();

  const { data: attempt } = await supabase
    .from('live_test_attempts')
    .select('*')
    .eq('live_test_id', params.id)
    .eq('user_id', session?.user?.id ?? '')
    .eq('test_attempt_id', searchParams.testId ?? '')
    .maybeSingle();

  // is test ki top 5 ranking (best per student)
  const { data: allA } = await supabase
    .from('live_test_attempts')
    .select('*')
    .eq('live_test_id', params.id)
    .eq('is_ranked', true)
    .order('score', { ascending: false })
    .order('submitted_at', { ascending: true });

  const best = new Map<string, any>();
  for (const a of allA ?? []) {
    const prev = best.get(a.user_id);
    if (!prev || Number(a.score) > Number(prev.score)) best.set(a.user_id, a);
  }
  const top5 = [...best.values()].sort((x, y) => Number(y.score) - Number(x.score)).slice(0, 5);
  const myRank = top5.findIndex((r) => r.user_id === session?.user?.id) + 1;

  if (!attempt) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="text-slate-500">Result nahi mila — pehle test do.</p>
      </div>
    );
  }

  const acc = attempt.max_score ? Math.round((Number(attempt.score) / Number(attempt.max_score)) * 100) : 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
        <div className="text-5xl">📊</div>
        <h1 className="mt-2 text-xl font-bold">Test Complete!</h1>
        {attempt.is_ranked ? (
          <p className="mt-1 text-sm text-green-600 font-semibold">🏆 Ranked attempt — 48h window ke andar diya</p>
        ) : (
          <p className="mt-1 text-sm text-sky-600 font-semibold">⚪ Practice attempt — window khatam hone ke baad diya</p>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl bg-indigo-50 p-4">
            <p className="text-2xl font-bold text-indigo-700">{attempt.score}/{attempt.max_score}</p>
            <p className="text-xs text-slate-500">Score</p>
          </div>
          <div className="rounded-xl bg-green-50 p-4">
            <p className="text-2xl font-bold text-green-700">{attempt.correct_count}</p>
            <p className="text-xs text-slate-500">Correct</p>
          </div>
          <div className="rounded-xl bg-red-50 p-4">
            <p className="text-2xl font-bold text-red-600">{attempt.wrong_count}</p>
            <p className="text-xs text-slate-500">Wrong</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-2xl font-bold text-slate-600">{attempt.skipped_count}</p>
            <p className="text-xs text-slate-500">Skipped</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-500">Accuracy: <b>{acc}%</b></p>

        {myRank > 0 && (
          <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-700">
            🏅 Is test ki Top 5 ranking mein aapka sthaan: #{myRank}
          </p>
        )}

        <p className="mt-4 text-xs text-slate-400">
          Dobara de sakte ho — best score hi ranking mein count hoga
        </p>
      </div>

      {/* Ranking table */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 bg-slate-50 px-5 py-3 font-bold">🏆 Top 5 — Is Test Ki</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-slate-400">
              <th className="px-5 py-2">Rank</th><th>Naam</th><th>Class</th><th>Score</th>
            </tr>
          </thead>
          <tbody>
            {top5.map((row, i) => (
              <tr key={row.id} className={`border-b border-slate-50 last:border-0 ${row.user_id === session?.user?.id ? 'bg-amber-50' : ''}`}>
                <td className="px-5 py-2.5 font-bold">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</td>
                <td className="py-2.5 font-medium">{row.student_name}</td>
                <td className="py-2.5 text-slate-500">{row.student_class ?? '—'}</td>
                <td className="py-2.5 font-semibold">{row.score}/{row.max_score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-center">
        <a href={`/live-tests/${params.id}`} className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
          🔄 Dobara Test Do
        </a>
      </div>
    </div>
  );
}
