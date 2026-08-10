import type { Metadata } from 'next';

import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Providers from '@/components/providers/Providers';

export const metadata: Metadata = {
  title: 'Quiz app — Free Test Series for Every Student',
  description: 'JEE, NEET, SSC, UPSC aur bahut se exams ki free AI test series aur quizzes.',
};

const socialLinks = [
  {
    name: 'YouTube',
    href: '#', // apna YouTube link yaha daal dena
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8ZM9.6 15.5v-7l6.3 3.5-6.3 3.5Z" />
      </svg>
    ),
  },
  {
    name: 'Telegram',
    href: 'https://t.me/bkstudyzone', // apna Telegram link yaha daal dena
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M22 3.5 2.6 11c-1.3.5-1.3 1.2-.2 1.5l4.9 1.5 1.9 5.9c.2.6.4.8.9.8.4 0 .6-.2.9-.5l2.2-2.1 4.6 3.4c.8.5 1.4.2 1.6-.8l3-14c.3-1.2-.4-1.7-1.4-1.2Zm-13 10.3-1.1-3.6L18 6.8c.3-.2.6.1.4.3L9 13.8Z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: '#', // apna Instagram link yaha daal dena
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 2c2.7 0 3.1 0 4.1.1 1.1 0 1.8.2 2.5.5.7.2 1.2.6 1.8 1.1.5.5.9 1 1.1 1.8.2.6.4 1.4.5 2.5V16c-.1 1.1-.2 1.8-.5 2.5-.2.7-.6 1.2-1.1 1.8-.5.5-1.1.9-1.8 1.1-.6.2-1.4.4-2.5.5H7.9c-1.1-.1-1.8-.2-2.5-.5-.7-.2-1.2-.6-1.8-1.1-.5-.5-.9-1.1-1.1-1.8-.2-.6-.4-1.4-.5-2.5V7.9c.1-1.1.2-1.8.5-2.5.2-.7.6-1.2 1.1-1.8.5-.5 1.1-.9 1.8-1.1.6-.2 1.4-.4 2.5-.5C8.9 2 9.3 2 12 2Zm0 1.8c-2.6 0-2.9 0-4 .1-.9 0-1.4.2-1.7.3-.4.2-.7.3-1 .6-.3.3-.5.6-.6 1-.1.3-.3.8-.3 1.7-.1 1-.1 1.3-.1 4s0 2.9.1 4c0 .9.2 1.4.3 1.7.2.4.3.7.6 1 .3.3.6.5 1 .6.3.1.8.3 1.7.3 1 .1 1.3.1 4 .1s2.9 0 4-.1c.9 0 1.4-.2 1.7-.3.4-.2.7-.3 1-.6.3-.3.5-.6.6-1 .1-.3.3-.8.3-1.7.1-1 .1-1.3.1-4s0-2.9-.1-4c0-.9-.2-1.4-.3-1.7-.2-.4-.3-.7-.6-1-.3-.3-.6-.5-1-.6-.3-.1-.8-.3-1.7-.3-1-.1-1.3-.1-4-.1Zm0 3.5a4.7 4.7 0 1 1 0 9.4 4.7 4.7 0 0 1 0-9.4Zm0 1.8a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8Zm5-2a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0Z" />
      </svg>
    ),
  },
  {
    name: 'WhatsApp',
    href: '#', // apna WhatsApp link yaha daal dena
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.4c.1-.1.2-.3.2-.4.1-.2 0-.3 0-.5-.1-.1-.6-1.4-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.1 0 1.2.9 2.4 1 2.6.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.2-.2-.4-.3Z" />
      </svg>
    ),
  },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <Providers>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex min-w-0 flex-1 flex-col">
              <Navbar />
              <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>

              <footer className="border-t bg-white">
                <div className="mx-auto max-w-6xl px-4 py-6">
                  <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                    <p className="text-sm text-slate-500">
                      Made with <span className="text-red-500">❤️</span> TEAMVB
                    </p>

                    <div className="flex items-center gap-3">
                      {socialLinks.map((s) => (
                        <a
                          key={s.name}
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={s.name}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-indigo-600 hover:text-white"
                        >
                          {s.icon}
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 border-t pt-4 text-center text-xs text-slate-400">
                    © {new Date().getFullYear()} Quiz App. All rights reserved.
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
