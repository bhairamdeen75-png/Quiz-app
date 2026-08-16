'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import CountdownTimer from './CountdownTimer';
import QuestionPalette from './QuestionPalette';
import FeedbackPanel from './FeedbackPanel';

interface Question {
  id: string;
  type: string;
  question_text: string;
  options: string[];
  difficulty: string;
  correctIndex: number;          // ⚡ For MCQ
  correctValue?: number | null;  // ⚡ For Integer — API 'correctValue' key se aata hai
  hint: string | null;
  explanation: string | null;
}

interface TestData {
  testId: string;
  title: string;
  answerMode: 'instant' | 'final';
  durationSeconds: number;
  startedAt: string;
  questions: Question[];
}

interface Feedback {
  correct: boolean;
  correctIndex: number;
  correctValue: number | null;
  isInteger: boolean;
  hint: string | null;
  explanation: string | null;
}

export default function TestPlayer({ testId }: { testId: string }) {
  const router = useRouter();
  const [test, setTest] = useState<TestData | null>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | null | undefined>>({});
  const [answeredFlags, setAnsweredFlags] = useState<Record<number, boolean>>({});
  const [feedback, setFeedback] = useState<Feedback | null>(null);               // transient (current question)
  const [feedbackMap, setFeedbackMap] = useState<Record<number, Feedback>>({}); // har question ka permanent feedback
  const startedAtRef = useRef<string>('');
  const intTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch(`/api/tests/${testId}/questions`)
      .then(async (r) => {
        const d = await r.json();
        if (r.status === 401 || d.needsLogin) {
          router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
          return;
        }
        setTest(d);
        startedAtRef.current = d.startedAt;
      })
      .catch(() => setTest(null));
  }, [testId, router]);

  // ⚡ Answer check LOCAL hai — 0ms, koi network call nahi
  const submitAnswer = useCallback(
    async (questionId: string, answerValue: number) => {
      if (!test) return;
      const q = test.questions.find((qq) => qq.id === questionId);
      if (!q) return;

      const isInteger = q.type === 'integer';
      const isCorrect = isInteger ? answerValue === q.correctValue : answerValue === q.correctIndex;

      const fb: Feedback = {
        correct: isCorrect,
        correctIndex: q.correctIndex,
        correctValue: q.correctValue ?? null,
        isInteger,
        hint: q.hint,
        explanation: q.explanation,
      };

      // Turant feedback sirf tab dikhao jab user abhi isi question par ho
      if (test.questions[current]?.id === questionId) setFeedback(fb);
      setFeedbackMap((prev) => ({ ...prev, [current]: fb }));
      setAnsweredFlags((prev) => ({ ...prev, [current]: true }));

      // Background me DB sync (fire-and-forget — UI block nahi hota)
      try {
        await fetch(`/api/tests/${testId}/answer`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questionId, userAnswer: answerValue }),
        });
      } catch {
        // Network fail ho jaye to submit pe answers phir bhi sync ho jayenge
      }
    },
    [test, testId, current]
  );

  const finalSubmit = useCallback(async () => {
    await fetch(`/api/tests/${testId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),   // ⚡ Backup sync — koi answer miss na ho
    });
    router.push(`/test/${testId}/result`);
  }, [testId, router, answers]);

  // Integer typing: 600ms debounce — pura number type kar pao, phir turant check
  const handleIntegerChange = useCallback(
    (qid: string, v: string) => {
      if (intTimer.current) clearTimeout(intTimer.current);
      setAnswers((p) => ({ ...p, [qid]: v === '' ? undefined : Number(v) }));
      if (v === '') return;
      intTimer.current = setTimeout(() => submitAnswer(qid, Number(v)), 600);
    },
    [submitAnswer]
  );

  if (!test) return <p className="p-8 text-center text-slate-500">Test load ho raha hai...</p>;

  const q = test.questions[current];
  const selected = answers[q.id];
  const fb = feedback ?? feedbackMap[current] ?? null;
  // instant mode: ek baar answer kiya to question LOCK — dobara change nahi kar sakte
  const locked = test.answerMode === 'instant' && !!answeredFlags[current];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
      {/* Question area */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">{test.title}</h1>
          <CountdownTimer startedAt={test.startedAt} durationSeconds={test.durationSeconds}
            onExpire={finalSubmit} />
        </div>

        <div className="card">
          <p className="text-xs font-semibold text-slate-400">Question {current + 1} / {test.questions.length} · {q.difficulty}</p>
          <p className="mt-3 text-lg font-medium">{q.question_text}</p>

          {/* ⚡ MCQ Options */}
          {q.type !== 'integer' && (
            <div className="mt-5 space-y-3">
              {q.options.map((opt, i) => {
                const isSelected = selected === i;
                const showFeedback = fb && i === fb.correctIndex;
                const showWrong = fb && isSelected && !fb.correct;
                return (
                  <button key={i}
                    onClick={() => { setAnswers((p) => ({ ...p, [q.id]: i })); submitAnswer(q.id, i); }}
                    disabled={locked}
                    className={`w-full rounded-xl border p-4 text-left transition
                      ${showFeedback ? 'border-green-500 bg-green-50' :
                        showWrong ? 'border-red-500 bg-red-50' :
                        isSelected ? 'border-brand bg-brand/5' : 'hover:border-brand/50'}`}>
                    <span className="font-semibold">{String.fromCharCode(65 + i)}.</span> {opt}
                  </button>
                );
              })}
            </div>
          )}

          {/* ⚡ Integer type — answer likhte hi check + lock */}
          {q.type === 'integer' && (
            <div className="mt-5">
              <input
                type="number"
                inputMode="numeric"
                value={(answers[q.id] ?? '') as any}
                onChange={(e) => handleIntegerChange(q.id, e.target.value)}
                disabled={locked}
                placeholder="Number answer likho"
                className={`w-full rounded-xl border-2 px-4 py-3 text-center text-xl font-bold focus:outline-none disabled:opacity-75 ${
                  fb
                    ? (fb.correct ? 'border-green-500 bg-green-50 focus:border-green-500' : 'border-red-400 bg-red-50 focus:border-red-400')
                    : 'border-purple-200 bg-purple-50/50 focus:border-purple-500'
                }`}
              />
              {!locked && !fb && (
                <p className="mt-2 text-xs text-slate-400">💡 Answer likhte hi correct/wrong + hint dikh jayega</p>
              )}
            </div>
          )}
        </div>

        {fb && (
          <FeedbackPanel correct={fb.correct} correctIndex={fb.correctIndex} correctValue={fb.correctValue}
            isInteger={fb.isInteger} options={q.options} hint={fb.hint} explanation={fb.explanation} />
        )}

        <div className="flex justify-between">
          <button onClick={() => { clearTimeout(intTimer.current ?? undefined); setFeedback(null); setCurrent((c) => Math.max(0, c - 1)); }}
            disabled={current === 0} className="btn-outline">← Pichhla</button>
          {current < test.questions.length - 1 ? (
            <button onClick={() => { clearTimeout(intTimer.current ?? undefined); setFeedback(null); setCurrent((c) => c + 1); }}
              className="btn-primary">Agla →</button>
          ) : (
            <button onClick={finalSubmit} className="btn-primary">✅ Submit Test</button>
          )}
        </div>
      </div>

      {/* Palette */}
      <aside className="card h-fit space-y-4 lg:sticky lg:top-20">
        <p className="font-bold">Question Palette</p>
        <QuestionPalette total={test.questions.length} answered={answeredFlags}
          current={current} onJump={(i) => { clearTimeout(intTimer.current ?? undefined); setFeedback(null); setCurrent(i); }} />
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="h-3 w-3 rounded bg-green-500" /> Answered
          <span className="ml-2 h-3 w-3 rounded bg-slate-200" /> Unanswered
        </div>
        <button onClick={finalSubmit} className="btn-primary w-full">Submit Test</button>
      </aside>
    </div>
  );
}
