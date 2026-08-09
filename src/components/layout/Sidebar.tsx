'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/ai-test', label: 'AI Test', icon: '🤖' },
  { href: '/exams', label: 'Preload Test', icon: '🏆' },
  { href: '/pdf-upload', label: 'Upload', icon: '📄' },
  { href: '/contact', label: 'Contact', icon: '📞' },
];

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
        className="fixed left-4 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-lg border border-brand/10 bg-paper text-lg text-brand shadow-sm lg:hidden"
      >
        ☰
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          onClick={close}
          aria-hidden
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Desktop sidebar (hamesha visible) */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-brand/8 bg-paper p-4 lg:flex">
        <SidebarContent pathname={pathname} onNavigate={close} />
      </aside>

      {/* Mobile drawer (slide-in) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-brand/8 bg-paper p-4 transition-transform duration-200 lg:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent pathname={pathname} onNavigate={close} />
      </aside>
    </>
  );
}

function SidebarContent({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-2 font-display text-lg font-bold text-brand"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm text-gold">
            📚
          </span>
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

      <nav className="flex flex-col gap-1">
        {navItems.map(({ href, label, icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? 'bg-brand text-gold'
                  : 'text-brand/70 hover:bg-brand/10 hover:text-brand'
              }`}
            >
              <span className="text-base leading-none">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
