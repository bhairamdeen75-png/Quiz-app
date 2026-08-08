'use client';
import { useEffect, useState } from 'react';

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [filter, setFilter] = useState('pending');

  async function load() {
    const res = await fetch(`/api/admin/questions?status=${filter}`);
    setQuestions(await res.json());
  }
  useEffect(() => { load(); }, [filter]);

  async function approve(id: string, approved: boolean) {
    await fetch('/api/admin/questions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isApproved: approved }),
    });
    load();
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Question Review</h1>
      <div className="flex gap-2">
        <button onClick={() => setFilter('pending')} className={`btn-outline ${filter === 'pending' ? 'bg-brand text-white' : ''}`}>Pending ({filter})</button>
        <button onClick={() => setFilter('approved')} className={`btn-outline ${filter === 'approved' ? 'bg-brand text-white' : ''}`}>Approved</button>
      </div>
      <div className="space-y-3">
        {questions.map((q) => (
          <div key={q.id} className="card">
            <p className="font-medium">{q.question_text}</p>
            <p className="mt-1 text-xs text-slate-500">
              {q.exams?.name} / {q.subjects?.name} / {q.difficulty} / {q.source}
            </p>
            <div className="mt-3 flex gap-2">
              <button onClick={() => approve(q.id, true)} className="btn-primary">✅ Approve</button>
              <button onClick={() => approve(q.id, false)} className="btn-outline">🗑️ Reject</button>
            </div>
          </div>
        ))}
        {questions.length === 0 && <p className="text-slate-500">Koi question nahi mila.</p>}
      </div>
    </div>
  );
}
