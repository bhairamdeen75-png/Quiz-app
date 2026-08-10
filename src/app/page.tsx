import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Exam } from "@/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  // ✅ DB se exams fetch karo — real UUIDs milengi, hardcoded 1-10 nahi
  const supabase = createClient();
  const { data } = await supabase.from("exams").select("*").eq("is_active", true).order("name");
  const exams: Exam[] = data ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navbar */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">Q</div>
          <span className="text-lg font-bold text-gray-900">Quiz-app</span>
        </div>
        <a href="/dashboard" className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700">
          Dashboard
        </a>
      </nav>

      {/* Hero */}
      <header className="mx-auto max-w-4xl px-6 pb-16 pt-16 text-center">
        <span className="mb-4 inline-block rounded-full bg-indigo-100 px-4 py-1.5 text-xs font-semibold text-indigo-700">
          ✨ AI-powered question generation
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
          Quiz banao, seconds mein,
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> AI ke saath</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
          Chapter select karo, difficulty chuno, aur AI ko 50 questions generate karne do — PDF, practice test, har format mein.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          {/* ✅ /create (404) → /ai-test (existing page) */}
          <a href="/ai-test" className="rounded-xl bg-indigo-600 px-7 py-3.5 font-semibold text-white shadow-xl shadow-indigo-200 transition hover:scale-[1.02] hover:bg-indigo-700">
            Make Quiz or Test 
          </a>
          <a href="/about" className="rounded-xl border border-gray-300 bg-white px-7 py-3.5 font-semibold text-gray-700 transition hover:bg-gray-50">
            How to work 
          </a>
        </div>
      </header>

      {/* Feature cards */}
      <section className="mx-auto grid max-w-5xl gap-6 px-6 pb-20 sm:grid-cols-3">
        {[
          { icon: "🤖", title: "AI Generation", desc: "Pollinations AI se topic-wise MCQs, answer + explanation ke saath" },
          { icon: "⚡", title: "Instant Tests", desc: "Generate hote hi test create, link share karo, results track karo" },
          { icon: "📊", title: "Progress Tracking", desc: "Student-wise scores aur weak topics ka analysis" },
        ].map((f) => (
          <div key={f.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="mb-3 text-3xl">{f.icon}</div>
            <h3 className="font-bold text-gray-900">{f.title}</h3>
            <p className="mt-1 text-sm text-gray-600">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* EXAMS GRID — ab DB se, real UUID links */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <h2 className="mb-6 text-center text-2xl font-bold">Exams Jo Hum Cover Karte Hain</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {exams.length === 0 && <p className="text-slate-500">Abhi koi exam nahi hai.</p>}
          {exams.map((exam) => (
            <Link key={exam.id} href={`/exams/${exam.id}`} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{exam.icon}</span>
                <div>
                  <h3 className="font-bold">{exam.name}</h3>
                  <p className="text-sm text-slate-500">{exam.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
