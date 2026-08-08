import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth-helpers';
import { createClient } from '@/lib/supabase/server';
import { parseCsv } from '@/lib/utils/csv';

// CSV format: question,option_a,option_b,option_c,option_d,correct,chapter,subject,exam,difficulty,hint
export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File;
  const text = await file.text();
  const rows = parseCsv(text).slice(1); // header hatao

  const supabase = createClient();
  let imported = 0, failed = 0;

  for (const r of rows) {
    try {
      const [question, a, b, c, d, correct, chapter, subject, exam, difficulty, hint] = r;
      const { data: examRow } = await supabase
        .from('exams').select('id').eq('slug', exam.trim().toLowerCase()).maybeSingle();
      if (!examRow) { failed++; continue; }

      const { data: subjRow } = await supabase
        .from('subjects').select('id').eq('exam_id', examRow.id).eq('name', subject.trim()).maybeSingle();
      if (!subjRow) { failed++; continue; }

      let chapterId: string | null = null;
      if (chapter.trim()) {
        const { data: chRow } = await supabase
          .from('chapters').select('id').eq('subject_id', subjRow.id).eq('name', chapter.trim()).maybeSingle();
        if (chRow) chapterId = chRow.id;
      }

      const correctLetter = correct.trim().toUpperCase();
      const optionLetters = ['A', 'B', 'C', 'D'];
      const correctIndex = optionLetters.indexOf(correctLetter);

      await supabase.from('questions').insert({
        exam_id: examRow.id,
        subject_id: subjRow.id,
        chapter_id: chapterId,
        question_text: question.trim(),
        options: [a.trim(), b.trim(), c.trim(), d.trim()],
        correct_index: correctIndex,
        hint: hint?.trim() || null,
        difficulty: ['easy', 'medium', 'hard'].includes(difficulty.trim()) ? difficulty.trim() : 'medium',
        source: 'preloaded',
      });
      imported++;
    } catch {
      failed++;
    }
  }

  return NextResponse.json({ imported, failed });
}
