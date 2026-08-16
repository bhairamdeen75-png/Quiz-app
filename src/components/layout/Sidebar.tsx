'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

const navItems = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/ai-test', label: 'AI Test', icon: '🤖' },
  { href: '/exams', label: 'Preload Test', icon: '🏆' },
  { href: '/live-tests', label: 'Live Tests', icon: '⚡' },
  { href: '/pdf-upload', label: 'Upload', icon: '📄' },
  { href: '/contact', label: 'Contact', icon: '📞' },
];

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const close = () => setOpen(false);

  async function handleLogout() {
    setLoggingOut(true);
    if (session?.user) {
      await signOut({ callbackUrl: '/' });
    } else {
      // Admin cookie logout
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    }
  }

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
        className="fixed left-4 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-lg border border-brand/10 bg-paper text-lg text-brand shadow-sm lg:hidden"
      >
        ☰
      </button>

      {/* Mobile overlay */}
      {open && (
        <div onClick={close} aria-hidden className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden" />
      )}

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-brand/8 bg-paper p-4 lg:flex">
        <SidebarContent
          pathname={pathname}
          onNavigate={close}
          hasSession={!!session?.user}
          onLogout={handleLogout}
          loggingOut={loggingOut}
        />
      </aside>

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-brand/8 bg-paper p-4 transition-transform duration-200 lg:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent
          pathname={pathname}
          onNavigate={close}
          hasSession={!!session?.user}
          onLogout={handleLogout}
          loggingOut={loggingOut}
        />
      </aside>
    </>
  );
}

function SidebarContent({
  pathname,
  onNavigate,
  hasSession,
  onLogout,
  loggingOut,
}: {
  pathname: string;
  onNavigate: () => void;
  hasSession: boolean;
  onLogout: () => void;
  loggingOut: boolean;
}) {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <Link
  href="/"
  onClick={onNavigate}
  className="flex items-center gap-2 font-display text-lg font-bold text-brand"
>
  <Image
    src="/icon.jpg"
    alt="Quiz App Logo"
    width={32}
    height={32}
    className="h-8 w-8 rounded-lg object-cover"
  />
  Quiz App
</Link>
        <button
          onClick={onNavigate}
          aria-label="Close sidebar"
          className="text-slate-400 transition hover:text-danger lg:hidden"
        >
          ✕
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map(({ href, label, icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active ? 'bg-brand text-gold' : 'text-brand/70 hover:bg-brand/10 hover:text-brand'
              }`}
            >
              <span className="text-base leading-none">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: Settings + Logout */}
            <div className="mt-auto space-y-1 border-t border-brand/10 pt-4">
        <Link
          href="/profile"
          onClick={onNavigate}
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
            isActive(pathname, '/profile')
              ? 'bg-brand text-gold'
              : 'text-brand/70 hover:bg-brand/10 hover:text-brand'
          }`}
        >
          {/* VIP Settings SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Settings
        </Link>
        <button
          onClick={onLogout}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-danger/80 transition hover:bg-danger/10 hover:text-danger disabled:opacity-50"
        >
          {/* VIP Logout SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          {loggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </>
  );
}

