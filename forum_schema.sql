-- ============================================================
-- POLYMERHUB — STUDENT FORUM SCHEMA
-- Phase 9D: Q&A per subject with realtime updates
-- Run in Supabase SQL Editor
-- ============================================================

-- ── 1. FORUM QUESTIONS ───────────────────────────────────────────────────────
create table if not exists public.forum_questions (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid not null references auth.users(id) on delete cascade,
  subject_id    uuid references public.subjects(id) on delete cascade,
  lesson_id     uuid references public.lessons(id) on delete set null,

  title         text not null,
  body          text not null,
  tags          text[],                    -- ['injection-moulding', 'defects']

  upvotes       integer default 0,
  answer_count  integer default 0,
  is_resolved   boolean default false,     -- marked resolved by asker
  is_pinned     boolean default false,     -- pinned by admin

  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index if not exists idx_fq_subject    on public.forum_questions(subject_id);
create index if not exists idx_fq_user       on public.forum_questions(user_id);
create index if not exists idx_fq_created    on public.forum_questions(created_at desc);
create index if not exists idx_fq_resolved   on public.forum_questions(is_resolved);

-- ── 2. FORUM ANSWERS ─────────────────────────────────────────────────────────
create table if not exists public.forum_answers (
  id           uuid default gen_random_uuid() primary key,
  question_id  uuid not null references public.forum_questions(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,

  body         text not null,
  upvotes      integer default 0,
  is_accepted  boolean default false,      -- accepted by question asker

  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create index if not exists idx_fa_question on public.forum_answers(question_id);
create index if not exists idx_fa_user     on public.forum_answers(user_id);

-- ── 3. UPVOTES TABLE (prevent duplicate votes) ───────────────────────────────
create table if not exists public.forum_upvotes (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid not null references auth.users(id) on delete cascade,
  question_id   uuid references public.forum_questions(id) on delete cascade,
  answer_id     uuid references public.forum_answers(id) on delete cascade,
  created_at    timestamptz default now(),

  -- Only one vote per user per item
  unique(user_id, question_id),
  unique(user_id, answer_id),

  -- Must vote on exactly one thing
  check (
    (question_id is not null and answer_id is null) or
    (question_id is null and answer_id is not null)
  )
);

-- ── 4. RLS ────────────────────────────────────────────────────────────────────
alter table public.forum_questions enable row level security;
alter table public.forum_answers enable row level security;
alter table public.forum_upvotes enable row level security;

-- Questions: anyone can read, authenticated users can create
drop policy if exists "Forum questions readable by all" on public.forum_questions;
create policy "Forum questions readable by all"
  on public.forum_questions for select using (true);

drop policy if exists "Authenticated users create questions" on public.forum_questions;
create policy "Authenticated users create questions"
  on public.forum_questions for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users update own questions" on public.forum_questions;
create policy "Users update own questions"
  on public.forum_questions for update
  using (auth.uid() = user_id);

-- Answers
drop policy if exists "Forum answers readable by all" on public.forum_answers;
create policy "Forum answers readable by all"
  on public.forum_answers for select using (true);

drop policy if exists "Authenticated users create answers" on public.forum_answers;
create policy "Authenticated users create answers"
  on public.forum_answers for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users update own answers" on public.forum_answers;
create policy "Users update own answers"
  on public.forum_answers for update
  using (auth.uid() = user_id);

-- Upvotes
drop policy if exists "Upvotes readable by all" on public.forum_upvotes;
create policy "Upvotes readable by all"
  on public.forum_upvotes for select using (true);

drop policy if exists "Authenticated users upvote" on public.forum_upvotes;
create policy "Authenticated users upvote"
  on public.forum_upvotes for all
  using (auth.uid() = user_id);

-- ── 5. TRIGGERS: keep answer_count and upvote counts in sync ─────────────────

-- Answer count on questions
create or replace function public.update_answer_count()
returns trigger language plpgsql as $$
begin
  if TG_OP = 'INSERT' then
    update public.forum_questions
    set answer_count = answer_count + 1, updated_at = now()
    where id = NEW.question_id;
  elsif TG_OP = 'DELETE' then
    update public.forum_questions
    set answer_count = greatest(0, answer_count - 1)
    where id = OLD.question_id;
  end if;
  return null;
end;
$$;

drop trigger if exists on_answer_change on public.forum_answers;
create trigger on_answer_change
  after insert or delete on public.forum_answers
  for each row execute function public.update_answer_count();

-- Upvote counts
create or replace function public.update_upvote_count()
returns trigger language plpgsql as $$
begin
  if TG_OP = 'INSERT' then
    if NEW.question_id is not null then
      update public.forum_questions set upvotes = upvotes + 1 where id = NEW.question_id;
    elsif NEW.answer_id is not null then
      update public.forum_answers set upvotes = upvotes + 1 where id = NEW.answer_id;
    end if;
  elsif TG_OP = 'DELETE' then
    if OLD.question_id is not null then
      update public.forum_questions set upvotes = greatest(0, upvotes - 1) where id = OLD.question_id;
    elsif OLD.answer_id is not null then
      update public.forum_answers set upvotes = greatest(0, upvotes - 1) where id = OLD.answer_id;
    end if;
  end if;
  return null;
end;
$$;

drop trigger if exists on_upvote_change on public.forum_upvotes;
create trigger on_upvote_change
  after insert or delete on public.forum_upvotes
  for each row execute function public.update_upvote_count();

-- ── 6. REALTIME ───────────────────────────────────────────────────────────────
-- Enable realtime for forum tables
-- Run these in Supabase Dashboard > Database > Replication:
-- alter publication supabase_realtime add table public.forum_questions;
-- alter publication supabase_realtime add table public.forum_answers;

-- ── 7. SEED: a few starter questions ─────────────────────────────────────────
-- Will be added by real students — no seed needed

-- ============================================================
-- ✅ FORUM SCHEMA COMPLETE
-- Tables: forum_questions, forum_answers, forum_upvotes
-- Triggers: auto answer_count, auto upvote_count
-- RLS: public read, authenticated write
-- ============================================================
