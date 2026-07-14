'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle, HelpCircle, Check, X, RefreshCw, BookOpen } from 'lucide-react'

// ─── Domain color map ─────────────────────────────────────────────────────────

const DOMAIN: Record<string, { color: string; bg: string; label: string }> = {
  'polymer-chemistry':         { color: '#1D4ED8', bg: '#EFF6FF', label: 'Chemistry & Science' },
  'polymer-processing':        { color: '#EA580C', bg: '#FFF7ED', label: 'Processing & Manufacturing' },
  'mould-design':              { color: '#EA580C', bg: '#FFF7ED', label: 'Processing & Manufacturing' },
  'polymer-testing':           { color: '#7C3AED', bg: '#F5F3FF', label: 'Testing & QA/QC' },
  'rubber-technology':         { color: '#EA580C', bg: '#FFF7ED', label: 'Processing & Manufacturing' },
  'recycling-technology':      { color: '#15803D', bg: '#F0FDF4', label: 'Circular Economy' },
  'sustainable-plastics':      { color: '#15803D', bg: '#F0FDF4', label: 'Circular Economy' },
  'polymer-composites':        { color: '#1D4ED8', bg: '#EFF6FF', label: 'Advanced Materials' },
  'entrepreneurship-plastics': { color: '#CA8A04', bg: '#FEFCE8', label: 'Business' },
  'medical-plastics':          { color: '#7C3AED', bg: '#F5F3FF', label: 'Specialised' },
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Lesson = {
  id: string
  title: string
  slug: string
  subject_id: string
  order_index: number
  subjects: {
    name: string
    slug: string
  } | null
}

type Quiz = {
  id: string
  title: string
  passing_score: number
}

type Question = {
  id: string
  question_text: string
  options: string[]
  correct_index: number
  explanation: string
  difficulty: string
  order_index: number
}

type GradedResult = {
  scorePercentage: number
  passed: boolean
  correctCount: number
  totalQuestions: number
  wrongQuestions: string[]
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function QuizPage({ params }: { params: { slug: string } }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [nextLesson, setNextLesson] = useState<{ slug: string; title: string } | null>(null)

  // Interactive state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [gradedResult, setGradedResult] = useState<GradedResult | null>(null)
  const [startTime] = useState<number>(Date.now())

  useEffect(() => {
    const loadQuizData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          window.location.href = `/login?redirectTo=/quiz/${params.slug}`
          return
        }

        // 1. Fetch lesson
        const { data: lessonData, error: lessonError } = await supabase
          .from('lessons')
          .select('id, title, slug, subject_id, order_index, subjects(name, slug)')
          .eq('slug', params.slug)
          .single()

        if (lessonError || !lessonData) {
          setError('Lesson not found')
          setLoading(false)
          return
        }
        setLesson(lessonData as unknown as Lesson)

        // 2. Fetch quiz
        const { data: quizData, error: quizError } = await supabase
          .from('quizzes')
          .select('id, title, passing_score')
          .eq('lesson_id', lessonData.id)
          .single()

        if (quizError || !quizData) {
          setError('Quiz not found for this lesson')
          setLoading(false)
          return
        }
        setQuiz(quizData)

        // 3. Fetch questions
        const { data: questionsData, error: questionsError } = await supabase
          .from('quiz_questions')
          .select('*')
          .eq('quiz_id', quizData.id)
          .order('order_index')

        if (questionsError || !questionsData || questionsData.length === 0) {
          setError('Questions not found for this quiz')
          setLoading(false)
          return
        }
        setQuestions(questionsData as Question[])

        // 4. Fetch next lesson
        const { data: nextLessonData } = await supabase
          .from('lessons')
          .select('slug, title')
          .eq('subject_id', lessonData.subject_id)
          .eq('order_index', lessonData.order_index + 1)
          .maybeSingle()

        if (nextLessonData) {
          setNextLesson(nextLessonData)
        }

      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'An error occurred'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    loadQuizData()
  }, [params.slug, supabase])

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (gradedResult) return // Read-only after submit
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }))
  }

  const handleSubmitQuiz = async () => {
    if (!quiz || !lesson) return

    // Verify all questions answered
    const unansweredCount = questions.length - Object.keys(selectedAnswers).length
    if (unansweredCount > 0) {
      alert(`Please answer all questions before submitting. (${unansweredCount} remaining)`)
      return
    }

    setIsSubmitting(true)
    try {
      const timeTakenSecs = Math.round((Date.now() - startTime) / 1000)

      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizId: quiz.id,
          lessonId: lesson.id,
          answers: selectedAnswers,
          timeTakenSecs
        })
      })

      const data = await response.json()
      if (response.ok) {
        setGradedResult(data)
      } else {
        alert(data.error || 'Failed to submit quiz')
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred during submission'
      alert(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setSelectedAnswers({})
    setGradedResult(null)
    setCurrentQuestionIndex(0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="border-4 border-ink p-8 shadow-hard font-display text-2xl font-black text-ink animate-pulse">
          Preparing quiz questions...
        </div>
      </div>
    )
  }

  if (error || !lesson || !quiz || questions.length === 0) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center px-4">
        <div className="border-4 border-ink bg-white p-6 md:p-8 max-w-md shadow-hard text-center">
          <AlertCircle className="w-12 h-12 text-orange-600 mx-auto mb-4" />
          <h2 className="font-display text-xl font-black text-ink mb-2">Quiz Load Failed</h2>
          <p className="text-sm text-ink/75 mb-6">{error || 'Could not load quiz details.'}</p>
          <Link href="/dashboard" className="cn-btn-black text-xs inline-flex">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const subjectSlug = lesson.subjects?.slug ?? ''
  const subjectName = lesson.subjects?.name ?? ''
  const domain = DOMAIN[subjectSlug] ?? { color: '#1D4ED8', bg: '#EFF6FF', label: 'Polymer Engineering' }

  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const allAnswered = Object.keys(selectedAnswers).length === questions.length

  return (
    <div className="min-h-screen bg-canvas pb-16">
      <div className="h-2 w-full" style={{ backgroundColor: domain.color }} />

      {/* Breadcrumb Header */}
      <header className="border-b-4 border-ink py-4 px-6" style={{ backgroundColor: domain.bg }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="font-mono text-[9px] font-bold text-ink/40 uppercase tracking-widest block mb-0.5">
              {subjectName} · Lesson {lesson.order_index}
            </span>
            <h1 className="font-display text-lg md:text-xl font-black text-ink truncate">
              {lesson.title}
            </h1>
          </div>
          <Link href={`/lessons/${lesson.slug}`} className="font-mono text-[10px] font-black border-2 border-ink bg-white px-3 py-1.5 hover:bg-ink hover:text-white transition-colors flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" /> Return
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 mt-8">

        {/* ── GRADED RESULT HEADER ─────────────────────────────────────── */}
        {gradedResult && (
          <div
            className="border-4 border-ink p-6 mb-8 text-center"
            style={{
              backgroundColor: gradedResult.passed ? '#F0FDF4' : '#FEF2F2',
              boxShadow: `6px 6px 0px 0px ${gradedResult.passed ? '#15803D' : '#DC2626'}`
            }}
          >
            {gradedResult.passed ? (
              <>
                <div className="w-16 h-16 bg-green border-4 border-ink mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h2 className="font-display text-3xl font-black text-ink mb-1">Lesson Completed!</h2>
                <p className="font-mono text-xs text-ink/60 uppercase tracking-wider mb-4">
                  Passed with {gradedResult.scorePercentage}% Score ({gradedResult.correctCount}/{gradedResult.totalQuestions})
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  {nextLesson ? (
                    <Link href={`/lessons/${nextLesson.slug}`} className="cn-btn-black text-sm">
                      Next Lesson: {nextLesson.title} <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <Link href="/dashboard" className="cn-btn-black text-sm">
                      Back to Dashboard <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                  <button onClick={handleReset} className="font-mono text-[10px] font-black border-2 border-ink px-4 py-2 bg-white hover:bg-ink hover:text-white transition-colors uppercase tracking-wider">
                    Retake Quiz
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-red-600 border-4 border-ink mx-auto mb-4 flex items-center justify-center">
                  <AlertCircle className="w-10 h-10 text-white" />
                </div>
                <h2 className="font-display text-3xl font-black text-ink mb-1">Try Again</h2>
                <p className="font-mono text-xs text-ink/60 uppercase tracking-wider mb-2">
                  Scored {gradedResult.scorePercentage}% · Required: {quiz.passing_score}%
                </p>
                <p className="text-sm text-ink/70 mb-6 max-w-sm mx-auto">
                  Review the questions and explanations below to improve your score on the next attempt.
                </p>
                <div className="flex gap-4 justify-center">
                  <button onClick={handleReset} className="cn-btn-yellow text-sm">
                    <RefreshCw className="w-4 h-4" /> Try Again
                  </button>
                  <Link href={`/lessons/${lesson.slug}`} className="cn-btn-black text-sm">
                    <BookOpen className="w-4 h-4" /> Review Lesson
                  </Link>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── QUESTION NAV / SELECTOR ─────────────────────────────────── */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-6">
          {questions.map((q, idx) => {
            const isAnswered = selectedAnswers[q.id] !== undefined
            const isCurrent = currentQuestionIndex === idx
            const isWrong = gradedResult && gradedResult.wrongQuestions.includes(q.id)
            const isRight = gradedResult && !isWrong

            let btnBg = 'white'
            let btnText = 'text-ink/60'
            let borderColor = 'border-ink/20'

            if (isCurrent) {
              btnBg = '#0B0B0B'
              btnText = 'text-white'
              borderColor = 'border-ink'
            } else if (gradedResult) {
              if (isRight) { btnBg = '#15803D'; btnText = 'text-white'; borderColor = 'border-ink' }
              if (isWrong) { btnBg = '#DC2626'; btnText = 'text-white'; borderColor = 'border-ink' }
            } else if (isAnswered) {
              btnBg = domain.bg
              btnText = 'text-ink font-bold'
              borderColor = 'border-ink'
            }

            return (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`w-9 h-9 border-2 flex items-center justify-center font-mono text-xs uppercase tracking-wider transition-all flex-shrink-0 ${btnText} ${borderColor}`}
                style={{ backgroundColor: btnBg }}
              >
                {idx + 1}
              </button>
            )
          })}
        </div>

        {/* ── QUESTION BODY ───────────────────────────────────────────── */}
        <div
          className="border-4 border-ink bg-white p-6 md:p-8 mb-6"
          style={{ boxShadow: `4px 4px 0px 0px ${domain.color}` }}
        >
          {/* Question Text */}
          <div className="flex items-start gap-3.5 mb-6">
            <HelpCircle className="w-6 h-6 text-ink/40 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-mono text-[9px] font-bold text-ink/40 uppercase tracking-widest block mb-1">
                Question {currentQuestionIndex + 1} of {questions.length} · {currentQuestion.difficulty}
              </span>
              <h2 className="font-display text-lg md:text-xl font-black text-ink leading-snug">
                {currentQuestion.question_text}
              </h2>
            </div>
          </div>

          {/* Options list */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswers[currentQuestion.id] === idx
              const isCorrectAnswer = currentQuestion.correct_index === idx
              const showCorrectness = gradedResult !== null

              let optBg = 'white'
              let optBorder = 'border-ink'
              let optText = 'text-ink'

              if (showCorrectness) {
                if (isCorrectAnswer) {
                  optBg = '#F0FDF4'
                  optBorder = 'border-green-600'
                  optText = 'text-green-800 font-bold'
                } else if (isSelected) {
                  optBg = '#FEF2F2'
                  optBorder = 'border-red-600'
                  optText = 'text-red-800'
                }
              } else if (isSelected) {
                optBg = domain.color
                optText = 'text-white font-bold'
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(currentQuestion.id, idx)}
                  disabled={gradedResult !== null}
                  className={`w-full text-left border-2 p-4 transition-all flex items-center justify-between gap-4 ${optText} ${optBorder}`}
                  style={{ backgroundColor: optBg }}
                >
                  <span className="text-sm leading-relaxed">{option}</span>
                  {isSelected && !showCorrectness && (
                    <span className="w-5 h-5 rounded-full border-2 border-white bg-white/20 flex items-center justify-center flex-shrink-0 text-xs font-black">✓</span>
                  )}
                  {showCorrectness && isCorrectAnswer && (
                    <span className="w-5 h-5 rounded-full bg-green text-white flex items-center justify-center flex-shrink-0 text-[10px] font-black"><Check className="w-3.5 h-3.5" /></span>
                  )}
                  {showCorrectness && isSelected && !isCorrectAnswer && (
                    <span className="w-5 h-5 rounded-full bg-red text-white flex items-center justify-center flex-shrink-0 text-[10px] font-black"><X className="w-3.5 h-3.5" /></span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Explanation block */}
          {gradedResult && (
            <div className="mt-8 border-t-4 border-ink/10 pt-6">
              <span className="font-mono text-[9px] font-black text-ink/40 uppercase tracking-widest block mb-2">Technical Explanation</span>
              <p className="text-sm text-ink/80 leading-relaxed bg-zinc-50 p-4 border-l-4 border-ink italic">
                {currentQuestion.explanation}
              </p>
            </div>
          )}
        </div>

        {/* ── ACTIONS FOOTER ──────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="font-mono text-[10px] font-bold border-2 border-ink px-4 py-2 bg-white hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors uppercase tracking-wider"
            >
              Prev
            </button>
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
              disabled={isLastQuestion}
              className="font-mono text-[10px] font-bold border-2 border-ink px-4 py-2 bg-white hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors uppercase tracking-wider"
            >
              Next
            </button>
          </div>

          <div>
            {!gradedResult ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={isSubmitting || !allAnswered}
                className="cn-btn-black text-xs disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Grading...' : 'Submit Answers'} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleReset}
                className="font-mono text-[10px] font-black border-2 border-ink px-5 py-2.5 bg-yellow-bright hover:bg-ink hover:text-white transition-colors uppercase tracking-wider shadow-hard-sm"
              >
                Retake Attempt
              </button>
            )}
          </div>
        </div>

      </main>
    </div>
  )
}
