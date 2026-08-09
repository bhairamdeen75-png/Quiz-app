'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();

  const navLink = 'text-brand/70 transition hover:text-brand';

  return (
    <header className="sticky top-0 z-10 border-b border-brand/8 bg-paper/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold text-brand">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm text-gold">📚</span>
          Quiz App
        </Link>
        <div className="flex items-center gap-5 text-sm font-medium">
          <Link href="/exams" className={navLink}>Exams</Link>
          <Link href="/ai-test" className={navLink}>AI Test</Link>
          <Link href="/pdf-upload" className={navLink}>PDF Quiz</Link>
          {session?.user ? (
            <>
              <Link href="/dashboard" className={navLink}>Dashboard</Link>
              {session.user.role === 'admin' && <Link href="/admin" className={navLink}>Admin</Link>}
              <button onClick={() => signOut()} className="text-brand/40 transition hover:text-danger">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="btn-primary !px-4 !py-2 text-sm">Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
