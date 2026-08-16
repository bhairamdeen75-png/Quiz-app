'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

const navItems = [
  { 
    href: '/', 
    label: 'Home', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ) 
  },
  { 
    href: '/ai-test', 
    label: 'AI Test', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M12 8V4H8"/>
        <rect width="16" height="12" x="4" y="8" rx="2"/>
        <path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>
      </svg>
    ) 
  },
  { 
    href: '/exams', 
    label: 'Preload Test', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
        <path d="M4 22h16"/>
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
        <path d="M18 2H6v7c0 3.31 2.69 6 6 6s6-2.69 6-6V2Z"/>
      </svg>
    ) 
  },
  { 
    href: '/live-tests', 
    label: 'Live Tests', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ) 
  },
  { 
    href: '/pdf-upload', 
    label: 'Upload', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
        <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
        <path d="M12 12v6"/><path d="m15 15-3-3-3 3"/>
      </svg>
    ) 
  },
  { 
    href: '/contact', 
    label: 'Contact', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ) 
  },
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

