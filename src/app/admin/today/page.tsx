'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Check, AlertCircle, Trash2, Eye, FlaskConical } from 'lucide-react'
import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = 'Research' | 'Market' | 'India' | 'Sustainability' | 'Policy' | 'Innovation' | 'Recycling' | 'Bioplastics'

type FormData = {
  headline: string
  summary: string
  source_name: string
  source_url: string
  image_url: string
  category: Category
  related_lesson_slug: string
  related_subject_slug: string
  is_featured: boolean
  publish_date: string
}

interface RecentEntry {
  id: string
  headline: string
  category: Category
  is_featured: boolean
  publish_date: string
  source_name: string
}

const EMPTY_FORM: FormData = {
  headline: '',
  summary: '',
  source_name: '',
  source_url: '',
  image_url: '',
  category: 'Research',
  related_lesson_slug: '',
  related_subject_slug: '',
  is_featured: false,
  publish_date: new Date().toISOString().split('T')[0],
}

const CATEGORIES: { value: Category; color: string; bg: string }[] = [
  { value: 'Research', color: '#1D4ED8', bg: '#EFF6FF' },
  { value: 'Market', color: '#CA8A04', bg: '#FEFCE8' },
  { value: 'India', color: '#1D4ED8', bg: '#EFF6FF' },
  { value: 'Sustainability', color: '#15803D', bg: '#F0FDF4' },
  { value: 'Policy', color: '#7C3AED', bg: '#F5F3FF' },
  { value: 'Innovation', color: '#EA580C', bg: '#FFF7ED' },
  { value: 'Recycling', color: '#15803D', bg: '#F0FDF4' },
  { value: 'Bioplastics', color: '#15803D', bg: '#F0FDF4' },
]

const SUBJECT_SLUGS = [
  'polymer-chemistry', 'polymer-processing', 'mould-design',
  'polymer-testing', 'rubber-technology', 'recycling-technology',
  'sustainable-plastics', 'polymer-composites', 'entrepreneurship-plastics', 'medical-plastics',
]

// Quick-add sources (saves typing common sources)
const QUICK_SOURCES = [
  { name: 'Plastics News', url: 'https://www.plasticsnews.com' },
  { name: 'PlasticsToday', url: 'https://www.plasticstoday.com' },
  { name: 'Plastics Technology', url: 'https://www.ptonline.com' },
  { name: 'Chemical Weekly India', url: 'https://www.chemicalweekly.com' },
  { name: 'Sustainable Plastics', url: 'https://www.sustainableplastics.com' },
  { name: 'CIPET Press Office', url: 'https://www.cipet.gov.in' },
  { name: 'Business Standard', url: 'https://www.business-standard.com' },
  { name: 'The Hindu BusinessLine', url: 'https://www.thehindubusinessline.com' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminTodayPage() {
  const supabase = createClient()
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [todayCount, setTodayCount] = useState<number | null>(null)
  const [recentEntries, setRecentEntries] = useState<RecentEntry[]>([])
  const [loaded, setLoaded] = useState(false)

  // Load today's count + recent entries on mount
  const loadRecent = async () => {
    const today = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase
      .from('daily_updates')
      .select('id, headline, category, is_featured, publish_date, source_name')
      .eq('publish_date', today)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setRecentEntries(data as RecentEntry[])
      setTodayCount(data.length)
    }
    setLoaded(true)
  }

  if (!loaded) loadRecent()

  const handleSubmit = async () => {
    if (!form.headline.trim() || !form.summary.trim() || !form.source_name.trim()) {
      setErrorMsg('Headline, summary, and source name are required.')
      setStatus('error')
      return
    }

    setStatus('saving')
    setErrorMsg('')

    const { error } = await supabase
      .from('daily_updates')
      .insert({
        headline: form.headline.trim(),
        summary: form.summary.trim(),
        source_name: form.source_name.trim(),
        source_url: form.source_url.trim() || null,
        image_url: form.image_url.trim() || null,
        category: form.category,
        related_lesson_slug: form.related_lesson_slug.trim() || null,
        related_subject_slug: form.related_subject_slug.trim() || null,
        is_featured: form.is_featured,
        publish_date: form.publish_date,
        is_published: true,
      })

    if (error) {
      setStatus('error')
      setErrorMsg(error.message)
    } else {
      setStatus('success')
      setForm({ ...EMPTY_FORM, publish_date: form.publish_date })
      loadRecent()
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this entry?')) return
    await supabase.from('daily_updates').delete().eq('id', id)
    loadRecent()
  }

  const setQuickSource = (src: { name: string; url: string }) => {
    setForm((f) => ({ ...f, source_name: src.name, source_url: src.url }))
  }

  return (
    <div className="min-h-screen bg-canvas">
      <div className="h-2 bg-yellow-bright" />

      {/* Header */}
      <div className="border-b-4 border-ink bg-ink px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-yellow-bright border-4 border-yellow-bright flex items-center justify-center">
            <FlaskConical className="w-4 h-4 text-ink" />
          </div>
          <div>
            <div className="font-display text-lg font-black text-white">Daily Pulse Admin</div>
            <div className="font-mono text-[9px] text-white/50 uppercase tracking-wider">Content Engine · PolymerHub</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {todayCount !== null && (
            <div className="border-2 border-yellow-bright px-3 py-1">
              <span className="font-mono text-xs font-black text-yellow-bright">{todayCount} stories today</span>
            </div>
          )}
          <Link href="/today" className="border-4 border-white/30 text-white font-mono text-xs font-bold px-3 py-2 hover:bg-white/10 transition-colors flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" /> Preview /today
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── ADD STORY FORM ─────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            <div className="border-4 border-ink overflow-hidden shadow-hard">
              <div className="border-b-4 border-ink px-5 py-3 bg-yellow-bright flex items-center justify-between">
                <h2 className="font-display text-xl font-black text-ink uppercase">Add Today&apos;s Story</h2>
                <div className="font-mono text-[9px] font-bold text-ink/60 border-2 border-ink px-2 py-0.5 uppercase tracking-wider">
                  {form.publish_date}
                </div>
              </div>

              <div className="p-5 space-y-4 bg-canvas">

                {/* Headline */}
                <div>
                  <label className="font-mono text-[10px] font-bold text-ink uppercase tracking-wider block mb-1.5">
                    Headline <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={form.headline}
                    onChange={(e) => setForm((f) => ({ ...f, headline: e.target.value }))}
                    className="w-full border-4 border-ink p-3 font-bold text-sm text-ink resize-none focus:outline-none focus:border-blue transition-colors"
                    rows={2}
                    placeholder="MIT Engineers Synthesize Self-Healing Biopolymer..."
                  />
                </div>

                {/* Summary */}
                <div>
                  <label className="font-mono text-[10px] font-bold text-ink uppercase tracking-wider block mb-1.5">
                    Summary (2–3 sentences) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={form.summary}
                    onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
                    className="w-full border-4 border-ink p-3 text-sm text-ink resize-none focus:outline-none focus:border-blue transition-colors"
                    rows={3}
                    placeholder="Key finding, why it matters, India connection..."
                  />
                </div>

                {/* Source */}
                <div>
                  <label className="font-mono text-[10px] font-bold text-ink uppercase tracking-wider block mb-1.5">
                    Source <span className="text-red-500">*</span>
                  </label>
                  {/* Quick source buttons */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {QUICK_SOURCES.map((src) => (
                      <button
                        key={src.name}
                        onClick={() => setQuickSource(src)}
                        className={`font-mono text-[9px] font-bold border-2 px-2 py-1 uppercase tracking-wider transition-colors ${
                          form.source_name === src.name
                            ? 'bg-ink text-white border-ink'
                            : 'border-ink/30 text-ink/60 hover:border-ink hover:text-ink'
                        }`}
                      >
                        {src.name}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      value={form.source_name}
                      onChange={(e) => setForm((f) => ({ ...f, source_name: e.target.value }))}
                      className="border-4 border-ink p-3 text-sm text-ink focus:outline-none focus:border-blue transition-colors"
                      placeholder="Source name"
                    />
                    <input
                      value={form.source_url}
                      onChange={(e) => setForm((f) => ({ ...f, source_url: e.target.value }))}
                      className="border-4 border-ink p-3 text-sm text-ink focus:outline-none focus:border-blue transition-colors"
                      placeholder="https://source.com/article"
                    />
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label className="font-mono text-[10px] font-bold text-ink uppercase tracking-wider block mb-1.5">
                    Image URL (Unsplash recommended)
                  </label>
                  <input
                    value={form.image_url}
                    onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                    className="w-full border-4 border-ink p-3 text-sm text-ink focus:outline-none focus:border-blue transition-colors"
                    placeholder="https://images.unsplash.com/photo-...?w=600&q=80"
                  />
                  {form.image_url && (
                    <img src={form.image_url} alt="preview" className="mt-2 h-20 w-full object-cover border-4 border-ink" />
                  )}
                </div>

                {/* Category + Featured */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[10px] font-bold text-ink uppercase tracking-wider block mb-1.5">Category</label>
                    <div className="flex flex-wrap gap-1.5">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.value}
                          onClick={() => setForm((f) => ({ ...f, category: cat.value }))}
                          className={`font-mono text-[9px] font-black border-2 px-2 py-1 uppercase tracking-wider transition-all ${
                            form.category === cat.value
                              ? 'text-white border-current'
                              : 'border-ink/20 text-ink/50 hover:border-current'
                          }`}
                          style={form.category === cat.value ? { backgroundColor: cat.color, borderColor: cat.color } : { color: cat.color }}
                        >
                          {cat.value}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="font-mono text-[10px] font-bold text-ink uppercase tracking-wider block mb-1.5">Options</label>
                    <label className="flex items-center gap-2 cursor-pointer border-4 border-ink p-3 hover:bg-yellow-light transition-colors">
                      <input
                        type="checkbox"
                        checked={form.is_featured}
                        onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))}
                        className="w-4 h-4"
                      />
                      <span className="font-mono text-xs font-bold text-ink uppercase tracking-wider">⭐ Featured Story of the Day</span>
                    </label>
                  </div>
                </div>

                {/* Lesson linkage */}
                <div className="border-4 border-ink p-4 bg-blue/5">
                  <div className="font-mono text-[9px] font-bold text-blue uppercase tracking-widest mb-3">
                    🔗 Lesson Linkage (optional but recommended)
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-mono text-[9px] text-ink/50 uppercase tracking-wider block mb-1">Subject Slug</label>
                      <select
                        value={form.related_subject_slug}
                        onChange={(e) => setForm((f) => ({ ...f, related_subject_slug: e.target.value }))}
                        className="w-full border-4 border-ink p-2.5 text-sm text-ink focus:outline-none bg-canvas"
                      >
                        <option value="">No subject</option>
                        {SUBJECT_SLUGS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-mono text-[9px] text-ink/50 uppercase tracking-wider block mb-1">Lesson Slug</label>
                      <input
                        value={form.related_lesson_slug}
                        onChange={(e) => setForm((f) => ({ ...f, related_lesson_slug: e.target.value }))}
                        className="w-full border-4 border-ink p-2.5 text-sm text-ink focus:outline-none"
                        placeholder="lesson-slug-here"
                      />
                    </div>
                  </div>
                </div>

                {/* Publish date */}
                <div>
                  <label className="font-mono text-[10px] font-bold text-ink uppercase tracking-wider block mb-1.5">Publish Date</label>
                  <input
                    type="date"
                    value={form.publish_date}
                    onChange={(e) => setForm((f) => ({ ...f, publish_date: e.target.value }))}
                    className="border-4 border-ink p-3 text-sm text-ink focus:outline-none font-mono"
                  />
                </div>

                {/* Status message */}
                {status === 'success' && (
                  <div className="border-4 border-green bg-green/10 p-3 flex items-center gap-2">
                    <Check className="w-4 h-4 text-green" />
                    <span className="font-mono text-xs font-bold text-green uppercase tracking-wider">Story added successfully!</span>
                  </div>
                )}
                {status === 'error' && (
                  <div className="border-4 border-red-500 bg-red-50 p-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="font-mono text-xs font-bold text-red-500">{errorMsg}</span>
                  </div>
                )}

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={status === 'saving'}
                  className="cn-btn-black w-full justify-center text-sm disabled:opacity-50"
                >
                  {status === 'saving' ? (
                    <>Saving...</>
                  ) : (
                    <><Plus className="w-4 h-4" /> Add Story to Daily Pulse</>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ── TODAY'S STORIES ────────────────────────────── */}
          <div className="space-y-4">
            <div className="border-4 border-ink overflow-hidden shadow-hard">
              <div className="border-b-4 border-ink px-4 py-3 bg-ink">
                <div className="font-mono text-[9px] font-bold text-yellow-bright uppercase tracking-widest mb-0.5">Today&apos;s Stories</div>
                <div className="font-display text-lg font-black text-white">
                  {todayCount ?? '...'} / 8 target
                </div>
              </div>

              {/* Progress bar */}
              <div className="border-b-4 border-ink h-3 bg-ink/10">
                <div
                  className="h-full bg-yellow-bright transition-all"
                  style={{ width: `${Math.min(((todayCount ?? 0) / 8) * 100, 100)}%` }}
                />
              </div>

              <div className="divide-y-2 divide-ink/10">
                {recentEntries.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="font-mono text-xs text-ink/40 uppercase tracking-wider">No stories today yet</p>
                  </div>
                ) : (
                  recentEntries.map((entry) => {
                    const cat = CATEGORIES.find((c) => c.value === entry.category)
                    return (
                      <div key={entry.id} className="p-4 flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          {entry.is_featured && (
                            <span className="font-mono text-[8px] font-black border-2 border-yellow bg-yellow-light text-yellow px-1.5 py-0.5 uppercase mr-1" style={{ borderColor: '#CA8A04', color: '#CA8A04', backgroundColor: '#FEFCE8' }}>
                              ⭐ Featured
                            </span>
                          )}
                          <span
                            className="font-mono text-[8px] font-black border-2 px-1.5 py-0.5 uppercase mr-1"
                            style={{ borderColor: cat?.color, color: cat?.color, backgroundColor: cat?.bg }}
                          >
                            {entry.category}
                          </span>
                          <p className="text-xs text-ink font-medium mt-1 leading-snug line-clamp-2">{entry.headline}</p>
                          <p className="font-mono text-[9px] text-ink/40 mt-1">{entry.source_name}</p>
                        </div>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="border-2 border-red-200 p-1 text-red-400 hover:bg-red-50 transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Quick tips */}
            <div className="border-4 border-ink p-4 bg-green/5">
              <div className="font-mono text-[9px] font-bold text-green uppercase tracking-widest mb-3">Daily Workflow (5 min)</div>
              <div className="space-y-2">
                {[
                  '1. Open Plastics News + PlasticsToday',
                  '2. Pick 5–8 most relevant stories',
                  '3. Paste headline + write 2-sentence summary',
                  '4. Select quick source, pick category',
                  '5. Link to related lesson if obvious',
                  '6. Mark 1 story as ⭐ Featured',
                  '7. Submit — live immediately on /today',
                ].map((step) => (
                  <p key={step} className="font-mono text-[9px] text-ink/70 leading-relaxed">{step}</p>
                ))}
              </div>
            </div>

            {/* Top sources */}
            <div className="border-4 border-ink p-4">
              <div className="font-mono text-[9px] font-bold text-ink uppercase tracking-widest mb-3">Top Sources</div>
              <div className="space-y-1.5">
                {[
                  { name: 'Plastics News', note: 'Primary — daily' },
                  { name: 'PlasticsToday', note: 'Primary — daily' },
                  { name: 'Chemical Weekly India', note: 'India focus' },
                  { name: 'Sustainable Plastics', note: 'Recycling/bio' },
                  { name: 'Plastics Technology', note: 'Processing' },
                ].map((src) => (
                  <div key={src.name} className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-ink">{src.name}</span>
                    <span className="font-mono text-[9px] text-ink/40">{src.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
