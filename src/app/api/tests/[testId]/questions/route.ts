import { LOGIN_REQUIRED_MESSAGE } from '@/lib/messages';
import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth-helpers';
import { createClient } from '@/lib/supabase/server';
import type { PublicQuestion } from '@/types';

export async function GET(_req: Request, { params }: { params: { testId: string } }) {
  const user = await requireUser();
  if (!user) {
  return NextResponse.json({ error: LOGIN_REQUIRED_MESSAGE, needsLogin: true }, { status: 401 });
}
  const supabase = createClient();
  const { data: test, error } = await supabase
    .from('tests').select('*').eq('id', params.testId).eq('user_id', user.id).single();
  if (error || !test) return NextResponse.json({ error: 'Test nahi mila' }, { status: 404 });

  // Correct answers BINA (public shape) — client ko answer nahi dikhte
  const { data: questions } = await supabase
    .from('questions').select('id, type, question_text, options, difficulty')
    .in('id', test.question_ids);

  const publicQuestions: PublicQuestion[] = (questions ?? []).map((q) => ({
    id: q.id, type: q.type, question_text: q.question_text, options: q.options, difficulty: q.difficulty,
  }));

  return NextResponse.json({
    testId: test.id,
    title: test.title,
    answerMode: test.answer_mode,
    durationSeconds: test.duration_seconds,
    startedAt: test.started_at,
    questions: publicQuestions,
  });
}
