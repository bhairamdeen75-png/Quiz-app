import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Exam } from "@/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  // DB se exams — real UUIDs, safe fetch
  const supabase = createClient();
  const { data } = await supabase
    .from("exams").select("*").eq("is_active", true).order("name");
  const exams: Exam[] = data ?? [];

  const iconGradients = [
    "linear-gradient(135deg,#6366f1,#8b5cf6)",
    "linear-gradient(135deg,#ec4899,#f43f5e)",
    "linear-gradient(135deg,#06b6d4,#3b82f6)",
    "linear-gradient(135deg,#f59e0b,#ef4444)",
    "linear-gradient(135deg,#10b981,#14b8a6)",
    "linear-gradient(135deg,#8b5cf6,#d946ef)",
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0a1f] text-white">
      {/* ══════ SAFE CSS (sirf animations — koi JS nahi) ══════ */}
      <style>{`
        .orb { position: absolute; border-radius: 9999px; filter: blur(90px); opacity: 0.45; pointer-events: none; }
        @keyframes orb1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(60px,-50px) scale(1.15); } }
        @keyframes orb2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-70px,40px) scale(1.1); } }
        @keyframes orb3 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(40px,60px) scale(0.9); } }
        @keyframes floaty { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
        @keyframes shimmerMove { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
        .shimmer-text {
          background: linear-gradient(90deg,#fbbf24,#f472b6,#a78bfa,#fbbf24);
          background-size: 200% auto;
          -webkit-background-clip: text; background-clip: text;
          color: transparent;
          animation: shimmerMove 4s linear infinite;
        }
        .grid-bg {
          background-image:
            linear-gradient(rgba(99,102,241,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.07) 1px, transparent 1px);
          background-size: 46px 46px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%);
        }
        .exam-card { transition: all 0.3s ease; }
        .exam-card:hover { transform: translateY(-6px); border-color: rgba(129,140,248,0.6); box-shadow: 0 24px 60px -16px rgba(99,102,241,0.45); }
        .btn-primary-fancy { transition: all 0.25s ease; box-shadow: 0 12px 40px -8px rgba(99,102,241,0.6); }
        .btn-primary-fancy:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 18px 50px -8px rgba(139,92,246,0.7); }
        .btn-ghost-fancy { transition: all 0.25s ease; }
        .btn-ghost-fancy:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.4); }
      `}</style>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative flex min-h-[92vh] items-center overflow-hidden">
        {/* Glow orbs */}
        <div aria-hidden="true" className="orb h-96 w-96 bg-indigo-600" style={{ top: "-60px", left: "-80px", animation: "orb1 12s ease-in-out infinite" }} />
        <div aria-hidden="true" className="orb h-80 w-80 bg-purple-600" style={{ top: "30%", right: "-100px", animation: "orb2 15s ease-in-out infinite" }} />
        <div aria-hidden="true" className="orb h-72 w-72 bg-pink-600" style={{ bottom: "-60px", left: "35%", animation: "orb3 18s ease-in-out infinite" }} />

        {/* Grid pattern */}
        <div aria-hidden="true" className="grid-bg absolute inset-0" />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-5xl px-4 py-24 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/40 bg-indigo-500/15 px-5 py-2 text-xs font-bold tracking-widest text-indigo-200 uppercase backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            10+ Exams · AI Powered · Bilkul Free
          </span>

          <h1 className="mt-7 text-4xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Padho, Practice Karo,
            <span className="shimmer-text block pt-2">Top Karo!</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            JEE, NEET, SSC, UPSC aur bahut se exams ki preloaded test series.
            AI se instant test banao, har answer pe turant feedback pao,
            aur apni accuracy real-time dekho.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link href="/exams" className="btn-primary-fancy inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-4 text-base font-bold">
              📚 Exam Chuno
            </Link>
            <Link href="/ai-test" className="btn-ghost-fancy inline-flex items-center gap-2 rounded-2xl border-2 border-white/25 bg-white/5 px-8 py-4 text-base font-bold backdrop-blur">
              🤖 AI Test Banao
            </Link>
          </div>

          {/* Floating glass cards (dekhaane ke liye) */}
          <div aria-hidden="true" className="pointer-events-none relative mx-auto mt-16 hidden max-w-3xl select-none sm:block">
            <div className="absolute left-0 top-2 w-44 rounded-2xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur" style={{ animation: "floaty 6s ease-in-out infinite" }}>
              <p className="text-xs text-slate-400">Accuracy</p>
              <p className="text-2xl font-black text-emerald-400">94%</p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-emerald-400 to-teal-400" />
              </div>
            </div>
            <div className="absolute right-0 top-10 w-52 rounded-2xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur" style={{ animation: "floaty 7s ease-in-out infinite 1s" }}>
              <p className="text-xs text-slate-400">Abhi chal raha hai</p>
              <p className="mt-1 text-sm font-bold text-white">JEE Main — Physics</p>
              <p className="mt-1 text-xs text-slate-400">Question 4 / 15</p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400" />
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="mx-auto mt-14 grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              ["10+", "Exams"],
              ["500+", "Questions"],
              ["100%", "Free"],
              ["24/7", "AI Available"],
            ].map(([num, label]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 backdrop-blur">
                <p className="text-2xl font-black text-transparent" style={{ backgroundImage: "linear-gradient(90deg,#a5b4fc,#f0abfc)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>{num}</p>
                <p className="mt-1 text-xs font-semibold tracking-wide text-slate-400 uppercase">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ EXAMS ═══════════════════ */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-widest text-indigo-400 uppercase">Test Series</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">Apna Exam Chuno</h2>
            <p className="mt-2 max-w-md text-slate-400">
              Har exam me preloaded test series, AI test aur PDF quiz available.
            </p>
          </div>
          <Link href="/exams" className="rounded-xl border border-white/15 px-5 py-2.5 text-sm font-bold text-indigo-300 transition hover:bg-white/10">
            Sab Dekho →
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam, i) => (
            <Link
              key={exam.id}
              href={`/exams/${exam.id}`}
              className="exam-card group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
            >
              {/* Hover glow */}
              <div aria-hidden="true" className="absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-0 blur-2xl transition group-hover:opacity-60" style={{ background: iconGradients[i % iconGradients.length] }} />

              <div className="relative flex items-center gap-4">
                <span
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl shadow-lg"
                  style={{ background: iconGradients[i % iconGradients.length] }}
                >
                  {exam.icon}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white">{exam.name}</h3>
                  <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-slate-400">{exam.description}</p>
                </div>
              </div>

              <div className="relative mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-xs font-semibold text-indigo-300">Test Series Dekho</span>
                <span className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-indigo-300">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
      <section className="relative z-10 border-t border-white/10 bg-white/[0.03] py-20">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-center text-xs font-bold tracking-widest text-indigo-400 uppercase">Kaise Kaam Karta Hai</p>
          <h2 className="mt-2 text-center text-3xl font-black sm:text-4xl">Sirf 3 Steps</h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              { step: "01", icon: "🎯", title: "Exam Chuno", desc: "JEE, NEET, SSC, UPSC — jo exam dena hai wo chuno." },
              { step: "02", icon: "⚡", title: "Test Shuru Karo", desc: "Preloaded series ya AI se banaya test — instant start." },
              { step: "03", icon: "🏆", title: "Result Dekho", desc: "Score, correct, wrong, accuracy — sab detailed analysis." },
            ].map((s) => (
              <div key={s.step} className="relative rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur">
                <span className="absolute right-5 top-4 text-4xl font-black text-white/5">{s.step}</span>
                <p className="text-4xl">{s.icon}</p>
                <h3 className="mt-4 text-lg font-bold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="relative z-10 overflow-hidden py-24">
        <div aria-hidden="true" className="orb h-72 w-72 bg-purple-600" style={{ top: "-40px", left: "10%", animation: "orb2 14s ease-in-out infinite" }} />
        <div aria-hidden="true" className="orb h-72 w-72 bg-indigo-600" style={{ bottom: "-60px", right: "10%", animation: "orb1 16s ease-in-out infinite" }} />

        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-black sm:text-5xl">
            Aaj Hi <span className="shimmer-text">Test Dena</span> Shuru Karo!
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-400">
            Login karo aur apni test series, progress aur weak topics track karo — bilkul free.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/login" className="btn-primary-fancy rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-4 font-bold">
              🔑 Abhi Login Karo
            </Link>
            <Link href="/exams" className="btn-ghost-fancy rounded-2xl border-2 border-white/25 bg-white/5 px-8 py-4 font-bold">
              Exams Browse Karo
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="relative z-10 border-t border-white/10 py-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-lg font-black">
              Q
            </span>
            <div>
              <p className="font-bold">QuizApp</p>
              <p className="text-xs text-slate-500">AI se banao, AI se seekho</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-slate-400">
            <Link href="/exams" className="transition hover:text-indigo-300">Exams</Link>
            <Link href="/ai-test" className="transition hover:text-indigo-300">AI Test</Link>
            <Link href="/dashboard" className="transition hover:text-indigo-300">Dashboard</Link>
            <Link href="/login" className="transition hover:text-indigo-300">Login</Link>
          </div>
          <p className="text-xs text-slate-600">© 2026 QuizApp · Made with ❤️ TEAMVB</p>
        </div>
      </footer>
    </div>
  );
}
