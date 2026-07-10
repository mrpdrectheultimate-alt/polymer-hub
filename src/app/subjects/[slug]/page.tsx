import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ArrowRight, ArrowLeft, Lock, Brain, BookOpen, ChevronRight } from 'lucide-react'

// ─── Domain color map ─────────────────────────────────────────────────────────

const DOMAIN: Record<string, {
  color: string; bg: string; light: string; label: string; tag: string
  image: string; quote: string; quoteAuthor: string
}> = {
  'polymer-chemistry': {
    color: '#1D4ED8', bg: '#EFF6FF', light: '#DBEAFE', label: 'Chemistry & Science', tag: 'Foundation',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&q=80',
    quote: 'Understanding the molecule is understanding the material. Everything else is engineering from that foundation.',
    quoteAuthor: 'Polymer Chemistry · PolymerHub',
  },
  'polymer-processing': {
    color: '#EA580C', bg: '#FFF7ED', light: '#FED7AA', label: 'Processing & Manufacturing', tag: 'Manufacturing',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200&q=80',
    quote: 'Every finished plastic product is the result of someone making thousands of decisions about temperature, pressure, and time.',
    quoteAuthor: 'Polymer Processing · PolymerHub',
  },
  'mould-design': {
    color: '#EA580C', bg: '#FFF7ED', light: '#FED7AA', label: 'Processing & Manufacturing', tag: 'Engineering',
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=1200&q=80',
    quote: 'The mould is where polymer science meets mechanical engineering. Getting it right before cutting steel saves everything.',
    quoteAuthor: 'Mould Design · PolymerHub',
  },
  'polymer-testing': {
    color: '#7C3AED', bg: '#F5F3FF', light: '#DDD6FE', label: 'Testing & QA/QC', tag: 'QA / QC',
    image: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=1200&q=80',
    quote: 'A number on a datasheet is only as trustworthy as the test that produced it.',
    quoteAuthor: 'Polymer Testing · PolymerHub',
  },
  'rubber-technology': {
    color: '#EA580C', bg: '#FFF7ED', light: '#FED7AA', label: 'Processing & Manufacturing', tag: 'Elastomers',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    quote: 'Vulcanization turned a sticky, unusable material into the product that put the world on wheels.',
    quoteAuthor: 'Rubber Technology · PolymerHub',
  },
  'recycling-technology': {
    color: '#15803D', bg: '#F0FDF4', light: '#BBF7D0', label: 'Circular Economy', tag: 'Recycling',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1200&q=80',
    quote: 'The engineer who understands recycling at molecular level has the rarest skill in the industry right now.',
    quoteAuthor: 'Recycling Technology · PolymerHub',
  },
  'sustainable-plastics': {
    color: '#15803D', bg: '#F0FDF4', light: '#BBF7D0', label: 'Circular Economy', tag: 'Bioplastics',
    image: 'https://images.unsplash.com/photo-1569427830807-c1429cbabed9?w=1200&q=80',
    quote: 'Bio-based does not mean biodegradable. Understanding the difference is the first thing a sustainable plastics engineer must learn.',
    quoteAuthor: 'Sustainable Plastics · PolymerHub',
  },
  'polymer-composites': {
    color: '#1D4ED8', bg: '#EFF6FF', light: '#BFDBFE', label: 'Advanced Materials', tag: 'Composites',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=1200&q=80',
    quote: 'Carbon fibre reinforced polymers are stronger than steel at one-fifth the weight. That is not magic. That is engineering.',
    quoteAuthor: 'Polymer Composites · PolymerHub',
  },
  'entrepreneurship-plastics': {
    color: '#CA8A04', bg: '#FEFCE8', light: '#FEF08A', label: 'Business', tag: 'Entrepreneurship',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80',
    quote: 'Your polymer engineering degree is the moat most plastics business owners simply cannot replicate.',
    quoteAuthor: 'Entrepreneurship in Plastics · PolymerHub',
  },
  'medical-plastics': {
    color: '#7C3AED', bg: '#F5F3FF', light: '#DDD6FE', label: 'Specialised Applications', tag: 'Medical',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&q=80',
    quote: 'A failure in automotive plastic is a warranty claim. A failure in a medical polymer device can cost a life.',
    quoteAuthor: 'Medical Plastics · PolymerHub',
  },
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SubjectDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = createClient()

  // Fetch subject
  const { data: subject } = await supabase
    .from('subjects')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!subject) notFound()

  // Fetch lessons
  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, title, slug, summary, order_index, is_premium')
    .eq('subject_id', subject.id)
    .order('order_index')

  // Session + subscription
  const { data: { session } } = await supabase.auth.getSession()
  let isPremium = false
  if (session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status')
      .eq('id', session.user.id)
      .single()
    isPremium = profile?.subscription_status === 'premium'
  }

  const domain = DOMAIN[params.slug] ?? {
    color: '#1D4ED8', bg: '#EFF6FF', light: '#BFDBFE', label: 'Polymer Engineering', tag: 'Subject',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&q=80',
    quote: 'The fundamentals of polymer engineering never go out of date.', quoteAuthor: 'PolymerHub',
  }

  const totalLessons = lessons?.length ?? 0
  const freeLessons = lessons?.filter((l) => !l.is_premium).length ?? 0

  return (
    <div className="min-h-screen bg-canvas">

      {/* Domain top accent */}
      <div className="h-2" style={{ backgroundColor: domain.color }} />

      {/* Breadcrumb */}
      <div className="border-b-4 border-ink px-6 md:px-10 py-3 flex items-center gap-2" style={{ backgroundColor: domain.bg }}>
        <Link href="/subjects" className="font-mono text-[10px] font-bold text-ink/50 hover:text-ink uppercase tracking-wider transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Subjects
        </Link>
        <ChevronRight className="w-3 h-3 text-ink/40" />
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider" style={{ color: domain.color }}>
          {subject.name}
        </span>
      </div>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="border-b-4 border-ink relative overflow-hidden" style={{ minHeight: '380px' }}>
        <img
          src={domain.image}
          alt={subject.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ backgroundColor: domain.color + 'E0' }} />

        {/* Floating blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 animate-blob-pulse" style={{ backgroundColor: 'white', filter: 'blur(50px)' }} />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 rounded-full opacity-10 animate-blob-pulse" style={{ backgroundColor: 'white', filter: 'blur(30px)', animationDelay: '3s' }} />

        <div className="relative px-6 md:px-12 py-12 md:py-16 max-w-5xl mx-auto">

          {/* Tag + lesson count */}
          <div className="flex items-center gap-3 mb-5">
            <span className="font-mono text-[10px] font-black text-white border-2 border-white px-3 py-1 uppercase tracking-widest">
              {domain.tag}
            </span>
            <span className="font-mono text-[10px] font-bold text-white/70 border-2 border-white/40 px-3 py-1 uppercase tracking-wider">
              {totalLessons} Lessons
            </span>
            {freeLessons > 0 && (
              <span className="font-mono text-[10px] font-bold border-2 px-3 py-1 uppercase tracking-wider" style={{ backgroundColor: '#FACC15', color: '#0A0A0A', borderColor: '#FACC15' }}>
                {freeLessons} Free
              </span>
            )}
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-black text-white leading-none mb-5 max-w-3xl">
            {subject.name.toUpperCase()}
          </h1>

          <p className="text-white/80 text-lg max-w-2xl leading-relaxed mb-8">
            {subject.description}
          </p>

          {/* Start and Practice buttons */}
          <div className="flex flex-wrap gap-4">
            {lessons && lessons.length > 0 && (
              <Link
                href={`/lessons/${lessons[0].slug}`}
                className="cn-btn bg-yellow-bright text-ink border-white font-black"
              >
                Start Lesson 1 <ArrowRight className="w-5 h-5" />
              </Link>
            )}
            <Link
              href={`/subjects/${params.slug}/practice`}
              className="cn-btn bg-white text-ink border-white font-black"
            >
              Take Practice Quiz <BookOpen className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── QUOTE BREAKER ──────────────────────────────────── */}
      <section className="border-b-4 border-ink px-6 md:px-12 py-10 bg-ink">
        <div className="max-w-4xl mx-auto">
          <p className="font-display text-2xl md:text-3xl font-black italic leading-tight mb-3" style={{ color: '#FACC15' }}>
            &ldquo;{domain.quote}&rdquo;
          </p>
          <p className="font-mono text-xs text-white/40 uppercase tracking-widest">— {domain.quoteAuthor}</p>
        </div>
      </section>

      {/* ── LESSONS GRID ───────────────────────────────────── */}
      <section className="px-6 md:px-10 py-10">
        <div className="max-w-6xl mx-auto">

          {/* Section header */}
          <div className="flex items-center justify-between mb-6 border-b-4 border-ink pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-4 border-ink flex items-center justify-center" style={{ backgroundColor: domain.color }}>
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <h2 className="font-display text-2xl font-black text-ink uppercase">
                {totalLessons} Lessons
              </h2>
            </div>
            <span className="font-mono text-[10px] text-ink/50 border-2 border-ink/20 px-3 py-1 uppercase tracking-wider">
              {freeLessons} free · {totalLessons - freeLessons} premium
            </span>
          </div>

          {/* Lesson cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {lessons?.map((lesson, index) => {
              const isLocked = lesson.is_premium && !isPremium

              return (
                <Link
                  key={lesson.id}
                  href={`/lessons/${lesson.slug}`}
                  className={`group block border-4 border-ink overflow-hidden transition-all duration-150 lesson-card-${lesson.id}`}
                  style={{
                    boxShadow: isLocked ? '4px 4px 0px 0px #6B7280' : `4px 4px 0px 0px ${domain.color}`,
                    opacity: isLocked ? 0.75 : 1,
                  }}
                >
                  <style dangerouslySetInnerHTML={{ __html: `
                    .lesson-card-${lesson.id}:hover {
                      transform: translate(-2px, -2px);
                      box-shadow: ${isLocked ? '6px 6px 0px 0px #6B7280' : `6px 6px 0px 0px ${domain.color}`} !important;
                    }
                  ` }} />
                  {/* Card header */}
                  <div
                    className="border-b-4 border-ink px-5 py-3 flex items-center justify-between"
                    style={{ backgroundColor: index === 0 ? domain.color : domain.bg }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="font-mono text-xs font-black w-7 h-7 border-2 flex items-center justify-center flex-shrink-0"
                        style={{
                          borderColor: index === 0 ? 'white' : domain.color,
                          color: index === 0 ? 'white' : domain.color,
                          backgroundColor: index === 0 ? 'transparent' : domain.light,
                        }}
                      >
                        {lesson.order_index}
                      </span>
                      <span
                        className="font-mono text-[9px] font-bold border-2 px-2 py-0.5 uppercase tracking-wider"
                        style={{
                          borderColor: index === 0 ? 'white' : domain.color,
                          color: index === 0 ? 'white' : domain.color,
                          backgroundColor: 'transparent',
                        }}
                      >
                        {lesson.is_premium ? 'Premium' : 'Free'}
                      </span>
                    </div>
                    {isLocked ? (
                      <Lock className="w-4 h-4" style={{ color: index === 0 ? 'white' : domain.color }} />
                    ) : (
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: index === 0 ? 'white' : domain.color }} />
                    )}
                  </div>

                  {/* Card body */}
                  <div className="p-5 bg-canvas">
                    <h3
                      className="font-display text-lg font-black text-ink leading-tight mb-2 group-hover:underline"
                      style={{ textDecorationColor: domain.color }}
                    >
                      {lesson.title}
                    </h3>
                    <p className="text-sm text-ink/60 leading-relaxed">{lesson.summary}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── PREMIUM CTA ────────────────────────────────────── */}
      {!isPremium && (
        <section className="border-t-4 border-ink px-6 md:px-12 py-12">
          <div className="max-w-4xl mx-auto border-4 border-ink p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6"
            style={{ backgroundColor: domain.bg, boxShadow: `6px 6px 0px 0px ${domain.color}` }}
          >
            <div>
              <div
                className="font-mono text-[10px] font-black border-2 border-ink px-3 py-1 mb-3 inline-block uppercase tracking-wider"
                style={{ backgroundColor: domain.color, color: 'white' }}
              >
                Premium · ₹149/month
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-black text-ink leading-tight mb-2">
                Unlock all {totalLessons} lessons in this subject
              </h2>
              <p className="text-ink/60 text-sm leading-relaxed">
                Unlimited AI Tutor queries · All 10 subjects · Cancel anytime
              </p>
            </div>
            <div className="flex flex-col gap-3 flex-shrink-0">
              <Link href="/pricing" className="cn-btn-black text-sm justify-center">
                Get Premium <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/login" className="cn-btn text-sm justify-center bg-white text-ink border-ink">
                Sign In
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── AI TUTOR + OTHER SUBJECTS ──────────────────────── */}
      <section className="border-t-4 border-ink bg-ink px-6 md:px-12 py-10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="font-mono text-[10px] font-bold text-yellow-bright border-2 border-yellow-bright px-3 py-1 mb-3 inline-block uppercase tracking-widest">
              AI Tutor · Gemini RAG
            </div>
            <h2 className="font-display text-2xl font-black text-white leading-tight mb-2">
              Questions about {subject.name}?
            </h2>
            <p className="text-white/60 text-sm">
              The AI Tutor is trained on all {totalLessons} lessons in this subject.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link href={`/subjects/${params.slug}/practice`} className="cn-btn-yellow text-sm font-black">
              Take Practice Quiz
            </Link>
            <Link href="/ai-tutor" className="cn-btn-white text-sm">
              <Brain className="w-4 h-4" /> Ask AI Tutor
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = createClient()
  const { data: subject } = await supabase
    .from('subjects')
    .select('name, description')
    .eq('slug', params.slug)
    .single()

  if (!subject) return { title: 'Subject Not Found' }

  return {
    title: `${subject.name} — PolymerHub`,
    description: subject.description,
  }
}
