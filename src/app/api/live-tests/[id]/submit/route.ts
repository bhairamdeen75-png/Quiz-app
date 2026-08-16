import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Login pehle karo' }, { status: 401 });
  const { testId, answers } = await req.json();
  if (!testId) return NextResponse.json({ error: 'testId missing' }, { status: 400 });

  const supabase = createClient();

  // test attempt (user ka apna)
  const { data: test, error: e1 } = await supabase
    .from('tests').select('*').eq('id', testId).eq('user_id', session.user.id).single();
  if (e1 || !test) return NextResponse.json({ error: 'Test attempt nahi mila' }, { status: 404 });

  // live test + marking rules
  const { data: lt } = await supabase
    .from('live_tests')
    .select('*, exams(slug, name)')
    .eq('id', params.id).single();
  if (!lt) return NextResponse.json({ error: 'Live test nahi mila' }, { status: 404 });

  const { data: rules } = await supabase
    .from('exam_rules')
    .select('correct_marks, negative_marks')
    .eq('exam_id', lt.exam_id).maybeSingle();
  const correctMarks = Number(rules?.correct_marks ?? 4);
  const negativeMarks = Number(rules?.negative_marks ?? 1);

  // questions + correct answers (server-side scoring — cheat-proof)
  const { data: qrows } = await supabase
    .from('questions')
    .select('id, type, correct_index, correct_value')
    .in('id', test.question_ids);

  let score = 0, correct = 0, wrong = 0, skipped = 0;
  for (const q of qrows ?? []) {
    const a = answers?.[q.id];
    if (a == null || a === '') { skipped++; continue; }
    const isRight = q.type === 'integer'
      ? Number(a) === Number(q.correct_value)
      : Number(a) === q.correct_index;
    if (isRight) { score += correctMarks; correct++; }
    else { score -= negativeMarks; wrong++; }
  }
  const maxScore = (qrows?.length ?? 0) * correctMarks;
  const accuracy = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  const now = Date.now();
  const isRanked = now >= new Date(lt.starts_at).getTime() && now <= new Date(lt.ends_at).getTime();

  // test row complete karo
  await supabase.from('tests').update({
    status: 'completed',
    completed_at: new Date().toISOString(),
    score, max_score: maxScore,
    correct_count: correct, wrong_count: wrong, skipped_count: skipped,
    accuracy,
  }).eq('id', test.id);

  // profile se naam/class/exam
  const { data: profile } = await supabase.from('profiles')
    .select('student_name, student_class, exam_slug').eq('id', session.user.id).maybeSingle();

  // ranking attempt save (Missed/Done isi se pata chalega)
  const { error: e3 } = await supabase.from('live_test_attempts').insert({
    live_test_id: params.id,
    test_attempt_id: test.id,
    exam_slug: lt.exams?.slug ?? 'other',
    user_id: session.user.id,
    student_name: profile?.student_name || session.user.name || 'Student',
    student_class: profile?.student_class ?? null,
    score, max_score: maxScore,
    correct_count: correct, wrong_count: wrong, skipped_count: skipped,
    accuracy, answers: answers ?? {}, is_ranked: isRanked,
  });
  if (e3) return NextResponse.json({ error: e3.message }, { status: 500 });

  return NextResponse.json({
    ok: true, ranked: isRanked, practice: !isRanked,
    score, max_score: maxScore, correct, wrong, skipped, total: qrows?.length ?? 0,
  });
}
