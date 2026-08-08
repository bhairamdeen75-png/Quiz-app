'use client';
import { useEffect, useState } from 'react';
import { getDeadlineMs, formatCountdown } from '@/lib/utils/timer';

export default function CountdownTimer({ startedAt, durationSeconds, onExpire }: {
  startedAt: string; durationSeconds: number; onExpire: () => void;
}) {
  const [ms, setMs] = useState(getDeadlineMs(startedAt, durationSeconds) - Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      const left = getDeadlineMs(startedAt, durationSeconds) - Date.now();
      setMs(left);
      if (left <= 0) { clearInterval(id); onExpire(); }
    }, 1000);
    return () => clearInterval(id);
  }, [startedAt, durationSeconds, onExpire]);

  const urgent = ms < 5 * 60 * 1000;
  return (
    <div className={`rounded-lg px-4 py-2 font-mono text-xl font-bold ${urgent ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-800'}`}>
      ⏱ {formatCountdown(ms)}
    </div>
  );
}
