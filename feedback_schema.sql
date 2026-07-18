-- ============================================================
-- POLYMERHUB — FEEDBACK SCHEMA
-- Run in Supabase SQL Editor
-- ============================================================

create table if not exists public.feedback (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references auth.users(id) on delete set null,
  type         text not null check (type in ('bug', 'feature', 'content', 'general', 'praise')),
  rating       integer check (rating between 1 and 5),
  message      text not null,
  page_url     text,
  user_email   text,
  user_name    text,
  status       text default 'new' check (status in ('new', 'reviewing', 'resolved', 'planned')),
  admin_note   text,
  created_at   timestamptz default now()
);

create index if not exists idx_feedback_type   on public.feedback(type);
create index if not exists idx_feedback_status on public.feedback(status);
create index if not exists idx_feedback_date   on public.feedback(created_at desc);

alter table public.feedback enable row level security;

-- Anyone can submit feedback
drop policy if exists "Anyone can submit feedback" on public.feedback;
create policy "Anyone can submit feedback"
  on public.feedback for insert with check (true);

-- Users can view their own feedback
drop policy if exists "Users view own feedback" on public.feedback;
create policy "Users view own feedback"
  on public.feedback for select using (auth.uid() = user_id);

-- ============================================================
-- ✅ FEEDBACK SCHEMA COMPLETE
-- ============================================================
