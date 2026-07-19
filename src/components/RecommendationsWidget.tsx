'use client'

// src/components/RecommendationsWidget.tsx
// Add to dashboard page — shows AI-powered personalized next steps
// Calls /api/recommendations endpoint

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Brain, Zap, BookOpen, Trophy, Flame, TrendingUp, TrendingDown } from 'lucide-react'

type Recommendation = {
  type: string
  priority: number
  title: string
  description: string
  lessonSlug?: string
  lessonTitle?: string
  subjectSlug?: string
  subjectName?: string
  score?: number
}

type Stats = {
  totalCompleted: number
  totalLessons: number
  overallAvg: number | null
  weakSubjects: { name: string; slug: string; score: number }[]
  strongSubjects: { name: string; slug: string; score: number }[]
  subjectProgress: { name: string; slug: string; pct: number; avgScore: number | null }[]
}

const TYPE_CONFIG: Record<string, { color: string; bg: string; icon: React.ComponentType<{ className?: string }>; label: string }> = {
  weak_subject: { color: '#EA580C', bg: '#FFF7ED', icon: TrendingDown, label: 'Needs Attention' },
  continue:     { color: '#1D4ED8', bg: '#EFF6FF', icon: BookOpen,     label: 'Continue Learning' },
  new_subject:  { color: '#15803D', bg: '#F0FDF4', icon: Zap,          label: 'Explore New Topic' },
  practice:     { color: '#7C3AED', bg: '#F5F3FF', icon: Brain,        label: 'Practice Recommended' },
  gate:         { color: '#CA8A04', bg: '#FEFCE8', icon: Trophy,       label: 'GATE Prep' },
  streak:       { color: '#EA580C', bg: '#FFF7ED', icon: Flame,        label: 'Streak Alert' },
}

export default function RecommendationsWidget() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/recommendations')
      .then(r => r.json())
      .then(data => {
        setRecommendations(data.recommendations ?? [])
        setStats(data.stats ?? null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="border-4 border-ink overflow-hidden shadow-hard animate-pulse">
        <div className="border-b-4 border-ink px-5 py-3 bg-ink">
          <span className="font-mono text-[10px] font-black text-yellow-bright uppercase tracking-widest">
            AI Recommendations
          </span>
        </div>
        <div className="p-5 space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="border-4 border-ink/20 h-16 bg-ink/5" />
          ))}
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return (
      <div className="border-4 border-ink overflow-hidden shadow-hard">
        <div className="border-b-4 border-ink px-5 py-3 bg-ink">
          <span className="font-mono text-[10px] font-black text-yellow-bright uppercase tracking-widest flex items-center gap-2">
            <Brain className="w-3.5 h-3.5" /> AI Recommendations
          </span>
        </div>
        <div className="p-5 text-center">
          <Brain className="w-8 h-8 mx-auto mb-2 text-ink/20" />
          <p className="font-display text-base font-black text-ink/30">Complete a few lessons</p>
          <p className="font-mono text-[9px] text-ink/30 uppercase tracking-wider mt-1">
            Personalized recommendations appear after your first quiz
          </p>
          <Link href="/subjects" className="cn-btn-black text-xs mt-4 inline-flex">
            Start Learning <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Recommendations */}
      <div className="border-4 border-ink overflow-hidden shadow-hard">
        <div className="border-b-4 border-ink px-5 py-3 bg-ink flex items-center justify-between">
          <span className="font-mono text-[10px] font-black text-yellow-bright uppercase tracking-widest flex items-center gap-2">
            <Brain className="w-3.5 h-3.5" /> Recommended for You
          </span>
          <span className="font-mono text-[8px] text-white/40 uppercase tracking-wider">Based on your performance</span>
        </div>

        <div className="divide-y-2 divide-ink/10">
          {recommendations.map((rec, i) => {
            const cfg = TYPE_CONFIG[rec.type] ?? TYPE_CONFIG.continue
            const Icon = cfg.icon
            const href = rec.lessonSlug
              ? `/lessons/${rec.lessonSlug}`
              : rec.subjectSlug === 'practice'
              ? '/practice'
              : rec.subjectSlug === 'gate-mock'
              ? '/gate-mock'
              : rec.subjectSlug
              ? `/subjects/${rec.subjectSlug}`
              : '/subjects'

            return (
              <Link key={i} href={href}
                className="flex items-start gap-4 px-5 py-4 hover:bg-ink/5 group transition-colors">
                <div className="w-10 h-10 border-4 border-ink flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: cfg.color }}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-[8px] font-black border px-1.5 py-0.5 uppercase tracking-wider"
                      style={{ borderColor: cfg.color, color: cfg.color, backgroundColor: cfg.bg }}>
                      {cfg.label}
                    </span>
                    {rec.score !== undefined && (
                      <span className="font-mono text-[8px] text-ink/40">{rec.score}% avg</span>
                    )}
                  </div>
                  <div className="font-display text-sm font-black text-ink leading-tight mb-0.5 group-hover:underline"
                    style={{ textDecorationColor: cfg.color }}>
                    {rec.title}
                  </div>
                  <p className="font-mono text-[9px] text-ink/50 leading-relaxed">{rec.description}</p>
                  {rec.lessonTitle && (
                    <div className="font-mono text-[8px] text-ink/40 mt-1 flex items-center gap-1">
                      <BookOpen className="w-2.5 h-2.5" />
                      {rec.lessonTitle.slice(0, 55)}{rec.lessonTitle.length > 55 ? '...' : ''}
                    </div>
                  )}
                </div>
                <ArrowRight className="w-4 h-4 text-ink/30 group-hover:text-ink flex-shrink-0 mt-3 transition-colors" />
              </Link>
            )
          })}
        </div>
      </div>

      {/* Weak vs Strong subjects */}
      {stats && (stats.weakSubjects.length > 0 || stats.strongSubjects.length > 0) && (
        <div className="grid grid-cols-2 gap-3">
          {/* Weak subjects */}
          {stats.weakSubjects.length > 0 && (
            <div className="border-4 border-ink overflow-hidden" style={{ boxShadow: '3px 3px 0px 0px #EA580C' }}>
              <div className="border-b-4 border-ink px-3 py-2 bg-orange flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5 text-white" />
                <span className="font-mono text-[9px] font-black text-white uppercase tracking-wider">Focus Areas</span>
              </div>
              <div className="p-3 space-y-2">
                {stats.weakSubjects.map(s => (
                  <Link key={s.slug} href={`/subjects/${s.slug}`}
                    className="flex items-center justify-between hover:bg-orange/10 -mx-1 px-1 py-1 transition-colors group">
                    <span className="font-mono text-[9px] font-bold text-ink group-hover:underline truncate" style={{ textDecorationColor: '#EA580C' }}>
                      {s.name.replace('Polymer ', '')}
                    </span>
                    <span className="font-mono text-[9px] font-black text-orange flex-shrink-0 ml-2">{s.score}%</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Strong subjects */}
          {stats.strongSubjects.length > 0 && (
            <div className="border-4 border-ink overflow-hidden" style={{ boxShadow: '3px 3px 0px 0px #15803D' }}>
              <div className="border-b-4 border-ink px-3 py-2 bg-green flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-white" />
                <span className="font-mono text-[9px] font-black text-white uppercase tracking-wider">Your Strengths</span>
              </div>
              <div className="p-3 space-y-2">
                {stats.strongSubjects.map(s => (
                  <Link key={s.slug} href={`/subjects/${s.slug}`}
                    className="flex items-center justify-between hover:bg-green/10 -mx-1 px-1 py-1 transition-colors group">
                    <span className="font-mono text-[9px] font-bold text-ink group-hover:underline truncate" style={{ textDecorationColor: '#15803D' }}>
                      {s.name.replace('Polymer ', '')}
                    </span>
                    <span className="font-mono text-[9px] font-black text-green flex-shrink-0 ml-2">{s.score}%</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
