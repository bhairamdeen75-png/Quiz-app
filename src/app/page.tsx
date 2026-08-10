import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Exam } from "@/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createClient();
  const { data } = await supabase.from("exams").select("*").eq("is_active", true).order("name");
  const exams: Exam[] = data ?? [];

  return (
    <>
      {/* ═════ HERO ═════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 py-20 text-center text-white">
        <div className="mx-auto max-w-3xl px-4">
          <span className="inline-block rounded-full border border-indigo-400/40 bg-indigo-500/20 px-4 py-1.5 text-xs font-bold tracking-wide text-indigo-200">
            🚀 10+ Exams · AI Tests · Bilkul Free
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl">
            Padho, Practice Karo,
            <span className="block bg-gradient-to-r from-amber-300 to-pink-400 bg-clip-text text-transparent">
              Top Karo!
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-indigo-200">
            JEE, NEET, SSC, UPSC aur bahut se exams ki preloaded test series —
            AI se instant test banao, instant feedback pao, apni accuracy dekho.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/exams" className="rounded-xl bg-white px-7 py-3.5 font-bold text-indigo-700 shadow-lg transition hover:bg-indigo-50">
              📚 Exam Chuno
            </Link>
            <Link href="/ai-test" className="rounded-xl border-2 border-white/30 bg-white/10 px-7 py-3.5 font-bold backdrop-blur transition hover:bg-white/20">
              🤖 AI Test Banao
            </Link>
          </div>
        </div>
      </section>

      {/* ═════ EXAMS GRID ═════ */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Apna Exam Chuno</h2>
        <p className="mt-1 text-slate-500">Har exam me preloaded test series, AI test aur PDF quiz available hai.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam) => (
            <Link key={exam.id} href={`/exams/${exam.id}`} className="card transition hover:border-brand hover:shadow-md">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{exam.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{exam.name}</h3>
                  <p className="text-sm text-slate-500">{exam.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═════ FEATURES ═════ */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">Kyun QuizApp?</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              { icon: "📚", title: "Preloaded Test Series", desc: "JEE, NEET, SSC, UPSC — har exam ke liye ready tests, Hindi me." },
              { icon: "🤖", title: "AI Se Instant Test", desc: "Exam, Subject aur Chapters chuno — AI 10-50 questions banayega." },
              { icon: "📊", title: "Detailed Results", desc: "Score, Correct, Wrong, Skipped aur Accuracy — sab kuch milega." },
            ].map((f) => (
              <div key={f.title} className="card text-center">
                <p className="text-4xl">{f.icon}</p>
                <h3 className="mt-3 text-lg font-bold text-slate-900">{f.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════ CTA ═════ */}
      <section className="bg-gradient-to-r from-indigo-700 to-purple-700 py-14 text-center text-white">
        <h2 className="text-2xl font-extrabold sm:text-3xl">Test dena shuru karo — bilkul free!</h2>
        <p className="mx-auto mt-2 max-w-md px-4 text-indigo-100">Login karo aur apni test series, progress aur weak topics track karo.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/login" className="rounded-xl bg-white px-7 py-3 font-bold text-indigo-700 shadow-lg transition hover:bg-indigo-50">🔑 Login Karo</Link>
          <Link href="/exams" className="rounded-xl border-2 border-white/40 px-7 py-3 font-bold transition hover:bg-white/10">Exams Dekho</Link>
        </div>
      </section>

      {/* ═════ FOOTER ═════ */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-sm font-extrabold text-white">Q</span>
            <span className="text-sm font-semibold text-slate-700">QuizApp <span className="font-normal text-slate-400">— AI se banao, AI se seekho</span></span>
          </div>
          <div className="flex gap-5 text-sm text-slate-500">
            <Link href="/exams" className="hover:text-brand">Exams</Link>
            <Link href="/ai-test" className="hover:text-brand">AI Test</Link>
            <Link href="/dashboard" className="hover:text-brand">Dashboard</Link>
            <Link href="/login" className="hover:text-brand">Login</Link>
          </div>
          <p className="text-xs text-slate-400">© 2026 QuizApp · Made with ❤️ TEAMVB</p>
        </div>
      </footer>
    </>
  );
}
