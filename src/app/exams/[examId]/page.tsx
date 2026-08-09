'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ExamDetail { exam: any; subjects: any[]; rule: any; }
interface Series { id: string; name: string; question_count: number; duration_minutes: number; difficulty: string; }

export default function ExamDetailPage({ params }: { params: { examId: string } }) {
  const [detail, setDetail] = useState<ExamDetail | null>(null);
  const [series, setSeries] = useState<Series[]>([]);
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

    return () => { cancelled = true; };
  }, [params.examId]);

  // ✅ Galt ID / missing exam → clean message, crash nahi
  if (error) return (
    <div className="p-8 text-center">
      <p className="text-lg font-semibold text-slate-700">{error}</p>
      <Link href="/exams" className="btn-primary mt-4 inline-block">Sab Exams Dekho</Link>
    </div>
  );

  // ✅ detail.exam exist karna chahiye — double guard
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
  const [starting, setStarting] = useState(false);
  async function start() {
    setStarting(true);
    const res = await fetch('/api/series', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seriesId: series.id }),
    });
    const data = await res.json();
    if (data.testId) window.location.href = `/test/${data.testId}`;
    else alert(data.error ?? 'Kuch galat hua');
    setStarting(false);
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
