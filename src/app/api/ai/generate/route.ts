export const maxDuration = 60;
export const dynamic = 'force-dynamic';
import { LOGIN_REQUIRED_MESSAGE } from '@/lib/messages';
import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth-helpers';
import { createClient } from '@/lib/supabase/server';
import { generateQuestions } from '@/lib/ai/generateQuestions';
import type { RawQuestion } from '@/types';

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) {
  return NextResponse.json({ error: LOGIN_REQUIRED_MESSAGE, needsLogin: true }, { status: 401 });
}
  const body = await req.json();
  const { examId, subjectId, chapterIds, count, difficulty } = body;

  // Validation
  if (!examId || !subjectId) return NextResponse.json({ error: 'Exam aur Subject chahiye' }, { status: 400 });
  const qCount = Number(count);
  if (!Number.isInteger(qCount) || qCount < 10 || qCount > 50) {
    return NextResponse.json({ error: 'Questions 10 se 50 ke beech hone chahiye' }, { status: 400 });
  }
  const diff = ['easy', 'medium', 'hard'].includes(difficulty) ? difficulty : 'medium';
  const chapterIdList: string[] = Array.isArray(chapterIds) ? chapterIds : [];

  const supabase = createClient();

  const [{ data: exam }, { data: subject }, { data: chapters }] = await Promise.all([
    supabase.from('exams').select('name').eq('id', examId).single(),
    supabase.from('subjects').select('name').eq('id', subjectId).single(),
    supabase.from('chapters').select('name').in('id', chapterIdList),
  ]);
  if (!exam || !subject) return NextResponse.json({ error: 'Invalid exam/subject' }, { status: 400 });
  const chapterNames = (chapters ?? []).map((c) => c.name);

  // AI se questions generate (cached)
  const rawQuestions: RawQuestion[] = await generateQuestions({
    examId, examName: exam.name, subjectId, subjectName: subject.name,
    chapterNames, count: qCount, difficulty: diff,
  });

  // Questions DB me save
  const rows = rawQuestions.map((q, i) => ({
    exam_id: examId,
    subject_id: subjectId,
    chapter_id: chapterIdList[i % Math.max(1, chapterIdList.length)] ?? null,
    question_text: q.question,
    options: q.options,
    correct_index: q.correct_index,
    hint: q.hint ?? null,
    explanation: q.explanation ?? null,
    difficulty: q.difficulty ?? diff,
    source: 'ai',
    is_approved: true,
  }));

  const { data: inserted, error: insertErr } = await supabase
    .from('questions').insert(rows).select('id');
  if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 });

  const questionIds = (inserted ?? []).map((q) => q.id);

  // Timer: AI test = instant feedback mode, per-question time (exam rule)
  const { data: rule } = await supabase
    .from('exam_rules').select('per_question_seconds').eq('exam_id', examId).maybeSingle();
  const perQuestion = rule?.per_question_seconds ?? 90;
  const durationSeconds = qCount * perQuestion;

  const { data: test, error: testErr } = await supabase.from('tests').insert({
    user_id: user.id,
    exam_id: examId,
    subject_id: subjectId,
    source: 'ai',
    title: `${exam.name} — ${subject.name} AI Test`,
    question_ids: questionIds,
    answer_mode: 'instant',          // ✅ har answer ke baad turant sahi/galat + hint
    duration_seconds: durationSeconds,
  }).select().single();

  if (testErr) return NextResponse.json({ error: testErr.message }, { status: 500 });
  return NextResponse.json({ testId: test.id, questionCount: questionIds.length });
}
