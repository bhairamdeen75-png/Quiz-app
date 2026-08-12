import { LOGIN_REQUIRED_MESSAGE } from '@/lib/messages';
import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth-helpers';
import { createClient } from '@/lib/supabase/server';
import { computeScore } from '@/lib/utils/scoring';
import { getDeadlineMs } from '@/lib/utils/timer';

export async function POST(req: Request, { params }: { params: { testId: string } }) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: LOGIN_REQUIRED_MESSAGE, needsLogin: true }, { status: 401 });
  }
  const supabase = createClient();
  const { data: test } = await supabase
    .from('tests').select('*').eq('id', params.testId).eq('user_id', user.id).single();
  if (!test) return NextResponse.json({ error: 'Test nahi mila' }, { status: 404 });

  // Already submitted → result wapas
  if (test.status === 'completed') {
    return NextResponse.json({
      testId: test.id,
      result: {
        score: test.score,
        maxScore: test.max_score,
        correct: test.correct_count,
        wrong: test.wrong_count,
        skipped: test.skipped_count,
        accuracy: test.accuracy,
      },
    });
  }

  const now = Date.now();
  const deadline = getDeadlineMs(test.started_at, test.duration_seconds);
  const isExpired = now > deadline;

  const [{ data: questions }, { data: rule }] = await Promise.all([
    supabase.from('questions').select('*').in('id', test.question_ids),
    supabase.from('exam_rules').select('*').eq('exam_id', test.exam_id).maybeSingle(),
  ]);

  // ⚡ Client ke local answers sync karo (agar koi background POST miss hua ho)
  const body = await req.json().catch(() => ({}));
  const clientAnswers = body.answers as Record<string, number> | undefined;
  if (clientAnswers && typeof clientAnswers === 'object' && questions) {
    const questionById = new Map(questions.map((qq) => [qq.id, qq]));
    const rows = Object.entries(clientAnswers)
      .filter(([questionId]) => questionById.has(questionId))
      .map(([questionId, userAnswer]) => ({
        test_id: test.id,
        question_id: questionId,
        user_answer: userAnswer as number,
        is_correct: (userAnswer as number) === questionById.get(questionId)!.correct_index,
      }));
    if (rows.length > 0) {
      await supabase.from('test_answers').upsert(rows, { onConflict: 'test_id,question_id' });
    }
  }

  const { data: answers } = await supabase
    .from('test_answers').select('*').eq('test_id', test.id);

  const correctMarks = Number(rule?.correct_marks ?? 4);
  const negativeMarks = Number(rule?.negative_marks ?? 1);
  const result = computeScore(questions ?? [], answers ?? [], correctMarks, negativeMarks);

  const { data: updated, error } = await supabase.from('tests')
    .update({
      status: isExpired ? 'expired' : 'completed',
      completed_at: new Date().toISOString(),
      score: result.score,
      max_score: result.maxScore,
      correct_count: result.correct,
      wrong_count: result.wrong,
      skipped_count: result.skipped,
      accuracy: result.accuracy,
    })
    .eq('id', test.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ testId: updated.id, result });
}
