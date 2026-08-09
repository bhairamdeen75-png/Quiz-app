import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Providers from '@/components/providers/Providers';

export const metadata: Metadata = {
  title: 'Quiz app — Free Test Series for Every Student',
  description: 'JEE, NEET, SSC, UPSC aur bahut se exams ki free AI test series aur quizzes.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <Providers>
          <Navbar />
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
          <footer className="border-t py-6 text-center text-sm text-slate-500">
            Made with ❤️ TEAMVB 
          </footer>
        </Providers>
      </body>
    </html>
  );
}
