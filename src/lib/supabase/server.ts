import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// SERVER-SIDE hi use karo (service role = admin access, RLS bypass karta hai)
export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
