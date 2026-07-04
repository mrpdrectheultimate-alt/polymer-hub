import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowRight, TrendingUp, TrendingDown, ExternalLink, Brain, Newspaper, BookOpen } from 'lucide-react'

// ISR: revalidate every hour
export const revalidate = 3600

// ─── Types ────────────────────────────────────────────────────────────────────

type NewsItem = {
  id: string
  headline: string
  summary: string
  source_name: string
  source_url: string | null
  image_url: string | null
  category: string
  related_lesson_slug: string | null
  related_subject_slug: string | null
  published_at: string
  publish_date: string
  is_featured: boolean
}

// ─── Static data (market + sidebar) ───────────────────────────────────────────

const MARKET_DATA = [
  { label: 'Repol PP (RIL)', value: '₹94.50/kg', delta: '+0.8%', up: true },
  { label: 'Relene HDPE', value: '₹101.20/kg', delta: '+0.4%', up: true },
  { label: 'Finolex PVC', value: '₹88.10/kg', delta: '-0.2%', up: false },
  { label: 'BASF Nylon 6', value: '₹196.40/kg', delta: '+1.2%', up: true },
  { label: 'Brent Crude', value: '$78.42/bbl', delta: '+1.1%', up: true },
]

const TICKER_ITEMS = [
  'Repol PP (RIL) ₹94.50/kg ▲0.8%',
  'Relene HDPE ₹101.20/kg ▲0.4%',
  'Finolex PVC ₹88.10/kg ▼0.2%',
  'Brent Crude $78.42/bbl ▲1.1%',
  'SABIC PC ₹218/kg ▲0.3%',
  'JBF PET ₹92/kg ▼0.5%',
]

const QUOTES = [
  'Plastics are the workhorses of modern civilization — invisible, indispensable, misunderstood.',
  'The next great polymer solving ocean waste is being designed right now. Will it be you?',
  'Every PPE engineer working today was once a student who chose to understand what most people ignore.',
  'A material that lasts 500 years should be designed to be recovered, not discarded.',
]

const TRENDING = ['PP', 'HDPE', 'PET', 'ABS', 'Nylon 6', 'PEEK']

const ON_THIS_DAY = {
  year: '1935',
  headline: 'DuPont patents Nylon 6,6',
  body: "Wallace Carothers patents the first fully synthetic fiber — used in WWII parachutes and today in every tyre cord and engineering gear in your syllabus.",
  color: '#7C3AED',
}

const CATEGORY_CONFIG: Record<string, { color: string; bg: string }> = {
  Research:      { color: '#1D4ED8', bg: '#EFF6FF' },
  Market:        { color: '#CA8A04', bg: '#FEFCE8' },
  India:         { color: '#1D4ED8', bg: '#EFF6FF' },
  Sustainability:{ color: '#15803D', bg: '#F0FDF4' },
  Policy:        { color: '#7C3AED', bg: '#F5F3FF' },
  Innovation:    { color: '#EA580C', bg: '#FFF7ED' },
  Recycling:     { color: '#15803D', bg: '#F0FDF4' },
  Bioplastics:   { color: '#15803D', bg: '#F0FDF4' },
}

const DEFAULT_IMAGES: Record<string, string> = {
  Research:       'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&q=80',
  Market:         'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80',
  India:          'https://images.unsplash.com/photo-1581093458791-9d58e74010a8?w=600&q=80',
  Sustainability: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&q=80',
  Policy:         'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=600&q=80',
  Innovation:     'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&q=80',
  Recycling:      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&q=80',
  Bioplastics:    'https://images.unsplash.com/photo-1569427830807-c1429cbabed9?w=600&q=80',
}

// ─── Components ───────────────────────────────────────────────────────────────

function LiveTicker() {
  return (
    <div className="bg-ink border-b-4 border-ink overflow-hidden h-10 flex items-center">
      <div className="bg-yellow-bright text-ink font-mono text-[10px] font-black px-4 h-full flex items-center flex-shrink-0 border-r-4 border-ink uppercase tracking-widest">
        Live
      </div>
      <div className="overflow-hidden flex-1">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="font-mono text-[10px] text-white/60 px-8 border-r border-white/10">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function NewsCard({ item }: { item: NewsItem }) {
  const cat = CATEGORY_CONFIG[item.category] ?? { color: '#0A0A0A', bg: '#F9FAFB' }
  const image = item.image_url || DEFAULT_IMAGES[item.category] || DEFAULT_IMAGES.Research

  return (
    <article
      className="border-4 border-ink overflow-hidden"
      style={{ boxShadow: `4px 4px 0px 0px ${cat.color}` }}
    >
      {/* Image */}
      {image && (
        <div className="relative border-b-4 border-ink overflow-hidden" style={{ height: '140px' }}>
          <img src={image} alt={item.headline} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ backgroundColor: cat.color + 'CC' }} />
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            <span
              className="font-mono text-[9px] font-black text-white border-2 border-white px-2 py-0.5 uppercase tracking-widest"
            >
              {item.category}
            </span>
            {item.is_featured && (
              <span className="font-mono text-[9px] font-black border-2 border-yellow-bright text-yellow-bright px-2 py-0.5 uppercase">
                ⭐ Featured
              </span>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-5 bg-canvas">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-mono text-[9px] text-ink/50">{new Date(item.published_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST</span>
        </div>

        <h3 className="font-display text-lg font-black text-ink leading-tight mb-2">
          {item.headline}
        </h3>
        <p className="text-sm text-ink/60 leading-relaxed mb-4">{item.summary}</p>

        <div className="flex items-center justify-between border-t-2 border-ink/10 pt-3">
          <div className="flex items-center gap-1.5 font-mono text-[9px] text-ink/40">
            <ExternalLink className="w-2.5 h-2.5" />
            {item.source_name}
          </div>
          <div className="flex items-center gap-2">
            {item.related_lesson_slug && (
              <Link
                href={`/lessons/${item.related_lesson_slug}`}
                className="font-mono text-[9px] font-black border-2 px-2 py-0.5 uppercase tracking-wider hover:bg-ink hover:text-white transition-colors flex items-center gap-1"
                style={{ borderColor: cat.color, color: cat.color }}
              >
                <BookOpen className="w-2.5 h-2.5" /> Related Lesson
              </Link>
            )}
            {item.source_url && (
              <a
                href={item.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[9px] font-black border-2 border-ink px-2 py-0.5 uppercase tracking-wider hover:bg-ink hover:text-white transition-colors"
              >
                Read Full →
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

function FeaturedCard({ item }: { item: NewsItem }) {
  const cat = CATEGORY_CONFIG[item.category] ?? { color: '#0A0A0A', bg: '#F9FAFB' }
  const image = item.image_url || DEFAULT_IMAGES[item.category] || DEFAULT_IMAGES.Research

  return (
    <article
      className="border-4 border-ink overflow-hidden col-span-1 md:col-span-2"
      style={{ boxShadow: `6px 6px 0px 0px ${cat.color}` }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Image */}
        <div className="relative border-r-4 border-ink overflow-hidden" style={{ minHeight: '240px' }}>
          <img src={image} alt={item.headline} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ backgroundColor: cat.color + 'CC' }} />
          <div className="absolute top-4 left-4">
            <span className="font-mono text-[9px] font-black text-white border-2 border-white px-2 py-0.5 uppercase tracking-widest">
              ⭐ Featured
            </span>
          </div>
          <div className="absolute bottom-4 left-4">
            <span
              className="font-mono text-[9px] font-black border-2 border-white bg-white px-2 py-0.5 uppercase"
              style={{ color: cat.color }}
            >
              {item.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col justify-between bg-canvas">
          <div>
            <div className="font-mono text-[9px] text-ink/40 mb-3">{item.source_name} · {new Date(item.published_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST</div>
            <h2 className="font-display text-2xl font-black text-ink leading-tight mb-3">{item.headline}</h2>
            <p className="text-sm text-ink/60 leading-relaxed">{item.summary}</p>
          </div>
          <div className="flex gap-2 mt-5">
            {item.related_lesson_slug && (
              <Link
                href={`/lessons/${item.related_lesson_slug}`}
                className="cn-btn text-xs border-4 flex items-center gap-1.5 py-2 px-3"
                style={{ backgroundColor: cat.color, borderColor: cat.color, color: 'white' }}
              >
                <BookOpen className="w-3.5 h-3.5" /> Study the Lesson
              </Link>
            )}
            {item.source_url && (
              <a
                href={item.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="cn-btn-black text-xs py-2 px-3"
              >
                Read Full Article <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function TodayPage() {
  const supabase = createClient()

  // Fetch today's updates from Supabase
  const today = new Date().toISOString().split('T')[0]
  const { data: todayItems } = await supabase
    .from('daily_updates')
    .select('*')
    .eq('publish_date', today)
    .eq('is_published', true)
    .order('is_featured', { ascending: false })
    .order('published_at', { ascending: true })

  const items: NewsItem[] = (todayItems as NewsItem[]) ?? []
  const featured = items.find((i) => i.is_featured)
  const rest = items.filter((i) => !i.is_featured)

  // Random quote
  const quote = QUOTES[new Date().getDay() % QUOTES.length]

  const dateStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  }).toUpperCase()

  return (
    <div className="min-h-screen bg-canvas">
      <div className="h-2 bg-yellow-bright" />
      <LiveTicker />

      {/* Hero */}
      <section className="border-b-4 border-ink bg-yellow-bright px-6 md:px-12 py-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-ink border-4 border-ink flex items-center justify-center">
                <Newspaper className="w-5 h-5 text-yellow-bright" />
              </div>
              <span className="font-mono text-[10px] font-black text-ink border-2 border-ink px-3 py-1 uppercase tracking-widest">Daily Pulse</span>
              <span className="font-mono text-[10px] font-black border-2 border-ink bg-ink text-yellow-bright px-3 py-1 uppercase tracking-widest">
                {items.length} STORIES
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-black text-ink leading-none">
              WHAT HAPPENED<br />
              <span className="italic">TODAY IN PLASTICS</span>
            </h1>
          </div>
          <div className="flex-shrink-0 text-right">
            <div className="font-mono text-[10px] font-bold text-ink/60 mb-1 uppercase tracking-wider">Edition</div>
            <div className="font-mono text-sm font-bold text-ink">{dateStr}</div>
          </div>
        </div>
      </section>

      {/* Market strip */}
      <section className="border-b-4 border-ink bg-ink">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 divide-x-4 divide-white/10">
          {MARKET_DATA.map((item) => (
            <div key={item.label} className="p-4">
              <div className="font-mono text-[9px] text-white/40 uppercase tracking-widest mb-1">{item.label}</div>
              <div className="font-mono text-sm font-black text-yellow-bright">{item.value}</div>
              <div className={`font-mono text-[9px] font-bold flex items-center gap-0.5 mt-0.5 ${item.up ? 'text-green-400' : 'text-red-400'}`}>
                {item.up ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                {item.delta} today
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {items.length === 0 ? (
          <div className="border-4 border-ink p-12 text-center shadow-hard">
            <div className="font-display text-2xl font-black text-ink mb-3">No stories published yet today</div>
            <p className="text-ink/60 mb-5 font-mono text-sm">Check back soon — stories are added each morning by 9 AM IST.</p>
            <Link href="/subjects" className="cn-btn-black text-sm">
              Browse All Lessons <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Feed */}
            <div className="lg:col-span-2 space-y-5">
              {/* Featured card */}
              {featured && (
                <div className="mb-2">
                  <FeaturedCard item={featured} />
                </div>
              )}

              {/* Rest of stories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {rest.map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">

              {/* On This Day */}
              <div className="border-4 border-ink overflow-hidden" style={{ boxShadow: `4px 4px 0px 0px ${ON_THIS_DAY.color}` }}>
                <div className="border-b-4 border-ink px-4 py-3 bg-ink">
                  <div className="font-mono text-[9px] font-black text-yellow-bright uppercase tracking-widest">{"// On This Day in Plastics"}</div>
                </div>
                <div className="p-5" style={{ backgroundColor: '#F5F3FF' }}>
                  <div className="font-display text-5xl font-black mb-2" style={{ color: ON_THIS_DAY.color }}>{ON_THIS_DAY.year}</div>
                  <h3 className="font-display text-lg font-black text-ink mb-2">{ON_THIS_DAY.headline}</h3>
                  <p className="text-sm text-ink/60 leading-relaxed">{ON_THIS_DAY.body}</p>
                </div>
              </div>

              {/* Trending polymers */}
              <div className="border-4 border-ink overflow-hidden shadow-hard">
                <div className="border-b-4 border-ink px-4 py-3 bg-yellow-bright">
                  <div className="font-mono text-[9px] font-black text-ink uppercase tracking-widest">{"// Trending This Week"}</div>
                </div>
                <div className="p-4 bg-canvas grid grid-cols-3 gap-2">
                  {TRENDING.map((mat, i) => (
                    <Link
                      key={mat}
                      href={`/materials?search=${mat}`}
                      className="border-4 border-ink p-2.5 text-center hover:bg-ink hover:text-white transition-colors group"
                      style={{ boxShadow: '2px 2px 0px 0px #0A0A0A' }}
                    >
                      <div className="font-mono text-sm font-black text-ink group-hover:text-white">{mat}</div>
                      <div className="font-mono text-[8px] text-ink/40 group-hover:text-white/60">#{i + 1}</div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Quote */}
              <div className="border-4 border-ink bg-ink p-5 shadow-hard">
                <div className="font-mono text-[9px] text-yellow-bright uppercase tracking-widest mb-3">{"// Quote of the Day"}</div>
                <p className="font-display text-lg font-black italic text-white leading-snug mb-2">&ldquo;{quote}&rdquo;</p>
                <p className="font-mono text-[9px] text-white/40 uppercase tracking-wider">— PolymerHub</p>
              </div>

              {/* AI Tutor */}
              <div className="border-4 border-ink overflow-hidden" style={{ backgroundColor: '#F0FDF4', boxShadow: '4px 4px 0px 0px #15803D' }}>
                <div className="border-b-4 border-ink px-4 py-3 bg-green">
                  <div className="font-mono text-[9px] font-black text-white uppercase tracking-widest">{"// AI Tutor"}</div>
                </div>
                <div className="p-5">
                  <p className="font-bold text-sm text-ink mb-3 leading-snug">Curious about today&apos;s news? Ask the AI Tutor how it connects to your lessons.</p>
                  <Link href="/ai-tutor" className="cn-btn-black w-full justify-center text-xs">
                    <Brain className="w-3.5 h-3.5" /> Ask Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer band */}
      <section className="border-t-4 border-ink bg-yellow-bright px-6 md:px-12 py-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-display text-2xl font-black text-ink">Stay connected to the sector every day.</p>
            <p className="font-mono text-xs text-ink/60 mt-1">Updated every morning · Market data · Research · India focus</p>
          </div>
          <Link href="/subjects" className="cn-btn-black text-sm flex-shrink-0">
            Back to Learning <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
