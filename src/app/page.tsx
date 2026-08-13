import Link from "next/link";
import { TelegramIcon } from '@/components/ui/icons';
import { createClient } from "@/lib/supabase/server";
import type { Exam } from "@/types";

export const dynamic = "force-dynamic";

/* ================= DATA ================= */

const stats = [
  { value: "10+", label: "Exams Covered", icon: "📚" },
  { value: "5000+", label: "Questions", icon: "❓" },
  { value: "100%", label: "Free Forever", icon: "🆓" },
  { value: "24/7", label: "AI Support", icon: "🤖" },
];

const features = [
  {
    icon: "🤖",
    title: "AI Live Test",
    desc: "Pollinations AI se seconds mein test generate karo. Exam, subject aur chapter select karo — 10 se 50 questions, instant feedback aur hint ke saath.",
  },
  {
    icon: "📄",
    title: "PDF → Quiz",
    desc: "Apna PDF upload karo aur AI usse turant quiz questions bana dega. Notes se practice karna ab bahut easy hai.",
  },
  {
    icon: "🏆",
    title: "Preloaded Series",
    desc: "JEE, NEET, SSC, UPSC aur 10+ exams ki ready-made test series. Exam-level timing aur difficulty ke saath.",
  },
  {
    icon: "⏱️",
    title: "Exam Timers",
    desc: "Real exam jaisa timer, negative marking aur detailed result — har test exam-accurate banaya gaya hai.",
  },
  {
    icon: "📊",
    title: "Progress Tracking",
    desc: "Score, accuracy aur weak topics ka pura analysis. Apni taiyari ka graph dekho aur behtar bano.",
  },
  {
    icon: "🚀",
    title: "Daily Updates",
    desc: "Naye tests aur questions regularly add hote hain taaki aapki taiyari kabhi ruke nahi.",
  },
];

const steps = [
  {
    step: "01",
    icon: "🎯",
    title: "Exam Chuno",
    desc: "Sidebar se AI Test, Preload Test ya PDF Upload chuno. Apna exam, subject aur chapter select karo.",
  },
  {
    step: "02",
    icon: "⚡",
    title: "Test Do",
    desc: "Real exam jaisa timer aur marking ke saath test do. Instant ya final — apna answer mode chuno.",
  },
  {
    step: "03",
    icon: "📈",
    title: "Result Dekho",
    desc: "Score, accuracy, hints aur explanations ke saath turant result. Weak topics identify karo aur improve karo.",
  },
];

const testimonials = [
  {
    name: "Rahul S.",
    exam: "JEE Aspirant",
    avatar: "🧑‍🎓",
    text: "AI test feature kamaal ka hai. Chapter select karo aur 2 minute me test ready! Free me itna achha platform milega socha nahi tha.",
  },
  {
    name: "Priya M.",
    exam: "NEET Aspirant",
    avatar: "👩‍🎓",
    text: "PDF upload se meri notes directly quiz ban jati hain. Revision ab itna easy ho gaya hai. Highly recommended!",
  },
  {
    name: "Aman K.",
    exam: "SSC Aspirant",
    avatar: "🧑‍💻",
    text: "Preloaded test series exam pattern ke hisaab se hai. Timer aur negative marking ne real exam jaisa feel diya. Thanks TEAMVB!",
  },
];

const faqs = [
  {
    q: "Quiz App kya hai?",
    a: "Quiz App ek free test series aur quiz platform hai — JEE, NEET, SSC, UPSC aur 10+ exams ke liye. AI tests, PDF se quiz, aur preloaded series — sab kuch ek jagah, bilkul free.",
  },
  {
    q: "Kya ye app sach me free hai?",
    a: "Haan, 100% free. Koi payment nahi, koi hidden charge nahi. Hum chahte hain ki har student ko achhi practice material mile.",
  },
  {
    q: "Test dene ke liye kya karna hoga?",
    a: "Sidebar se AI Test ya Preload Test chuno, apna exam select karo aur test shuru karo. Test ke baad turant result, correct answers aur hints mil jayenge.",
  },
  {
    q: "PDF upload kaise kare?",
    a: "Sidebar me Upload par click karo, apni PDF file select karo, aur AI uske questions bana dega. PDF jitna clear hoga, questions utne achhe banenge.",
  },
  {
    q: "Kya main mobile par use kar sakta hu?",
    a: "Bilkul. Website mobile, tablet aur laptop — har device par perfectly responsive hai. Mobile par sidebar hamburger menu se khulta hai.",
  },
  {
    q: "Support se kaise baat karu?",
    a: "Contact page par jao aur Telegram par message karo — @bkstudyzone. Hamari team jaldi reply karti hai.",
  },
];

/* ================= COMPONENT ================= */

export default async function Home() {
  // DB se exams fetch karo
  const supabase = createClient();
  const { data } = await supabase
    .from("exams")
    .select("*")
    .eq("is_active", true)
    .order("name");
  const exams: Exam[] = data ?? [];

  return (
    <div className="space-y-20">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-6 py-16 text-center sm:py-24">
        {/* Soft decorative blobs */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-indigo-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-purple-100/60 blur-3xl" />

        <div className="relative mx-auto max-w-4xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-700">
            ✨ Free Test Series for Every Student
          </span>

          <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-slate-900 sm:text-6xl">
            Quiz banao, seconds mein,{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AI ke saath
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            JEE, NEET, SSC, UPSC aur 10+ exams ki free AI test series.
            Chapter select karo, AI se questions generate karo, PDF se quiz banao —
            sab kuch ek hi jagah, bilkul free.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/ai-test"
              className="rounded-xl bg-indigo-600 px-8 py-3.5 font-display font-semibold text-white shadow-xl shadow-indigo-200 transition hover:scale-[1.02] hover:bg-indigo-700"
            >
              🤖 AI Test Banao
            </Link>
            <Link
              href="/exams"
              className="rounded-xl border border-gray-300 bg-white px-8 py-3.5 font-display font-semibold text-slate-700 transition hover:bg-gray-50"
            >
              🏆 Preloaded Series
            </Link>
          </div>

          <p className="mt-6 text-sm text-slate-400">
            ⚡ Koi signup charge nahi · Koi limit nahi · Sirf practice
          </p>
        </div>
      </section>

      {/* ================= STATS STRIP ================= */}
      <section className="mx-auto grid max-w-5xl grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition hover:shadow-md"
          >
            <span className="text-2xl">{s.icon}</span>
            <div className="mt-1 font-mono text-3xl font-semibold text-indigo-600 tabular-nums">
              {s.value}
            </div>
            <div className="mt-1 text-sm font-medium uppercase tracking-wide text-slate-500">
              {s.label}
            </div>
          </div>
        ))}
      </section>

      {/* ================= FEATURES ================= */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">
            Sab Kuch Ek Platform Par
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Har student ki zaroorat ke hisaab se — AI se lekar PDF tak,
            practice se lekar analysis tak.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-2xl">
                {f.icon}
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="rounded-3xl bg-slate-50 px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">
              Kaise Kaam Karta Hai?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Sirf 3 steps me apna pehla test do — itna easy hai.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.step} className="relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                {i < 2 && (
                  <span className="absolute -right-4 top-1/2 hidden -translate-y-1/2 text-2xl text-indigo-300 md:block">
                    →
                  </span>
                )}
                <span className="font-mono text-sm font-semibold text-indigo-600">
                  STEP {s.step}
                </span>
                <div className="mt-3 text-3xl">{s.icon}</div>
                <h3 className="mt-3 font-display text-lg font-bold text-slate-900">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= EXAMS GRID (mobile overflow FIXED) ================= */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">
            Exams Jo Hum Cover Karte Hain
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Har exam ke liye dedicated test series — exam-level timing aur
            difficulty ke saath.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {exams.length === 0 && (
            <p className="col-span-full text-center text-slate-500">
              Abhi koi exam nahi hai.
            </p>
          )}
          {exams.map((exam) => (
            <Link
              key={exam.id}
              href={`/exams/${exam.id}`}
              className="group flex min-w-0 items-center gap-3 overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-2xl">
                {exam.icon}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-display font-bold text-slate-900">
                  {exam.name}
                </h3>
                <p className="truncate text-sm text-slate-500">
                  {exam.description}
                </p>
              </div>
              <span className="hidden shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-600 sm:block">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= AI TEST PROMO ================= */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-8 overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-sm sm:p-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-gold-light px-2.5 py-0.5 text-xs font-semibold text-brand">
              🤖 AI Live Test
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold text-slate-900">
              AI se Seconds Mein Test Generate Karo
            </h2>
            <p className="mt-3 leading-relaxed text-slate-600">
              Exam, subject aur chapter select karo. Pollinations AI turant
              10 se 50 questions bana deta hai — options, hints aur
              explanations ke saath. Naya question set, har baar naya.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <span className="text-gold">✔</span> Instant feedback mode ya final mode
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gold">✔</span> Har question ke saath hint aur explanation
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gold">✔</span> Apni accuracy aur weak topics ka analysis
              </li>
            </ul>
            <Link href="/ai-test" className="mt-7 inline-block rounded-xl bg-indigo-600 px-6 py-3 font-display font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700">
              🤖 AI Test Start Karo
            </Link>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 p-8 text-center">
            <div className="text-5xl">🧠</div>
            <h3 className="mt-4 font-display text-xl font-bold text-white">
              Demo Question
            </h3>
            <p className="mt-3 text-sm text-white/80">
              "Newton ka second law ka formula kya hai?"
            </p>
            <div className="mt-5 space-y-2 text-left text-sm">
              <div className="rounded-lg bg-white/15 px-4 py-2.5 text-white">
                A) F = ma <span className="ml-1 rounded bg-gold px-1.5 text-xs font-bold text-brand">✓</span>
              </div>
              <div className="rounded-lg bg-white/10 px-4 py-2.5 text-white/60">B) E = mc²</div>
              <div className="rounded-lg bg-white/10 px-4 py-2.5 text-white/60">C) V = IR</div>
              <div className="rounded-lg bg-white/10 px-4 py-2.5 text-white/60">D) P = VI</div>
            </div>
            <p className="mt-4 text-xs text-white/60">
              Aise hi questions — har baar fresh, har baar naya ✨
            </p>
          </div>
        </div>
      </section>

      {/* ================= PDF PROMO ================= */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-8 overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-sm sm:p-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <div className="rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 p-8 text-center">
              <div className="text-5xl">📄</div>
              <p className="mt-4 font-mono text-sm text-slate-500">
                physics_notes.pdf
              </p>
              <div className="mx-auto mt-4 h-2 w-3/4 rounded-full bg-indigo-100">
                <div className="h-2 w-2/3 rounded-full bg-indigo-500" />
              </div>
              <p className="mt-2 text-xs text-slate-400">Uploading... 66%</p>
              <p className="mt-3 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                ✓ 12 Questions ban gaye
              </p>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-gold-light px-2.5 py-0.5 text-xs font-semibold text-brand">
              📄 PDF → Quiz
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold text-slate-900">
              Apni Notes Ko Quiz Mein Badlo
            </h2>
            <p className="mt-3 leading-relaxed text-slate-600">
              Apna PDF upload karo aur AI usse turant practice questions bana
              dega. Jis chapter ki notes hain, usi ke questions — itna simple.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <span className="text-gold">✔</span> Kisi bhi subject ki PDF chale
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gold">✔</span> Questions + options + explanations
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gold">✔</span> Turant result aur accuracy analysis
              </li>
            </ul>
            <Link href="/pdf-upload" className="mt-7 inline-block rounded-xl bg-indigo-600 px-6 py-3 font-display font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700">
              📄 PDF Upload Karo
            </Link>
          </div>
        </div>
      </section>

      {/* ================= WHY US ================= */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">
            Kyon Chune Quiz App?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Kyunki aapki taiyari ke liye hum jitna sochte hain, utna koi nahi.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-xl">
                ✅
              </span>
              <h3 className="font-display text-lg font-bold text-slate-900">Sach Me Free</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Koi hidden charge nahi, koi premium lock nahi. Har feature har
              student ke liye 100% free.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-light text-xl">
                ⚡
              </span>
              <h3 className="font-display text-lg font-bold text-slate-900">Seconds Mein Ready</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              AI test generate karna ho ya PDF se quiz — sab kuch seconds mein.
              Waiting ka jhanjhat nahi.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-xl">
                🎯
              </span>
              <h3 className="font-display text-lg font-bold text-slate-900">Exam Accurate</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Real exam jaisa timer, negative marking aur difficulty. Jo feel
              exam hall me milegi, wahi yahan practice hoti hai.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-xl">
                📱
              </span>
              <h3 className="font-display text-lg font-bold text-slate-900">Har Device Par</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Mobile, tablet, laptop — kahin bhi, kabhi bhi practice karo.
              Responsive design jo har screen par perfect lagta hai.
            </p>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="rounded-3xl bg-slate-50 px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">
              Students Kya Kehte Hain
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Hamare students ki apni zubani — unki mehnat, unki kahani.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">
                <div className="text-gold">⭐⭐⭐⭐⭐</div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  "{t.text}"
                </p>
                <div className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-lg">
                    {t.avatar}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.exam}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="mx-auto max-w-3xl px-4">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Jo sawaal sabse zyada puchhe jate hain — jawab yahan hain.
          </p>
        </div>

        <div className="mt-10 space-y-3">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="group rounded-xl border border-gray-100 bg-white p-5 shadow-sm open:border-indigo-200"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-800">
                {item.q}
                <span className="shrink-0 text-indigo-600 transition group-open:rotate-45">
                  ＋
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-6 py-14 text-center">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-indigo-100/60 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-purple-100/60 blur-3xl" />

          <div className="relative mx-auto max-w-2xl">
            <div className="text-5xl">🚀</div>
            <h2 className="mt-4 font-display text-3xl font-bold text-slate-900 sm:text-4xl">
              Aaj Hi Apna Pehla Test Do
            </h2>
            <p className="mx-auto mt-3 text-slate-600">
              Jitna jaldi shuru karoge, utna aage nikal jaoge.
              Free hai — koi excuse nahi. 💪
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/ai-test"
                className="rounded-xl bg-indigo-600 px-8 py-3.5 font-display font-semibold text-white shadow-xl shadow-indigo-200 transition hover:scale-[1.02] hover:bg-indigo-700"
              >
                🤖 AI Test Banao
              </Link>
              <Link
                href="/contact"
                className="rounded-xl border border-gray-300 bg-white px-8 py-3.5 font-display font-semibold text-slate-700 transition hover:bg-gray-50"
              >
                <TelegramIcon className="h-8 w-8" /> Telegram connect 
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
