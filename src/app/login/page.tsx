'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

const exams = [
  { slug: 'jee', name: 'JEE Main', icon: '⚙️', desc: '75 Q · 15 Integer · 4/-1 marking' },
  { slug: 'neet', name: 'NEET', icon: '🩺', desc: '180 Q · 4/-1 marking' },
  { slug: 'ssc-cgl', name: 'SSC CGL', icon: '🏛️', desc: '100 Q · 2/-0.5 marking' },
  { slug: 'upsc-prelims', name: 'UPSC Prelims', icon: '🎖️', desc: '100 Q · 2/-0.66 marking' },
];

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-sm text-gray-500">Loading...</div>}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [exam, setExam] = useState('jee');
  const [profileChecked, setProfileChecked] = useState(false);
  const [onboarded, setOnboarded] = useState(false);

  const callbackUrl = searchParams.get('callbackUrl') ?? '/';

  // Google login ke baad profile check karo
  useEffect(() => {
    if (session?.user && !profileChecked && !onboarded) {
      fetch('/api/profile/me')
        .then((r) => r.json())
        .then((p) => {
          if (p?.onboarded) {
            setOnboarded(true);
            window.location.href = callbackUrl;
          } else {
            setName(p?.student_name || session.user?.name || '');
            if (p?.student_class) setStudentClass(p.student_class);
            if (p?.exam_slug) setExam(p.exam_slug);
          }
        })
        .catch(() => {})
        .finally(() => setProfileChecked(true));
    }
  }, [session, profileChecked, onboarded, callbackUrl]);

  function handleGoogle() {
    setLoading(true);
    setError('');
    signIn('google', { callbackUrl: window.location.href });
  }

  async function saveProfile() {
    if (!name.trim()) {
      setError('Apna pura naam likho');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/profile/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam_slug: exam,
          student_name: name.trim(),
          student_class: studentClass,
          onboarded: true,
        }),
      });
      if (!res.ok) throw new Error('Save failed');
      window.location.href = callbackUrl;
    } catch {
      setError('Kuch galat ho gaya, dobara try karo');
      setSaving(false);
    }
  }

  // Loading / redirecting state
  if (status === 'loading' || (session?.user && !profileChecked) || onboarded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-center text-2xl font-bold text-gray-900">📚 Quiz App</h1>
        <p className="mt-1 text-center text-sm text-gray-500">JEE · NEET · SSC · UPSC practice</p>

        {/* STEP 1: GOOGLE LOGIN */}
        {!session?.user && (
          <div className="mt-10">
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600" />
                  Login ho raha hai...
                </span>
              ) : (
                <>
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
              Pehli baar? Google se login karo, phir naam / class / exam bharoge
            </p>
          </div>
        )}

        {/* STEP 2: NAME + CLASS + EXAM */}
        {session?.user && (
          <>
            <h2 className="mt-2 text-center text-xl font-bold text-gray-900">Profile Complete Karo ✏️</h2>
            <p className="mt-1 text-center text-sm text-gray-500">Ranking mein naam aise dikhega</p>

            {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">{error}</p>}

            <div className="mt-6 space-y-4">
              {/* Naam */}
              <div>
                <label className="text-sm font-medium text-gray-700">Pura Naam</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Class */}
              <div>
                <label className="text-sm font-medium text-gray-700">Class / Batch</label>
                <select
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="">Select class</option>
                  {['11th', '12th', '12th Pass', 'Dropper', 'Other'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Exam */}
              <div>
                <label className="text-sm font-medium text-gray-700">Exam Choose Karo</label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  {exams.map((e) => (
                    <button
                      key={e.slug}
                      type="button"
                      onClick={() => setExam(e.slug)}
                      className={`relative flex flex-col items-start gap-1 rounded-xl border-2 p-3 text-left transition ${
                        exam === e.slug
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      <span className="text-lg">{e.icon}</span>
                      <span className="text-sm font-semibold text-gray-900">{e.name}</span>
                      <span className="text-[11px] leading-tight text-gray-500">{e.desc}</span>
                      {exam === e.slug && (
                        <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[11px] text-white">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Continue */}
              <button
                onClick={saveProfile}
                disabled={saving || !name.trim()}
                className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : '✅ Continue'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
