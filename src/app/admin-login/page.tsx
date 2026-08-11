'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error ?? 'Galat email ya password. Sirf admin login kar sakta hai.');
        setPassword('');
      }
    } catch {
      setError('Server se connect nahi hua. Dobara try karo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4">
      <div className="rounded-2xl border border-brand/10 bg-white p-8 shadow-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-2xl shadow-lg">
          ⭐
        </div>
        <h1 className="mt-4 text-center text-2xl font-bold text-brand">Admin Login</h1>
        <p className="mt-1 text-center text-sm text-slate-500">
          Sirf authorized admin ke liye — koi aur yahan nahi ghus sakta 🔒
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="admin-email" className="mb-1 block text-sm font-semibold text-slate-700">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-1 block text-sm font-semibold text-slate-700">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full !py-3 disabled:opacity-60">
            {loading ? 'Verify ho raha hai...' : '⭐ Admin Panel Kholo'}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-slate-400">
          Owners and Admin ke alawa koi aur login nahi kar sakta.
        </p>
        <Link href="/" className="mt-3 block text-center text-sm text-brand/70 hover:text-brand">
          ← Home wapas jao
        </Link>
      </div>
    </div>
  );
}
