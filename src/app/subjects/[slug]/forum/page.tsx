'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import {
  MessageSquare, Plus, Search, ArrowLeft, ThumbsUp,
  CheckCircle, Pin, User as UserIcon,
  ExternalLink, ChevronRight, X, AlertCircle, Brain
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Subject {
  id: string
  name: string
  slug: string
  description: string | null
}

interface Lesson {
  id: string
  title: string
  slug: string
  order_index: number
}

interface Author {
  id: string
  full_name: string | null
  avatar_url: string | null
}

interface ForumQuestion {
  id: string
  user_id: string
  subject_id: string
  lesson_id: string | null
  title: string
  body: string
  tags: string[] | null
  upvotes: number
  answer_count: number
  is_resolved: boolean
  is_pinned: boolean
  created_at: string
  updated_at: string
  author: Author
  lesson?: Lesson
}

interface ForumAnswer {
  id: string
  question_id: string
  user_id: string
  body: string
  upvotes: number
  is_accepted: boolean
  created_at: string
  updated_at: string
  author: Author
}

const DOMAIN_COLORS: Record<string, string> = {
  'polymer-chemistry': '#1D4ED8',
  'polymer-processing': '#EA580C',
  'mould-design': '#EA580C',
  'polymer-testing': '#7C3AED',
  'rubber-technology': '#EA580C',
  'recycling-technology': '#15803D',
  'sustainable-plastics': '#15803D',
  'polymer-composites': '#1D4ED8',
  'entrepreneurship-plastics': '#CA8A04',
  'medical-plastics': '#7C3AED',
}

export default function SubjectForumPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const colorTheme = DOMAIN_COLORS[slug] ?? '#7C3AED'

  const [user, setUser] = useState<User | null>(null)
  const [subject, setSubject] = useState<Subject | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  
  // Forum list & filters
  const [questions, setQuestions] = useState<ForumQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'unresolved' | 'resolved' | 'pinned'>('all')
  const [sort, setSort] = useState<'newest' | 'upvotes'>('newest')

  // Active question & replies
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null)
  const [activeQuestion, setActiveQuestion] = useState<ForumQuestion | null>(null)
  const [answers, setAnswers] = useState<ForumAnswer[]>([])
  const [answersLoading, setAnswersLoading] = useState(false)
  const [userUpvotes, setUserUpvotes] = useState<Set<string>>(new Set())

  // Forms state
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newBody, setNewBody] = useState('')
  const [newTags, setNewTags] = useState('')
  const [newLessonId, setNewLessonId] = useState('')
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false)

  const [newAnswerBody, setNewAnswerBody] = useState('')
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false)

  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const supabase = createClient()

  // ─── Loaders (useCallback to avoid hook dependency loops) ───────────────────

  const loadUserUpvotes = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('forum_upvotes')
      .select('question_id, answer_id')
      .eq('user_id', userId)

    const set = new Set<string>()
    data?.forEach(v => {
      if (v.question_id) set.add(v.question_id)
      if (v.answer_id) set.add(v.answer_id)
    })
    setUserUpvotes(set)
  }, [supabase])

  const loadQuestions = useCallback(async (subId?: string) => {
    const activeSubId = subId || subject?.id
    if (!activeSubId) return

    const { data: rawQuestions } = await supabase
      .from('forum_questions')
      .select('*, lessons(id, title, slug, order_index)')
      .eq('subject_id', activeSubId)
      .order(sort === 'newest' ? 'created_at' : 'upvotes', { ascending: false })

    if (!rawQuestions) {
      setQuestions([])
      return
    }

    // Stitch authors
    const userIds = Array.from(new Set(rawQuestions.map((q: { user_id: string }) => q.user_id)))
    const profileMap = new Map<string, { id: string; full_name: string | null; avatar_url: string | null }>()
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', userIds)
      
      profiles?.forEach(p => profileMap.set(p.id, p))
    }

    const formatted: ForumQuestion[] = rawQuestions.map((q: {
      id: string
      user_id: string
      subject_id: string
      lesson_id: string | null
      title: string
      body: string
      tags: string[] | null
      upvotes: number
      answer_count: number
      is_resolved: boolean
      is_pinned: boolean
      created_at: string
      updated_at: string
      lessons: { id: string; title: string; slug: string; order_index: number } | null
    }) => ({
      ...q,
      author: profileMap.get(q.user_id) || { id: q.user_id, full_name: 'Student', avatar_url: null },
      lesson: q.lessons ? {
        id: q.lessons.id,
        title: q.lessons.title,
        slug: q.lessons.slug,
        order_index: q.lessons.order_index
      } : undefined
    }))

    setQuestions(formatted)

    // Sync active question if open
    if (activeQuestionId) {
      const updatedActive = formatted.find(q => q.id === activeQuestionId)
      if (updatedActive) {
        setActiveQuestion(updatedActive)
      }
    }
  }, [supabase, subject, sort, activeQuestionId])

  const loadAnswers = useCallback(async (qId?: string) => {
    const targetQId = qId || activeQuestionId
    if (!targetQId) return

    setAnswersLoading(true)
    const { data: rawAnswers } = await supabase
      .from('forum_answers')
      .select('*')
      .eq('question_id', targetQId)
      .order('is_accepted', { ascending: false })
      .order('created_at', { ascending: true })

    if (!rawAnswers) {
      setAnswers([])
      setAnswersLoading(false)
      return
    }

    const userIds = Array.from(new Set(rawAnswers.map((a: { user_id: string }) => a.user_id)))
    const profileMap = new Map<string, { id: string; full_name: string | null; avatar_url: string | null }>()
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', userIds)
      
      profiles?.forEach(p => profileMap.set(p.id, p))
    }

    const formatted: ForumAnswer[] = rawAnswers.map((a: {
      id: string
      question_id: string
      user_id: string
      body: string
      upvotes: number
      is_accepted: boolean
      created_at: string
      updated_at: string
    }) => ({
      ...a,
      author: profileMap.get(a.user_id) || { id: a.user_id, full_name: 'Student', avatar_url: null }
    }))

    setAnswers(formatted)
    setAnswersLoading(false)
  }, [supabase, activeQuestionId])

  // ─── Init Load ─────────────────────────────────────────────────────────────

  useEffect(() => {
    async function init() {
      setLoading(true)
      
      // Get user
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      setUser(currentUser)

      if (currentUser) {
        loadUserUpvotes(currentUser.id)
      }

      // Get subject
      const { data: currentSubject } = await supabase
        .from('subjects')
        .select('*')
        .eq('slug', slug)
        .single()

      if (!currentSubject) {
        router.push('/subjects')
        return
      }
      setSubject(currentSubject)

      // Fetch lessons
      const { data: subjectLessons } = await supabase
        .from('lessons')
        .select('id, title, slug, order_index')
        .eq('subject_id', currentSubject.id)
        .order('order_index')
      
      setLessons(subjectLessons ?? [])
      
      // Load initial questions
      await loadQuestions(currentSubject.id)
      setLoading(false)
    }

    init()
  }, [slug, supabase, router, loadUserUpvotes, loadQuestions])

  // ─── Realtime Subscriptions ─────────────────────────────────────────────────

  useEffect(() => {
    if (!subject) return

    const channel = supabase
      .channel(`forum-subject-realtime-${subject.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'forum_questions', filter: `subject_id=eq.${subject.id}` },
        () => {
          loadQuestions()
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'forum_answers' },
        () => {
          loadAnswers()
          loadQuestions()
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'forum_upvotes' },
        () => {
          loadQuestions()
          loadAnswers()
          if (user) loadUserUpvotes(user.id)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [subject, activeQuestionId, sort, user, loadQuestions, loadAnswers, loadUserUpvotes, supabase])

  // ─── Event handlers ─────────────────────────────────────────────────────────

  const handleSelectQuestion = (qId: string) => {
    setActiveQuestionId(qId)
    const q = questions.find(item => item.id === qId)
    setActiveQuestion(q || null)
    loadAnswers(qId)
    setShowCreateForm(false)
  }

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !subject) return
    setIsSubmittingQuestion(true)
    setErrorMsg(null)

    const tagsArr = newTags
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0)

    const { error } = await supabase
      .from('forum_questions')
      .insert({
        user_id: user.id,
        subject_id: subject.id,
        lesson_id: newLessonId || null,
        title: newTitle,
        body: newBody,
        tags: tagsArr.length > 0 ? tagsArr : null
      })

    if (error) {
      setErrorMsg(error.message)
      setIsSubmittingQuestion(false)
      return
    }

    setNewTitle('')
    setNewBody('')
    setNewTags('')
    setNewLessonId('')
    setShowCreateForm(false)
    setIsSubmittingQuestion(false)
    loadQuestions()
  }

  const handleCreateAnswer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !activeQuestionId) return
    setIsSubmittingAnswer(true)
    setErrorMsg(null)

    const { error } = await supabase
      .from('forum_answers')
      .insert({
        question_id: activeQuestionId,
        user_id: user.id,
        body: newAnswerBody
      })

    if (error) {
      setErrorMsg(error.message)
      setIsSubmittingAnswer(false)
      return
    }

    setNewAnswerBody('')
    setIsSubmittingAnswer(false)
    loadAnswers()
  }

  const handleUpvoteQuestion = async (qId: string) => {
    if (!user) {
      setErrorMsg('Sign in to upvote questions.')
      return
    }

    const isAlreadyUpvoted = userUpvotes.has(qId)
    if (isAlreadyUpvoted) {
      await supabase
        .from('forum_upvotes')
        .delete()
        .eq('user_id', user.id)
        .eq('question_id', qId)
      
      setUserUpvotes(prev => {
        const next = new Set(prev)
        next.delete(qId)
        return next
      })
    } else {
      await supabase
        .from('forum_upvotes')
        .insert({
          user_id: user.id,
          question_id: qId
        })

      setUserUpvotes(prev => {
        const next = new Set(prev)
        next.add(qId)
        return next
      })
    }
    loadQuestions()
  }

  const handleUpvoteAnswer = async (aId: string) => {
    if (!user) {
      setErrorMsg('Sign in to upvote replies.')
      return
    }

    const isAlreadyUpvoted = userUpvotes.has(aId)
    if (isAlreadyUpvoted) {
      await supabase
        .from('forum_upvotes')
        .delete()
        .eq('user_id', user.id)
        .eq('answer_id', aId)
      
      setUserUpvotes(prev => {
        const next = new Set(prev)
        next.delete(aId)
        return next
      })
    } else {
      await supabase
        .from('forum_upvotes')
        .insert({
          user_id: user.id,
          answer_id: aId
        })

      setUserUpvotes(prev => {
        const next = new Set(prev)
        next.add(aId)
        return next
      })
    }
    loadAnswers()
  }

  const handleToggleResolve = async () => {
    if (!user || !activeQuestion || activeQuestion.user_id !== user.id) return

    const { error } = await supabase
      .from('forum_questions')
      .update({ is_resolved: !activeQuestion.is_resolved })
      .eq('id', activeQuestion.id)

    if (!error) {
      loadQuestions()
    }
  }

  const handleAcceptAnswer = async (answerId: string, currentAccepted: boolean) => {
    if (!user || !activeQuestion || activeQuestion.user_id !== user.id) return

    // Unaccept all other answers for this question
    if (!currentAccepted) {
      await supabase
        .from('forum_answers')
        .update({ is_accepted: false })
        .eq('question_id', activeQuestion.id)
    }

    const { error } = await supabase
      .from('forum_answers')
      .update({ is_accepted: !currentAccepted })
      .eq('id', answerId)

    if (!error) {
      // Automatically resolve the question if accepting an answer
      if (!currentAccepted && !activeQuestion.is_resolved) {
        await supabase
          .from('forum_questions')
          .update({ is_resolved: true })
          .eq('id', activeQuestion.id)
      }
      loadAnswers()
      loadQuestions()
    }
  }

  // ─── Filters & Search ────────────────────────────────────────────────────────

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(search.toLowerCase()) || 
                          q.body.toLowerCase().includes(search.toLowerCase()) ||
                          (q.tags && q.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))

    const matchesFilter = filter === 'all' ? true :
                          filter === 'resolved' ? q.is_resolved :
                          filter === 'unresolved' ? !q.is_resolved :
                          filter === 'pinned' ? q.is_pinned : true

    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-canvas pb-12">
      <div className="h-2" style={{ backgroundColor: colorTheme }} />

      {/* Header */}
      <div className="border-b-4 border-ink px-6 md:px-10 py-5 flex items-center justify-between flex-wrap gap-4" style={{ backgroundColor: colorTheme + '12' }}>
        <div className="flex items-center gap-3">
          <Link href={`/subjects/${slug}`} className="w-8 h-8 border-4 border-ink bg-white flex items-center justify-center hover:translate-x-[-2px] transition-transform">
            <ArrowLeft className="w-4 h-4 text-ink" />
          </Link>
          <div>
            <div className="font-mono text-[9px] font-black uppercase tracking-widest text-ink/40">Subject Forum</div>
            <h1 className="font-display text-2xl font-black text-ink uppercase leading-none mt-1">
              {subject?.name} Discussion
            </h1>
          </div>
        </div>

        <Link href="/subjects" className="font-mono text-[10px] font-bold text-ink/50 hover:text-ink uppercase tracking-wider flex items-center gap-1 transition-colors">
          All Subjects <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {errorMsg && (
        <div className="max-w-7xl mx-auto px-4 md:px-6 mt-4">
          <div className="border-4 border-ink bg-orange-light text-ink px-4 py-3 flex items-center justify-between shadow-hard-sm">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-orange" />
              <span className="font-mono text-xs font-bold">{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg(null)}>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="font-mono text-sm font-black text-ink/40 animate-pulse uppercase tracking-widest">Loading Discussion Boards...</div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 md:px-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* ─── LEFT: Questions List (5 cols) ────────────────────────────────── */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Toolbar */}
              <div className="border-4 border-ink p-4 bg-white shadow-hard-sm space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search titles, tags, content..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full border-4 border-ink pl-10 pr-4 py-2 font-mono text-xs font-bold"
                  />
                  <Search className="w-4 h-4 text-ink/40 absolute left-4.5 top-3.5" />
                </div>

                <div className="flex gap-2 flex-wrap items-center justify-between pt-1">
                  <div className="flex gap-1 flex-wrap">
                    {(['all', 'unresolved', 'resolved', 'pinned'] as const).map(f => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className="font-mono text-[9px] border-2 px-2.5 py-1 uppercase font-bold tracking-wider transition-colors"
                        style={filter === f ? { backgroundColor: colorTheme, borderColor: colorTheme, color: 'white' } : { borderColor: '#E5E7EB', color: '#6B7280' }}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                  
                  <select
                    value={sort}
                    onChange={e => {
                      setSort(e.target.value as 'newest' | 'upvotes')
                      loadQuestions()
                    }}
                    className="font-mono text-[9px] font-bold border-2 border-ink/20 px-2 py-1 uppercase bg-white cursor-pointer"
                  >
                    <option value="newest">Newest</option>
                    <option value="upvotes">Upvoted</option>
                  </select>
                </div>

                {user ? (
                  <button
                    onClick={() => {
                      setShowCreateForm(true)
                      setActiveQuestionId(null)
                      setActiveQuestion(null)
                    }}
                    className="w-full font-mono text-xs font-black uppercase tracking-wider border-4 border-ink py-2.5 transition-all text-center flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: showCreateForm ? '#E5E7EB' : colorTheme,
                      color: showCreateForm ? '#0A0A0A' : 'white',
                      boxShadow: showCreateForm ? '0px 0px 0px 0px #000' : '3px 3px 0px 0px #0A0A0A'
                    }}
                  >
                    <Plus className="w-4 h-4" /> Start New Discussion
                  </button>
                ) : (
                  <Link href="/login" className="cn-btn-yellow w-full justify-center text-xs">
                    Sign In to Ask a Question
                  </Link>
                )}
              </div>

              {/* Questions Stack */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {filteredQuestions.length === 0 ? (
                  <div className="border-4 border-ink p-8 bg-canvas text-center">
                    <MessageSquare className="w-8 h-8 text-ink/30 mx-auto mb-2" />
                    <p className="font-mono text-xs font-bold text-ink/50 uppercase tracking-wide">No questions found</p>
                  </div>
                ) : (
                  filteredQuestions.map(q => {
                    const isActive = q.id === activeQuestionId
                    const authorName = q.author?.full_name || 'Anonymous Student'
                    
                    return (
                      <div
                        key={q.id}
                        onClick={() => handleSelectQuestion(q.id)}
                        className="border-4 border-ink bg-white p-4 cursor-pointer transition-all hover:translate-y-[-2px]"
                        style={{
                          borderColor: isActive ? colorTheme : '#0A0A0A',
                          boxShadow: isActive ? `4px 4px 0px 0px ${colorTheme}` : '3px 3px 0px 0px #0A0A0A'
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          {q.is_pinned && (
                            <span className="font-mono text-[8px] bg-red text-white px-1.5 py-0.5 uppercase font-bold flex items-center gap-0.5">
                              <Pin className="w-2.5 h-2.5 fill-current" /> Pinned
                            </span>
                          )}
                          {q.is_resolved ? (
                            <span className="font-mono text-[8px] bg-green text-white px-1.5 py-0.5 uppercase font-bold flex items-center gap-0.5">
                              <CheckCircle className="w-2.5 h-2.5" /> Resolved
                            </span>
                          ) : (
                            <span className="font-mono text-[8px] bg-[#FEFCE8] text-yellow-800 border border-yellow-200 px-1.5 py-0.5 uppercase font-bold">
                              Open
                            </span>
                          )}
                          <span className="font-mono text-[8px] text-ink/40 ml-auto uppercase">
                            {new Date(q.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>

                        <h3 className="font-bold text-sm text-ink mb-2 leading-tight group-hover:underline">
                          {q.title}
                        </h3>

                        <p className="text-xs text-ink/60 line-clamp-2 mb-3 leading-relaxed">
                          {q.body}
                        </p>

                        <div className="flex items-center justify-between border-t-2 border-ink/5 pt-3 flex-wrap gap-2">
                          <span className="font-mono text-[8px] font-bold text-ink/50 uppercase tracking-wide">
                            by {authorName}
                          </span>
                          
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-[8px] font-bold text-ink/60 uppercase">
                              👍 {q.upvotes}
                            </span>
                            <span className="font-mono text-[8px] font-bold text-ink/60 uppercase">
                              💬 {q.answer_count} replies
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* ─── RIGHT: Main Pane (7 cols) ───────────────────────────────────── */}
            <div className="lg:col-span-7">
              
              {/* Placeholder */}
              {!activeQuestion && !showCreateForm && (
                <div className="border-4 border-ink bg-canvas p-12 text-center shadow-hard">
                  <Brain className="w-12 h-12 text-ink/30 mx-auto mb-4" />
                  <h3 className="font-display text-lg font-black text-ink uppercase mb-2">Subject Discussion Workspace</h3>
                  <p className="text-sm text-ink/50 max-w-sm mx-auto leading-relaxed">
                    Select a question on the left to read and answer, or launch a new topic to discuss with other engineering students.
                  </p>
                </div>
              )}

              {/* Creation Form */}
              {showCreateForm && (
                <div className="border-4 border-ink bg-white p-6 shadow-hard animate-fade-up">
                  <div className="flex justify-between items-center border-b-4 border-ink pb-3 mb-5">
                    <h2 className="font-display text-xl font-black text-ink uppercase flex items-center gap-2">
                      <Plus className="w-5 h-5" /> Start New Discussion
                    </h2>
                    <button onClick={() => setShowCreateForm(false)}>
                      <X className="w-5 h-5 text-ink/50 hover:text-ink" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateQuestion} className="space-y-4">
                    <div>
                      <label className="block font-mono text-[10px] font-bold text-ink/60 uppercase tracking-wider mb-1">Question Title</label>
                      <input
                        type="text"
                        required
                        placeholder="What is your question? Be specific..."
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        className="w-full border-4 border-ink px-3 py-2 text-sm font-bold text-ink"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono text-[10px] font-bold text-ink/60 uppercase tracking-wider mb-1">Related Lesson (Optional)</label>
                        <select
                          value={newLessonId}
                          onChange={e => setNewLessonId(e.target.value)}
                          className="w-full border-4 border-ink px-3 py-2 text-xs font-bold text-ink bg-white cursor-pointer"
                        >
                          <option value="">-- No specific lesson --</option>
                          {lessons.map(l => (
                            <option key={l.id} value={l.id}>
                              Lesson {l.order_index}: {l.title.slice(0, 35)}...
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] font-bold text-ink/60 uppercase tracking-wider mb-1">Tags (Comma-separated)</label>
                        <input
                          type="text"
                          placeholder="e.g. extrusion, melt-strength, pvc"
                          value={newTags}
                          onChange={e => setNewTags(e.target.value)}
                          className="w-full border-4 border-ink px-3 py-2 text-xs font-bold text-ink"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] font-bold text-ink/60 uppercase tracking-wider mb-1">Details & Context</label>
                      <textarea
                        required
                        rows={8}
                        placeholder="Provide all background information, chemical formulas, parameters, or links. Be clear and helpful..."
                        value={newBody}
                        onChange={e => setNewBody(e.target.value)}
                        className="w-full border-4 border-ink px-3 py-2 text-sm text-ink leading-relaxed"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t-2 border-ink/10">
                      <button
                        type="button"
                        onClick={() => setShowCreateForm(false)}
                        className="border-4 border-ink px-4 py-2 bg-white text-ink font-mono text-xs font-black uppercase tracking-wider hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingQuestion}
                        className="border-4 border-ink px-5 py-2 bg-ink text-white font-mono text-xs font-black uppercase tracking-wider hover:bg-ink/90 disabled:opacity-50"
                        style={{ backgroundColor: colorTheme }}
                      >
                        {isSubmittingQuestion ? 'Posting...' : 'Post Question'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Question Detailed View */}
              {activeQuestion && (
                <div className="space-y-6">
                  
                  {/* The Main Question Card */}
                  <div className="border-4 border-ink bg-white shadow-hard overflow-hidden">
                    
                    {/* Meta bar */}
                    <div className="border-b-4 border-ink px-5 py-3 bg-ink flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-black text-yellow-bright">Q&A</span>
                        {activeQuestion.lesson && (
                          <Link
                            href={`/lessons/${activeQuestion.lesson.slug}`}
                            className="font-mono text-[9px] text-white/70 hover:text-white border border-white/20 px-2 py-0.5 uppercase tracking-wider flex items-center gap-1 transition-colors"
                          >
                            Lesson {activeQuestion.lesson.order_index} <ExternalLink className="w-2.5 h-2.5" />
                          </Link>
                        )}
                        {activeQuestion.tags && activeQuestion.tags.map(t => (
                          <span key={t} className="font-mono text-[8px] bg-white/10 text-white px-2 py-0.5 border border-white/10 uppercase">
                            #{t}
                          </span>
                        ))}
                      </div>
                      
                      {user && activeQuestion.user_id === user.id && (
                        <button
                          onClick={handleToggleResolve}
                          className="font-mono text-[9px] border-2 px-3 py-1 uppercase font-bold tracking-wider transition-colors"
                          style={activeQuestion.is_resolved 
                            ? { backgroundColor: '#15803D', borderColor: '#15803D', color: 'white' } 
                            : { borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.5)' }
                          }
                        >
                          {activeQuestion.is_resolved ? '✓ Resolved' : 'Mark Resolved'}
                        </button>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h2 className="font-display text-xl md:text-2xl font-black text-ink leading-tight mb-4">
                        {activeQuestion.title}
                      </h2>

                      {/* Asker info block */}
                      <div className="flex items-center gap-3 border-b-2 border-ink/5 pb-4 mb-5">
                        <div className="w-8 h-8 rounded-full border-2 border-ink bg-gray-100 flex items-center justify-center font-mono font-black text-xs">
                          {activeQuestion.author?.full_name?.slice(0, 2).toUpperCase() || <UserIcon className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-mono text-xs font-black text-ink">{activeQuestion.author?.full_name || 'Anonymous Student'}</div>
                          <div className="font-mono text-[9px] text-ink/40 uppercase tracking-wide flex items-center gap-2">
                            <span>Posted {new Date(activeQuestion.created_at).toLocaleString()}</span>
                            {activeQuestion.is_resolved && (
                              <span className="text-green font-bold">● Resolved</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Question Body */}
                      <div className="text-sm text-ink leading-relaxed whitespace-pre-wrap mb-6">
                        {activeQuestion.body}
                      </div>

                      {/* Question Actions */}
                      <div className="flex items-center gap-3 pt-4 border-t-2 border-ink/5">
                        <button
                          onClick={() => handleUpvoteQuestion(activeQuestion.id)}
                          className="border-4 border-ink px-4 py-2 flex items-center gap-2 transition-all"
                          style={{
                            backgroundColor: userUpvotes.has(activeQuestion.id) ? colorTheme : 'white',
                            color: userUpvotes.has(activeQuestion.id) ? 'white' : '#0A0A0A',
                            boxShadow: userUpvotes.has(activeQuestion.id) ? '0px 0px 0px 0px #000' : '2px 2px 0px 0px #0A0A0A'
                          }}
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span className="font-mono text-xs font-black">{activeQuestion.upvotes} Upvotes</span>
                        </button>
                      </div>

                    </div>
                  </div>

                  {/* Answers Section */}
                  <div className="space-y-4">
                    <h3 className="font-mono text-[10px] font-bold text-ink/50 uppercase tracking-widest border-b-4 border-ink pb-2">
                      Replies ({answers.length})
                    </h3>

                    {answersLoading ? (
                      <div className="font-mono text-xs text-ink/40 animate-pulse uppercase tracking-wider py-4">Fetching replies...</div>
                    ) : answers.length === 0 ? (
                      <div className="border-4 border-ink p-6 bg-canvas text-center">
                        <MessageSquare className="w-6 h-6 text-ink/20 mx-auto mb-2" />
                        <p className="font-mono text-xs font-bold text-ink/40 uppercase">No replies yet. Be the first to answer!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {answers.map(ans => {
                          const isAsker = activeQuestion.user_id === user?.id
                          const isAnswerAccepted = ans.is_accepted

                          return (
                            <div
                              key={ans.id}
                              className="border-4 border-ink bg-white p-5 transition-all shadow-hard-sm"
                              style={{
                                borderColor: isAnswerAccepted ? '#15803D' : '#0A0A0A',
                              }}
                            >
                              {/* Reply meta */}
                              <div className="flex items-center justify-between border-b-2 border-ink/5 pb-3 mb-4 flex-wrap gap-2">
                                <div className="flex items-center gap-3">
                                  <div className="w-7 h-7 rounded-full border-2 border-ink bg-gray-50 flex items-center justify-center font-mono font-black text-2xs">
                                    {ans.author?.full_name?.slice(0, 2).toUpperCase() || <UserIcon className="w-3.5 h-3.5" />}
                                  </div>
                                  <div>
                                    <div className="font-mono text-xs font-bold text-ink">{ans.author?.full_name || 'Anonymous Student'}</div>
                                    <div className="font-mono text-[9px] text-ink/40 uppercase tracking-wide">
                                      Replied {new Date(ans.created_at).toLocaleString()}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  {isAnswerAccepted && (
                                    <span className="font-mono text-[8px] bg-green text-white px-2 py-0.5 uppercase font-bold flex items-center gap-0.5">
                                      <CheckCircle className="w-2.5 h-2.5" /> Accepted Answer
                                    </span>
                                  )}
                                  
                                  {isAsker && (
                                    <button
                                      onClick={() => handleAcceptAnswer(ans.id, ans.is_accepted)}
                                      className="font-mono text-[8px] border border-ink px-2 py-0.5 uppercase font-bold tracking-wide bg-white hover:bg-gray-50 flex items-center gap-1"
                                    >
                                      {ans.is_accepted ? 'Unaccept' : 'Accept Answer'}
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Reply body */}
                              <div className="text-sm text-ink leading-relaxed whitespace-pre-wrap mb-4">
                                {ans.body}
                              </div>

                              {/* Reply actions */}
                              <div className="flex items-center gap-3 pt-3 border-t border-ink/5">
                                <button
                                  onClick={() => handleUpvoteAnswer(ans.id)}
                                  className="border-2 border-ink px-3 py-1 flex items-center gap-1.5 transition-all text-xs"
                                  style={{
                                    backgroundColor: userUpvotes.has(ans.id) ? colorTheme : 'white',
                                    color: userUpvotes.has(ans.id) ? 'white' : '#0A0A0A',
                                  }}
                                >
                                  <ThumbsUp className="w-3 h-3" />
                                  <span className="font-mono text-[10px] font-black">{ans.upvotes}</span>
                                </button>
                              </div>

                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* Reply Input Form */}
                  <div className="border-4 border-ink p-5 bg-white shadow-hard-sm">
                    <h4 className="font-mono text-[10px] font-black text-ink uppercase tracking-widest mb-3">Add Your Reply</h4>
                    {user ? (
                      <form onSubmit={handleCreateAnswer} className="space-y-3">
                        <textarea
                          required
                          rows={4}
                          placeholder="Share your explanation, insights, or ask follow-up questions..."
                          value={newAnswerBody}
                          onChange={e => setNewAnswerBody(e.target.value)}
                          className="w-full border-4 border-ink px-3 py-2 text-sm text-ink leading-relaxed"
                        />
                        <button
                          type="submit"
                          disabled={isSubmittingAnswer}
                          className="cn-btn text-xs justify-center ml-auto font-black uppercase"
                          style={{ backgroundColor: colorTheme, color: 'white', borderColor: 'transparent' }}
                        >
                          {isSubmittingAnswer ? 'Posting...' : 'Post Reply'}
                        </button>
                      </form>
                    ) : (
                      <div className="border-2 border-dashed border-ink/20 p-4 bg-canvas text-center">
                        <p className="font-mono text-xs text-ink/50 uppercase tracking-wider mb-2">Sign in to participate in discussion</p>
                        <Link href="/login" className="cn-btn-black inline-flex text-xs py-1.5 px-4">Sign In</Link>
                      </div>
                    )}
                  </div>

                </div>
              )}

            </div>

          </div>
        </div>
      )}
    </div>
  )
}
