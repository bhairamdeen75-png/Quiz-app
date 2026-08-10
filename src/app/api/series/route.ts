import { LOGIN_REQUIRED_MESSAGE } from '@/lib/messages';
import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth-helpers';
import { createClient } from '@/lib/supabase/server';

// GET: preloaded test series list karo
export async function GET(req: NextRequest) {
  const examId = req.nextUrl.searchParams.get('examId');
  const subjectId = req.nextUrl.searchParams.get('subjectId');
  const supabase = createClient();

  let query = supabase.from('test_series').select('*');
  if (examId) query = query.eq('exam_id', examId);
  if (subjectId) query = query.eq('subject_id', subjectId);
  const { data } = await query.order('name');
  return NextResponse.json(data ?? []);
}

// POST: series start karo → test banao
export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { seriesId } = await req.json();
  const supabase = createClient();

  const { data: series } = await supabase
    .from('test_series').select('*').eq('id', seriesId).single();
  if (!series) return NextResponse.json({ error: 'Series nahi mili' }, { status: 404 });

  const { data: questions } = await supabase
    .from('test_series_questions').select('question_id').eq('test_series_id', seriesId);

  const questionIds = (questions ?? []).map((q) => q.question_id);
  if (questionIds.length === 0) {
    return NextResponse.json({ error: 'Is series me abhi questions nahi hain' }, { status: 400 });
  }

  const duration = series.duration_minutes ?? Math.ceil(questionIds.length * 90 / 60);

  const { data: test, error } = await supabase.from('tests').insert({
    user_id: user.id,
    exam_id: series.exam_id,
    subject_id: series.subject_id,
    source: 'preloaded',
    title: series.name,
    question_ids: questionIds,
    answer_mode: 'final',          // exam mode — feedback sirf submit ke baad
    duration_seconds: duration * 60,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ testId: test.id });
}
