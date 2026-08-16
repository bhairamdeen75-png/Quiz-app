import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET: sabhi active live tests — exam pages ke liye (sabhi exams ke dikhte hain)
export async function GET(req: NextRequest) {
  const examId = req.nextUrl.searchParams.get('examId'); // optional filter
  const supabase = createClient();

  let query = supabase
    .from('live_tests')
    .select('id, name, starts_at, ends_at, exam_id, exams(slug, name), test_series(duration_minutes)')
    .eq('is_active', true)
    .order('starts_at', { ascending: false });

  if (examId) query = query.eq('exam_id', examId);

  const { data } = await query;

  const rows = (data ?? []).map((t: any) => ({
    id: t.id,
    name: t.name,
    starts_at: t.starts_at,
    ends_at: t.ends_at,
    exam_id: t.exam_id,
    exam_slug: t.exams?.slug ?? null,
    exam_name: t.exams?.name ?? null,
    duration_minutes: t.test_series?.duration_minutes ?? 180,
  }));

  return NextResponse.json(rows);
}
