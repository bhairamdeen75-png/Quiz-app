'use client';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm py-16">
      <div className="card text-center">
        <h1 className="text-2xl font-bold">Login / Signup</h1>
        <p className="mt-2 text-slate-500">Google se ek click me login — free.</p>
        <button onClick={() => signIn('google', { callbackUrl: '/dashboard' })} className="btn-primary mt-6 w-full">
          Continue with Google
        </button>
      </div>
    </div>
  );
}
