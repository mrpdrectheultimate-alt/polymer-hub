'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowRight, Brain, BookOpen, Zap, Flame, Trophy, ChevronRight, User, Clock } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Profile = {
  id: string
  email: string
  full_name: string | null
  subscription_status: string | null
  ai_queries_today: number | null
  ai_queries_reset_at: string | null
  created_at: string
}

type Subject = {
  id: string
  name: string
  slug: string
  order_index: number
}

type Lesson = {
  id: string
  title: string
  slug: string
  subject_id: string
  order_index: number
  is_premium: boolean
}

const SUBJECT_COLORS: Record<string, { color: string; bg: string }> = {
  'polymer-chemistry':         { color: '#1D4ED8', bg: '#EFF6FF' },
  'polymer-processing':        { color: '#EA580C', bg: '#FFF7ED' },
  'mould-design':              { color: '#EA580C', bg: '#FFF7ED' },
  'polymer-testing':           { color: '#7C3AED', bg: '#F5F3FF' },
  'rubber-technology':         { color: '#EA580C', bg: '#FFF7ED' },
  'recycling-technology':      { color: '#15803D', bg: '#F0FDF4' },
  'sustainable-plastics':      { color: '#15803D', bg: '#F0FDF4' },
  'polymer-composites':        { color: '#1D4ED8', bg: '#EFF6FF' },
  'entrepreneurship-plastics': { color: '#CA8A04', bg: '#FEFCE8' },
  'medical-plastics':          { color: '#7C3AED', bg: '#F5F3FF' },
}

const QUICK_LINKS = [
  { label: 'AI Tutor', href: '/ai-tutor', icon: Brain, color: '#15803D', bg: '#F0FDF4' },
  { label: 'Practice Quiz', href: '/practice', icon: Zap, color: '#CA8A04', bg: '#FEFCE8' },
  { label: 'Daily Pulse', href: '/today', icon: Flame, color: '#EA580C', bg: '#FFF7ED' },
  { label: 'Comparator', href: '/comparator', icon: Trophy, color: '#1D4ED8', bg: '#EFF6FF' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [recentLessons, setRecentLessons] = useState<string[]>([]) // lesson slugs from localStorage

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { window.location.href = '/login'; return }

      const [{ data: prof }, { data: subs }, { data: less }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', session.user.id).single(),
        supabase.from('subjects').select('id, name, slug, order_index').order('order_index'),
        supabase.from('lessons').select('id, title, slug, subject_id, order_index, is_premium').order('order_index'),
      ])

      let activeProfile = prof
      if (!activeProfile) {
        const defaultName = session.user.email ? session.user.email.split('@')[0] : 'Student'
        const { data: newProf } = await supabase
          .from('profiles')
          .insert({
            id: session.user.id,
            full_name: defaultName,
            subscription_status: 'free',
            ai_queries_today: 0,
            avatar_url: null,
            bio: null,
            goals: null,
            college_name: null,
            education_level: null,
            branch: 'B.Tech Plastic Polymer Engineering',
            graduation_year: null,
            target_path: null,
          })
          .select()
          .single()

        if (newProf) {
          activeProfile = newProf
        }
      }

      if (activeProfile) {
        setProfile({ ...activeProfile, email: session.user.email ?? '' })
      }
      if (subs) setSubjects(subs)
      if (less) setLessons(less)

      // Recent lessons from localStorage
      const recent = JSON.parse(localStorage.getItem('ph_recent_lessons') ?? '[]')
      setRecentLessons(recent.slice(0, 3))

      setLoading(false)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="border-4 border-ink p-8 text-center shadow-hard">
          <div className="font-display text-2xl font-black text-ink animate-pulse">Loading your dashboard...</div>
        </div>
      </div>
    )
  }

  if (!profile) return null

  const isPremium = profile.subscription_status === 'premium'
  const aiQueriesUsed = profile.ai_queries_today ?? 0
  const aiQueriesMax = isPremium ? 999 : 15
  const aiQueriesLeft = Math.max(0, aiQueriesMax - aiQueriesUsed)
  const joinDate = new Date(profile.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  // Lessons grouped by subject
  const lessonsBySubject = subjects.map((s) => ({
    subject: s,
    lessons: lessons.filter((l) => l.subject_id === s.id).sort((a, b) => a.order_index - b.order_index),
  }))

  // Recent lesson objects
  const recentLessonObjects = recentLessons
    .map((slug) => lessons.find((l) => l.slug === slug))
    .filter(Boolean) as Lesson[]

  return (
    <div className="min-h-screen bg-canvas">
      <div className="h-2 bg-blue animate-pulse" />

      {/* Header */}
      <section className="border-b-4 border-ink bg-ink px-6 md:px-12 py-8">
        <div className="max-w-6xl mx-auto flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-bright border-4 border-yellow-bright flex items-center justify-center">
                <User className="w-5 h-5 text-ink" />
              </div>
              <div>
                <div className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Your Dashboard</div>
                <div className="font-display text-xl font-black text-white leading-tight">
                  {profile.full_name || profile.email.split('@')[0]}
                </div>
              </div>
            </div>
            <div className="font-mono text-[9px] text-white/40 mt-1">Member since {joinDate}</div>
          </div>
          <div className="flex items-center gap-3">
            {isPremium ? (
              <span className="font-mono text-[10px] font-black border-2 border-yellow-bright text-yellow-bright px-3 py-1 uppercase tracking-widest">
                ⭐ Premium
              </span>
            ) : (
              <Link href="/pricing" className="cn-btn-yellow text-xs">
                Upgrade to Premium <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT COLUMN ──────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Stats strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { val: `${aiQueriesLeft}`, label: 'AI queries left today', color: '#15803D', bg: '#F0FDF4', sub: isPremium ? 'Unlimited' : `of ${aiQueriesMax}` },
                { val: `${subjects.length}`, label: 'Subjects available', color: '#1D4ED8', bg: '#EFF6FF', sub: '10 total' },
                { val: `${lessons.filter((l) => !l.is_premium).length}`, label: 'Free lessons', color: '#EA580C', bg: '#FFF7ED', sub: `of ${lessons.length} total` },
                { val: isPremium ? '∞' : '15', label: 'AI queries/day', color: '#7C3AED', bg: '#F5F3FF', sub: isPremium ? 'Premium' : 'Free tier' },
              ].map((s) => (
                <div key={s.label} className="border-4 border-ink p-4 text-center shadow-hard-sm" style={{ backgroundColor: s.bg }}>
                  <div className="font-display text-3xl font-black" style={{ color: s.color }}>{s.val}</div>
                  <div className="font-mono text-[8px] text-ink/50 uppercase tracking-wider mt-0.5 leading-snug">{s.label}</div>
                  <div className="font-mono text-[8px] font-bold mt-1" style={{ color: s.color }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* AI Tutor query bar */}
            {!isPremium && (
              <div className="border-4 border-ink overflow-hidden shadow-hard">
                <div className="border-b-4 border-ink px-4 py-3 bg-ink flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-yellow-bright" />
                    <span className="font-mono text-[9px] font-black text-yellow-bright uppercase tracking-widest">AI Tutor — Daily Queries</span>
                  </div>
                  <span className="font-mono text-[10px] text-white/50">{aiQueriesUsed}/{aiQueriesMax} used today</span>
                </div>
                <div className="p-4 bg-canvas">
                  <div className="border-4 border-ink h-4 overflow-hidden mb-3">
                    <div
                      className="h-full transition-all"
                      style={{ width: `${(aiQueriesUsed / aiQueriesMax) * 100}%`, backgroundColor: aiQueriesUsed >= aiQueriesMax ? '#EA580C' : '#15803D' }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-ink/60">
                      {aiQueriesLeft > 0
                        ? `${aiQueriesLeft} queries remaining today. Resets at midnight.`
                        : 'Daily limit reached. Upgrade for unlimited queries.'}
                    </p>
                    {aiQueriesLeft === 0 && (
                      <Link href="/pricing" className="cn-btn-yellow text-xs flex-shrink-0 ml-3">
                        Upgrade
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Recent lessons */}
            {recentLessonObjects.length > 0 && (
              <div className="border-4 border-ink overflow-hidden shadow-hard">
                <div className="border-b-4 border-ink px-4 py-3 bg-ink">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-bright" />
                    <span className="font-mono text-[9px] font-black text-yellow-bright uppercase tracking-widest">Continue Where You Left Off</span>
                  </div>
                </div>
                <div className="divide-y-2 divide-ink/10">
                  {recentLessonObjects.map((l) => {
                    const sub = subjects.find((s) => s.id === l.subject_id)
                    const dc = SUBJECT_COLORS[sub?.slug ?? ''] ?? { color: '#1D4ED8', bg: '#EFF6FF' }
                    return (
                      <Link
                        key={l.id}
                        href={`/lessons/${l.slug}`}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-ink/5 group transition-colors"
                      >
                        <div className="w-2 h-8 flex-shrink-0" style={{ backgroundColor: dc.color }} />
                        <div className="flex-1 min-w-0">
                          <div className="font-mono text-[9px] text-ink/40 uppercase tracking-wider">{sub?.name}</div>
                          <div className="font-bold text-sm text-ink group-hover:underline truncate">{l.title}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-ink/30 flex-shrink-0" />
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* All subjects + lessons */}
            <div className="border-4 border-ink overflow-hidden shadow-hard">
              <div className="border-b-4 border-ink px-4 py-3 bg-yellow-bright flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-ink" />
                  <span className="font-mono text-[9px] font-black text-ink uppercase tracking-widest">All Subjects & Lessons</span>
                </div>
                <span className="font-mono text-[9px] text-ink/60">{lessons.length} total</span>
              </div>
              <div className="divide-y-4 divide-ink">
                {lessonsBySubject.map(({ subject, lessons: subLessons }) => {
                  const dc = SUBJECT_COLORS[subject.slug] ?? { color: '#1D4ED8', bg: '#EFF6FF' }
                  return (
                    <div key={subject.id}>
                      <Link
                        href={`/subjects/${subject.slug}`}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-ink hover:text-white group transition-colors border-b-2 border-ink/10"
                        style={{ backgroundColor: dc.bg }}
                      >
                        <div className="w-3 h-3 border-2 border-ink flex-shrink-0" style={{ backgroundColor: dc.color }} />
                        <span className="font-display text-base font-black text-ink group-hover:text-white">{subject.name}</span>
                        <span className="font-mono text-[9px] text-ink/40 group-hover:text-white/60 ml-auto">{subLessons.length} lessons</span>
                        <ChevronRight className="w-3.5 h-3.5 text-ink/30 group-hover:text-white/60" />
                      </Link>
                      <div className="divide-y divide-ink/5">
                        {subLessons.map((lesson) => (
                          <Link
                            key={lesson.id}
                            href={`/lessons/${lesson.slug}`}
                            onClick={() => {
                              const recent = JSON.parse(localStorage.getItem('ph_recent_lessons') ?? '[]')
                              const updated = [lesson.slug, ...recent.filter((s: string) => s !== lesson.slug)].slice(0, 5)
                              localStorage.setItem('ph_recent_lessons', JSON.stringify(updated))
                            }}
                            className="flex items-center gap-3 px-6 py-2.5 hover:bg-ink/5 group transition-colors"
                          >
                            <span className="font-mono text-[9px] text-ink/30 w-4 flex-shrink-0">{lesson.order_index}</span>
                            <span className="text-sm text-ink group-hover:underline flex-1 truncate" style={{ textDecorationColor: dc.color }}>
                              {lesson.title}
                            </span>
                            {lesson.is_premium && !isPremium && (
                              <span className="font-mono text-[8px] border border-yellow text-yellow px-1.5 py-0.5 flex-shrink-0" style={{ borderColor: '#CA8A04', color: '#CA8A04' }}>
                                PRO
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ── RIGHT SIDEBAR ─────────────────────────────────── */}
          <div className="space-y-4">

            {/* Quick links */}
            <div className="border-4 border-ink overflow-hidden shadow-hard">
              <div className="border-b-4 border-ink px-4 py-3 bg-ink">
                <span className="font-mono text-[9px] font-black text-yellow-bright uppercase tracking-widest">Quick Access</span>
              </div>
              <div className="divide-y-2 divide-ink/10">
                {QUICK_LINKS.map((link) => {
                  const Icon = link.icon
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-ink hover:text-white group transition-colors"
                    >
                      <div className="w-8 h-8 border-2 border-ink flex items-center justify-center flex-shrink-0" style={{ backgroundColor: link.color }}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-mono text-xs font-bold text-ink group-hover:text-white uppercase tracking-wider">{link.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-ink/30 group-hover:text-white/60 ml-auto" />
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Premium upgrade card */}
            {!isPremium && (
              <div className="border-4 border-ink overflow-hidden" style={{ boxShadow: '4px 4px 0px 0px #CA8A04' }}>
                <div className="border-b-4 border-ink px-4 py-3 bg-yellow-bright">
                  <span className="font-mono text-[9px] font-black text-ink uppercase tracking-widest">⭐ Go Premium</span>
                </div>
                <div className="p-5 bg-canvas">
                  <div className="font-display text-2xl font-black text-ink mb-1">₹149<span className="text-sm font-sans font-normal text-ink/50">/month</span></div>
                  <div className="space-y-2 mb-4">
                    {[
                      'All 60 lessons unlocked',
                      'Unlimited AI Tutor queries',
                      'Premium practice questions',
                      'Cancel anytime',
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow border-2 border-ink flex-shrink-0" style={{ backgroundColor: '#CA8A04' }} />
                        <span className="text-xs text-ink">{item}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/pricing" className="cn-btn-black w-full justify-center text-xs">
                    Get Premium <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* Account info */}
            <div className="border-4 border-ink p-4 shadow-hard-sm">
              <div className="font-mono text-[9px] font-bold text-ink/40 uppercase tracking-widest mb-3">Account</div>
              <div className="space-y-2">
                <div>
                  <div className="font-mono text-[8px] text-ink/30 uppercase tracking-wider">Email</div>
                  <div className="font-mono text-xs font-bold text-ink truncate">{profile.email}</div>
                </div>
                <div>
                  <div className="font-mono text-[8px] text-ink/30 uppercase tracking-wider">Plan</div>
                  <div className="font-mono text-xs font-bold" style={{ color: isPremium ? '#CA8A04' : '#6B7280' }}>
                    {isPremium ? '⭐ Premium' : 'Free'}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[8px] text-ink/30 uppercase tracking-wider">Member Since</div>
                  <div className="font-mono text-xs font-bold text-ink">{joinDate}</div>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <Link
                  href="/profile"
                  className="w-full border-4 border-ink bg-yellow-bright text-ink px-3 py-2 font-mono text-[9px] font-black uppercase tracking-wider hover:bg-ink hover:text-white transition-colors text-center"
                >
                  Edit Profile
                </Link>
                <button
                  onClick={async () => { await supabase.auth.signOut(); window.location.href = '/' }}
                  className="w-full border-4 border-ink px-3 py-2 font-mono text-[9px] font-black uppercase tracking-wider hover:bg-ink hover:text-white transition-colors text-center"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
