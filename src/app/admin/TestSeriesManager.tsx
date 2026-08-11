'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type SeriesRow = {
  id: string;
  name: string;
  description: string | null;
  question_count: number | null;
  difficulty: string | null;
  exams?: { name: string } | null;
};

export default function TestSeriesManager({ initialSeries }: { initialSeries: SeriesRow[] }) {
  const [series, setSeries] = useState(initialSeries);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [cleanupOrphans, setCleanupOrphans] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  async function handleDelete(id: string, name: string) {
    if (!confirm(`"${name}" series delete karni hai?\nYe DB se bhi hata di jayegi.`)) return;
    setDeleting(id);
    setMessage('');
    try {
      const res = await fetch('/api/admin/delete-test-series', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, cleanupOrphans }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Delete fail ho gaya');
      setSeries((prev) => prev.filter((s) => s.id !== id));
      setMessage(`✅ "${name}" delete ho gayi. Storage free!`);
      router.refresh();
    } catch (e) {
      setMessage(`❌ ${(e as Error).message}`);
    } finally {
      setDeleting(null);
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold">🗑️ Test Series Management</h2>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={cleanupOrphans}
            onChange={(e) => setCleanupOrphans(e.target.checked)}
            className="accent-brand"
          />
          Kisi series me nahi wale orphan questions bhi delete karo (storage free)
        </label>
      </div>

      {message && <p className="rounded-lg bg-slate-50 p-3 text-sm">{message}</p>}

      {series.length === 0 ? (
        <p className="rounded-xl border border-dashed p-6 text-center text-sm text-slate-400">
          Koi test series nahi hai
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-brand/10 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Series</th>
                <th className="px-4 py-3">Exam</th>
                <th className="px-4 py-3">Questions</th>
                <th className="px-4 py-3">Difficulty</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {series.map((s) => (
                <tr key={s.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-semibold">{s.name}</td>
                  <td className="px-4 py-3 text-slate-500">{s.exams?.name ?? '—'}</td>
                  <td className="px-4 py-3">{s.question_count ?? '—'}</td>
                  <td className="px-4 py-3 capitalize">{s.difficulty ?? '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(s.id, s.name)}
                      disabled={deleting === s.id}
                      className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                    >
                      {deleting === s.id ? 'Deleting...' : '🗑️ Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
