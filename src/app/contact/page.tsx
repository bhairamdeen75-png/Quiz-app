import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact & Support — Quiz App',
  description: 'Support aur feedback ke liye humein Telegram par message karo.',
};

const TELEGRAM_URL = 'https://t.me/bkstudyzone';

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-3xl font-bold text-brand">Contact & Support</h1>
      <p className="mt-2 text-slate-600">
        Koi bhi problem, feedback ya question ho — humse seedha Telegram par baat karo.
        Team jaldi reply karti hai. 🚀
      </p>

      <div className="mt-8 rounded-2xl border border-brand/10 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-2xl text-gold">
            ✈️
          </span>
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900">Telegram Support</h2>
            <p className="text-sm text-slate-500">Study Zone</p>
          </div>
        </div>

        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-6 inline-flex w-full items-center justify-center gap-2 !px-6 !py-3 text-sm"
        >
          ✈️ Telegram par message karo
        </a>

        <p className="mt-4 text-center text-xs text-slate-400">
          {{TELEGRAM_URL}
        </p>
      </div>
    </div>
  );
}
