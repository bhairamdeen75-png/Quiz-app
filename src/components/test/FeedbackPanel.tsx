'use client';
export default function FeedbackPanel({ correct, correctIndex, correctValue, isInteger, options, hint, explanation }: {
  correct: boolean;
  correctIndex: number;
  correctValue?: number | null;
  isInteger?: boolean;
  options: string[];
  hint?: string | null;
  explanation?: string | null;
}) {
  return (
    <div className={`rounded-xl border p-4 ${correct ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
      <p className="text-lg font-bold">{correct ? '✅ Sahi Jawab!' : '❌ Galat Jawab'}</p>
      {!correct && (
        <p className="mt-2">
          <span className="font-semibold">Sahi jawab:</span>{' '}
          {isInteger ? <b>{correctValue}</b> : <b>{options[correctIndex]}</b>}
        </p>
      )}
      {hint && (
        <p className="mt-2 rounded-lg bg-amber-50 p-3 text-sm">
          💡 <span className="font-semibold">Hint:</span> {hint}
        </p>
      )}
      {explanation && (
        <p className="mt-2 text-sm text-slate-600">
          📖 <span className="font-semibold">Explanation:</span> {explanation}
        </p>
      )}
    </div>
  );
}
