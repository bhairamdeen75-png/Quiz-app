// Run: npx tsx scripts/import-csv.ts supabase/seed/questions/jee_main_questions.csv
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(url, key);

const filePath = process.argv[2];
if (!filePath) { console.error('Usage: npx tsx scripts/import-csv.ts <file.csv>'); process.exit(1); }

const text = readFileSync(filePath, 'utf-8');
const rows = text.split('\n').slice(1).filter((l) => l.trim());

let imported = 0, failed = 0;

for (const line of rows) {
  const [question, a, b, c, d, correct, chapter, subject, exam, difficulty, hint] =
    line.split(',').map((s) => s.replace(/^"|"$/g, '').trim());

  const { data: examRow } = await supabase.from('exams').select('id').eq('slug', exam).maybeSingle();
  if (!examRow) { console.log('SKIP (exam not found):', exam); failed++; continue; }

  const { data: subjRow } = await supabase.from('subjects')
    .select('id').eq('exam_id', examRow.id).eq('name', subject).maybeSingle();
  if (!subjRow) { console.log('SKIP (subject not found):', subject); failed++; continue; }

  let chapterId: string | null = null;
  if (chapter) {
    const { data: chRow } = await supabase.from('chapters')
      .select('id').eq('subject_id', subjRow.id).eq('name', chapter).maybeSingle();
    if (chRow) chapterId = chRow.id;
  }

  const { error } = await supabase.from('questions').insert({
    exam_id: examRow.id, subject_id: subjRow.id, chapter_id: chapterId,
    question_text: question, options: [a, b, c, d],
    correct_index: ['A', 'B', 'C', 'D'].indexOf(correct.toUpperCase()),
    hint: hint || null, difficulty: difficulty || 'medium', source: 'preloaded',
  });
  if (error) { failed++; console.log('FAIL:', error.message); } else imported++;
}

console.log(`✅ Imported: ${imported} | ❌ Failed: ${failed}`);
