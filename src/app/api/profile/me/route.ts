import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ needsLogin: true }, { status: 401 });
  const supabase = createClient();
  const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
  return NextResponse.json(data ?? { id: session.user.id, name: session.user.name });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { exam_slug, student_name, student_class } = await req.json();
  const supabase = createClient();
  const { error } = await supabase.from('profiles').upsert({
    id: session.user.id,
    name: session.user.name,
    avatar_url: session.user.image,
    exam_slug,
    student_name,
    student_class,
    onboarded: true,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
