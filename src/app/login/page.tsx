'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

interface Exam {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
}

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

  const [exams, setExams] = useState<Exam[]>([]);
  const [examsLoading, setExamsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [exam, setExam] = useState('');
  const [profileChecked, setProfileChecked] = useState(false);
  const [onboarded, setOnboarded] = useState(false);

  const callbackUrl = searchParams.get('callbackUrl') ?? '/';

  // 📚 Saare active exams DB se
  useEffect(() => {
    fetch('/api/exams')
      .then((r) => r.json())
      .then((data: Exam[]) => {
        const list = Array.isArray(data) ? data : [];
        setExams(list);
        if (list.length > 0) setExam((prev) => prev || list[0].slug);
      })
      .catch(() => {})
      .finally(() => setExamsLoading(false));
  }, []);

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
    if (!exam) {
      setError('Exam choose karo');
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
      <div className="flex min-h-screen items-center justify-center bg-[#F8F9FA]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600" />
      </div>
    );
  }

  const selectedExam = exams.find((e) => e.slug === exam);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F9FA] px-4 py-8">
      <div className="w-full max-w-[420px] rounded-[32px] bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        
        {/* STEP 1: GOOGLE LOGIN */}
        {!session?.user && (
          <div className="flex flex-col items-center">
            {/* App Icon */}
            <div className="mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-white shadow-[0_8px_20px_rgba(59,130,246,0.25)]">
              <img 
                src="/icon.jpg" 
                alt="App Icon" 
                className="h-full w-full rounded-2xl object-cover"
              />
            </div>

            {/* Headings */}
            <h1 className="text-center text-3xl font-extrabold leading-tight text-gray-900">
              Quiz-app me <br /> Welcome 👋
            </h1>
            <p className="mt-3 text-center text-[15px] leading-relaxed text-gray-500 px-2">
              Login karo aur apni test series, progress aur weak topics track karo
            </p>

            {/* Feature List Box */}
            <div className="mt-8 w-full rounded-2xl bg-slate-50 p-5 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xl">📚</span>
                <span className="text-[14px] font-medium text-gray-700">10+ exam ki free test series</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">🤖</span>
                <span className="text-[14px] font-medium text-gray-700">AI se instant test generation</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">📊</span>
                <span className="text-[14px] font-medium text-gray-700">Score + accuracy + weak topic analysis</span>
              </div>
            </div>

            {/* Login Button */}
            <div className="mt-8 w-full">
              <button
                onClick={handleGoogle}
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-[16px] border border-gray-200 bg-white px-4 py-3.5 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600" />
                    Login ho raha hai...
                  </span>
                ) : (
                  <>
                    <svg width="22" height="22" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>
              
              {/* Disclaimer */}
              <p className="mt-5 text-center text-[12px] text-gray-400 font-medium px-2 leading-relaxed">
                Continue karne se aap hamari Terms of Service se sehmat hote hain
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: NAME + CLASS + EXAM */}
        {session?.user && (
          <div className="flex flex-col items-center">
            {/* App Icon */}
            <div className="mb-4 flex h-[60px] w-[60px] items-center justify-center rounded-2xl bg-white shadow-[0_6px_16px_rgba(59,130,246,0.2)]">
              <img 
                src="/icon.jpg" 
                alt="App Icon" 
                className="h-full w-full rounded-2xl object-cover"
              />
            </div>

            <h2 className="text-center text-2xl font-extrabold text-gray-900">Profile Complete Karo ✏️</h2>
            <p className="mt-1 text-center text-[14px] text-gray-500">Ranking mein naam aise dikhega</p>

            {error && <p className="mt-4 w-full rounded-xl bg-red-50 p-3 text-center text-sm font-medium text-red-600">{error}</p>}

            <div className="mt-6 w-full space-y-4">
              {/* Naam */}
              <div>
                <label className="text-sm font-semibold text-gray-700">Pura Naam</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 focus:border-indigo-500 focus:bg-white focus:outline-none transition text-gray-900"
                />
              </div>

              {/* Class */}
              <div>
                <label className="text-sm font-semibold text-gray-700">Class / Batch</label>
                <select
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 focus:border-indigo-500 focus:bg-white focus:outline-none transition text-gray-900"
                >
                  <option value="">Select class</option>
                  {['11th', '12th', '12th Pass', 'Dropper', 'Other'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Exam */}
              <div>
                <label className="text-sm font-semibold text-gray-700">Exam Choose Karo</label>
                {examsLoading ? (
                  <p className="mt-2 text-sm text-gray-400">Exams load ho rahe hain...</p>
                ) : exams.length === 0 ? (
                  <p className="mt-2 text-sm text-red-500">Koi exam nahi mila — baad mein try karo</p>
                ) : (
                  <div className="mt-2 grid max-h-[220px] grid-cols-2 gap-3 overflow-y-auto pr-1">
                    {exams.map((e) => (
                      <button
                        key={e.id}
                        type="button"
                        onClick={() => setExam(e.slug)}
                        className={`relative flex flex-col items-start gap-1 rounded-xl border-2 p-3 text-left transition ${
                          exam === e.slug
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-gray-100 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-xl">{e.icon}</span>
                        <span className="mt-1 text-sm font-bold text-gray-900">{e.name}</span>
                        {e.description && (
                          <span className="line-clamp-2 text-[11px] leading-tight text-gray-500">{e.description}</span>
                        )}
                        {exam === e.slug && (
                          <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[11px] text-white shadow-sm">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Continue */}
              <button
                onClick={saveProfile}
                disabled={saving || !name.trim() || !exam}
                className="mt-4 w-full rounded-[16px] bg-indigo-600 px-4 py-4 font-semibold text-white shadow-md transition hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : `✅ Continue${selectedExam ? ` — ${selectedExam.name}` : ''}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
