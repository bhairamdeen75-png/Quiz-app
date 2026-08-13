import type { Metadata } from 'next';
import Link from 'next/link';
import { TelegramIcon, EmailIcon } from '@/components/ui/icons';
import ContactForm from '@/components/contact/ContactForm';

export const metadata: Metadata = {
  title: 'Contact & Support — Quiz App',
  description:
    'Quiz App ke baare me janiye, apna feedback dijiye aur support ke liye humein message karo.',
};

// 🔐 Sab kuch backend se — env variables (Vercel me set karo).
// Email ID aur Telegram link ab frontend source me kahin nahi hain.
const TELEGRAM_USERNAME = process.env.TELEGRAM_USERNAME ?? '@bkstudyzone';

const features = [
  {
    icon: '🤖',
    title: 'AI Live Test',
    desc: 'Pollinations AI dwara generate hote hain questions. Exam, subject aur chapter select karo — 10 se 50 questions, instant feedback aur hint ke saath.',
  },
  {
    icon: '📄',
    title: 'PDF → Quiz',
    desc: 'Apna PDF upload karo aur AI usse turant quiz questions bana dega. Notes se practice karna ab bahut easy.',
  },
  {
    icon: '🏆',
    title: 'Preloaded Series',
    desc: 'JEE, NEET, SSC, UPSC aur 10+ exams ki ready-made test series. Exam-level timing aur difficulty ke saath.',
  },
  {
    icon: '⏱️',
    title: 'Exam Timers & Marking',
    desc: 'Real exam jaisa timer, negative marking aur detailed result summary — har test exam-accurate banaya gaya hai.',
  },
  {
    icon: '🆓',
    title: '100% Free',
    desc: 'Har student ke liye free. Koi payment nahi, koi hidden charges nahi — sirf padhai aur practice.',
  },
  {
    icon: '🚀',
    title: 'Daily Practice',
    desc: 'Naye tests aur questions regularly add hote hain, taaki aapki taiyari kabhi ruke nahi.',
  },
];

const faqs = [
  {
    q: 'Quiz App kya hai?',
    a: 'Quiz App ek free test series aur quiz platform hai — JEE, NEET, SSC, UPSC aur 10+ exams ke liye. AI tests, PDF se quiz, aur preloaded series — sab kuch ek jagah, bilkul free.',
  },
  {
    q: 'Kya ye app sach me free hai?',
    a: 'Haan, 100% free. Koi payment nahi, koi hidden charge nahi. Hum chahte hain ki har student ko achhi practice material mile.',
  },
  {
    q: 'Test dene ke liye kya karna hoga?',
    a: 'Sidebar se AI Test ya Preload Test chuno, apna exam select karo aur test shuru karo. Test ke baad turant result, correct answers aur hints mil jayenge.',
  },
  {
    q: 'PDF upload kaise kare?',
    a: 'Sidebar me Upload par click karo, apni PDF file select karo, aur AI uske questions bana dega. PDF jitna clear hoga, questions utne achhe banenge.',
  },
  {
    q: 'Kya main mobile par use kar sakta hu?',
    a: 'Bilkul. Website mobile, tablet aur laptop — har device par perfectly responsive hai. Mobile par sidebar hamburger menu se khulta hai.',
  },
  {
    q: 'Support se kaise baat karu?',
    a: 'Contact page par niche diye Telegram group button se judein ya email form se message bhejein. Hamari team jaldi reply karti hai.',
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* ============ HERO ============ */}
      <section className="text-center">
        <span className="badge">💬 Support & Feedback</span>
        <h1 className="mt-3 font-display text-4xl font-bold text-slate-900 sm:text-5xl">
          Humse Judein
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-600">
          Koi sawaal, feedback ya technical problem — hum yahan hain aapki madad ke liye.
          Telegram group me judein ya neeche form se message bhejein.
        </p>
      </section>

      {/* ============ CONTACT CARDS ============ */}
      <section className="mt-12 grid gap-6 md:grid-cols-2">
        {/* Telegram card */}
        <div className="flex flex-col rounded-2xl border border-brand/10 bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500 text-white">
              <TelegramIcon className="h-7 w-7" />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">Telegram Support</h2>
              <p className="text-sm text-slate-500">Fastest reply — usually within minutes</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            Questions, doubts, feedback ya koi technical problem — Telegram par message karo.
            Hamari team daily active rehti hai.
          </p>
          {/* 🔐 Link frontend me nahi — server redirect karta hai */}
          <a
            href="/api/contact/telegram"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-5 inline-flex items-center justify-center gap-2 !px-5 !py-3 text-sm"
          >
            <TelegramIcon className="h-5 w-5" /> Telegram Group Join Karo
          </a>
          <p className="mt-3 text-center text-xs text-slate-400">{TELEGRAM_USERNAME}</p>
        </div>

        {/* Email card — form, koi address nahi dikhta */}
        <div className="flex flex-col rounded-2xl border border-brand/10 bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-white">
              <EmailIcon className="h-6 w-6" />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">Email Support</h2>
              <p className="text-sm text-slate-500">Detailed queries ke liye</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            Lambi detail wali baat, bug report ya business enquiry ho — neeche form bharo,
            message seedha hamari team ko jayega. Hum 24-48 ghante me reply karte hain.
          </p>
          <ContactForm />
        </div>
      </section>

      {/* ============ WEBSITE KE BAARE ME ============ */}
      <section className="mt-16">
        <h2 className="text-center font-display text-3xl font-bold text-slate-900">
          Website ke baare mein
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
          Quiz App ek free test series aur quiz platform hai — JEE, NEET, SSC, UPSC
          aur 10+ exams ke liye. Har student ke liye free, koi limit nahi.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-brand/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-xl">
                {f.icon}
              </span>
              <h3 className="mt-3 font-display text-base font-bold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/ai-test" className="btn-primary !px-5 !py-2.5 text-sm">
            🤖 AI Test Start karo
          </Link>
          <Link href="/exams" className="rounded-lg border border-brand/20 bg-brand/5 px-5 py-2.5 text-sm font-semibold text-brand transition hover:bg-brand/10">
            🏆 Preloaded Series dekho
          </Link>
          <Link href="/pdf-upload" className="rounded-lg border border-brand/20 bg-brand/5 px-5 py-2.5 text-sm font-semibold text-brand transition hover:bg-brand/10">
            📄 PDF Upload karo
          </Link>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="mt-16">
        <h2 className="text-center font-display text-3xl font-bold text-slate-900">
          Frequently Asked Questions
        </h2>
        <div className="mx-auto mt-6 max-w-3xl space-y-3">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="group rounded-xl border border-brand/10 bg-white p-5 shadow-sm open:border-brand/30"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-slate-800">
                {item.q}
                <span className="text-brand transition group-open:rotate-45">＋</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ============ CTA BANNER ============ */}
      <section className="mt-16 rounded-2xl bg-brand p-8 text-center text-gold">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">
          Koi aur sawaal hai? 💬
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-gold/80">
          Telegram group me ek message bhejo — hamari team aapko turant madad karegi.
          Padhai jari rakho, hum support ke liye hain!
        </p>
        <a
          href="/api/contact/telegram"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-3 text-sm font-bold text-brand shadow-md transition hover:bg-slate-100"
        >
          <TelegramIcon className="h-5 w-5" /> Telegram Join Karo — {TELEGRAM_USERNAME}
        </a>
      </section>
    </div>
  );
}
