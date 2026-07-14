-- ============================================================
-- POLYMERHUB — PAYMENT SCHEMA
-- Run in Supabase SQL Editor
-- ============================================================

-- Extend profiles for payment fields
alter table public.profiles
  add column if not exists subscription_end_date  timestamptz,
  add column if not exists razorpay_payment_id    text,
  add column if not exists razorpay_order_id      text;

-- Payment history table
create table if not exists public.payment_history (
  id                    uuid default gen_random_uuid() primary key,
  user_id               uuid not null references auth.users(id) on delete cascade,
  razorpay_order_id     text,
  razorpay_payment_id   text unique,
  amount                integer not null,      -- in rupees
  currency              text default 'INR',
  status                text not null check (status in ('success', 'failed', 'refunded')),
  plan                  text default 'premium_monthly',
  paid_at               timestamptz default now()
);

create index if not exists idx_payments_user on public.payment_history(user_id);
create index if not exists idx_payments_status on public.payment_history(status);

alter table public.payment_history enable row level security;

drop policy if exists "Users view own payments" on public.payment_history;
create policy "Users view own payments"
  on public.payment_history for select
  using (auth.uid() = user_id);

drop policy if exists "Service role manages payments" on public.payment_history;
create policy "Service role manages payments"
  on public.payment_history for all
  using (auth.role() = 'service_role');

-- ============================================================
-- ✅ PAYMENT SCHEMA COMPLETE
-- ============================================================
