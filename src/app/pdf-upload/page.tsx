'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LOGIN_REQUIRED_MESSAGE, TELEGRAM_URL } from '@/lib/messages';

export default function PdfUploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);   // 🔐 Naya state

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append('file', file);

    const res = await fetch('/api/pdf/upload', { method: 'POST', body: form });
    const data = await res.json();

    // 🔐 Login nahi hai → wahi mast modal dikhao (exams wala style)
    if (res.status === 401 || data.needsLogin) {
      setUploading(false);
      setShowLogin(true);
      return;
    }

    if (data.uploadId) {
      setUploadId(data.uploadId);
      setStatus('uploaded');
      await processPdf(data.uploadId);
    } else {
      alert(data.error ?? 'Upload failed');
      setUploading(false);
    }
  }

  async function processPdf(id: string) {
    const res = await fetch(`/api/pdf/uploads/${id}`, { method: 'POST' });
    const data = await res.json();

    // 🔐 Processing ke time session expire ho gaya → modal
    if (res.status === 401 || data.needsLogin) {
      setUploading(false);
      setShowLogin(true);
      return;
    }

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
        <input type="file" accept=".pdf"
          onChange={(e) => { setFile(e.target.files?.[0] ?? null); setStatus(null); }}
          className="w-full rounded-lg border p-3" />
        <p className="text-xs text-slate-400">Max 20MB · Sirf .pdf</p>
        <button onClick={handleUpload} disabled={!file || uploading} className="btn-primary w-full">
          {uploading ? '⏳ AI PDF padh raha hai...' : 'Upload & Quiz Banao'}
        </button>
        {uploadId && status === 'uploaded' && (
          <p className="text-center text-sm text-amber-600">📖 PDF process ho raha hai — isme 30-60 sec lag sakte hain...</p>
        )}
      </div>

      {/* 🔐 Login modal — exams page jaisa, bilkul wahi style */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="rounded-t-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5">
              <p className="text-3xl">🔐</p>
              <h3 className="mt-1 text-xl font-bold text-white">Login Zaroori Hai</h3>
            </div>
            <div className="p-6">
              <p className="text-sm leading-relaxed text-slate-600">{LOGIN_REQUIRED_MESSAGE}</p>

              <a href={TELEGRAM_URL} target="_blank" rel="noreferrer"
                className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-4 py-2.5 text-sm font-semibold text-sky-700 transition hover:bg-sky-100">
                📨 टेलीग्राम पर मैसेज करें
              </a>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`)}
                  className="btn-primary flex-1 py-3">
                  🔑 Login Karo
                </button>
                <button onClick={() => setShowLogin(false)} className="btn-outline px-4 py-3">
                  Baad Me
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
