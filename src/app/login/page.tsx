'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGoogle() {
    setLoading(true);
    setError('');
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (e) {
      setError('Login fail ho gaya. Dobara try karo.');
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4">
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl shadow-indigo-100">
        {/* Logo */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-2xl font-extrabold text-white shadow-lg shadow-indigo-200">
          Q
        </div>
        <h1 className="mt-4 text-center text-2xl font-bold text-gray-900">Quiz-app me Welcome 👋</h1>
        <p className="mt-1 text-center text-sm text-gray-500">
          Login karo aur apni test series, progress aur weak topics track karo
        </p>

        {/* Features */}
        <div className="mt-6 space-y-2 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
          <p className="flex items-center gap-2"><span>📚</span> 10+ exam ki free test series</p>
          <p className="flex items-center gap-2"><span>🤖</span> AI se instant test generation</p>
          <p className="flex items-center gap-2"><span>📊</span> Score + accuracy + weak topic analysis</p>
        </div>

        {/* Error */}
        {error && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">{error}</p>
        )}

        {/* Google Button */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:shadow disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600" />
              Login ho raha hai...
            </span>
          ) : (
            <>
              {/* Google G logo */}
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </>
          )}
        </button>

        <p className="mt-4 text-center text-xs text-gray-400">
          Continue karne se aap hamari Terms of Service se sehmat hote hain
        </p>
      </div>
    </div>
  );
}
