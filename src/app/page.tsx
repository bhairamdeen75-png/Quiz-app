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
    <>
      {/* ═══════════════════════════════════════════════════════════════
          ULTRA PRO ANIMATIONS & STYLES — ADDED ON TOP OF ORIGINAL
      ═══════════════════════════════════════════════════════════════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        * { font-family: 'Inter', -apple-system, sans-serif; }

        /* ── Floating orbs ── */
        @keyframes orb-float-1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33%       { transform: translate(30px, -40px) scale(1.05); }
          66%       { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes orb-float-2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33%       { transform: translate(-40px, 30px) scale(1.08); }
          66%       { transform: translate(25px, -20px) scale(0.92); }
        }
        @keyframes orb-float-3 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50%       { transform: translate(20px, -30px) scale(1.04); }
        }

        /* ── Shimmer text ── */
        @keyframes shimmer-move {
          0%   { background-position: -300% center; }
          100% { background-position: 300% center; }
        }
        .shimmer-text {
          background: linear-gradient(90deg,
            #6366f1 0%, #8b5cf6 20%, #c084fc 40%,
            #f472b6 55%, #8b5cf6 75%, #6366f1 100%);
          background-size: 300% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer-move 5s linear infinite;
        }

        /* ── Glow pulse on primary CTA ── */
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 24px 4px rgba(99,102,241,0.45); }
          50%       { box-shadow: 0 0 48px 12px rgba(139,92,246,0.6); }
        }
        .btn-glow { animation: glow-pulse 3s ease-in-out infinite; }

        /* ── Gradient border on hover cards ── */
        .grad-border-card {
          position: relative;
          background: white;
          border-radius: 20px;
          isolation: isolate;
          transition: transform 0.35s cubic-bezier(.34,1.56,.64,1),
                      box-shadow 0.35s ease;
        }
        .grad-border-card::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 22px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899, #6366f1);
          z-index: -1;
          opacity: 0;
          transition: opacity 0.35s ease;
        }
        .grad-border-card:hover::before { opacity: 1; }
        .grad-border-card:hover {
          transform: translateY(-10px) scale(1.01);
          box-shadow: 0 28px 56px rgba(99,102,241,0.18);
        }

        /* ── Exam card hover ── */
        .exam-card {
          transition: all 0.3s cubic-bezier(.34,1.56,.64,1);
          position: relative;
          overflow: hidden;
        }
        .exam-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(99,102,241,0.04), rgba(139,92,246,0.04));
          opacity: 0;
          transition: opacity 0.3s;
        }
        .exam-card:hover {
          transform: translateY(-6px) scale(1.025);
          box-shadow: 0 20px 44px rgba(99,102,241,0.14);
          border-color: #6366f1 !important;
        }
        .exam-card:hover::after { opacity: 1; }

        /* ── Step card ── */
        .step-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .step-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(99,102,241,0.12);
        }

        /* ── Sticky nav blur ── */
        .nav-glass {
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          background: rgba(255,255,255,0.82);
          border-bottom: 1px solid rgba(99,102,241,0.1);
        }

        /* ── Fade-up (just CSS, no JS needed for hero) ── */
        .fade-up {
          opacity: 0;
          transform: translateY(24px);
          animation: fade-up-in 0.7s ease forwards;
        }
        .fade-up-1 { animation-delay: 0.05s; }
        .fade-up-2 { animation-delay: 0.18s; }
        .fade-up-3 { animation-delay: 0.32s; }
        .fade-up-4 { animation-delay: 0.46s; }
        .fade-up-5 { animation-delay: 0.62s; }
        @keyframes fade-up-in {
          to { opacity: 1; transform: translateY(0); }
        }

        /* ── Marquee ── */
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-scroll 28s linear infinite;
          gap: 0;
        }
        .marquee-track:hover { animation-play-state: paused; }

        /* ── Stats number glow ── */
        .stat-number {
          background: linear-gradient(135deg, #fff 0%, #c7d2fe 60%, #a5b4fc 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* ── Shimmer sweep on dark CTA btn ── */
        .btn-sweep {
          position: relative;
          overflow: hidden;
        }
        .btn-sweep::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent);
          transform: skewX(-20deg);
          transition: left 0.5s ease;
        }
        .btn-sweep:hover::after { left: 150%; }

        /* ── Tag pill ── */
        .trust-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 14px;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 600;
          color: #4f46e5;
          background: rgba(99,102,241,0.08);
          border: 1px solid rgba(99,102,241,0.18);
          white-space: nowrap;
        }

        /* ── Reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .orb-1, .orb-2, .orb-3 { animation: none !important; }
          .shimmer-text             { animation: none !important; background: linear-gradient(135deg, #6366f1, #8b5cf6); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
          .btn-glow                 { animation: none !important; }
          .marquee-track            { animation: none !important; }
          .fade-up                  { opacity: 1 !important; transform: none !important; animation: none !important; }
        }

        /* ── Responsive helpers ── */
        @media (max-width: 640px) {
          .hide-mobile { display: none !important; }
        }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════
          ROOT WRAPPER
      ══════════════════════════════════════════════════════════════ */}
      <div style={{ minHeight: '100vh', background: '#fafaff', overflowX: 'hidden', position: 'relative' }}>

        {/* ─── BACKGROUND ORBS (decorative, fixed) ─── */}
        <div aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <div className="orb-1" style={{
            position: 'absolute', top: '8%', left: '2%',
            width: 520, height: 520, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'orb-float-1 12s ease-in-out infinite',
          }} />
          <div className="orb-2" style={{
            position: 'absolute', top: '25%', right: '3%',
            width: 380, height: 380, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%)',
            filter: 'blur(50px)',
            animation: 'orb-float-2 16s ease-in-out infinite',
          }} />
          <div className="orb-3" style={{
            position: 'absolute', bottom: '15%', left: '35%',
            width: 440, height: 440, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)',
            filter: 'blur(55px)',
            animation: 'orb-float-3 20s ease-in-out infinite',
          }} />
        </div>

        {/* ═══ CONTENT LAYER ═══ */}
        <div style={{ position: 'relative', zIndex: 1 }}>

          {/* ──────────────────────────────────────────────────────────
              ORIGINAL NAVBAR — ultra enhanced with glassmorphism
          ────────────────────────────────────────────────────────── */}
          <nav className="nav-glass" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

              {/* Logo — original Q logo, enhanced */}
              <div className="flex items-center gap-3">
                <div style={{
                  width: 42, height: 42, borderRadius: 13,
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, fontWeight: 900, color: 'white',
                  boxShadow: '0 6px 20px rgba(99,102,241,0.38)',
                  letterSpacing: '-1px',
                }}>Q</div>
                <span style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
                  Quiz<span style={{ color: '#6366f1' }}>app</span>
                </span>
              </div>

              {/* NEW: Centre nav links */}
              <div className="hide-mobile" style={{ display: 'flex', gap: 28 }}>
                {[
                  { href: '/about', label: 'How to Work' },
                  { href: '/ai-test', label: 'AI Test' },
                  { href: '#exams', label: 'Exams' },
                ].map(l => (
                  <a key={l.href} href={l.href} style={{
                    fontSize: 14, fontWeight: 500, color: '#64748b',
                    textDecoration: 'none', transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#6366f1')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
                  >{l.label}</a>
                ))}
              </div>

              {/* Original Dashboard link — enhanced */}
              <a href="/dashboard" className="btn-sweep" style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: 'white', padding: '10px 22px', borderRadius: 50,
                fontSize: 14, fontWeight: 700, textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(99,102,241,0.38)',
                display: 'inline-flex', alignItems: 'center', gap: 6,
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}>
                Dashboard <span style={{ opacity: 0.8 }}>→</span>
              </a>
            </div>
          </nav>

          {/* ──────────────────────────────────────────────────────────
              ORIGINAL HERO — dramatically enhanced
          ────────────────────────────────────────────────────────── */}
          <header style={{
            background: 'linear-gradient(160deg, #eef2ff 0%, #ffffff 45%, #faf5ff 75%, #fff1f2 100%)',
            padding: '90px 24px 80px',
          }}>
            <div className="mx-auto max-w-4xl" style={{ textAlign: 'center' }}>

              {/* Original badge — enhanced */}
              <div className="fade-up fade-up-1" style={{ marginBottom: 24 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '7px 18px', borderRadius: 50,
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))',
                  border: '1.5px solid rgba(99,102,241,0.25)',
                  fontSize: 13, fontWeight: 700, color: '#6366f1',
                }}>
                  <span style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: '#6366f1', display: 'inline-block',
                    boxShadow: '0 0 8px #6366f1',
                  }} />
                  ✨ AI-powered question generation
                </span>
              </div>

              {/* Original H1 — enhanced with shimmer */}
              <h1 className="fade-up fade-up-2" style={{
                fontSize: 'clamp(38px, 7vw, 80px)',
                fontWeight: 900, lineHeight: 1.0,
                letterSpacing: '-3px', color: '#0f172a',
                marginBottom: 28,
              }}>
                Quiz banao, seconds mein,
                <br />
                <span className="shimmer-text">AI ke saath</span>
              </h1>

              {/* Original description */}
              <p className="fade-up fade-up-3" style={{
                maxWidth: 560, margin: '0 auto 16px',
                fontSize: 18, lineHeight: 1.75, color: '#475569',
              }}>
                Chapter select karo, difficulty chuno, aur AI ko 50 questions generate karne do — PDF, practice test, har format mein.
              </p>

              {/* NEW: Supporting sub-copy */}
              <p className="fade-up fade-up-3" style={{
                maxWidth: 420, margin: '0 auto 40px',
                fontSize: 14, lineHeight: 1.65, color: '#94a3b8',
              }}>
                India ke top competitive exams ke liye — UPSC, JEE, NEET, SSC, aur zyada.
              </p>

              {/* Original CTA buttons — enhanced */}
              <div className="fade-up fade-up-4" style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 36 }}>
                {/* ✅ Original: /ai-test */}
                <a href="/ai-test" className="btn-glow btn-sweep" style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: 'white', padding: '17px 36px', borderRadius: 14,
                  fontSize: 15, fontWeight: 800, textDecoration: 'none',
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  transition: 'transform 0.2s',
                }}>
                  🚀 Make Quiz or Test
                </a>
                {/* ✅ Original: /about */}
                <a href="/about" style={{
                  background: 'white', color: '#374151',
                  padding: '17px 32px', borderRadius: 14,
                  fontSize: 15, fontWeight: 700, textDecoration: 'none',
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  border: '2px solid #e2e8f0',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
                  transition: 'all 0.2s',
                }}>
                  How to Work ↗
                </a>
              </div>

              {/* NEW: Trust pills */}
              <div className="fade-up fade-up-5" style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
                {['No signup chahiye', 'Free to try', 'Hindi + English', 'Instant results'].map(tag => (
                  <span key={tag} className="trust-pill">✓ {tag}</span>
                ))}
              </div>
            </div>
          </header>

          {/* ──────────────────────────────────────────────────────────
              NEW: STATS DARK BAND
          ────────────────────────────────────────────────────────── */}
          <section style={{
            background: 'linear-gradient(135deg, #0c0b17, #1e1b4b, #2e1065)',
            padding: '60px 24px',
          }}>
            {/* NEW: Marquee of exam names just above stats */}
            <div style={{ overflow: 'hidden', marginBottom: 48, maskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)' }}>
              <div className="marquee-track">
                {[...Array(2)].map((_, ri) =>
                  ['UPSC', 'JEE Main', 'NEET UG', 'SSC CGL', 'IBPS PO', 'CAT', 'GATE', 'NDA', 'RRB NTPC', 'CLAT', 'CUET', 'AFCAT'].map((exam) => (
                    <span key={`${ri}-${exam}`} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 10,
                      padding: '10px 28px', marginRight: 16, borderRadius: 50,
                      background: 'rgba(99,102,241,0.12)',
                      border: '1px solid rgba(99,102,241,0.2)',
                      color: '#a5b4fc', fontSize: 14, fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#6366f1', display: 'inline-block' }} />
                      {exam}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Stats grid */}
            <div className="mx-auto max-w-5xl" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: 40, textAlign: 'center',
            }}>
              {[
                { icon: '❓', num: '50K+', label: 'Questions Generated' },
                { icon: '📝', num: '5K+',  label: 'Tests Created' },
                { icon: '🎯', num: '20+',  label: 'Exams Covered' },
                { icon: '⚡', num: '99%',  label: 'AI Accuracy' },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontSize: 30, marginBottom: 10 }}>{s.icon}</div>
                  <div className="stat-number" style={{
                    fontSize: 'clamp(34px, 5vw, 54px)',
                    fontWeight: 900, letterSpacing: '-2px', lineHeight: 1,
                  }}>{s.num}</div>
                  <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 10, fontWeight: 600 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────
              ORIGINAL FEATURE CARDS — ultra enhanced
          ────────────────────────────────────────────────────────── */}
          <section className="mx-auto grid max-w-5xl gap-6 px-6 pb-20 sm:grid-cols-3" style={{ paddingTop: 80 }}>
            {/* NEW: Section eyebrow */}
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '2.5px', color: '#6366f1', textTransform: 'uppercase' }}>
                Kyun QuizApp?
              </span>
              <h2 style={{ fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 900, color: '#0f172a', marginTop: 10, letterSpacing: '-1px' }}>
                Sabse powerful quiz platform
              </h2>
            </div>

            {/* ORIGINAL 3 feature cards — enhanced in-place */}
            {[
              {
                icon: '🤖', title: 'AI Generation',
                desc: 'Pollinations AI se topic-wise MCQs, answer + explanation ke saath',
                grad: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                glow: 'rgba(99,102,241,0.22)',
              },
              {
                icon: '⚡', title: 'Instant Tests',
                desc: 'Generate hote hi test create, link share karo, results track karo',
                grad: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                glow: 'rgba(245,158,11,0.18)',
              },
              {
                icon: '📊', title: 'Progress Tracking',
                desc: 'Student-wise scores aur weak topics ka analysis',
                grad: 'linear-gradient(135deg, #10b981, #059669)',
                glow: 'rgba(16,185,129,0.18)',
              },
            ].map(f => (
              <div key={f.title} className="grad-border-card" style={{
                padding: '32px 28px',
                boxShadow: `0 8px 32px ${f.glow}, 0 2px 8px rgba(0,0,0,0.04)`,
                border: '1.5px solid rgba(226,232,240,0.9)',
              }}>
                {/* Icon bubble */}
                <div style={{
                  width: 60, height: 60, borderRadius: 18,
                  background: f.grad,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, marginBottom: 22,
                  boxShadow: `0 10px 24px ${f.glow}`,
                }}>{f.icon}</div>

                <h3 style={{ fontWeight: 800, fontSize: 17, color: '#0f172a', marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.65 }}>{f.desc}</p>

                {/* NEW: subtle "learn more" hint */}
                <div style={{ marginTop: 20, fontSize: 13, color: '#6366f1', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                  Explore <span>→</span>
                </div>
              </div>
            ))}
          </section>

          {/* ──────────────────────────────────────────────────────────
              NEW SECTION: HOW IT WORKS (3 steps)
          ────────────────────────────────────────────────────────── */}
          <section style={{
            background: 'linear-gradient(160deg, #f8faff 0%, #f0f4ff 100%)',
            padding: '88px 24px',
            borderTop: '1px solid rgba(99,102,241,0.08)',
            borderBottom: '1px solid rgba(99,102,241,0.08)',
          }}>
            <div className="mx-auto max-w-5xl">
              <div style={{ textAlign: 'center', marginBottom: 60 }}>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '2.5px', color: '#6366f1', textTransform: 'uppercase' }}>
                  Simple Process
                </span>
                <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 900, color: '#0f172a', marginTop: 10, letterSpacing: '-1px' }}>
                  3 Steps mein shuru karo
                </h2>
                <p style={{ color: '#64748b', marginTop: 12, fontSize: 16, maxWidth: 460, margin: '12px auto 0' }}>
                  Itna aasan hai ki pehli baar mein hi perfect test ban jaata hai.
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 28,
              }}>
                {[
                  {
                    step: '01', icon: '🎯',
                    title: 'Exam & Chapter Chuno',
                    desc: 'Apna exam choose karo — UPSC, JEE, NEET ya koi bhi. Phir chapter ya specific topic select karo.',
                    color: '#6366f1',
                  },
                  {
                    step: '02', icon: '🤖',
                    title: 'AI Generate Karta Hai',
                    desc: 'Ek click mein AI 50 unique MCQs banata hai — correct answers aur detailed explanations ke saath.',
                    color: '#8b5cf6',
                  },
                  {
                    step: '03', icon: '📤',
                    title: 'Share & Track Karo',
                    desc: 'Test link share karo students ke saath, woh denge, aur tum real-time results aur analytics dekho.',
                    color: '#ec4899',
                  },
                ].map((s, i) => (
                  <div key={s.step} className="step-card" style={{
                    background: 'white', borderRadius: 20, padding: '32px 28px',
                    border: '1.5px solid rgba(226,232,240,0.9)',
                    boxShadow: '0 4px 20px rgba(99,102,241,0.06)',
                    position: 'relative', overflow: 'hidden',
                  }}>
                    {/* Big step number — decorative background */}
                    <div style={{
                      position: 'absolute', top: -10, right: 16,
                      fontSize: 80, fontWeight: 900, lineHeight: 1,
                      color: 'rgba(99,102,241,0.05)', letterSpacing: '-3px',
                      userSelect: 'none', pointerEvents: 'none',
                    }}>{s.step}</div>

                    {/* Icon */}
                    <div style={{
                      width: 64, height: 64, borderRadius: 18,
                      background: `linear-gradient(135deg, ${s.color}22, ${s.color}44)`,
                      border: `2px solid ${s.color}33`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 30, marginBottom: 20,
                    }}>{s.icon}</div>

                    <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '2px', color: s.color, marginBottom: 10 }}>
                      STEP {s.step}
                    </div>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>{s.title}</h3>
                    <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────
              ORIGINAL EXAMS GRID — ultra enhanced
          ────────────────────────────────────────────────────────── */}
          <section id="exams" className="mx-auto max-w-5xl px-6 pb-20" style={{ paddingTop: 88 }}>
            {/* Section header — enhanced from original h2 */}
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '2.5px', color: '#6366f1', textTransform: 'uppercase' }}>
                Coverage
              </span>
              <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 900, color: '#0f172a', marginTop: 10, letterSpacing: '-1px' }}>
                Exams Jo Hum Cover Karte Hain
              </h2>
              <p style={{ color: '#64748b', marginTop: 12, fontSize: 16 }}>
                India ke sabse popular competitive exams ke liye AI-generated questions
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Original empty state */}
              {exams.length === 0 && (
                <div style={{
                  gridColumn: '1 / -1', textAlign: 'center',
                  padding: '64px 32px', borderRadius: 24,
                  background: 'rgba(99,102,241,0.04)',
                  border: '2px dashed rgba(99,102,241,0.2)',
                }}>
                  <div style={{ fontSize: 52, marginBottom: 16 }}>📚</div>
                  <p style={{ color: '#64748b', fontWeight: 600, fontSize: 16 }}>Abhi koi exam nahi hai.</p>
                  <p style={{ color: '#94a3b8', fontSize: 14, marginTop: 8 }}>Jald hi naye exams add honge!</p>
                </div>
              )}

              {/* ✅ ORIGINAL: Real UUID links from DB */}
              {exams.map((exam) => (
                <Link key={exam.id} href={`/exams/${exam.id}`} className="exam-card" style={{
                  display: 'block', textDecoration: 'none',
                  borderRadius: 18, border: '1.5px solid rgba(226,232,240,0.9)',
                  background: 'white', padding: '20px 20px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    {/* Icon container */}
                    <div style={{
                      width: 54, height: 54, borderRadius: 15, flexShrink: 0,
                      background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))',
                      border: '1.5px solid rgba(99,102,241,0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 28,
                    }}>{exam.icon}</div>

                    {/* Text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontWeight: 800, fontSize: 15, color: '#0f172a', marginBottom: 3 }}>{exam.name}</h3>
                      <p style={{ fontSize: 13, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {exam.description}
                      </p>
                    </div>

                    {/* NEW: Arrow badge */}
                    <div style={{
                      width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                      background: 'rgba(99,102,241,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#6366f1', fontSize: 15, fontWeight: 700,
                      transition: 'background 0.2s',
                    }}>→</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────
              NEW: BOTTOM DARK CTA SECTION
          ────────────────────────────────────────────────────────── */}
          <section style={{
            background: 'linear-gradient(145deg, #0c0b17 0%, #1e1b4b 50%, #2e1065 100%)',
            padding: '96px 24px', textAlign: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Decorative rings */}
            <div aria-hidden="true" style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 700, height: 700, borderRadius: '50%',
              border: '1px solid rgba(99,102,241,0.08)',
              pointerEvents: 'none',
            }} />
            <div aria-hidden="true" style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 500, height: 500, borderRadius: '50%',
              border: '1px solid rgba(99,102,241,0.12)',
              pointerEvents: 'none',
            }} />
            <div aria-hidden="true" style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 300, height: 300, borderRadius: '50%',
              border: '1px solid rgba(99,102,241,0.18)',
              pointerEvents: 'none',
            }} />

            <div className="mx-auto max-w-3xl" style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '6px 18px', borderRadius: 50,
                background: 'rgba(99,102,241,0.15)',
                border: '1px solid rgba(99,102,241,0.3)',
                fontSize: 13, color: '#a5b4fc', fontWeight: 700,
                marginBottom: 28, letterSpacing: '0.3px',
              }}>
                🚀 Abhi shuru karo — bilkul free
              </div>

              <h2 style={{
                fontSize: 'clamp(28px, 6vw, 58px)',
                fontWeight: 900, letterSpacing: '-2px',
                color: 'white', lineHeight: 1.05, marginBottom: 18,
              }}>
                Ek best quiz experience
                <span className="shimmer-text" style={{ display: 'block', marginTop: 4 }}>sirf tumhare liye</span>
              </h2>

              <p style={{ fontSize: 16, color: '#94a3b8', marginBottom: 40, lineHeight: 1.75, maxWidth: 500, margin: '0 auto 40px' }}>
                AI ke power se apne students ke liye perfect test banao. Koi account nahi chahiye — seedha shuru karo.
              </p>

              {/* Original links preserved */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
                <a href="/ai-test" className="btn-sweep" style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: 'white', padding: '17px 38px', borderRadius: 14,
                  fontSize: 15, fontWeight: 800, textDecoration: 'none',
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  boxShadow: '0 10px 36px rgba(99,102,241,0.5)',
                }}>
                  🎯 Make Quiz or Test
                </a>
                <a href="/dashboard" style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: 'white', padding: '17px 32px', borderRadius: 14,
                  fontSize: 15, fontWeight: 700, textDecoration: 'none',
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  border: '1.5px solid rgba(255,255,255,0.18)',
                  backdropFilter: 'blur(12px)',
                  transition: 'background 0.2s',
                }}>
                  Dashboard →
                </a>
              </div>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────
              NEW: FOOTER
          ────────────────────────────────────────────────────────── */}
          <footer style={{
            background: '#07060f',
            padding: '44px 24px 36px',
            borderTop: '1px solid rgba(99,102,241,0.12)',
          }}>
            <div className="mx-auto max-w-5xl" style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', flexWrap: 'wrap', gap: 20,
            }}>
              {/* Logo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 10,
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15, fontWeight: 900, color: 'white',
                }}>Q</div>
                <span style={{ color: '#64748b', fontSize: 14 }}>
                  QuizApp — <span style={{ color: '#4f46e5' }}>AI se banao, AI se seekho</span>
                </span>
              </div>

              {/* Original nav links in footer */}
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                {[
                  { href: '/about', label: 'How to Work' },
                  { href: '/ai-test', label: 'AI Test' },
                  { href: '/dashboard', label: 'Dashboard' },
                ].map(l => (
                  <a key={l.href} href={l.href} style={{
                    color: '#475569', fontSize: 14, textDecoration: 'none', fontWeight: 500,
                    transition: 'color 0.2s',
                  }}>
                    {l.label}
                  </a>
                ))}
              </div>

              <p style={{ color: '#1e1b4b', fontSize: 12, fontWeight: 600 }}>
                © 2026 QuizApp. Made with ❤️ TEAMVB 
              </p>
            </div>
          </footer>

        </div>{/* end content layer */}
      </div>{/* end root */}
    </>
  );
}
