'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { MessageSquarePlus, Star, Bug, Lightbulb, BookOpen, Heart, CheckCircle, Eye } from 'lucide-react'

type Feedback = {
  id: string
  type: string
  rating: number | null
  message: string
  page_url: string | null
  user_email: string | null
  user_name: string | null
  status: string
  admin_note: string | null
  created_at: string
}

const TYPE_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  bug:     { label: 'Bug',     icon: Bug,                color: '#EA580C', bg: '#FFF7ED' },
  feature: { label: 'Feature', icon: Lightbulb,          color: '#CA8A04', bg: '#FEFCE8' },
  content: { label: 'Content', icon: BookOpen,           color: '#1D4ED8', bg: '#EFF6FF' },
  praise:  { label: 'Praise',  icon: Heart,              color: '#15803D', bg: '#F0FDF4' },
  general: { label: 'General', icon: MessageSquarePlus,  color: '#7C3AED', bg: '#F5F3FF' },
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  new:       { label: 'New',       color: '#EA580C' },
  reviewing: { label: 'Reviewing', color: '#CA8A04' },
  planned:   { label: 'Planned',   color: '#1D4ED8' },
  resolved:  { label: 'Resolved',  color: '#15803D' },
}

const RATING_LABELS = ['', 'Very Poor', 'Poor', 'Okay', 'Good', 'Excellent']

export default function AdminFeedbackPage() {
  const supabase = createClient()
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedItem, setSelectedItem] = useState<Feedback | null>(null)
  const [adminNote, setAdminNote] = useState('')
  const [savingNote, setSavingNote] = useState(false)

  const loadFeedback = useCallback(async () => {
    setLoading(true)
    let query = supabase.from('feedback').select('*').order('created_at', { ascending: false })
    if (filterType !== 'all') query = query.eq('type', filterType)
    if (filterStatus !== 'all') query = query.eq('status', filterStatus)
    const { data } = await query.limit(100)
    setFeedback(data ?? [])
    setLoading(false)
  }, [filterType, filterStatus, supabase])

  useEffect(() => { loadFeedback() }, [loadFeedback])

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('feedback').update({ status }).eq('id', id)
    setFeedback(prev => prev.map(f => f.id === id ? { ...f, status } : f))
    if (selectedItem?.id === id) setSelectedItem(prev => prev ? { ...prev, status } : null)
  }

  const saveNote = async () => {
    if (!selectedItem) return
    setSavingNote(true)
    await supabase.from('feedback').update({ admin_note: adminNote }).eq('id', selectedItem.id)
    setFeedback(prev => prev.map(f => f.id === selectedItem.id ? { ...f, admin_note: adminNote } : f))
    setSavingNote(false)
  }

  const counts = {
    total: feedback.length,
    new: feedback.filter(f => f.status === 'new').length,
    bugs: feedback.filter(f => f.type === 'bug').length,
    features: feedback.filter(f => f.type === 'feature').length,
    praise: feedback.filter(f => f.type === 'praise').length,
  }

  const avgRating = feedback.filter(f => f.rating).length > 0
    ? (feedback.filter(f => f.rating).reduce((a, b) => a + (b.rating ?? 0), 0) / feedback.filter(f => f.rating).length).toFixed(1)
    : '—'

  return (
    <div className="min-h-screen bg-canvas">
      <div className="h-2 bg-violet" />

      {/* Header */}
      <div className="border-b-4 border-ink bg-ink px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-violet border-4 border-violet flex items-center justify-center">
            <MessageSquarePlus className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-display text-lg font-black text-white">Student Feedback Inbox</div>
            <div className="font-mono text-[9px] text-white/40 uppercase tracking-wider">Admin — read everything students send</div>
          </div>
        </div>
        <Link href="/admin/analytics" className="border-2 border-white/30 text-white font-mono text-[9px] px-3 py-1.5 hover:bg-white/10 transition-colors uppercase">
          ← Analytics
        </Link>
      </div>

      {/* Stats strip */}
      <div className="border-b-4 border-ink grid grid-cols-3 sm:grid-cols-6 divide-x-4 divide-ink">
        {[
          { val: counts.total, label: 'Total', color: '#7C3AED' },
          { val: counts.new, label: 'New', color: '#EA580C' },
          { val: counts.bugs, label: 'Bugs', color: '#EA580C' },
          { val: counts.features, label: 'Features', color: '#CA8A04' },
          { val: counts.praise, label: 'Praise', color: '#15803D' },
          { val: avgRating, label: 'Avg Rating', color: '#CA8A04' },
        ].map(s => (
          <div key={s.label} className="p-4 text-center" style={{ backgroundColor: s.color + '10' }}>
            <div className="font-display text-2xl font-black" style={{ color: s.color }}>{s.val}</div>
            <div className="font-mono text-[8px] text-ink/40 uppercase tracking-wider mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="border-b-4 border-ink px-6 py-3 flex gap-3 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {['all', 'bug', 'feature', 'content', 'praise', 'general'].map(t => {
            const cfg = t !== 'all' ? TYPE_CONFIG[t] : { color: '#0A0A0A', bg: '#F9FAFB' }
            return (
              <button key={t} onClick={() => setFilterType(t)}
                className="font-mono text-[9px] font-black border-4 border-ink px-3 py-1.5 uppercase transition-all"
                style={{ backgroundColor: filterType === t ? cfg.color : 'white', color: filterType === t ? 'white' : '#6B7280' }}>
                {t === 'all' ? 'All Types' : TYPE_CONFIG[t].label}
              </button>
            )
          })}
        </div>
        <div className="flex gap-2 flex-wrap ml-auto">
          {['all', 'new', 'reviewing', 'planned', 'resolved'].map(s => {
            const cfg = s !== 'all' ? STATUS_CONFIG[s] : { color: '#0A0A0A' }
            return (
              <button key={s} onClick={() => setFilterStatus(s)}
                className="font-mono text-[9px] font-black border-4 border-ink px-3 py-1.5 uppercase transition-all"
                style={{ backgroundColor: filterStatus === s ? cfg.color : 'white', color: filterStatus === s ? 'white' : '#6B7280' }}>
                {s === 'all' ? 'All Status' : STATUS_CONFIG[s].label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Feedback list */}
        <div className="space-y-3">
          {loading ? (
            <div className="border-4 border-ink p-8 text-center shadow-hard">
              <div className="font-display text-lg font-black text-ink animate-pulse">Loading feedback...</div>
            </div>
          ) : feedback.length === 0 ? (
            <div className="border-4 border-ink border-dashed p-12 text-center">
              <MessageSquarePlus className="w-10 h-10 mx-auto mb-3 text-ink/20" />
              <p className="font-display text-xl font-black text-ink/30">No feedback yet</p>
              <p className="font-mono text-[10px] text-ink/30 uppercase tracking-wider mt-1">Students will start sending as they use the platform</p>
            </div>
          ) : (
            feedback.map(item => {
              const cfg = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.general
              const Icon = cfg.icon
              const statusCfg = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.new
              const isSelected = selectedItem?.id === item.id

              return (
                <button key={item.id} onClick={() => { setSelectedItem(item); setAdminNote(item.admin_note ?? '') }}
                  className="w-full text-left border-4 border-ink overflow-hidden transition-all"
                  style={{
                    boxShadow: isSelected ? `4px 4px 0px 0px ${cfg.color}` : '2px 2px 0px 0px #0A0A0A',
                    backgroundColor: isSelected ? cfg.bg : 'white',
                  }}>
                  <div className="border-b-4 border-ink px-4 py-2 flex items-center justify-between flex-wrap gap-2"
                    style={{ backgroundColor: isSelected ? cfg.color : '#F9FAFB' }}>
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5" style={{ color: isSelected ? 'white' : cfg.color }} />
                      <span className="font-mono text-[9px] font-black uppercase tracking-wider" style={{ color: isSelected ? 'white' : cfg.color }}>{cfg.label}</span>
                      {item.rating && (
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map(starIdx => (
                            <Star key={starIdx} className="w-2.5 h-2.5" style={{ color: starIdx <= item.rating! ? '#CA8A04' : '#D1D5DB', fill: starIdx <= item.rating! ? '#CA8A04' : 'none' }} />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[8px] font-black border px-1.5 py-0.5 uppercase"
                        style={{ borderColor: statusCfg.color, color: isSelected ? 'white' : statusCfg.color }}>
                        {statusCfg.label}
                      </span>
                      <span className="font-mono text-[8px] text-ink/40" style={{ color: isSelected ? 'white' : undefined }}>
                        {new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-sm text-ink font-medium leading-relaxed line-clamp-2">{item.message}</p>
                    <div className="flex items-center gap-3 mt-2">
                      {item.user_name && <span className="font-mono text-[8px] text-ink/50">{item.user_name}</span>}
                      {item.user_email && <span className="font-mono text-[8px] text-ink/40">{item.user_email}</span>}
                      {item.page_url && <span className="font-mono text-[8px] text-ink/30">{item.page_url}</span>}
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>

        {/* Detail panel */}
        <div>
          {selectedItem ? (
            <div className="border-4 border-ink overflow-hidden shadow-hard h-fit bg-white">
              <div className="border-b-4 border-ink px-5 py-3 flex items-center justify-between"
                style={{ backgroundColor: TYPE_CONFIG[selectedItem.type]?.color ?? '#7C3AED' }}>
                <span className="font-mono text-[10px] font-black text-white uppercase tracking-widest">Feedback Detail</span>
                <button onClick={() => setSelectedItem(null)} className="border-2 border-white/30 text-white w-6 h-6 flex items-center justify-center hover:bg-white/10 text-xs">✕</button>
              </div>
              <div className="p-5 space-y-4">
                {/* Meta */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="border-4 border-ink p-3 bg-canvas">
                    <div className="font-mono text-[8px] text-ink/40 uppercase tracking-wider mb-0.5">Type</div>
                    <div className="font-mono text-sm font-black" style={{ color: TYPE_CONFIG[selectedItem.type]?.color }}>
                      {TYPE_CONFIG[selectedItem.type]?.label}
                    </div>
                  </div>
                  <div className="border-4 border-ink p-3 bg-canvas">
                    <div className="font-mono text-[8px] text-ink/40 uppercase tracking-wider mb-0.5">Rating</div>
                    <div className="font-mono text-sm font-black text-ink">{selectedItem.rating ? `${selectedItem.rating}/5 (${RATING_LABELS[selectedItem.rating]})` : 'Not rated'}</div>
                  </div>
                  {selectedItem.user_name && (
                    <div className="border-4 border-ink p-3 bg-canvas">
                      <div className="font-mono text-[8px] text-ink/40 uppercase tracking-wider mb-0.5">Student</div>
                      <div className="font-mono text-xs font-bold text-ink">{selectedItem.user_name}</div>
                    </div>
                  )}
                  {selectedItem.user_email && (
                    <div className="border-4 border-ink p-3 bg-canvas">
                      <div className="font-mono text-[8px] text-ink/40 uppercase tracking-wider mb-0.5">Email</div>
                      <a href={`mailto:${selectedItem.user_email}`} className="font-mono text-xs font-bold text-blue hover:underline truncate block">{selectedItem.user_email}</a>
                    </div>
                  )}
                  {selectedItem.page_url && (
                    <div className="border-4 border-ink p-3 col-span-2 bg-canvas">
                      <div className="font-mono text-[8px] text-ink/40 uppercase tracking-wider mb-0.5">Sent from page</div>
                      <div className="font-mono text-xs font-bold text-ink break-all">{selectedItem.page_url}</div>
                    </div>
                  )}
                </div>

                {/* Message */}
                <div className="border-4 border-ink p-4" style={{ backgroundColor: TYPE_CONFIG[selectedItem.type]?.bg }}>
                  <div className="font-mono text-[8px] text-ink/50 uppercase tracking-wider mb-2">Message</div>
                  <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap">{selectedItem.message}</p>
                </div>

                {/* Status control */}
                <div>
                  <div className="font-mono text-[9px] font-bold text-ink/50 uppercase tracking-widest mb-2">Update Status</div>
                  <div className="flex gap-2 flex-wrap">
                    {Object.entries(STATUS_CONFIG).map(([statusKey, cfg]) => (
                      <button key={statusKey} onClick={() => updateStatus(selectedItem.id, statusKey)}
                        className="font-mono text-[9px] font-black border-4 border-ink px-3 py-1.5 uppercase tracking-wider transition-all"
                        style={{
                          backgroundColor: selectedItem.status === statusKey ? cfg.color : 'white',
                          color: selectedItem.status === statusKey ? 'white' : '#6B7280',
                        }}>
                        {cfg.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Admin note */}
                <div>
                  <div className="font-mono text-[9px] font-bold text-ink/50 uppercase tracking-widest mb-2">Internal Note</div>
                  <textarea
                    value={adminNote}
                    onChange={e => setAdminNote(e.target.value)}
                    rows={3}
                    className="w-full border-4 border-ink px-4 py-3 text-sm text-ink focus:outline-none focus:border-violet resize-none shadow-hard-sm bg-canvas"
                    placeholder="Add a note for yourself — what action you took, what you planned..."
                  />
                  <button onClick={saveNote} disabled={savingNote}
                    className="cn-btn-black text-xs mt-2 disabled:opacity-50">
                    {savingNote ? 'Saving...' : <><CheckCircle className="w-3.5 h-3.5" /> Save Note</>}
                  </button>
                </div>

                <div className="font-mono text-[8px] text-ink/30 uppercase tracking-wider">
                  Received: {new Date(selectedItem.created_at).toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          ) : (
            <div className="border-4 border-ink border-dashed p-12 text-center flex flex-col items-center justify-center bg-white h-64">
              <Eye className="w-10 h-10 text-ink/20 mb-3" />
              <p className="font-display text-lg font-black text-ink/30">Select a feedback item</p>
              <p className="font-mono text-[9px] text-ink/20 uppercase tracking-wider mt-1">Click any item to see details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
