'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { MessageCircle, ThumbsUp, CheckCircle, Plus, Search, Send, Brain } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Subject = { id: string; name: string; slug: string }

type Question = {
  id: string
  user_id: string
  subject_id: string | null
  lesson_id: string | null
  title: string
  body: string
  upvotes: number
  answer_count: number
  is_resolved: boolean
  is_pinned: boolean
  created_at: string
  profiles?: { full_name: string | null; avatar_url: string | null }
  subjects?: { name: string; slug: string }
}

type Answer = {
  id: string
  question_id: string
  user_id: string
  body: string
  upvotes: number
  is_accepted: boolean
  created_at: string
  profiles?: { full_name: string | null; avatar_url: string | null }
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

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

function Avatar({ name, avatarUrl, size = 8 }: { name: string | null; avatarUrl: string | null; size?: number }) {
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'ST'
  
  const sizeMap: Record<number, string> = {
    5: 'w-5 h-5',
    7: 'w-7 h-7',
    8: 'w-8 h-8'
  }
  const sizeClass = sizeMap[size] ?? 'w-8 h-8'

  return avatarUrl ? (
    <img src={avatarUrl} alt={name ?? 'Student'} className={`${sizeClass} border-2 border-ink flex-shrink-0 object-cover`} />
  ) : (
    <div className={`${sizeClass} border-2 border-ink bg-violet flex-shrink-0 flex items-center justify-center font-mono text-[9px] font-black text-white`}>
      {initials}
    </div>
  )
}

// ─── Ask Question Modal ────────────────────────────────────────────────────────

function AskModal({ subjects, onClose, onSubmit }: {
  subjects: Subject[]
  onClose: () => void
  onSubmit: () => void
}) {
  const supabase = createClient()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) { setError('Title and description are required.'); return }
    setSubmitting(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { setError('Sign in to ask a question.'); setSubmitting(false); return }

    const { error: err } = await supabase.from('forum_questions').insert({
      user_id: session.user.id,
      subject_id: subjectId || null,
      title: title.trim(),
      body: body.trim(),
    })

    if (err) { setError(err.message); setSubmitting(false); return }
    onSubmit()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-ink/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="bg-canvas w-full sm:max-w-xl border-4 border-ink sm:shadow-hard-xl max-h-[90vh] overflow-y-auto">
        <div className="border-b-4 border-ink px-5 py-4 bg-ink flex items-center justify-between">
          <span className="font-display text-lg font-black text-white">Ask a Question</span>
          <button onClick={onClose} className="border-2 border-white/30 text-white px-3 py-1 font-mono text-[10px] uppercase hover:bg-white/10">✕ Close</button>
        </div>
        <div className="p-5 space-y-4">
          {error && <div className="border-4 border-orange bg-orange/10 p-3 font-mono text-xs text-orange">{error}</div>}

          <div>
            <label className="font-mono text-[10px] font-bold text-ink/50 uppercase tracking-widest block mb-1.5">
              Question Title <span className="text-orange">*</span>
            </label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full border-4 border-ink px-4 py-3 text-sm font-bold text-ink focus:outline-none focus:border-violet shadow-hard-sm"
              placeholder="e.g. Why does PP become brittle after gamma sterilization?"
              maxLength={200}
            />
            <div className="font-mono text-[8px] text-ink/30 mt-1 text-right">{title.length}/200</div>
          </div>

          <div>
            <label className="font-mono text-[10px] font-bold text-ink/50 uppercase tracking-widest block mb-1.5">
              Description <span className="text-orange">*</span>
            </label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              rows={5}
              className="w-full border-4 border-ink px-4 py-3 text-sm text-ink focus:outline-none focus:border-violet resize-none shadow-hard-sm"
              placeholder="Explain your question in detail. What have you already tried? What does your lesson say about this?"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] font-bold text-ink/50 uppercase tracking-widest block mb-1.5">Subject (optional)</label>
            <select
              value={subjectId}
              onChange={e => setSubjectId(e.target.value)}
              className="w-full border-4 border-ink px-4 py-3 text-sm text-ink focus:outline-none bg-canvas shadow-hard-sm"
            >
              <option value="">All Subjects</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <button onClick={handleSubmit} disabled={submitting} className="cn-btn-black w-full justify-center text-sm disabled:opacity-50">
            {submitting ? 'Posting...' : <><Send className="w-4 h-4" /> Post Question</>}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Question Detail ───────────────────────────────────────────────────────────

function QuestionDetail({ question, onBack, currentUserId, onUpdate }: {
  question: Question
  onBack: () => void
  currentUserId: string | null
  onUpdate: () => void
}) {
  const supabase = createClient()
  const [answers, setAnswers] = useState<Answer[]>([])
  const [answerBody, setAnswerBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [userUpvotes, setUserUpvotes] = useState<Set<string>>(new Set())
  const dc = question.subjects ? SUBJECT_COLORS[question.subjects.slug] ?? { color: '#7C3AED', bg: '#F5F3FF' } : { color: '#7C3AED', bg: '#F5F3FF' }

  useEffect(() => {
    loadAnswers()
    if (currentUserId) loadUserUpvotes()
  }, [question.id])

  const loadAnswers = async () => {
    const { data: rawAnswers } = await supabase
      .from('forum_answers')
      .select('*')
      .eq('question_id', question.id)
      .order('is_accepted', { ascending: false })
      .order('upvotes', { ascending: false })
      .order('created_at', { ascending: true })

    if (!rawAnswers || rawAnswers.length === 0) {
      setAnswers([])
      return
    }

    const userIds = Array.from(new Set(rawAnswers.map((a: { user_id: string }) => a.user_id)))
    const profileMap = new Map<string, { full_name: string | null; avatar_url: string | null }>()
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', userIds)
      
      profiles?.forEach(p => profileMap.set(p.id, { full_name: p.full_name, avatar_url: p.avatar_url }))
    }

    const formatted: Answer[] = rawAnswers.map((a: {
      id: string
      question_id: string
      user_id: string
      body: string
      upvotes: number
      is_accepted: boolean
      created_at: string
    }) => ({
      ...a,
      profiles: profileMap.get(a.user_id) || { full_name: 'Student', avatar_url: null }
    }))

    setAnswers(formatted)
  }

  const loadUserUpvotes = async () => {
    const { data } = await supabase
      .from('forum_upvotes')
      .select('question_id, answer_id')
      .eq('user_id', currentUserId!)
    const ids = new Set<string>()
    data?.forEach(u => { if (u.question_id) ids.add(u.question_id); if (u.answer_id) ids.add(u.answer_id) })
    setUserUpvotes(ids)
  }

  const handleUpvoteQuestion = async () => {
    if (!currentUserId) return
    if (userUpvotes.has(question.id)) {
      await supabase.from('forum_upvotes').delete().eq('user_id', currentUserId).eq('question_id', question.id)
      setUserUpvotes(prev => {
        const next = new Set(prev)
        next.delete(question.id)
        return next
      })
    } else {
      await supabase.from('forum_upvotes').insert({ user_id: currentUserId, question_id: question.id })
      setUserUpvotes(prev => {
        const next = new Set(prev)
        next.add(question.id)
        return next
      })
    }
    onUpdate()
  }

  const handleUpvoteAnswer = async (answerId: string) => {
    if (!currentUserId) return
    if (userUpvotes.has(answerId)) {
      await supabase.from('forum_upvotes').delete().eq('user_id', currentUserId).eq('answer_id', answerId)
      setUserUpvotes(prev => {
        const next = new Set(prev)
        next.delete(answerId)
        return next
      })
    } else {
      await supabase.from('forum_upvotes').insert({ user_id: currentUserId, answer_id: answerId })
      setUserUpvotes(prev => {
        const next = new Set(prev)
        next.add(answerId)
        return next
      })
    }
    loadAnswers()
  }

  const handleAcceptAnswer = async (answerId: string) => {
    if (!currentUserId || currentUserId !== question.user_id) return
    await supabase.from('forum_answers').update({ is_accepted: true }).eq('id', answerId)
    await supabase.from('forum_questions').update({ is_resolved: true }).eq('id', question.id)
    loadAnswers()
    onUpdate()
  }

  const handlePostAnswer = async () => {
    if (!answerBody.trim() || !currentUserId) return
    setSubmitting(true)
    await supabase.from('forum_answers').insert({
      question_id: question.id,
      user_id: currentUserId,
      body: answerBody.trim(),
    })
    setAnswerBody('')
    loadAnswers()
    onUpdate()
    setSubmitting(false)
  }

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="font-mono text-[10px] text-ink/50 hover:text-ink uppercase tracking-wider flex items-center gap-1 transition-colors">
        ← Back to questions
      </button>

      {/* Question */}
      <div className="border-4 border-ink overflow-hidden" style={{ boxShadow: `4px 4px 0px 0px ${dc.color}` }}>
        <div className="border-b-4 border-ink px-5 py-4" style={{ backgroundColor: dc.bg }}>
          <div className="flex items-start gap-3">
            <Avatar name={question.profiles?.full_name ?? null} avatarUrl={question.profiles?.avatar_url ?? null} />
            <div className="flex-1 min-w-0">
              <h2 className="font-display text-xl font-black text-ink leading-tight mb-1">{question.title}</h2>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-mono text-[9px] text-ink/50">{question.profiles?.full_name ?? 'Student'}</span>
                <span className="font-mono text-[9px] text-ink/40">{timeAgo(question.created_at)}</span>
                {question.subjects && (
                  <span className="font-mono text-[9px] font-bold border-2 px-2 py-0.5 uppercase" style={{ borderColor: dc.color, color: dc.color }}>
                    {question.subjects.name}
                  </span>
                )}
                {question.is_resolved && (
                  <span className="font-mono text-[9px] font-bold border-2 border-green text-green px-2 py-0.5 uppercase flex items-center gap-1">
                    <CheckCircle className="w-2.5 h-2.5" /> Resolved
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="p-5 bg-canvas">
          <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap mb-4">{question.body}</p>
          <div className="flex items-center gap-3">
            <button
              onClick={handleUpvoteQuestion}
              className="flex items-center gap-1.5 border-4 border-ink px-3 py-1.5 font-mono text-[10px] font-black uppercase transition-all hover:bg-ink hover:text-white"
              style={userUpvotes.has(question.id) ? { backgroundColor: '#1D4ED8', color: 'white', borderColor: '#1D4ED8' } : {}}
            >
              <ThumbsUp className="w-3.5 h-3.5" /> {question.upvotes}
            </button>
            <Link href="/ai-tutor" className="flex items-center gap-1.5 font-mono text-[9px] text-ink/40 hover:text-ink uppercase tracking-wider transition-colors">
              <Brain className="w-3 h-3" /> Ask AI Tutor
            </Link>
          </div>
        </div>
      </div>

      {/* Answers */}
      <div>
        <div className="font-mono text-[10px] font-bold text-ink/50 uppercase tracking-widest border-b-4 border-ink pb-3 mb-4">
          {answers.length} Answer{answers.length !== 1 ? 's' : ''}
        </div>
        <div className="space-y-3">
          {answers.map(answer => (
            <div
              key={answer.id}
              className="border-4 border-ink overflow-hidden"
              style={{ boxShadow: answer.is_accepted ? '4px 4px 0px 0px #15803D' : '3px 3px 0px 0px #0A0A0A' }}
            >
              {answer.is_accepted && (
                <div className="border-b-4 border-ink px-4 py-2 bg-green flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-white" />
                  <span className="font-mono text-[9px] font-black text-white uppercase tracking-widest">Accepted Answer</span>
                </div>
              )}
              <div className="p-5 bg-canvas">
                <div className="flex items-center gap-2 mb-3">
                  <Avatar name={answer.profiles?.full_name ?? null} avatarUrl={answer.profiles?.avatar_url ?? null} size={7} />
                  <span className="font-mono text-[9px] font-bold text-ink">{answer.profiles?.full_name ?? 'Student'}</span>
                  <span className="font-mono text-[9px] text-ink/40">{timeAgo(answer.created_at)}</span>
                </div>
                <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap mb-4">{answer.body}</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleUpvoteAnswer(answer.id)}
                    className="flex items-center gap-1.5 border-4 border-ink px-3 py-1.5 font-mono text-[10px] font-black uppercase transition-all hover:bg-ink hover:text-white"
                    style={userUpvotes.has(answer.id) ? { backgroundColor: '#1D4ED8', color: 'white', borderColor: '#1D4ED8' } : {}}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" /> {answer.upvotes}
                  </button>
                  {currentUserId === question.user_id && !question.is_resolved && (
                    <button
                      onClick={() => handleAcceptAnswer(answer.id)}
                      className="flex items-center gap-1.5 border-4 border-green text-green px-3 py-1.5 font-mono text-[10px] font-black uppercase hover:bg-green hover:text-white transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Accept
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {answers.length === 0 && (
            <div className="border-4 border-ink border-dashed p-8 text-center">
              <p className="font-display text-lg font-black text-ink/30 mb-2">No answers yet</p>
              <p className="font-mono text-[10px] text-ink/30 uppercase tracking-wider">Be the first to help your classmate</p>
            </div>
          )}
        </div>
      </div>

      {/* Post answer */}
      {currentUserId ? (
        <div className="border-4 border-ink overflow-hidden shadow-hard">
          <div className="border-b-4 border-ink px-5 py-3 bg-ink">
            <span className="font-mono text-[10px] font-black text-yellow-bright uppercase tracking-widest">Post Your Answer</span>
          </div>
          <div className="p-5 bg-canvas">
            <textarea
              value={answerBody}
              onChange={e => setAnswerBody(e.target.value)}
              rows={5}
              className="w-full border-4 border-ink px-4 py-3 text-sm text-ink focus:outline-none focus:border-green resize-none shadow-hard-sm mb-3"
              placeholder="Write a clear, helpful answer. Include the technical reasoning, not just the answer."
            />
            <button onClick={handlePostAnswer} disabled={submitting || !answerBody.trim()} className="cn-btn-black text-sm disabled:opacity-40">
              {submitting ? 'Posting...' : <><Send className="w-4 h-4" /> Post Answer</>}
            </button>
          </div>
        </div>
      ) : (
        <div className="border-4 border-ink p-5 text-center shadow-hard">
          <p className="font-bold text-ink mb-3">Sign in to post an answer</p>
          <Link href="/login" className="cn-btn-black text-sm">Sign In</Link>
        </div>
      )}
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function ForumPage() {
  const supabase = createClient()
  const [questions, setQuestions] = useState<Question[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [filter, setFilter] = useState<'latest' | 'top' | 'unresolved'>('latest')
  const [search, setSearch] = useState('')
  const [showAsk, setShowAsk] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setCurrentUserId(session?.user.id ?? null)

      const { data: subs } = await supabase.from('subjects').select('id, name, slug').order('order_index')
      setSubjects(subs ?? [])

      await loadQuestions()
    }
    init()
  }, [])

  useEffect(() => { loadQuestions() }, [selectedSubject, filter, search])

  const loadQuestions = async () => {
    setLoading(true)
    let query = supabase
      .from('forum_questions')
      .select('*, subjects(name, slug)')

    if (selectedSubject !== 'all') query = query.eq('subject_id', selectedSubject)
    if (filter === 'unresolved') query = query.eq('is_resolved', false)
    if (search) query = query.ilike('title', `%${search}%`)
    if (filter === 'top') query = query.order('upvotes', { ascending: false })
    else query = query.order('is_pinned', { ascending: false }).order('created_at', { ascending: false })

    const { data: rawQuestions } = await query.limit(50)
    
    if (!rawQuestions || rawQuestions.length === 0) {
      setQuestions([])
      setLoading(false)
      return
    }

    const userIds = Array.from(new Set(rawQuestions.map((q: { user_id: string }) => q.user_id)))
    const profileMap = new Map<string, { full_name: string | null; avatar_url: string | null }>()
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', userIds)
      
      profiles?.forEach(p => profileMap.set(p.id, { full_name: p.full_name, avatar_url: p.avatar_url }))
    }

    const formatted: Question[] = rawQuestions.map((q: {
      id: string
      user_id: string
      subject_id: string | null
      lesson_id: string | null
      title: string
      body: string
      upvotes: number
      answer_count: number
      is_resolved: boolean
      is_pinned: boolean
      created_at: string
      subjects?: { name: string; slug: string }
    }) => ({
      ...q,
      profiles: profileMap.get(q.user_id) || { full_name: 'Student', avatar_url: null }
    }))

    setQuestions(formatted)
    setLoading(false)
  }

  if (selectedQuestion) {
    return (
      <div className="min-h-screen bg-canvas">
        <div className="h-2 bg-violet" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <QuestionDetail
            question={selectedQuestion}
            onBack={() => { setSelectedQuestion(null); loadQuestions() }}
            currentUserId={currentUserId}
            onUpdate={loadQuestions}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas">
      <div className="h-2 bg-violet" />

      {/* Hero */}
      <section className="border-b-4 border-ink bg-ink px-6 md:px-12 py-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-5xl mx-auto flex items-end justify-between gap-6 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-violet border-4 border-violet flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="font-mono text-[10px] font-black text-yellow-bright border-2 border-yellow-bright px-3 py-1 uppercase tracking-widest">Student Forum</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-black text-white leading-none mb-3">
              ASK. ANSWER.<br />
              <span className="text-yellow-bright italic">LEARN TOGETHER.</span>
            </h1>
            <p className="text-white/70 max-w-lg leading-relaxed">
              {questions.length} questions from PPE students across India. Ask anything — classmates and the AI Tutor are here to help.
            </p>
          </div>
          <button onClick={() => currentUserId ? setShowAsk(true) : window.location.href = '/login'}
            className="cn-btn-yellow text-sm flex-shrink-0">
            <Plus className="w-4 h-4" /> Ask a Question
          </button>
        </div>
      </section>

      {/* Filters */}
      <div className="border-b-4 border-ink px-6 md:px-10 py-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full border-4 border-ink pl-10 pr-4 py-2 text-sm text-ink focus:outline-none focus:border-violet shadow-hard-sm"
            placeholder="Search questions..." />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['latest', 'top', 'unresolved'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="font-mono text-[10px] font-black border-4 border-ink px-3 py-2 uppercase tracking-wider transition-all"
              style={{ backgroundColor: filter === f ? '#0A0A0A' : 'white', color: filter === f ? '#FACC15' : '#6B7280', boxShadow: filter === f ? '2px 2px 0px 0px #7C3AED' : '2px 2px 0px 0px #0A0A0A' }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Subject sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <div className="font-mono text-[9px] font-bold text-ink/40 uppercase tracking-widest mb-3">Filter by Subject</div>
          <button onClick={() => setSelectedSubject('all')}
            className="w-full text-left border-4 border-ink px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-wider transition-all"
            style={{ backgroundColor: selectedSubject === 'all' ? '#0A0A0A' : 'white', color: selectedSubject === 'all' ? 'white' : '#0A0A0A' }}>
            All Subjects
          </button>
          {subjects.map(s => {
            const dc = SUBJECT_COLORS[s.slug] ?? { color: '#7C3AED', bg: '#F5F3FF' }
            const isActive = selectedSubject === s.id
            return (
              <button key={s.id} onClick={() => setSelectedSubject(s.id)}
                className="w-full text-left border-4 border-ink px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-wider transition-all"
                style={{
                  backgroundColor: isActive ? dc.color : 'white',
                  color: isActive ? 'white' : '#0A0A0A',
                  boxShadow: `2px 2px 0px 0px ${dc.color}`,
                }}>
                {s.name.replace('Polymer ', '').replace(' & Bioplastics', '')}
              </button>
            )
          })}
        </div>

        {/* Questions list */}
        <div className="lg:col-span-3 space-y-3">
          {loading ? (
            <div className="border-4 border-ink p-8 text-center shadow-hard">
              <div className="font-display text-lg font-black text-ink animate-pulse">Loading questions...</div>
            </div>
          ) : questions.length === 0 ? (
            <div className="border-4 border-ink border-dashed p-12 text-center">
              <MessageCircle className="w-10 h-10 mx-auto mb-3 text-ink/20" />
              <p className="font-display text-xl font-black text-ink/30 mb-2">No questions yet</p>
              <p className="font-mono text-[10px] text-ink/30 uppercase tracking-wider mb-4">Be the first to ask something</p>
              <button onClick={() => currentUserId ? setShowAsk(true) : window.location.href = '/login'}
                className="cn-btn-black text-sm">
                Ask the First Question
              </button>
            </div>
          ) : (
            questions.map(q => {
              const dc = q.subjects ? SUBJECT_COLORS[q.subjects.slug] ?? { color: '#7C3AED', bg: '#F5F3FF' } : { color: '#7C3AED', bg: '#F5F3FF' }
              return (
                <button key={q.id} onClick={() => setSelectedQuestion(q)}
                  className="w-full text-left border-4 border-ink overflow-hidden group transition-all"
                  style={{
                    boxShadow: `3px 3px 0px 0px ${q.is_resolved ? '#15803D' : dc.color}`,
                    transition: 'transform 0.1s ease, box-shadow 0.1s ease',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.transform = 'translate(-2px, -2px)'
                    el.style.boxShadow = `5px 5px 0px 0px ${q.is_resolved ? '#15803D' : dc.color}`
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.transform = 'translate(0,0)'
                    el.style.boxShadow = `3px 3px 0px 0px ${q.is_resolved ? '#15803D' : dc.color}`
                  }}
                >
                  <div className="flex items-start gap-4 p-5">
                    {/* Stats */}
                    <div className="flex-shrink-0 text-center space-y-2">
                      <div className="border-2 border-ink px-2 py-1 text-center">
                        <div className="font-mono text-sm font-black text-ink">{q.upvotes}</div>
                        <div className="font-mono text-[7px] text-ink/40 uppercase">votes</div>
                      </div>
                      <div className="border-2 px-2 py-1 text-center" style={{ borderColor: q.answer_count > 0 ? '#15803D' : '#D1D5DB' }}>
                        <div className="font-mono text-sm font-black" style={{ color: q.answer_count > 0 ? '#15803D' : '#9CA3AF' }}>{q.answer_count}</div>
                        <div className="font-mono text-[7px] uppercase" style={{ color: q.answer_count > 0 ? '#15803D' : '#9CA3AF' }}>answers</div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-2 flex-wrap">
                        {q.is_pinned && <span className="font-mono text-[8px] font-black border-2 border-yellow bg-yellow-light text-yellow px-1.5 py-0.5 uppercase" style={{ borderColor: '#CA8A04', color: '#CA8A04', backgroundColor: '#FEFCE8' }}>📌 Pinned</span>}
                        {q.is_resolved && <span className="font-mono text-[8px] font-black border-2 border-green text-green px-1.5 py-0.5 uppercase flex items-center gap-0.5"><CheckCircle className="w-2.5 h-2.5" /> Resolved</span>}
                        {q.subjects && <span className="font-mono text-[8px] font-black border-2 px-1.5 py-0.5 uppercase" style={{ borderColor: dc.color, color: dc.color }}>{q.subjects.name.replace('Polymer ', '')}</span>}
                      </div>
                      <h3 className="font-display text-base font-black text-ink leading-tight mb-1 group-hover:underline" style={{ textDecorationColor: dc.color }}>
                        {q.title}
                      </h3>
                      <p className="text-sm text-ink/60 leading-relaxed line-clamp-2 mb-3">{q.body}</p>
                      <div className="flex items-center gap-3">
                        <Avatar name={q.profiles?.full_name ?? null} avatarUrl={q.profiles?.avatar_url ?? null} size={5} />
                        <span className="font-mono text-[9px] text-ink/50">{q.profiles?.full_name ?? 'Student'}</span>
                        <span className="font-mono text-[9px] text-ink/30">{timeAgo(q.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>

      {showAsk && (
        <AskModal subjects={subjects} onClose={() => setShowAsk(false)} onSubmit={loadQuestions} />
      )}
    </div>
  )
}
