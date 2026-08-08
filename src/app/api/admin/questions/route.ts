import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth-helpers';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const user = await requireUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const status = req.nextUrl.searchParams.get('status') ?? 'pending';
  const supabase = createClient();
  const { data } = await supabase
    .from('questions')
    .select('*, exams(name), subjects(name)')
    .eq('is_approved', status === 'pending' ? false : true)
    .order('created_at', { ascending: false })
    .limit(100);
  return NextResponse.json(data ?? []);
}

export async function PATCH(req: NextRequest) {
  const user = await requireUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { id, isApproved } = await req.json();
  const supabase = createClient();
  const { error } = await supabase
    .from('questions').update({ is_approved: isApproved }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
