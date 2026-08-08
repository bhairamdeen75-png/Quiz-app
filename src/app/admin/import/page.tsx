'use client';
import { useState } from 'react';

export default function AdminImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);

  async function importCsv() {
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/api/admin/import-csv', { method: 'POST', body: form });
    setResult(await res.json());
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">CSV Import</h1>
      <p className="text-sm text-slate-600">
        Format: <code className="rounded bg-slate-100 p-1">question,option_a,option_b,option_c,option_d,correct,chapter,subject,exam,difficulty,hint</code>
      </p>
      <div className="card space-y-4">
        <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="w-full rounded-lg border p-3" />
        <button onClick={importCsv} disabled={!file} className="btn-primary w-full">Import Karo</button>
        {result && (
          <p className="text-center font-semibold">
            ✅ {result.imported} imported · ❌ {result.failed} failed
          </p>
        )}
      </div>
    </div>
  );
}
