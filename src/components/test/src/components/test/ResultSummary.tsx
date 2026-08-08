'use client';
export default function ResultSummary({ result }: { result: any }) {
  const stats = [
    { label: 'Score', value: `${result.score} / ${result.maxScore}`, color: 'text-brand' },
    { label: 'Correct', value: result.correct ?? result.correct_count ?? 0, color: 'text-green-600' },
    { label: 'Wrong', value: result.wrong ?? result.wrong_count ?? 0, color: 'text-red-600' },
    { label: 'Skipped', value: result.skipped ?? result.skipped_count ?? 0, color: 'text-slate-500' },
    { label: 'Accuracy', value: `${result.accuracy ?? 0}%`, color: 'text-amber-600' },
  ];
  return (
    <div className="card text-center">
      <h1 className="text-2xl font-bold">🎉 Test Complete!</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label}>
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
