'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-extrabold text-brand">📚 Quiz App</Link>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="/exams" className="hover:text-brand">Exams</Link>
          <Link href="/ai-test" className="hover:text-brand">AI Test</Link>
          <Link href="/pdf-upload" className="hover:text-brand">PDF Quiz</Link>
          {session?.user ? (
            <>
              <Link href="/dashboard" className="hover:text-brand">Dashboard</Link>
              {session.user.role === 'admin' && <Link href="/admin" className="hover:text-brand">Admin</Link>}
              <button onClick={() => signOut()} className="text-slate-500 hover:text-red-500">Logout</button>
            </>
          ) : (
            <Link href="/login" className="btn-primary">Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
