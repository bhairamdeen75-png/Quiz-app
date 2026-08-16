-- ============ 1) INTEGER QUESTIONS ============
alter table questions drop constraint if exists questions_type_check;
alter table questions add constraint questions_type_check
  check (type in ('mcq','true_false','multi_select','integer'));

alter table questions add column if not exists correct_value numeric;

-- ============ 2) LIVE TESTS (metadata) ============
create table if not exists live_tests (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid references exams(id) on delete cascade not null,
  test_series_id uuid references test_series(id) on delete cascade not null,
  name text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  is_active boolean default true,
  created_at timestamptz default now()
);
create index if not exists idx_lt_exam on live_tests(exam_id);

-- ============ 3) LIVE TEST ATTEMPTS ============
create table if not exists live_test_attempts (
  id uuid primary key default gen_random_uuid(),
  live_test_id uuid references live_tests(id) on delete cascade not null,
  test_attempt_id uuid references tests(id) on delete set null,
  exam_slug text not null,
  user_id text not null,
  student_name text not null,
  student_class text,
  score numeric,
  max_score numeric,
  correct_count int default 0,
  wrong_count int default 0,
  skipped_count int default 0,
  accuracy numeric,
  answers jsonb,
  is_ranked boolean default true,
  submitted_at timestamptz default now()
);
create index if not exists idx_lta_lt on live_test_attempts(live_test_id);
create index if not exists idx_lta_user on live_test_attempts(user_id);
create index if not exists idx_lta_exam on live_test_attempts(exam_slug);

-- ============ 4) PROFILES ============
alter table profiles add column if not exists exam_slug text;
alter table profiles add column if not exists student_name text;
alter table profiles add column if not exists student_class text;
alter table profiles add column if not exists onboarded boolean default false;

-- ============ 5) RLS — ⚠️ auth.uid()::text cast zaroori (uuid vs text) ============
alter table live_tests enable row level security;
alter table live_test_attempts enable row level security;
create policy "public read live tests" on live_tests for select using (true);
create policy "public read attempts" on live_test_attempts for select using (true);
create policy "own insert attempts" on live_test_attempts for insert with check (auth.uid()::text = user_id);
create policy "own update attempts" on live_test_attempts for update using (auth.uid()::text = user_id);
