import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth-helpers';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest, { params }: { params: { testId: string } }) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { questionId, userAnswer } = await req.json();
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

  await supabase.from('test_answers').upsert(
    {
      test_id: test.id, question_id: questionId,
      user_answer: userAnswer, is_correct: isCorrect,
    },
    { onConflict: 'test_id,question_id' }
  );

  // ✅ Har answer pe turant feedback — final mode me bhi
  return NextResponse.json({
    correct: isCorrect,
    correctIndex: question.correct_index,
    hint: question.hint,
    explanation: question.explanation,
  });
}
