'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ResultSummary from '@/components/test/ResultSummary';

export default function ResultPage({ params }: { params: { testId: string } }) {
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/tests/${params.testId}/submit`, { method: 'POST' })
      .then((r) => r.json())
      .then((d) => setResult(d.result ?? d));
  }, [params.testId]);

  if (!result) return <p className="p-8 text-center text-slate-500">Result load ho raha hai...</p>;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <ResultSummary result={result} />
      <div className="flex justify-center gap-3">
        <Link href="/exams" className="btn-primary">Naya Test</Link>
        <Link href="/dashboard" className="btn-outline">Dashboard</Link>
      </div>
    </div>
  );
}
