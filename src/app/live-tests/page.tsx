import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

type Status = 'upcoming' | 'live' | 'closed';

function statusOf(startsAt: string, endsAt: string): Status {
  const now = Date.now();
  if (now < new Date(startsAt).getTime()) return 'upcoming';
  if (now <= new Date(endsAt).getTime()) return 'live';
  return 'closed';
}

function left(endsAt: string) {
  const ms = new Date(endsAt).getTime() - Date.now();
  if (ms <= 0) return '0m';
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default async function LiveTestsPage() {
  const supabase = createClient();
  const session = await getServerSession(authOptions);

  const { data: liveTests } = await supabase
    .from('live_tests')
    .select('id, name, starts_at, ends_at, exam_id, exams(slug, name), test_series(duration_minutes, description)')
    .eq('is_active', true)
    .order('starts_at', { ascending: false });

  // USER KE ATTEMPTS — Done / Missed
  let myMap: Record<string, { done: boolean; best: number | null; ranked: boolean }> = {};
  if (session?.user) {
    const { data: attempts } = await supabase
      .from('live_test_attempts')
      .select('live_test_id, score, is_ranked')
      .eq('user_id', session.user.id);
    for (const a of attempts ?? []) {
      const cur = myMap[a.live_test_id] ?? { done: false, best: null, ranked: false };
      cur.done = true;
      cur.ranked = cur.ranked || a.is_ranked;
      cur.best = cur.best == null || Number(a.score) > cur.best ? Number(a.score) : cur.best;
      myMap[a.live_test_id] = cur;
    }
  }

  // TOP 5 PER EXAM — best score per student, sirf ranked attempts
  const { data: allAttempts } = await supabase
    .from('live_test_attempts')
    .select('id, user_id, exam_slug, student_name, student_class, score, max_score, submitted_at, live_tests(name)')
    .eq('is_ranked', true)
    .order('score', { ascending: false })
    .order('submitted_at', { ascending: true });

  const bestPerExam = new Map<string, Map<string, any>>();
  for (const a of allAttempts ?? []) {
    if (!bestPerExam.has(a.exam_slug)) bestPerExam.set(a.exam_slug, new Map());
    const m = bestPerExam.get(a.exam_slug)!;
    const prev = m.get(a.user_id);
    if (!prev || Number(a.score) > Number(prev.score)) m.set(a.user_id, a);
  }
  const rankingSections = [...bestPerExam.entries()].map(([slug, m]) => ({
    slug,
    rows: [...m.values()].sort((x, y) => Number(y.score) - Number(x.score)).slice(0, 5),
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold">⚡ Live Test Series & Ranking</h1>
      <p className="mt-1 text-sm text-slate-500">
        Har test <b>48 hours</b> live rahta hai. Window ke andar dene par <b>ranking</b> mein hissa milega.
        Window ke baad bhi test de sakte ho — bas ranking nahi milegi (normal practice).
        Jitni baar chaaho de sakte ho, <b>best score</b> count hoga. 🏆
      </p>

      {/* 👑 VIP STATUS PANEL */}
      <section className="mt-6 rounded-2xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 p-5 shadow-sm">
        <h2 className="flex items-center gap-2 text-lg font-bold text-amber-800">👑 VIP Status — Missed / Done</h2>
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
          <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">✅ Done</span>
          <span className="rounded-full bg-red-100 px-3 py-1 text-red-700">❌ Missed</span>
          <span className="rounded-full bg-indigo-600 px-3 py-1 text-white">🔴 Live Now</span>
          <span className="rounded-full bg-gray-200 px-3 py-1 text-gray-600">🕐 Upcoming</span>
        </div>

        <div className="mt-4 space-y-2">
          {(liveTests ?? []).length === 0 && (
            <p className="text-sm text-amber-700">Abhi koi live test nahi hai — jaldi aayega!</p>
          )}
          {(liveTests ?? []).map((t) => {
            const status = statusOf(t.starts_at, t.ends_at);
            const mine = myMap[t.id];
            const missed = status === 'closed' && !mine?.done;
            const live = status === 'live';
            return (
              <div key={t.id}
                className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3 shadow-sm transition ${
                  live ? 'border-indigo-300 bg-white' : 'border-gray-200 bg-white/80'
                }`}>
                <div className="min-w-0">
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-xs text-slate-500">
                    {t.exams?.name} · {t.test_series?.duration_minutes ?? 180} min
                    {t.test_series?.description ? ` · ${t.test_series.description}` : ''}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {status === 'upcoming' && (
                    <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-600">
                      🕐 Upcoming
                    </span>
                  )}
                  {live && (
                    <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                      🔴 Live · {left(t.ends_at)} baki
                    </span>
                  )}
                  {status === 'closed' && mine?.done && (
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${mine.ranked ? 'bg-green-100 text-green-700' : 'bg-sky-100 text-sky-700'}`}>
                      ✅ Done {mine.ranked ? `· Best: ${mine.best}` : '· Practice'}
                    </span>
                  )}
                  {missed && (
                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                      ❌ Missed
                    </span>
                  )}
                  <Link href={`/live-tests/${t.id}`}
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700">
                    {status === 'closed' && mine?.done ? 'Dobara Do' : 'Start →'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 🏆 TOP 5 RANKINGS — har exam alag */}
      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-bold">🏆 Top 5 Rankings — Har Exam Alag</h2>
        {rankingSections.length === 0 && (
          <p className="text-sm text-slate-500">Abhi koi ranking nahi — 48h window khatam hone ke baad yahan dikhegi.</p>
        )}
        {rankingSections.map((r) => (
          <div key={r.slug} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 bg-slate-50 px-5 py-3 font-bold">
              {r.slug.toUpperCase()} — Top 5
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                <tr className="border-b text-left text-xs text-slate-400">
                  <th className="px-5 py-2">Rank</th>
                  <th className="py-2">Naam</th>
                  <th className="py-2">Class</th>
                  <th className="py-2">Test</th>
                  <th className="py-2">Score</th>
                  <th className="py-2">Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {r.rows.map((row, i) => (
                  <tr key={row.id} className="border-b border-slate-50 last:border-0">
                    <td className="px-5 py-2.5 font-bold">
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                    </td>
                    <td className="py-2.5 font-medium">{row.student_name}</td>
                    <td className="py-2.5 text-slate-500">{row.student_class ?? '—'}</td>
                    <td className="py-2.5 text-slate-500">{row.live_tests?.name ?? '—'}</td>
                    <td className="py-2.5 font-semibold">{row.score}/{row.max_score}</td>
                    <td className="py-2.5 text-slate-500">
                      {row.max_score ? `${Math.round((Number(row.score) / Number(row.max_score)) * 100)}%` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
