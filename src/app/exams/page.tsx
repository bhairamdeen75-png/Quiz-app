import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { Exam } from '@/types';

export const dynamic = 'force-dynamic';

export default async function ExamsPage() {
  const supabase = createClient();
  const { data } = await supabase.from('exams').select('*').eq('is_active', true).order('name');
  const exams: Exam[] = data ?? [];

  return (
    <div>
      <h1 className="text-3xl font-bold">Apna Exam Chuno</h1>
      <p className="mt-2 text-slate-600">10+ exams — har ek me preloaded test series, AI test aur PDF quiz.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {exams.map((exam) => (
          <Link key={exam.id} href={`/exams/${exam.id}`} className="card hover:border-brand hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{exam.icon}</span>
              <div>
                <h2 className="text-lg font-bold">{exam.name}</h2>
                <p className="text-sm text-slate-500">{exam.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
