import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminToken } from '@/lib/admin-auth';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  // Sirf admin hi delete kar sakta hai
  const adminCookie = cookies().get('admin_session')?.value;
  if (!verifyAdminToken(adminCookie)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const id = body.id as string | undefined;
  if (!id) return NextResponse.json({ error: 'Series id missing' }, { status: 400 });

  const supabase = createClient();

  // Series delete — test_series_questions cascade se apne aap delete
  const { error } = await supabase.from('test_series').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Optional: orphan questions cleanup (storage free)
  if (body.cleanupOrphans) {
    const { data: usedRows } = await supabase.from('test_series_questions').select('question_id');
    const used = new Set((usedRows ?? []).map((r) => r.question_id));
    const { data: preloaded } = await supabase.from('questions').select('id').eq('source', 'preloaded');
    const orphanIds = (preloaded ?? []).map((q) => q.id).filter((qid) => !used.has(qid));

    // Chunks me delete (bade data ke liye safe)
    for (let i = 0; i < orphanIds.length; i += 400) {
      const chunk = orphanIds.slice(i, i + 400);
      const { error: delErr } = await supabase.from('questions').delete().in('id', chunk);
      if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
