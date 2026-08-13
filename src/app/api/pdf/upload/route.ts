import { LOGIN_REQUIRED_MESSAGE } from '@/lib/messages';
import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth-helpers';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) {
  return NextResponse.json({ error: LOGIN_REQUIRED_MESSAGE, needsLogin: true }, { status: 401 });
}

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'File nahi mili' }, { status: 400 });
  if (!file.name.toLowerCase().endsWith('.pdf')) {
    return NextResponse.json({ error: 'Sirf PDF files allowed hain' }, { status: 400 });
  }
  if (file.size > 20 * 1024 * 1024) {
    return NextResponse.json({ error: 'File 20MB se bada hai' }, { status: 400 });
  }

  const supabase = createClient();
  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = `${user.id}/${Date.now()}-${file.name}`;

  // Supabase Storage me upload
  const { error: uploadErr } = await supabase.storage
    .from('pdfs').upload(filePath, buffer, { contentType: 'application/pdf' });
  if (uploadErr) return NextResponse.json({ error: uploadErr.message }, { status: 500 });

  // DB me entry
  const { data: row, error: dbErr } = await supabase.from('pdf_uploads').insert({
    user_id: user.id,
    file_name: file.name,
    file_url: filePath,
    status: 'uploaded',
  }).select().single();

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });
  return NextResponse.json({ uploadId: row.id });
}
