import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft, ArrowRight, Lock, Brain, ChevronRight } from 'lucide-react'


// ─── Domain color map ─────────────────────────────────────────────────────────

const DOMAIN = {
  'polymer-chemistry':        { color: '#1D4ED8', bg: '#EFF6FF', label: 'Chemistry & Science', tag: 'Foundation' },
  'polymer-processing':       { color: '#EA580C', bg: '#FFF7ED', label: 'Processing & Manufacturing', tag: 'Manufacturing' },
  'mould-design':             { color: '#EA580C', bg: '#FFF7ED', label: 'Processing & Manufacturing', tag: 'Engineering' },
  'polymer-testing':          { color: '#7C3AED', bg: '#F5F3FF', label: 'Testing & QA/QC', tag: 'QA / QC' },
  'rubber-technology':        { color: '#EA580C', bg: '#FFF7ED', label: 'Processing & Manufacturing', tag: 'Elastomers' },
  'recycling-technology':     { color: '#15803D', bg: '#F0FDF4', label: 'Circular Economy', tag: 'Recycling' },
  'sustainable-plastics':     { color: '#15803D', bg: '#F0FDF4', label: 'Circular Economy', tag: 'Bioplastics' },
  'polymer-composites':       { color: '#1D4ED8', bg: '#EFF6FF', label: 'Advanced Materials', tag: 'Composites' },
  'entrepreneurship-plastics':{ color: '#CA8A04', bg: '#FEFCE8', label: 'Business', tag: 'Entrepreneurship' },
  'medical-plastics':         { color: '#7C3AED', bg: '#F5F3FF', label: 'Specialised', tag: 'Medical' },
} as const

type SubjectSlug = keyof typeof DOMAIN

// ─── Markdown-to-HTML renderer (simple, no external deps) ────────────────────

function renderContent(markdown: string, domainColor: string): string {
  let html = markdown

  // Code blocks
  html = html.replace(/```[\w]*\n?([\s\S]*?)```/g, (_, code) =>
    `<pre class="border-4 border-ink bg-ink text-green-400 font-mono text-sm p-5 overflow-x-auto my-6 shadow-hard"><code>${code.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`
  )

  // Tables
  html = html.replace(/(\|.+\|\n)+/g, (table) => {
    const rows = table.trim().split('\n')
    const headerRow = rows[0]
    const bodyRows = rows.slice(2)
    const headers = headerRow.split('|').filter(Boolean).map((h) => h.trim())
    const bodyHtml = bodyRows
      .map((row) => {
        const cells = row.split('|').filter(Boolean).map((c) => c.trim())
        return `<tr class="border-b-2 border-ink">${cells.map((c) => `<td class="px-4 py-2.5 text-sm text-ink">${c}</td>`).join('')}</tr>`
      })
      .join('')
    return `<div class="overflow-x-auto my-6"><table class="w-full border-4 border-ink shadow-hard">
      <thead><tr class="border-b-4 border-ink" style="background:${domainColor}">
        ${headers.map((h) => `<th class="px-4 py-3 text-left font-mono text-xs font-bold text-white uppercase tracking-wider">${h}</th>`).join('')}
      </tr></thead>
      <tbody class="bg-canvas">${bodyHtml}</tbody>
    </table></div>`
  })

  // H2 — section headers with domain color left border
  html = html.replace(/^## (.+)$/gm, (_, text) =>
    `<h2 class="font-display text-2xl font-black text-ink mt-10 mb-4 pb-3 border-b-4 border-ink flex items-center gap-3">
      <span class="w-2 h-8 flex-shrink-0" style="background:${domainColor}"></span>
      ${text}
    </h2>`
  )

  // H3
  html = html.replace(/^### (.+)$/gm, (_, text) =>
    `<h3 class="font-display text-xl font-black text-ink mt-8 mb-3">${text}</h3>`
  )

  // HR — becomes a domain-color divider
  html = html.replace(/^---$/gm,
    `<div class="border-t-4 border-ink my-8" style="border-color:#0A0A0A"></div>`
  )

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, `<strong class="font-black text-ink">$1</strong>`)

  // Inline code
  html = html.replace(/`([^`]+)`/g,
    `<code class="font-mono text-xs font-bold px-2 py-0.5 border-2 border-ink" style="background:${domainColor}20;color:${domainColor}">$1</code>`
  )

  // Unordered list items
  html = html.replace(/^- (.+)$/gm, (_, text) =>
    `<li class="flex items-start gap-3 mb-2">
      <span class="w-3 h-3 border-2 border-ink flex-shrink-0 mt-1" style="background:${domainColor}"></span>
      <span class="text-ink/80 leading-relaxed">${text}</span>
    </li>`
  )
  html = html.replace(/(<li.+<\/li>\n?)+/g, (match) =>
    `<ul class="space-y-1 my-4">${match}</ul>`
  )

  // Paragraphs
  html = html.replace(/^(?!<[a-z]).+$/gm, (line) => {
    if (!line.trim()) return ''
    return `<p class="text-ink/80 leading-relaxed my-4">${line}</p>`
  })

  // Clean up multiple newlines
  html = html.replace(/\n{3,}/g, '\n\n')

  return html
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function LessonPage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = createClient()

  // Fetch lesson + subject
  const { data: lesson } = await supabase
    .from('lessons')
    .select('*, subjects(name, slug)')
    .eq('slug', params.slug)
    .single()

  if (!lesson) notFound()

  const subjectsData = lesson.subjects as unknown as { name: string; slug: string }
  const subjectSlug = subjectsData?.slug ?? ''

  // Fetch user session
  const { data: { session } } = await supabase.auth.getSession()

  // Fetch user profile for subscription status
  let isPremium = false
  if (session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status')
      .eq('id', session.user.id)
      .single()
    isPremium = profile?.subscription_status === 'premium'
  }

  // Fetch adjacent lessons (prev/next)
  const { data: allLessons } = await supabase
    .from('lessons')
    .select('id, title, slug, order_index, is_premium')
    .eq('subject_id', lesson.subject_id)
    .order('order_index')

  const currentIndex = allLessons?.findIndex((l) => l.id === lesson.id) ?? -1
  const prevLesson = currentIndex > 0 ? allLessons![currentIndex - 1] : null
  const nextLesson = currentIndex < (allLessons?.length ?? 0) - 1 ? allLessons![currentIndex + 1] : null

  const domain = DOMAIN[subjectSlug as SubjectSlug] ?? { color: '#1D4ED8', bg: '#EFF6FF', label: 'Polymer Engineering', tag: 'Lesson' }
  const isLocked = lesson.is_premium && !isPremium && !session

  const renderedContent = !isLocked ? renderContent(lesson.content, domain.color) : ''

  return (
    <div className="min-h-screen bg-canvas">

      {/* Domain color top bar */}
      <div className="h-2 w-full" style={{ backgroundColor: domain.color }} />

      {/* Breadcrumb */}
      <div className="border-b-4 border-ink px-6 md:px-10 py-3 flex items-center gap-2 overflow-x-auto whitespace-nowrap" style={{ backgroundColor: domain.bg }}>
        <Link href="/subjects" className="font-mono text-[10px] font-bold text-ink/50 hover:text-ink uppercase tracking-wider transition-colors">
          Subjects
        </Link>
        <ChevronRight className="w-3 h-3 text-ink/40 flex-shrink-0" />
        <Link
          href={`/subjects/${subjectSlug}`}
          className="font-mono text-[10px] font-bold uppercase tracking-wider hover:text-ink transition-colors flex-shrink-0"
          style={{ color: domain.color }}
        >
          {subjectsData?.name}
        </Link>
        <ChevronRight className="w-3 h-3 text-ink/40 flex-shrink-0" />
        <span className="font-mono text-[10px] font-bold text-ink uppercase tracking-wider truncate">{lesson.title}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* ── MAIN CONTENT ─────────────────────────────────── */}
          <article className="lg:col-span-3">

            {/* Lesson header */}
            <div className="border-4 border-ink p-6 md:p-8 mb-6 relative overflow-hidden" style={{ boxShadow: `6px 6px 0px 0px ${domain.color}` }}>
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full" style={{ backgroundColor: domain.color, filter: 'blur(20px)' }} />

              <div className="flex items-center gap-3 mb-4">
                <span
                  className="font-mono text-[10px] font-black border-2 border-ink px-3 py-1 uppercase tracking-widest"
                  style={{ backgroundColor: domain.color, color: 'white' }}
                >
                  {domain.tag}
                </span>
                <span className="font-mono text-[10px] text-ink/50 border-2 border-ink/20 px-3 py-1 uppercase tracking-wider">
                  Lesson {lesson.order_index}
                </span>
                {lesson.is_premium && (
                  <span className="font-mono text-[10px] font-black border-2 border-yellow bg-yellow-light text-yellow px-3 py-1 uppercase tracking-wider flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> Premium
                  </span>
                )}
              </div>

              <h1 className="font-display text-3xl md:text-4xl font-black text-ink leading-tight mb-4">
                {lesson.title}
              </h1>

              <p className="text-ink/70 text-base leading-relaxed border-l-4 pl-4" style={{ borderColor: domain.color }}>
                {lesson.summary}
              </p>
            </div>

            {/* Locked state */}
            {isLocked ? (
              <div className="border-4 border-ink p-8 md:p-12 text-center" style={{ boxShadow: '6px 6px 0px 0px #0A0A0A' }}>
                <div className="w-16 h-16 border-4 border-ink mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: domain.color }}>
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h2 className="font-display text-3xl font-black text-ink mb-3">Premium Lesson</h2>
                <p className="text-ink/70 mb-8 max-w-md mx-auto leading-relaxed">
                  This lesson is part of the premium curriculum. Unlock all 60 lessons for ₹149/month.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/pricing" className="cn-btn-yellow text-sm justify-center">
                    Get Premium — ₹149/mo <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/login" className="cn-btn-black text-sm justify-center">
                    Sign In
                  </Link>
                </div>
              </div>
            ) : (
              /* Lesson content */
              <div
                className="border-4 border-ink p-6 md:p-8 bg-canvas"
                style={{ boxShadow: `4px 4px 0px 0px ${domain.color}` }}
              >
                <div
                  className="prose prose-base max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderedContent }}
                />
              </div>
            )}

            {/* Prev / Next navigation */}
            {!isLocked && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {prevLesson ? (
                  <Link
                    href={`/lessons/${prevLesson.slug}`}
                    className="border-4 border-ink p-4 flex items-center gap-3 hover:bg-ink hover:text-white group transition-colors shadow-hard"
                  >
                    <ArrowLeft className="w-5 h-5 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="font-mono text-[9px] text-ink/50 group-hover:text-white/50 uppercase tracking-wider mb-0.5">Previous</div>
                      <div className="font-bold text-sm leading-tight truncate">{prevLesson.title}</div>
                    </div>
                  </Link>
                ) : <div />}

                {nextLesson ? (
                  <Link
                    href={`/lessons/${nextLesson.slug}`}
                    className="border-4 border-ink p-4 flex items-center justify-end gap-3 text-right transition-colors next-lesson-link hover:text-white group"
                    style={{ boxShadow: `4px 4px 0px 0px ${domain.color}`, backgroundColor: domain.bg }}
                  >
                    <style dangerouslySetInnerHTML={{ __html: `
                      .next-lesson-link:hover {
                        background-color: ${domain.color} !important;
                        color: white !important;
                      }
                    ` }} />
                    <div className="min-w-0">
                      <div className="font-mono text-[9px] text-ink/50 uppercase tracking-wider mb-0.5 group-hover:text-white/50">Next Lesson</div>
                      <div className="font-black text-sm leading-tight truncate">{nextLesson.title}</div>
                    </div>
                    <ArrowRight className="w-5 h-5 flex-shrink-0" />
                  </Link>
                ) : (
                  <Link
                    href={`/subjects/${subjectSlug}`}
                    className="border-4 border-ink p-4 flex items-center justify-end gap-3 text-right hover:bg-ink hover:text-white transition-colors shadow-hard"
                  >
                    <div>
                      <div className="font-mono text-[9px] text-ink/50 uppercase tracking-wider mb-0.5">Subject Complete</div>
                      <div className="font-black text-sm">Back to {subjectsData?.name}</div>
                    </div>
                    <ArrowRight className="w-5 h-5 flex-shrink-0" />
                  </Link>
                )}
              </div>
            )}
          </article>

          {/* ── SIDEBAR ──────────────────────────────────────── */}
          <aside className="lg:col-span-1 space-y-4">

            {/* Subject progress */}
            <div className="border-4 border-ink" style={{ boxShadow: `4px 4px 0px 0px ${domain.color}` }}>
              <div className="border-b-4 border-ink p-4" style={{ backgroundColor: domain.color }}>
                <div className="font-mono text-[10px] font-black text-white uppercase tracking-widest mb-1">{domain.label}</div>
                <div className="font-display text-lg font-black text-white leading-tight">{subjectsData?.name}</div>
              </div>
              <div className="bg-canvas divide-y-2 divide-ink/10">
                {allLessons?.map((l, i) => {
                  const isCurrent = l.id === lesson.id
                  const isLessonLocked = l.is_premium && !isPremium
                  return (
                    <Link
                      key={l.id}
                      href={`/lessons/${l.slug}`}
                      className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                        isCurrent
                          ? 'text-white'
                          : isLessonLocked
                          ? 'opacity-50 hover:opacity-70'
                          : 'hover:bg-ink/5'
                      }`}
                      style={isCurrent ? { backgroundColor: domain.color } : {}}
                    >
                      <span
                        className="font-mono text-[10px] font-black w-5 h-5 border-2 flex items-center justify-center flex-shrink-0"
                        style={{
                          borderColor: isCurrent ? 'white' : domain.color,
                          color: isCurrent ? 'white' : domain.color,
                        }}
                      >
                        {i + 1}
                      </span>
                      <span className={`text-xs leading-tight flex-1 font-medium ${isCurrent ? 'text-white font-bold' : 'text-ink'}`}>
                        {l.title}
                      </span>
                      {isLessonLocked && !isCurrent && <Lock className="w-3 h-3 text-ink/40 flex-shrink-0" />}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* AI Tutor */}
            <div className="border-4 border-ink bg-ink" style={{ boxShadow: '4px 4px 0px 0px #0A0A0A' }}>
              <div className="border-b-4 border-white/20 p-4">
                <div className="font-mono text-[10px] font-bold text-yellow-bright uppercase tracking-widest mb-1">AI Tutor</div>
                <p className="text-white/80 text-sm">Question about this lesson?</p>
              </div>
              <div className="p-4">
                <Link href="/ai-tutor" className="cn-btn-yellow w-full justify-center text-xs">
                  <Brain className="w-3.5 h-3.5" /> Ask AI Tutor
                </Link>
              </div>
            </div>

            {/* Pricing — for non-premium */}
            {!isPremium && (
              <div
                className="border-4 border-ink p-5"
                style={{ backgroundColor: domain.bg, boxShadow: `4px 4px 0px 0px ${domain.color}` }}
              >
                <div
                  className="font-mono text-[10px] font-black border-2 border-ink px-2 py-0.5 mb-3 inline-block uppercase tracking-wider"
                  style={{ backgroundColor: domain.color, color: 'white' }}
                >
                  Premium
                </div>
                <p className="font-display text-lg font-black text-ink leading-tight mb-2">
                  Unlock all 60 lessons
                </p>
                <p className="text-xs text-ink/60 mb-4 leading-relaxed">
                  ₹149/month. Cancel anytime. Unlimited AI Tutor queries.
                </p>
                <Link href="/pricing" className="cn-btn-black w-full justify-center text-xs">
                  Get Premium <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* Back to subject */}
            <Link
              href={`/subjects/${subjectSlug}`}
              className="border-4 border-ink px-4 py-3 flex items-center gap-2 hover:bg-ink hover:text-white transition-colors w-full shadow-hard"
            >
              <ArrowLeft className="w-4 h-4 flex-shrink-0" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider">Back to Subject</span>
            </Link>
          </aside>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = createClient()
  const { data: lesson } = await supabase
    .from('lessons')
    .select('title, summary')
    .eq('slug', params.slug)
    .single()

  if (!lesson) return { title: 'Lesson Not Found' }

  return {
    title: lesson.title,
    description: lesson.summary,
  }
}
