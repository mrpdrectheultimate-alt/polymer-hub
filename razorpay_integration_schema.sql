-- ============================================================
-- POLYMERHUB — RAZORPAY INTEGRATION SCHEMA
-- Phase 9: Payments
-- Run in Supabase SQL Editor
-- ============================================================

-- ── 1. EXTEND profiles TABLE FOR RAZORPAY ───────────────────────────────────
alter table public.profiles
  add column if not exists subscription_end_date timestamptz,
  add column if not exists razorpay_payment_id    text,
  add column if not exists razorpay_order_id      text;

-- ── 2. CREATE payment_history TABLE ─────────────────────────────────────────
create table if not exists public.payment_history (
  id                  uuid default gen_random_uuid() primary key,
  user_id             uuid not null references auth.users(id) on delete cascade,
  razorpay_order_id   text not null,
  razorpay_payment_id text not null unique,
  amount              integer not null, -- amount paid
  currency            text not null default 'INR',
  status              text not null default 'success',
  plan                text not null default 'premium_monthly',
  paid_at             timestamptz default now(),
  created_at          timestamptz default now()
);

-- Indices
create index if not exists idx_payment_history_user on public.payment_history(user_id);

-- RLS
alter table public.payment_history enable row level security;

drop policy if exists "Users view own payment history" on public.payment_history;
create policy "Users view own payment history"
  on public.payment_history for select
  using (auth.uid() = user_id);
