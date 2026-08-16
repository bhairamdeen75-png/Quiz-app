import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Login pehle karo', needsLogin: true }, { status: 401 });

  const supabase = createClient();
  const { data: lt, error } = await supabase
    .from('live_tests')
    .select('id, name, starts_at, ends_at, exam_id, test_series_id, test_series(duration_minutes)')
    .eq('id', params.id).eq('is_active', true).single();
  if (error || !lt) return NextResponse.json({ error: 'Live test nahi mila' }, { status: 404 });

  const now = Date.now();
  const start = new Date(lt.starts_at).getTime();
  const end = new Date(lt.ends_at).getTime();

  if (now < start) {
    return NextResponse.json({ error: 'Test abhi shuru nahi hua hai', status: 'upcoming' }, { status: 400 });
  }
  const isRanked = now <= end; // 48h window ke andar = ranked, baad = practice

  // test_series se questions fetch karo
  const { data: qrows } = await supabase
    .from('test_series_questions')
    .select('questions(id, type, question_text, options, correct_index, correct_value, hint, explanation, difficulty)')
    .eq('test_series_id', lt.test_series_id);

  const questions = (qrows ?? []).map((r: any) => r.questions).filter(Boolean);
  if (!questions.length) return NextResponse.json({ error: 'Test mein koi question nahi hai' }, { status: 400 });

  const durationSeconds = (lt.test_series?.duration_minutes ?? 180) * 60;
  const { data: attempt, error: e2 } = await supabase.from('tests').insert({
    user_id: session.user.id,
    exam_id: lt.exam_id,
    source: 'preloaded',
    title: lt.name,
    status: 'in_progress',
    question_ids: questions.map((q: any) => q.id),
    answer_mode: 'final',
    duration_seconds: durationSeconds,
  }).select().single();
  if (e2 || !attempt) return NextResponse.json({ error: 'Test attempt ban nahi paya' }, { status: 500 });

  return NextResponse.json({
    testId: attempt.id,
    title: lt.name,
    durationSeconds,
    startedAt: attempt.started_at,
    ranked: isRanked,
    questions: questions.map((q: any) => ({
      id: q.id, type: q.type, question_text: q.question_text, options: q.options ?? [],
      correctIndex: q.correct_index, correctValue: q.correct_value,
      hint: q.hint, explanation: q.explanation, difficulty: q.difficulty,
    })),
  });
}
