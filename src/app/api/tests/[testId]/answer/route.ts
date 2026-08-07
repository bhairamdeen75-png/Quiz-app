import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth-helpers';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest, { params }: { params: { testId: string } }) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { questionId, userAnswer, timeLeftSeconds } = await req.json();
  const supabase = createClient();

  const { data: test } = await supabase
    .from('tests').select('*').eq('id', params.testId).eq('user_id', user.id).single();
  if (!test) return NextResponse.json({ error: 'Test nahi mila' }, { status: 404 });
  if (test.status !== 'in_progress') {
    return NextResponse.json({ error: 'Test khatam ho chuka hai' }, { status: 400 });
  }
  if (!test.question_ids.includes(questionId)) {
    return NextResponse.json({ error: 'Question is test ka nahi hai' }, { status: 400 });
  }

  const { data: question } = await supabase
    .from('questions').select('*').eq('id', questionId).single();
  if (!question) return NextResponse.json({ error: 'Question nahi mila' }, { status: 404 });

  const isCorrect = userAnswer === question.correct_index;

  // Timer sync (deadline server-side hi validate hota hai)
  if (timeLeftSeconds !== undefined && timeLeftSeconds <= 0) {
    await supabase.from('tests')
      .update({ status: 'expired', completed_at: new Date().toISOString() })
      .eq('id', test.id);
    return NextResponse.json({ error: 'Time up! Test submit ho gaya' }, { status: 400 });
  }

  await supabase.from('test_answers').upsert(
    {
      test_id: test.id, question_id: questionId,
      user_answer: userAnswer, is_correct: isCorrect,
      time_taken_seconds: test.duration_seconds ? Math.max(0, timeLeftSeconds ?? 0) : null,
    },
    { onConflict: 'test_id,question_id' }
  );

  // Agar instant mode hai → sahi answer + hint + explanation turant bhejo
  if (test.answer_mode === 'instant') {
    return NextResponse.json({
      correct: isCorrect,
      correctIndex: question.correct_index,
      hint: question.hint,
      explanation: question.explanation,
    });
  }
  return NextResponse.json({ correct: isCorrect });
}
