import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { Exam } from '@/types';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const supabase = createClient();
  const { data: exams } = await supabase.from('exams').select('*').eq('is_active', true).order('name');
  const list: Exam[] = exams ?? [];

  return (
    <div className="space-y-16">
      {/* HERO */}
      <section className="py-10 text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">
          Padhai sabki hai.
          <br />
          <span className="text-brand">Test series ab FREE.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
          JEE, NEET, SSC, UPSC — AI se live test banao, PDF se quiz banao,
          ya preloaded test series do. Sab kuch bilkul free.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/exams" className="btn-primary text-lg">🚀 Test Shuru Karo</Link>
          <Link href="/ai-test" className="btn-outline text-lg">🤖 AI Test Generate</Link>
          <Link href="/pdf-upload" className="btn-outline text-lg">📄 PDF → Quiz</Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="grid gap-6 md:grid-cols-3">
        <div className="card">
          <h3 className="text-xl font-bold">🤖 AI Live Test</h3>
          <p className="mt-2 text-slate-600">
            Exam, subject aur chapter select karo — AI 10-50 questions banayega.
            Har answer ke baad turant sahi/galat + hint.
          </p>
        </div>
        <div className="card">
          <h3 className="text-xl font-bold">📄 PDF → Quiz</h3>
          <p className="mt-2 text-slate-600">
            Apni koi bhi PDF bhejo — AI uske questions ko interactive test me badal dega.
          </p>
        </div>
        <div className="card">
          <h3 className="text-xl font-bold">🏆 Preloaded Series</h3>
          <p className="mt-2 text-slate-600">
            10+ exams, 100-500 questions har exam me — exam-level difficulty aur exact timing.
          </p>
        </div>
      </section>

      {/* EXAMS GRID */}
      <section>
        <h2 className="mb-6 text-center text-2xl font-bold">Exams Jo Hum Cover Karte Hain</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((exam) => (
            <Link key={exam.id} href={`/exams/${exam.id}`} className="card hover:border-brand">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{exam.icon}</span>
                <div>
                  <h3 className="font-bold">{exam.name}</h3>
                  <p className="text-sm text-slate-500">{exam.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
