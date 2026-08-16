'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LOGIN_REQUIRED_MESSAGE } from '@/lib/messages';
import { TelegramIcon } from '@/components/ui/icons';

interface ExamDetail { exam: any; subjects: any[]; rule: any; }
interface Series { id: string; name: string; question_count: number; duration_minutes: number; difficulty: string; }
interface LiveTestInfo {
  id: string;
  name: string;
  starts_at: string;
  ends_at: string;
  exam_slug: string | null;
  exam_name: string | null;
  duration_minutes: number;
}

function liveStatus(startsAt: string, endsAt: string): 'upcoming' | 'live' | 'closed' {
  const now = Date.now();
  if (now < new Date(startsAt).getTime()) return 'upcoming';
  if (now <= new Date(endsAt).getTime()) return 'live';
  return 'closed';
}

export default function ExamDetailPage({ params }: { params: { examId: string } }) {
  const [detail, setDetail] = useState<ExamDetail | null>(null);
  const [series, setSeries] = useState<Series[]>([]);
  const [liveTests, setLiveTests] = useState<LiveTestInfo[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/exams/${params.examId}`)
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error ?? 'Exam nahi mila');
        return data as ExamDetail;
      })
      .then((data) => { if (!cancelled) setDetail(data); })
      .catch((e) => { if (!cancelled) setError(e.message); });

    fetch(`/api/series?examId=${params.examId}`)
      .then((r) => r.json())
      .then((data) => { if (!cancelled) setSeries(data ?? []); });

    // ⚡ Sabhi live tests (sabhi exams ke) — purane bhi, kyunki practice mode mein de sakte hain
    fetch('/api/live-tests')
      .then((r) => r.json())
      .then((data) => { if (!cancelled) setLiveTests(data ?? []); });

    return () => { cancelled = true; };
  }, [params.examId]);

  if (error) return (
    <div className="p-8 text-center">
      <p className="text-lg font-semibold text-slate-700">{error}</p>
      <Link href="/exams" className="btn-primary mt-4 inline-block">Sab Exams Dekho</Link>
    </div>
  );

  if (!detail || !detail.exam) return <p className="p-8 text-center text-slate-500">Loading...</p>;

  const subjects = detail.subjects ?? [];
  const filtered = selectedSubject === 'all' ? series : series.filter((s) => s.subject_id === selectedSubject);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <span className="text-5xl">{detail.exam.icon}</span>
        <div>
          <h1 className="text-3xl font-bold">{detail.exam.name}</h1>
          <p className="text-slate-500">{detail.exam.description}</p>
          {detail.rule && (
            <p className="mt-1 text-sm font-semibold text-brand">
              {detail.rule.duration_minutes} min · {detail.rule.total_questions} Q · +{detail.rule.correct_marks}/-{detail.rule.negative_marks}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href={`/ai-test?examId=${detail.exam.id}`} className="btn-primary">🤖 AI Test Banao</Link>
        <Link href="/pdf-upload" className="btn-outline">📄 PDF Upload Karo</Link>
      </div>

      {/* ⚡ LIVE TESTS — sabhi exams ke, purane bhi */}
      {liveTests.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-bold">⚡ Live Tests <span className="text-sm font-normal text-slate-400">(sabhi exams ke)</span></h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {liveTests.map((t) => {
              const status = liveStatus(t.starts_at, t.ends_at);
              return (
                <div key={t.id} className="card">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold leading-snug">{t.name}</h3>
                    {status === 'live' && (
                      <span className="shrink-0 rounded-full bg-indigo-600 px-2.5 py-1 text-[11px] font-semibold text-white">🔴 LIVE</span>
                    )}
                    {status === 'upcoming' && (
                      <span className="shrink-0 rounded-full bg-gray-200 px-2.5 py-1 text-[11px] font-semibold text-gray-600">🕐 UPCOMING</span>
                    )}
                    {status === 'closed' && (
                      <span className="shrink-0 rounded-full bg-sky-100 px-2.5 py-1 text-[11px] font-semibold text-sky-700">⚪ PRACTICE</span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {t.exam_name ?? 'Exam'} · {t.duration_minutes} min
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {status === 'upcoming' ? `📅 ${new Date(t.starts_at).toLocaleString()}` :
                     status === 'live' ? '⏳ 48h window — ranking ke liye abhi do' :
                     '✅ Window khatam — practice mode (ranking nahi)'}
                  </p>
                  <Link href={`/live-tests/${t.id}`} className="btn-primary mt-4 flex w-full items-center justify-center">
                    {status === 'closed' ? 'Dobara Do' : 'Start →'}
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-xl font-bold">Test Series</h2>
        <div className="mb-4 flex flex-wrap gap-2">
          <button onClick={() => setSelectedSubject('all')}
            className={`px-3 py-1 rounded-full text-sm ${selectedSubject === 'all' ? 'bg-brand text-white' : 'bg-slate-200'}`}>
            Sab Subjects
          </button>
          {subjects.map((s) => (
            <button key={s.id} onClick={() => setSelectedSubject(s.id)}
              className={`px-3 py-1 rounded-full text-sm ${selectedSubject === s.id ? 'bg-brand text-white' : 'bg-slate-200'}`}>
              {s.name}
            </button>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <StartSeriesCard key={s.id} series={s} />
          ))}
          {filtered.length === 0 && <p className="text-slate-500">Is category me abhi series nahi hain.</p>}
        </div>
      </section>
    </div>
  );
}

function StartSeriesCard({ series }: { series: Series }) {
  const router = useRouter();
  const [starting, setStarting] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  async function start() {
    setStarting(true);
    const res = await fetch('/api/series', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seriesId: series.id }),
    });
    const data = await res.json();
    setStarting(false);

    if (data.testId) { window.location.href = `/test/${data.testId}`; return; }

    if (res.status === 401 || data.needsLogin) { setShowLogin(true); return; }

    alert(data.error ?? 'Kuch galat hua');
  }

  if (showLogin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
          <div className="rounded-t-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5">
            <p className="text-3xl">🔐</p>
            <h3 className="mt-1 text-xl font-bold text-white">Login Zaroori Hai</h3>
          </div>
          <div className="p-6">
            <p className="text-sm leading-relaxed text-slate-600">{LOGIN_REQUIRED_MESSAGE}</p>

            <a href="/api/contact/telegram" target="_blank" rel="noreferrer"
              className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-4 py-2.5 text-sm font-semibold text-sky-700 transition hover:bg-sky-100">
              <TelegramIcon className="h-4 w-4" /> टेलीग्राम पर मैसेज करें
            </a>

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`)}
                className="btn-primary flex-1 py-3">
                🔑 Login Karo
              </button>
              <button onClick={() => setShowLogin(false)}
                className="btn-outline px-4 py-3">
                Baad Me
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="font-bold">{series.name}</h3>
      <p className="mt-1 text-sm text-slate-500">
        {series.question_count} Q · {series.duration_minutes} min · {series.difficulty}
      </p>
      <button onClick={start} disabled={starting} className="btn-primary mt-4 w-full">
        {starting ? 'Shuru ho raha...' : 'Test Shuru Karo'}
      </button>
    </div>
  );
}
