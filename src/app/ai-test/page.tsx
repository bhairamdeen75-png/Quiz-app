'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AITestPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center">Loading...</p>}>
      <AITestForm />
    </Suspense>
  );
}

function AITestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [exams, setExams] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [chapters, setChapters] = useState<any[]>([]);

  const [examId, setExamId] = useState(searchParams.get('examId') ?? '');
  const [subjectId, setSubjectId] = useState('');
  const [chapterIds, setChapterIds] = useState<string[]>([]);
  const [count, setCount] = useState(20);
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/exams').then((r) => r.json()).then(setExams);
  }, []);

  useEffect(() => {
    if (!examId) return;
    fetch(`/api/exams/${examId}`).then((r) => r.json()).then((d) => {
      setSubjects(d.subjects ?? []);
      setSubjectId(''); setChapters([]); setChapterIds([]);
    });
  }, [examId]);

  useEffect(() => {
    const sub = subjects.find((s) => s.id === subjectId);
    setChapters(sub?.chapters ?? []);
    setChapterIds([]);
  }, [subjectId, subjects]);

  function toggleChapter(id: string) {
    setChapterIds((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
  }

  async function generate() {
    if (!examId || !subjectId) { alert('Exam aur Subject select karo'); return; }
    setLoading(true);
    const res = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ examId, subjectId, chapterIds, count, difficulty }),
    });
    const data = await res.json();
    if (data.testId) router.push(`/test/${data.testId}`);
    else alert(data.error ?? 'Generation failed');
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">🤖 AI Test Generate Karo</h1>
      <p className="text-slate-600">Exam → Subject → Chapters chuno, AI 10-50 questions banayega. Har answer ke baad sahi/galat + hint milega.</p>

      {/* Exam */}
      <div className="card space-y-2">
        <label className="block font-semibold">1. Exam Chuno</label>
        <select value={examId} onChange={(e) => setExamId(e.target.value)} className="w-full rounded-lg border p-3">
          <option value="">-- Select Exam --</option>
          {exams.map((e) => <option key={e.id} value={e.id}>{e.icon} {e.name}</option>)}
        </select>
      </div>

      {/* Subject */}
      {examId && (
        <div className="card space-y-2">
          <label className="block font-semibold">2. Subject Chuno</label>
          <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="w-full rounded-lg border p-3">
            <option value="">-- Select Subject --</option>
            {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      )}

      {/* Chapters */}
      {chapters.length > 0 && (
        <div className="card space-y-3">
          <label className="block font-semibold">3. Chapters Chuno (multi-select)</label>
          <div className="flex flex-wrap gap-2">
            {chapters.map((c) => (
              <button key={c.id} onClick={() => toggleChapter(c.id)}
                className={`px-3 py-1 rounded-full text-sm ${chapterIds.includes(c.id) ? 'bg-brand text-white' : 'bg-slate-200'}`}>
                {c.name}
              </button>
            ))}
          </div>
          {chapterIds.length === 0 && <p className="text-xs text-slate-400">Kuch nahi chuna to AI pura subject cover karega</p>}
        </div>
      )}

      {/* Count + Difficulty */}
      <div className="card grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block font-semibold">4. Kitne Questions?</label>
          <input type="range" min={10} max={50} step={10} value={count}
            onChange={(e) => setCount(Number(e.target.value))} className="w-full" />
          <p className="text-center font-bold text-brand">{count} Questions</p>
        </div>
        <div>
          <label className="block font-semibold">5. Difficulty</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full rounded-lg border p-3">
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <button onClick={generate} disabled={loading} className="btn-primary w-full py-4 text-lg">
        {loading ? '⏳ AI Questions bana raha hai...' : '🚀 AI Test Generate Karo'}
      </button>
    </div>
  );
}
