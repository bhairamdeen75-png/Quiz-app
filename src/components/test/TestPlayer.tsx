'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import CountdownTimer from './CountdownTimer';
import QuestionPalette from './QuestionPalette';
import FeedbackPanel from './FeedbackPanel';

interface TestData {
  testId: string; title: string; answerMode: 'instant' | 'final';
  durationSeconds: number; startedAt: string;
  questions: { id: string; question_text: string; options: string[]; difficulty: string }[];
}

export default function TestPlayer({ testId }: { testId: string }) {
  const router = useRouter();
  const [test, setTest] = useState<TestData | null>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [answeredFlags, setAnsweredFlags] = useState<Record<number, boolean>>({});
  const [feedback, setFeedback] = useState<any>(null);
  const startedAtRef = useRef<string>('');

  useEffect(() => {
    fetch(`/api/tests/${testId}/questions`).then((r) => r.json()).then((d) => {
      setTest(d);
      startedAtRef.current = d.startedAt;
    });
  }, [testId]);

  const submitAnswer = useCallback(async (questionId: string, optionIndex: number) => {
    if (!test) return;
    const res = await fetch(`/api/tests/${testId}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId, userAnswer: optionIndex }),
    });
    const data = await res.json();
    if (res.ok && test.answerMode === 'instant') setFeedback(data);
    setAnsweredFlags((prev) => ({ ...prev, [current]: true }));
  }, [test, testId, current]);

  const finalSubmit = useCallback(async () => {
    await fetch(`/api/tests/${testId}/submit`, { method: 'POST' });
    router.push(`/test/${testId}/result`);
  }, [testId, router]);

  if (!test) return <p className="p-8 text-center text-slate-500">Test load ho raha hai...</p>;

  const q = test.questions[current];
  const selected = answers[q.id];

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
          <div className="mt-5 space-y-3">
            {q.options.map((opt, i) => {
              const isSelected = selected === i;
              const showFeedback = feedback && i === feedback.correctIndex;
              const showWrong = feedback && isSelected && i !== feedback.correctIndex;
              return (
                <button key={i}
                  onClick={() => { setAnswers((p) => ({ ...p, [q.id]: i })); submitAnswer(q.id, i); }}
                  disabled={!!feedback && test.answerMode === 'instant'}
                  className={`w-full rounded-xl border p-4 text-left transition
                    ${showFeedback ? 'border-green-500 bg-green-50' :
                      showWrong ? 'border-red-500 bg-red-50' :
                      isSelected ? 'border-brand bg-brand/5' : 'hover:border-brand/50'}`}>
                  <span className="font-semibold">{String.fromCharCode(65 + i)}.</span> {opt}
                </button>
              );
            })}
          </div>
        </div>

        {feedback && test.answerMode === 'instant' && (
          <FeedbackPanel {...feedback} options={q.options} />
        )}

        <div className="flex justify-between">
          <button onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}
            className="btn-outline">← Pichhla</button>
          {current < test.questions.length - 1 ? (
            <button onClick={() => { setFeedback(null); setCurrent((c) => c + 1); }} className="btn-primary">Agla →</button>
          ) : (
            <button onClick={finalSubmit} className="btn-primary">✅ Submit Test</button>
          )}
        </div>
      </div>

      {/* Palette */}
      <aside className="card h-fit space-y-4 lg:sticky lg:top-20">
        <p className="font-bold">Question Palette</p>
        <QuestionPalette total={test.questions.length} answered={answeredFlags}
          current={current} onJump={(i) => { setFeedback(null); setCurrent(i); }} />
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="h-3 w-3 rounded bg-green-500" /> Answered
          <span className="ml-2 h-3 w-3 rounded bg-slate-200" /> Unanswered
        </div>
        <button onClick={finalSubmit} className="btn-primary w-full">Submit Test</button>
      </aside>
    </div>
  );
}
