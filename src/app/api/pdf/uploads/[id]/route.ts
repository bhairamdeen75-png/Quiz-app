import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth-helpers';
import { createClient } from '@/lib/supabase/server';
import { extractQuestionsFromPdfText } from '@/lib/ai/extractFromPdf';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';

export const runtime = 'nodejs';
export const maxDuration = 60;

// GET: status poll karo
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized', needsLogin: true }, { status: 401 });
  const supabase = createClient();
  const { data } = await supabase
    .from('pdf_uploads').select('*').eq('id', params.id).eq('user_id', user.id).single();
  if (!data) return NextResponse.json({ error: 'Upload nahi mila' }, { status: 404 });
  return NextResponse.json(data);
}

// POST: process karo (parse → AI extract → test banao)
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const user = await requireUser();
if (!user) return NextResponse.json({ error: 'Unauthorized', needsLogin: true }, { status: 401 });

  const supabase = createClient();
  const { data: upload } = await supabase
    .from('pdf_uploads').select('*').eq('id', params.id).eq('user_id', user.id).single();
  if (!upload) return NextResponse.json({ error: 'Upload nahi mila' }, { status: 404 });

  await supabase.from('pdf_uploads').update({ status: 'processing' }).eq('id', upload.id);

  try {
    // 1) PDF download + text extract
    const { data: blob } = await supabase.storage
      .from('pdfs').download(upload.file_url);
    if (!blob) throw new Error('PDF download nahi hua');
    const pdfData = await pdfParse(Buffer.from(await blob.arrayBuffer()));
    const text = pdfData.text;

    // 2) AI se questions extract
    const rawQuestions = await extractQuestionsFromPdfText(text, true);

    // 3) Questions save (source = pdf)
    const rows = rawQuestions.map((q) => ({
      question_text: q.question,
      options: q.options,
      correct_index: q.correct_index,
      hint: q.hint ?? null,
      explanation: q.explanation ?? null,
      difficulty: q.difficulty ?? 'medium',
      source: 'pdf',
      is_approved: false,   // admin review ke liye
    }));
    const { data: inserted } = await supabase.from('questions').insert(rows).select('id');
    const questionIds = (inserted ?? []).map((q) => q.id);

    // 4) Test banao (instant feedback mode)
    const { data: test } = await supabase.from('tests').insert({
      user_id: user.id,
      source: 'pdf',
      title: `PDF Test — ${upload.file_name.replace('.pdf', '')}`,
      question_ids: questionIds,
      answer_mode: 'instant',
      duration_seconds: questionIds.length * 90,
    }).select().single();

    // 5) Status update
    await supabase.from('pdf_uploads').update({
      status: 'done', question_count: questionIds.length,
    }).eq('id', upload.id);

    return NextResponse.json({ status: 'done', testId: test!.id, questionCount: questionIds.length });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Processing failed';
    await supabase.from('pdf_uploads').update({ status: 'failed', error: msg }).eq('id', upload.id);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
