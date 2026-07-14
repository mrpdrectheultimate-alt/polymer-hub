-- ============================================================
-- POLYMERHUB — STUDENT DASHBOARD SCHEMA
-- Phase 8A: Profile, Progress, Quiz Lock System
-- Run in Supabase SQL Editor
-- ============================================================

-- ── 1. EXTEND profiles TABLE ─────────────────────────────────────────────────
alter table public.profiles
  add column if not exists avatar_url       text,
  add column if not exists bio              text,
  add column if not exists goals            text,
  add column if not exists college_name     text,
  add column if not exists education_level  text,    -- '1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduated'
  add column if not exists branch           text,    -- 'B.Tech PPE', 'Diploma Plastics', etc.
  add column if not exists graduation_year  integer,
  add column if not exists target_path      text,    -- 'exam', 'job', 'business', 'industry', 'gate'
  add column if not exists total_ai_queries integer default 0,
  add column if not exists updated_at       timestamptz default now();

-- ── 2. LESSON PROGRESS TABLE ─────────────────────────────────────────────────
create table if not exists public.user_progress (
  id              uuid default gen_random_uuid() primary key,
  user_id         uuid not null references auth.users(id) on delete cascade,
  lesson_id       uuid not null references public.lessons(id) on delete cascade,

  -- Reading status
  status          text not null default 'not_started'
                  check (status in ('not_started', 'reading', 'completed')),

  -- Quiz results
  quiz_score      integer,           -- percentage 0-100
  quiz_attempts   integer default 0,
  quiz_passed     boolean default false,

  -- Timestamps
  started_at      timestamptz,
  completed_at    timestamptz,
  last_active_at  timestamptz default now(),

  unique(user_id, lesson_id)
);

create index if not exists idx_progress_user    on public.user_progress(user_id);
create index if not exists idx_progress_lesson  on public.user_progress(lesson_id);
create index if not exists idx_progress_status  on public.user_progress(user_id, status);

-- RLS
alter table public.user_progress enable row level security;

drop policy if exists "Users manage own progress" on public.user_progress;
create policy "Users manage own progress"
  on public.user_progress for all
  using (auth.uid() = user_id);

-- ── 3. QUIZZES TABLE (one per lesson) ────────────────────────────────────────
create table if not exists public.quizzes (
  id            uuid default gen_random_uuid() primary key,
  lesson_id     uuid not null references public.lessons(id) on delete cascade,
  title         text not null,
  passing_score integer default 70,     -- % required to unlock next lesson
  created_at    timestamptz default now(),
  unique(lesson_id)
);

create index if not exists idx_quizzes_lesson on public.quizzes(lesson_id);

alter table public.quizzes enable row level security;
drop policy if exists "Quizzes publicly readable" on public.quizzes;
create policy "Quizzes publicly readable"
  on public.quizzes for select using (true);

-- ── 4. QUIZ QUESTIONS TABLE ───────────────────────────────────────────────────
create table if not exists public.quiz_questions (
  id              uuid default gen_random_uuid() primary key,
  quiz_id         uuid not null references public.quizzes(id) on delete cascade,
  question_text   text not null,
  options         jsonb not null,       -- ["Option A", "Option B", "Option C", "Option D"]
  correct_index   integer not null,     -- 0-based index of correct answer
  explanation     text,                 -- why this is correct
  difficulty      text default 'medium' check (difficulty in ('easy', 'medium', 'hard')),
  order_index     integer default 0
);

create index if not exists idx_quiz_questions_quiz on public.quiz_questions(quiz_id);

alter table public.quiz_questions enable row level security;
drop policy if exists "Questions publicly readable" on public.quiz_questions;
create policy "Questions publicly readable"
  on public.quiz_questions for select using (true);

-- ── 5. QUIZ ATTEMPTS TABLE ───────────────────────────────────────────────────
create table if not exists public.quiz_attempts (
  id                uuid default gen_random_uuid() primary key,
  user_id           uuid not null references auth.users(id) on delete cascade,
  quiz_id           uuid not null references public.quizzes(id) on delete cascade,
  lesson_id         uuid not null references public.lessons(id) on delete cascade,
  score_percentage  integer not null,   -- 0-100
  passed            boolean not null,
  answers_given     jsonb,              -- {question_id: selected_index}
  wrong_questions   jsonb,              -- [question_ids where wrong]
  time_taken_secs   integer,
  attempted_at      timestamptz default now()
);

create index if not exists idx_attempts_user  on public.quiz_attempts(user_id);
create index if not exists idx_attempts_quiz  on public.quiz_attempts(quiz_id);

alter table public.quiz_attempts enable row level security;
drop policy if exists "Users manage own attempts" on public.quiz_attempts;
create policy "Users manage own attempts"
  on public.quiz_attempts for all
  using (auth.uid() = user_id);

-- ── 6. HELPER FUNCTION: check if student can access a lesson ─────────────────
-- Returns true if the lesson is the first in the subject OR the previous lesson quiz was passed
create or replace function public.can_access_lesson(p_user_id uuid, p_lesson_id uuid)
returns boolean
language plpgsql security definer
as $$
declare
  v_lesson       record;
  v_prev_lesson  record;
  v_prev_progress record;
begin
  -- Get the lesson
  select * into v_lesson from public.lessons where id = p_lesson_id;
  if not found then return false; end if;

  -- First lesson in subject is always accessible
  if v_lesson.order_index = 1 then return true; end if;

  -- Get the previous lesson (order_index - 1, same subject)
  select * into v_prev_lesson
  from public.lessons
  where subject_id = v_lesson.subject_id
    and order_index = v_lesson.order_index - 1
  limit 1;

  if not found then return true; end if;

  -- Check if previous lesson quiz was passed
  select * into v_prev_progress
  from public.user_progress
  where user_id = p_user_id
    and lesson_id = v_prev_lesson.id;

  if not found then return false; end if;

  return v_prev_progress.quiz_passed = true;
end;
$$;

-- ── 7. AVATAR STORAGE BUCKET ─────────────────────────────────────────────────
-- Run this separately if bucket doesn't exist:
-- insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
-- drop policy if exists "Avatar images are publicly accessible." on storage.objects;
-- create policy "Avatar images are publicly accessible." on storage.objects for select using ( bucket_id = 'avatars' );
-- drop policy if exists "Users can upload their own avatar." on storage.objects;
-- create policy "Users can upload their own avatar." on storage.objects for insert with check ( bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1] );

-- ── 8. VIEWS ────────────────==================================================

-- Student dashboard stats (fast query)
create or replace view public.student_dashboard_stats as
select
  up.user_id,
  count(*)                                          as total_started,
  count(*) filter (where up.status = 'completed')  as total_completed,
  count(*) filter (where up.quiz_passed = true)    as total_quiz_passed,
  round(avg(up.quiz_score) filter (where up.quiz_score is not null), 1) as avg_quiz_score,
  max(up.last_active_at)                           as last_active
from public.user_progress up
group by up.user_id;

-- Subject-wise progress
create or replace view public.subject_progress as
select
  up.user_id,
  s.id   as subject_id,
  s.name as subject_name,
  s.slug as subject_slug,
  count(l.id)                                          as total_lessons,
  count(up2.lesson_id) filter (where up2.status = 'completed') as completed_lessons,
  round(
    100.0 * count(up2.lesson_id) filter (where up2.status = 'completed') / count(l.id), 1
  ) as completion_pct,
  round(avg(up2.quiz_score) filter (where up2.quiz_score is not null), 1) as avg_score
from public.subjects s
join public.lessons l on l.subject_id = s.id
cross join (select distinct user_id from public.user_progress) up
left join public.user_progress up2 on up2.lesson_id = l.id and up2.user_id = up.user_id
group by up.user_id, s.id, s.name, s.slug;
