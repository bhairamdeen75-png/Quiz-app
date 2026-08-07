import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(_req: NextRequest, { params }: { params: { examId: string } }) {
  const supabase = createClient();

  const { data: exam, error: examErr } = await supabase
    .from('exams').select('*').eq('id', params.examId).single();
  if (examErr) return NextResponse.json({ error: 'Exam nahi mila' }, { status: 404 });

  const { data: subjects } = await supabase
    .from('subjects').select('*, chapters(*)').eq('exam_id', params.examId).order('order_no');

  const { data: rule } = await supabase
    .from('exam_rules').select('*').eq('exam_id', params.examId).maybeSingle();

  return NextResponse.json({ exam, subjects: subjects ?? [], rule });
}
