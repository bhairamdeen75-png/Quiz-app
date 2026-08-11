import type { Metadata } from 'next';

import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import Providers from '@/components/providers/Providers';

export const metadata: Metadata = {
  title: 'Quiz app — Free Test Series for Every Student',
  description: 'JEE, NEET, SSC, UPSC aur bahut se exams ki free AI test series aur quizzes.',
  icons: {
    icon: '/icon.jpg',
    shortcut: '/icon.jpg',
    apple: '/icon.jpg',
  },
};

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
            </div>
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
