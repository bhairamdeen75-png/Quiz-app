'use client';
export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <h1 className="text-2xl font-bold text-red-600">Kuch galat ho gaya 😕</h1>
      <p className="mt-2 text-slate-600">{error.message || 'Ek unexpected error aaya.'}</p>
      <button onClick={reset} className="btn-primary mt-6">Dobara Try Karo</button>
    </div>
  );
}
