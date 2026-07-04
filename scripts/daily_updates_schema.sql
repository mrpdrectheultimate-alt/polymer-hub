-- ============================================================
-- POLYMERHUB — DAILY PULSE CONTENT ENGINE SCHEMA v2
-- Enhanced schema with lesson linking, images, source URLs
-- Safe to re-run — uses DROP/CREATE IF NOT EXISTS guards
-- Run in Supabase SQL Editor
-- ============================================================

-- ─── Drop old table if exists (clean rebuild) ─────────────────────────────────
drop table if exists public.daily_updates cascade;

-- ─── Main daily_updates table ─────────────────────────────────────────────────
create table public.daily_updates (
  id uuid default gen_random_uuid() primary key,

  -- Content
  headline text not null,
  summary text not null,                    -- 2-3 sentence summary
  full_body text,                           -- optional longer write-up

  -- Source
  source_name text not null,                -- 'Plastics News', 'PlasticsToday', etc.
  source_url text,                          -- full URL to original article
  image_url text,                           -- thumbnail image URL

  -- Classification
  category text not null check (
    category in (
      'Research',
      'Market',
      'India',
      'Sustainability',
      'Policy',
      'Innovation',
      'Recycling',
      'Bioplastics'
    )
  ),

  -- Lesson linkage
  related_lesson_slug text,                 -- slug of the PolymerHub lesson this connects to
  related_subject_slug text,                -- slug of the subject this connects to

  -- Publishing
  published_at timestamptz not null default now(),
  publish_date date not null default current_date,  -- for daily grouping
  is_featured boolean default false,        -- featured story of the day
  is_published boolean default true,        -- draft support

  -- Meta
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── Indexes for fast queries ──────────────────────────────────────────────────
create index idx_daily_updates_date on public.daily_updates (publish_date desc);
create index idx_daily_updates_category on public.daily_updates (category);
create index idx_daily_updates_published on public.daily_updates (is_published, publish_date desc);
create index idx_daily_updates_featured on public.daily_updates (is_featured, publish_date desc);

-- ─── RLS ──────────────────────────────────────────────────────────────────────
alter table public.daily_updates enable row level security;

-- Public can read published items
drop policy if exists "Daily updates publicly readable" on public.daily_updates;
create policy "Daily updates publicly readable"
  on public.daily_updates for select
  using (is_published = true);

-- Only service role can insert/update/delete (admin form uses service role key)
drop policy if exists "Service role can manage daily updates" on public.daily_updates;
create policy "Service role can manage daily updates"
  on public.daily_updates for all
  using (auth.role() = 'service_role');

-- ─── Updated_at trigger ────────────────────────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists daily_updates_updated_at on public.daily_updates;
create trigger daily_updates_updated_at
  before update on public.daily_updates
  for each row execute function public.handle_updated_at();

-- ─── Seed: 10 sample entries across all categories ─────────────────────────────
insert into public.daily_updates (
  headline, summary, source_name, source_url, image_url,
  category, related_lesson_slug, related_subject_slug,
  publish_date, is_featured
) values
(
  'MIT Engineers Synthesize Self-Healing Biopolymer Derived From Marine Chitin With 45-Minute Ambient Recovery',
  'New patent maps molecular recovery matrices that heal structural micro-fractures at room temperature. Potential applications in automotive seals, medical implants, and long-life packaging that outlasts traditional thermoset alternatives.',
  'MIT Technology Review',
  'https://www.technologyreview.com',
  'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&q=80',
  'Research',
  'polymer-degradation-and-stabilization',
  'polymer-chemistry',
  current_date, true
),
(
  'Reliance Industries Adjusts Repol PP Wholesale Pricing Across Gujarat and Maharashtra Distribution Hubs',
  'Injection-grade Repol PP adjusts by +₹1.20/kg across major hubs. Analysts attribute the shift to Brent Crude gaining overnight on Middle East supply concerns.',
  'Chemical Weekly India',
  'https://www.chemicalweekly.com',
  'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80',
  'Market',
  'injection-moulding-process-parameters-and-defects',
  'polymer-processing',
  current_date, false
),
(
  'Carbios PETase Enzyme Trial Enters 10-Tonne Pilot Scale — Chemical Recycling Milestone for Food-Grade PET',
  'Carbios reports first food-contact-safe rPET from enzymatic depolymerization at pilot scale — the clearest proof yet that closed-loop PET recycling is commercially viable within this decade.',
  'Sustainable Plastics',
  'https://www.sustainableplastics.com',
  'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&q=80',
  'Recycling',
  'enzymatic-and-biological-recycling-the-frontier-technology',
  'recycling-technology',
  current_date, false
),
(
  'CIPET Launches Advanced Polymer Testing Certification Aligned to BIS IS 13360 Standards',
  'New 6-week certification covers MFI, DSC/TGA thermal analysis, and tensile/impact testing — directly applicable for QC roles at Finolex, Supreme Industries, and Astral.',
  'CIPET Press Office',
  'https://www.cipet.gov.in',
  'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=600&q=80',
  'India',
  'tensile-and-flexural-testing-measuring-mechanical-strength',
  'polymer-testing',
  current_date, false
),
(
  'BIS Tightens IS 4984 Compliance Requirements for HDPE Pressure Pipes in Jal Jeevan Mission Projects',
  'New amendments require third-party testing at BIS-approved labs for all HDPE pipe consignments above 5-tonne — affecting Astral, Prince Pipes, and Finolex directly.',
  'Bureau of Indian Standards',
  'https://www.bis.gov.in',
  'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80',
  'Policy',
  'melt-flow-index-mfi-measurement-significance-and-indian-standards',
  'polymer-testing',
  current_date, false
),
(
  'IIT Bombay Develops Low-Cost Silica-Carbon Black Hybrid Filler for Green Tyre Compound With 12% Rolling Resistance Reduction',
  'Breakthrough filler system targets the price barrier slowing silica tyre adoption in India — hybrid compound matches global green tyre performance at 60% of imported silica cost.',
  'Journal of Applied Polymer Science',
  'https://onlinelibrary.wiley.com/journal/10974628',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  'Research',
  'rubber-compounding-fillers-carbon-black-and-additives',
  'rubber-technology',
  current_date, false
),
(
  'NatureWorks Announces 200,000 Tonne PLA Expansion in Thailand — Largest Bioplastics Capacity Addition in Asia',
  'NatureWorks confirms Phase 2 of their Thailand Ingeo PLA facility, adding capacity that would make Asia the largest bioplastics production region by 2027.',
  'PlasticsToday',
  'https://www.plasticstoday.com',
  'https://images.unsplash.com/photo-1569427830807-c1429cbabed9?w=600&q=80',
  'Bioplastics',
  'polylactic-acid-pla-synthesis-properties-and-commercial-reality',
  'sustainable-plastics',
  current_date, false
),
(
  'EU PPWR Mandatory Recycled Content Rules Come Into Force — 30% rPET in Bottles Required From January 2025',
  'The EU Packaging and Packaging Waste Regulation begins enforcement of mandatory recycled content requirements — directly affecting every Indian company exporting to European markets.',
  'Plastics News Europe',
  'https://www.plasticsnews.com',
  'https://images.unsplash.com/photo-1624517452488-04aec72f6a44?w=600&q=80',
  'Sustainability',
  'extended-producer-responsibility-epr-and-regulatory-frameworks',
  'recycling-technology',
  current_date, false
),
(
  'ISRO Chandrayaan-4 Mission Uses 38% CFRP Composite Structures — Tata Advanced Materials Selected as Supplier',
  'Tata Advanced Materials confirms supply of carbon-fibre reinforced polymer structural components for the upcoming Chandrayaan-4 mission, marking the highest domestic composite content in any ISRO programme.',
  'The Hindu BusinessLine',
  'https://www.thehindubusinessline.com',
  'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80',
  'Innovation',
  'carbon-fibre-reinforced-polymers-cfrp-aerospace-to-automotive',
  'polymer-composites',
  current_date, false
),
(
  'Supreme Industries Reports 14% Revenue Growth — Plastic Piping Segment Drives Expansion Across Rural India',
  'Supreme Industries Q4 results show strong growth in plastic piping systems driven by Jal Jeevan Mission tenders — management signals capacity expansion at Gadegaon and Malanpur plants.',
  'Business Standard',
  'https://www.business-standard.com',
  'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80',
  'India',
  'the-plastics-entrepreneurship-landscape-in-india-why-your-degree-is-the-moat',
  'entrepreneurship-plastics',
  current_date, false
);

-- ─── View: Today's published updates (fast query for /today page) ──────────────
create or replace view public.todays_updates as
select
  id, headline, summary, source_name, source_url, image_url,
  category, related_lesson_slug, related_subject_slug,
  published_at, publish_date, is_featured
from public.daily_updates
where is_published = true
  and publish_date = current_date
order by is_featured desc, published_at asc;

-- ─── View: Latest updates (for homepage teaser — last 6 featured) ─────────────
create or replace view public.latest_updates as
select
  id, headline, summary, source_name, source_url, image_url,
  category, related_lesson_slug, related_subject_slug,
  published_at, publish_date, is_featured
from public.daily_updates
where is_published = true
order by publish_date desc, is_featured desc, published_at asc
limit 6;
