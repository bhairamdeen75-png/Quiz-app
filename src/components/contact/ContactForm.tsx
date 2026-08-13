'use client';
import { useState, type FormEvent } from 'react';
import { EmailIcon } from '@/components/ui/icons';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/contact/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('sent');
        setName(''); setEmail(''); setMessage('');
      } else {
        setStatus('error');
        setError(data.error ?? 'Kuch galat hua, dobara try karo');
      }
    } catch {
      setStatus('error');
      setError('Network error — dobara try karo');
    }
  }

  if (status === 'sent') {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-5 text-center">
        <p className="text-2xl">✅</p>
        <p className="mt-1 font-semibold text-green-700">Message bhej diya gaya!</p>
        <p className="mt-1 text-sm text-green-600">Hamari team jald hi aapko reply karegi. Dhanyawad! 🙏</p>
        <button onClick={() => setStatus('idle')} className="btn-outline mt-3 px-4 py-2 text-sm">
          Naya Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-3">
      <input
        type="text" placeholder="Aapka naam" value={name}
        onChange={(e) => setName(e.target.value)} required minLength={2}
        className="w-full rounded-lg border border-brand/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand"
      />
      <input
        type="email" placeholder="Aapka email (reply ke liye)" value={email}
        onChange={(e) => setEmail(e.target.value)} required
        className="w-full rounded-lg border border-brand/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand"
      />
      <textarea
        placeholder="Aapka message / sawaal / feedback..." value={message}
        onChange={(e) => setMessage(e.target.value)} required minLength={10} rows={4}
        className="w-full rounded-lg border border-brand/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand"
      />
      {status === 'error' && (
        <p className="rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">{error}</p>
      )}
      <button type="submit" disabled={status === 'sending'} className="btn-primary w-full">
        {status === 'sending' ? (
          '⏳ Bheja ja raha hai...'
        ) : (
          <span className="inline-flex items-center justify-center gap-2">
            <EmailIcon className="h-4 w-4" /> Message Bhejo
          </span>
        )}
      </button>
      <p className="text-center text-xs text-slate-400">
        Reply 24–48 ghante me milta hai. Jaldi chahiye to Telegram use karo.
      </p>
    </form>
  );
}
