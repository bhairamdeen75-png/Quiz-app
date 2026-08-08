'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PdfUploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append('file', file);

    const res = await fetch('/api/pdf/upload', { method: 'POST', body: form });
    const data = await res.json();
    if (data.uploadId) {
      setUploadId(data.uploadId);
      setStatus('uploaded');
      processPdf(data.uploadId);
    } else {
      alert(data.error ?? 'Upload failed');
      setUploading(false);
    }
  }

  async function processPdf(id: string) {
    const res = await fetch(`/api/pdf/uploads/${id}`, { method: 'POST' });
    const data = await res.json();
    if (data.testId) {
      setStatus('done');
      router.push(`/test/${data.testId}`);
    } else {
      setStatus('failed');
      alert(data.error ?? 'Processing failed');
    }
    setUploading(false);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">📄 PDF ko Quiz Banao</h1>
      <p className="text-slate-600">
        Apni koi bhi practice paper / notes PDF upload karo. AI uske questions nikaal kar
        turant feedback wala live test bana dega.
      </p>

      <div className="card space-y-4">
        <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full rounded-lg border p-3" />
        <p className="text-xs text-slate-400">Max 20MB · Sirf .pdf</p>
        <button onClick={handleUpload} disabled={!file || uploading} className="btn-primary w-full">
          {uploading ? '⏳ AI PDF padh raha hai...' : 'Upload & Quiz Banao'}
        </button>
        {uploadId && status === 'uploaded' && (
          <p className="text-center text-sm text-amber-600">📖 PDF process ho raha hai — isme 30-60 sec lag sakte hain...</p>
        )}
      </div>
    </div>
  );
}
