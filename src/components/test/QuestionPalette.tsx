'use client';
export default function QuestionPalette({ total, answered, current, onJump }: {
  total: number; answered: Record<number, boolean>; current: number; onJump: (i: number) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {Array.from({ length: total }, (_, i) => (
        <button key={i} onClick={() => onJump(i)}
          className={`h-9 rounded-lg text-sm font-semibold
            ${i === current ? 'ring-2 ring-brand' : ''}
            ${answered[i] ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
          {i + 1}
        </button>
      ))}
    </div>
  );
}
