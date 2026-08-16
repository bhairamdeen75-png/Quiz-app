'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface LQ {
  id: string; type: string; question_text: string; options: string[];
  correctIndex: number; correctValue: number | null; difficulty: string;
}

export default function LiveTestPlayer() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [data, setData] = useState<{
    testId: string; title: string; durationSeconds: number; startedAt: string;
    ranked: boolean; questions: LQ[];
  } | null>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [remaining, setRemaining] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user) {
      router.push(`/login?callbackUrl=${encodeURIComponent('/live-tests/' + id)}`);
      return;
    }
    fetch(`/api/live-tests/${id}/start`, { method: 'POST' })
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) { alert(d.error || 'Test start nahi hua'); router.push('/live-tests'); return; }
        setData(d);
        const endMs = Date.now() + d.durationSeconds * 1000;
        timerRef.current = setInterval(() => {
          setRemaining(Math.max(0, endMs - Date.now()));
        }, 1000);
      })
      .catch(() => router.push('/live-tests'));
    return () => clearInterval(timerRef.current);
  }, [id, status, session, router]);

  const finalSubmit = useCallback(async () => {
    if (!data || submitting) return;
    setSubmitting(true);
    clearInterval(timerRef.current);
    try {
      const res = await fetch(`/api/live-tests/${id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testId: data.testId, answers }),
      });
      const d = await res.json();
      if (res.ok) router.push(`/live-tests/${id}/result?testId=${data.testId}`);
      else { alert(d.error || 'Submit fail ho gaya'); setSubmitting(false); }
    } catch {
      alert('Network error');
      setSubmitting(false);
    }
  }, [data, id, answers, submitting, router]);

  if (!data) return <p className="p-8 text-center text-slate-500">Test load ho raha hai...</p>;
  const q = data.questions[current];
  const selected = answers[q.id];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold">{data.title}</h1>
          <p className="text-xs text-slate-500">
            {data.questions.length} Questions
            {data.ranked
              ? ' · 🔴 Ranked Mode — 48h window ke andar'
              : ' · ⚪ Practice Mode — ranking nahi milegi'}
          </p>
        </div>
        <div className="rounded-xl bg-indigo-50 px-4 py-2 font-mono text-lg font-bold text-indigo-700">
          {String(Math.floor(remaining / 60000)).padStart(2, '0')}:
          {String(Math.floor((remaining % 60000) / 1000)).padStart(2, '0')}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-400">Question {current + 1} / {data.questions.length}</p>
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            q.type === 'integer' ? 'bg-purple-100 text-purple-700' : 'bg-indigo-100 text-indigo-700'
          }`}>
            {q.type === 'integer' ? '# Integer Type' : 'MCQ'}
          </span>
        </div>
        <p className="mt-3 text-lg font-medium">{q.question_text}</p>

        {/* MCQ */}
        {q.type !== 'integer' && (
          <div className="mt-5 space-y-3">
            {q.options.map((opt, i) => (
              <button key={i}
                onClick={() => setAnswers((p) => ({ ...p, [q.id]: i }))}
                className={`w-full rounded-xl border p-4 text-left transition ${
                  selected === i ? 'border-indigo-500 bg-indigo-50' : 'hover:border-indigo-300'
                }`}>
                <span className="font-semibold">{String.fromCharCode(65 + i)}.</span> {opt}
              </button>
            ))}
          </div>
        )}

        {/* INTEGER */}
        {q.type === 'integer' && (
          <div className="mt-5">
            <input
              type="number"
              value={selected ?? ''}
              onChange={(e) =>
                setAnswers((p) => ({ ...p, [q.id]: e.target.value === '' ? (null as any) : Number(e.target.value) }))
              }
              placeholder="Answer yahan likho (sirf number)"
              className="w-full rounded-xl border-2 border-purple-200 bg-purple-50/50 px-4 py-3 text-center text-xl font-bold focus:border-purple-500 focus:outline-none"
            />
            <p className="mt-2 text-xs text-slate-400">Integer type — answer ek number hoga</p>
          </div>
        )}

        <div className="mt-6 flex justify-between">
          <button onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}
            className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-gray-50 disabled:opacity-40">
            ← Pichhla
          </button>
          {current < data.questions.length - 1 ? (
            <button onClick={() => setCurrent((c) => c + 1)}
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
              Agla →
            </button>
          ) : (
            <button onClick={finalSubmit} disabled={submitting}
              className="rounded-xl bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50">
              {submitting ? 'Submitting...' : '✅ Submit Test'}
            </button>
          )}
        </div>
      </div>

      {/* Palette */}
      <div className="mt-4 flex flex-wrap gap-2">
        {data.questions.map((qq, i) => (
          <button key={qq.id} onClick={() => setCurrent(i)}
            className={`h-9 w-9 rounded-lg text-xs font-semibold transition ${
              answers[qq.id] != null ? 'bg-green-500 text-white' :
              i === current ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
            }`}>
            {i + 1}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-400">
        🟢 = Answered · ⬜ = Unanswered · Jitni baar chaho dobara de sakte ho — best score count hoga
      </p>
    </div>
  );
}
