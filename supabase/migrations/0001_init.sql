-- ============ EXTENSIONS ============
create extension if not exists "pgcrypto";

-- ============ EXAMS ============
create table exams (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  icon text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ============ SUBJECTS ============
create table subjects (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid references exams(id) on delete cascade not null,
  name text not null,
  order_no int default 0
);

-- ============ CHAPTERS ============
create table chapters (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid references subjects(id) on delete cascade not null,
  name text not null,
  order_no int default 0
);

-- ============ QUESTIONS (teeno features yahin aate hain) ============
create table questions (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid references exams(id) on delete cascade not null,
  subject_id uuid references subjects(id) on delete cascade,
  chapter_id uuid references chapters(id) on delete set null,
  type text default 'mcq' check (type in ('mcq','true_false','multi_select')),
  question_text text not null,
  options jsonb not null,              -- ["a","b","c","d"]
  correct_index int not null,          -- sahi option ka index
  hint text,
  explanation text,
  difficulty text check (difficulty in ('easy','medium','hard')),
  source text default 'preloaded' check (source in ('preloaded','ai','pdf')),
  is_approved boolean default true,
  created_at timestamptz default now()
);
create index idx_questions_exam on questions(exam_id);
create index idx_questions_chapter on questions(chapter_id);

-- ============ EXAM RULES (timing + marking — exam ke hisaab se) ============
create table exam_rules (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid references exams(id) on delete cascade unique,
  duration_minutes int default 60,
  per_question_seconds int default 90,
  correct_marks numeric default 4,
  negative_marks numeric default 1,
  total_questions int default 100
);

-- ============ PRELOADED TEST SERIES ============
create table test_series (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid references exams(id) on delete cascade not null,
  subject_id uuid references subjects(id) on delete cascade,
  name text not null,
  description text,
  question_count int,
  duration_minutes int,
  difficulty text
);

create table test_series_questions (
  test_series_id uuid references test_series(id) on delete cascade,
  question_id uuid references questions(id) on delete cascade,
  primary key (test_series_id, question_id)
);

-- ============ TESTS (student ke attempts) ============
create table tests (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  exam_id uuid references exams(id) on delete cascade not null,
  subject_id uuid references subjects(id) on delete set null,
  source text check (source in ('preloaded','ai','pdf')) default 'preloaded',
  title text,
  status text default 'in_progress' check (status in ('in_progress','completed','expired')),
  question_ids jsonb not null,
  answer_mode text default 'final' check (answer_mode in ('instant','final')),
  duration_seconds int,
  started_at timestamptz default now(),
  completed_at timestamptz,
  score numeric,
  max_score numeric,
  correct_count int,
  wrong_count int,
  skipped_count int,
  accuracy numeric
);

-- ============ TEST ANSWERS ============
create table test_answers (
  id uuid primary key default gen_random_uuid(),
  test_id uuid references tests(id) on delete cascade not null,
  question_id uuid references questions(id) on delete cascade not null,
  user_answer int,                      -- student ne kaunsa option chuna
  is_correct boolean,
  time_taken_seconds int,
  answered_at timestamptz default now(),
  unique (test_id, question_id)
);

-- ============ PDF UPLOADS ============
create table pdf_uploads (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  file_name text,
  file_url text,
  status text default 'uploaded' check (status in ('uploaded','processing','done','failed')),
  question_count int,
  error text,
  created_at timestamptz default now()
);

-- ============ AI CACHE (cost killer — same request dubara AI call nahi) ============
create table ai_generations (
  id uuid primary key default gen_random_uuid(),
  cache_key text unique not null,
  exam_id uuid,
  subject_id uuid,
  chapter_ids jsonb,
  difficulty text,
  question_count int,
  response jsonb,
  created_at timestamptz default now()
);

-- profiles (id ab text hai — NextAuth user id ke liye)
create table profiles (
  id text primary key,
  name text,
  avatar_url text,
  role text default 'student' check (role in ('student','admin')),
  created_at timestamptz default now()
);

-- ============ PDF STORAGE BUCKET ============
insert into storage.buckets (id, name, public) values ('pdfs', 'pdfs', false)
on conflict (id) do nothing;

-- ============ RLS (safety — service role se code bypass karega) ============
alter table exams enable row level security;
alter table subjects enable row level security;
alter table chapters enable row level security;
alter table questions enable row level security;
alter table tests enable row level security;
alter table test_answers enable row level security;
alter table pdf_uploads enable row level security;
alter table profiles enable row level security;

create policy "public read exams" on exams for select using (true);
create policy "public read subjects" on subjects for select using (true);
create policy "public read chapters" on chapters for select using (true);
create policy "public read approved questions" on questions for select using (is_approved = true);
create policy "own tests" on tests for all using (auth.uid() = user_id);
create policy "own answers" on test_answers for all using (
  exists (select 1 from tests t where t.id = test_answers.test_id and t.user_id = auth.uid())
);
create policy "own pdfs" on pdf_uploads for all using (auth.uid() = user_id);
create policy "own profile" on profiles for all using (auth.uid() = id);
