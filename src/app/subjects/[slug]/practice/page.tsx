'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { ArrowLeft, Check, X, ArrowRight, Award, HelpCircle, AlertCircle, RefreshCw } from 'lucide-react'

type Subject = {
  id: string
  name: string
  slug: string
  description: string | null
}

type Question = {
  id: string
  subject_id: string
  question: string
  type: 'mcq' | 'short' | 'numerical'
  options: string[] | null // stored as JSONB array of strings
  correct_answer: string
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  topic: string | null
  is_gate_relevant: boolean
}

type UserAnswerState = {
  selected: string
  isSubmitted: boolean
  isCorrect: boolean
}

const DIFFICULTY_COLORS = {
  easy: 'border-green-600 text-green-700 bg-green-50',
  medium: 'border-blue-600 text-blue-700 bg-blue-50',
  hard: 'border-rose-600 text-rose-700 bg-rose-50',
}

export default function SubjectPracticePage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [subject, setSubject] = useState<Subject | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  
  // Quiz state
  const [answers, setAnswers] = useState<Record<string, UserAnswerState>>({})
  const [currentIdx, setCurrentIdx] = useState(0)
  const [submittingAnswerId, setSubmittingAnswerId] = useState<string | null>(null)
  const [quizFinished, setQuizFinished] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      setLoading(true)

      // Get user
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      setUser(currentUser)

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

      // Fetch questions
      const { data: questionList } = await supabase
        .from('practice_questions')
        .select('*')
        .eq('subject_id', currentSubject.id)
        .order('order_index')
      
      // Parse options if they are stored as JSONB
      const parsedQuestions: Question[] = (questionList ?? []).map((q) => {
        let opts = q.options
        if (typeof opts === 'string') {
          try {
            opts = JSON.parse(opts)
          } catch {
            opts = []
          }
        }
        return {
          ...q,
          options: opts,
        }
      })

      setQuestions(parsedQuestions)

      // Load previous answers if logged in
      if (currentUser && parsedQuestions.length > 0) {
        const { data: prevAnswers } = await supabase
          .from('user_answers')
          .select('*')
          .eq('user_id', currentUser.id)
          .in('question_id', parsedQuestions.map(q => q.id))

        if (prevAnswers && prevAnswers.length > 0) {
          const loadedAnswers: Record<string, UserAnswerState> = {}
          prevAnswers.forEach((ans) => {
            const q = parsedQuestions.find(pq => pq.id === ans.question_id)
            if (q) {
              loadedAnswers[ans.question_id] = {
                selected: ans.selected_answer,
                isSubmitted: true,
                isCorrect: ans.is_correct,
              }
            }
          })
          setAnswers(loadedAnswers)
        }
      }

      setLoading(false)
    }

    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  const handleSelectOption = (questionId: string, optionChar: string) => {
    if (answers[questionId]?.isSubmitted) return // cannot change submitted answers
    setAnswers({
      ...answers,
      [questionId]: {
        selected: optionChar,
        isSubmitted: false,
        isCorrect: false,
      }
    })
  }

  const handleSubmitAnswer = async (question: Question) => {
    const answerState = answers[question.id]
    if (!answerState || !answerState.selected || answerState.isSubmitted) return

    setSubmittingAnswerId(question.id)
    const isCorrect = answerState.selected === question.correct_answer

    // Update local state
    const updatedState = {
      ...answerState,
      isSubmitted: true,
      isCorrect,
    }

    setAnswers({
      ...answers,
      [question.id]: updatedState
    })

    // Save to database if logged in
    if (user) {
      await supabase
        .from('user_answers')
        .upsert({
          user_id: user.id,
          question_id: question.id,
          selected_answer: answerState.selected,
          is_correct: isCorrect,
          answered_at: new Date().toISOString()
        }, { onConflict: 'user_id,question_id' })
    }

    setSubmittingAnswerId(null)
  }

  const restartQuiz = async () => {
    if (user && questions.length > 0) {
      setLoading(true)
      // Delete answers in DB
      await supabase
        .from('user_answers')
        .delete()
        .eq('user_id', user.id)
        .in('question_id', questions.map(q => q.id))
      setLoading(false)
    }
    setAnswers({})
    setCurrentIdx(0)
    setQuizFinished(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col justify-center items-center p-6">
        <div className="w-10 h-10 border-4 border-ink border-t-yellow-bright rounded-full animate-spin mb-4" />
        <p className="font-mono text-xs font-black uppercase text-ink/60">Loading practice questions...</p>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-canvas py-12 px-6">
        <div className="max-w-xl mx-auto border-4 border-ink p-8 text-center bg-white shadow-hard">
          <HelpCircle className="w-12 h-12 mx-auto text-ink/40 mb-4" />
          <h2 className="font-display font-black text-2xl text-ink uppercase tracking-tight mb-2">No questions loaded</h2>
          <p className="text-xs font-mono text-ink/50 uppercase tracking-wide mb-6">
            Subject: {subject?.name}
          </p>
          <p className="text-sm text-ink/70 leading-relaxed mb-6">
            We haven&apos;t loaded the practice questions for this subject yet. Please check back later.
          </p>
          <Link href={`/subjects/${slug}`} className="cn-btn-black py-3 px-6 text-xs inline-flex items-center gap-1.5">
            <ArrowLeft className="w-4 h-4" /> Back to Subject
          </Link>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentIdx]
  const currentAnswer = answers[currentQuestion.id]
  const isLast = currentIdx === questions.length - 1

  // Count correct answers
  const correctCount = Object.values(answers).filter(a => a.isSubmitted && a.isCorrect).length

  return (
    <div className="min-h-screen bg-canvas pb-16">
      {/* Top Banner */}
      <section className="border-b-4 border-ink bg-yellow-bright px-6 md:px-12 py-10">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href={`/subjects/${slug}`} className="font-mono text-[9px] font-black border-2 border-ink bg-white text-ink px-2.5 py-1 uppercase tracking-wider hover:bg-ink hover:text-white transition-colors">
                ← {subject?.name}
              </Link>
              <span className="font-mono text-[9px] font-black border-2 border-ink bg-ink text-yellow-bright px-2.5 py-1 uppercase tracking-wider">
                Practice Mode
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-black text-ink uppercase leading-none">
              Practice Quiz
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="border-2 border-ink bg-white px-4 py-2 font-mono text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              Score: {correctCount} / {questions.length}
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {!quizFinished ? (
          /* ── Question Card ── */
          <div className="space-y-6">
            {/* Progress indicator */}
            <div className="flex items-center justify-between font-mono text-[10px] font-black text-ink/40 uppercase tracking-widest">
              <span>Question {currentIdx + 1} of {questions.length}</span>
              <span>{Math.round(((currentIdx) / questions.length) * 100)}% Complete</span>
            </div>

            <div className="w-full bg-slate-200 h-3 border-2 border-ink overflow-hidden shadow-hard-sm">
              <div 
                className="bg-blue h-full transition-all duration-300"
                style={{ width: `${((currentIdx) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question Box */}
            <div className="bg-white border-4 border-ink p-6 md:p-8 shadow-hard relative">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`font-mono text-[9px] font-black border-2 px-2.5 py-0.5 uppercase tracking-wider ${DIFFICULTY_COLORS[currentQuestion.difficulty]}`}>
                  {currentQuestion.difficulty}
                </span>
                {currentQuestion.is_gate_relevant && (
                  <span className="font-mono text-[9px] font-black border-2 border-amber-600 text-amber-700 bg-amber-50 px-2.5 py-0.5 uppercase tracking-wider">
                    GATE Relevant
                  </span>
                )}
                {currentQuestion.topic && (
                  <span className="font-mono text-[9px] font-bold border-2 border-ink/20 text-ink/40 px-2.5 py-0.5 uppercase tracking-wider">
                    Topic: {currentQuestion.topic}
                  </span>
                )}
              </div>

              {/* Question Text */}
              <h2 className="font-display font-black text-lg md:text-xl text-ink leading-snug mb-6">
                {currentQuestion.question}
              </h2>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options?.map((option) => {
                  const optionChar = option.trim().charAt(0) // expects option string to be e.g. "A) Option text"
                  const isSelected = currentAnswer?.selected === optionChar
                  const isSubmitted = currentAnswer?.isSubmitted
                  const isCorrectAnswer = currentQuestion.correct_answer === optionChar
                  
                  let optionStyle = 'border-ink bg-white text-ink hover:bg-slate-50'
                  if (isSelected) {
                    optionStyle = 'border-ink bg-yellow-bright text-ink shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  }
                  if (isSubmitted) {
                    if (isCorrectAnswer) {
                      optionStyle = 'border-green-600 bg-green-50 text-green-800 shadow-[2px_2px_0px_0px_#16A34A]'
                    } else if (isSelected) {
                      optionStyle = 'border-rose-600 bg-rose-50 text-rose-800 shadow-[2px_2px_0px_0px_#E11D48]'
                    } else {
                      optionStyle = 'border-ink/20 bg-white text-ink/40 cursor-not-allowed'
                    }
                  }

                  return (
                    <button
                      key={option}
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(currentQuestion.id, optionChar)}
                      className={`w-full text-left border-4 p-4 font-bold text-xs md:text-sm flex items-center justify-between transition-all ${optionStyle}`}
                    >
                      <span>{option}</span>
                      {isSubmitted && isCorrectAnswer && <Check className="w-5 h-5 text-green-600 flex-shrink-0" />}
                      {isSubmitted && isSelected && !isCorrectAnswer && <X className="w-5 h-5 text-rose-600 flex-shrink-0" />}
                    </button>
                  )
                })}
              </div>

              {/* Submission Button */}
              {!currentAnswer?.isSubmitted && (
                <div className="mt-8 border-t-2 border-ink/10 pt-6 flex justify-end">
                  <button
                    disabled={!currentAnswer?.selected || submittingAnswerId !== null}
                    onClick={() => handleSubmitAnswer(currentQuestion)}
                    className="cn-btn-black text-xs py-3 px-6 uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Check Answer <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Explanation Box (Visible after submission) */}
            {currentAnswer?.isSubmitted && (
              <div 
                className="border-4 border-ink p-6 shadow-hard animate-fadeIn" 
                style={{ backgroundColor: currentAnswer.isCorrect ? '#F0FDF4' : '#FFF1F2' }}
              >
                <div className="flex items-start gap-3">
                  {currentAnswer.isCorrect ? (
                    <Check className="w-6 h-6 text-green-700 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-rose-700 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h3 className="font-display font-black text-base text-ink uppercase tracking-tight mb-2">
                      {currentAnswer.isCorrect ? 'Correct! Well Done.' : 'Incorrect Answer.'}
                    </h3>
                    <p className="text-xs text-ink/75 leading-relaxed font-bold mb-4">
                      {currentQuestion.explanation}
                    </p>
                    <div className="font-mono text-[9px] font-black uppercase text-ink/40 tracking-wider">
                      Correct Option: {currentQuestion.correct_answer}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            {currentAnswer?.isSubmitted && (
              <div className="flex justify-between items-center pt-4">
                <button
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx(currentIdx - 1)}
                  className="font-mono text-xs font-black border-4 border-ink bg-white px-4 py-2.5 uppercase tracking-wider hover:bg-ink hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none shadow-hard-sm"
                >
                  Previous
                </button>

                {!isLast ? (
                  <button
                    onClick={() => setCurrentIdx(currentIdx + 1)}
                    className="font-mono text-xs font-black border-4 border-ink bg-ink text-white px-6 py-2.5 uppercase tracking-widest hover:bg-slate-900 transition-colors shadow-hard-sm"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    onClick={() => setQuizFinished(true)}
                    className="font-mono text-xs font-black border-4 border-ink bg-blue text-white px-6 py-2.5 uppercase tracking-widest hover:bg-blue-800 transition-colors shadow-hard-sm"
                  >
                    Finish Quiz
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          /* ── Quiz Finished / Summary ── */
          <div className="bg-white border-4 border-ink p-8 md:p-12 text-center shadow-hard animate-fade-up">
            <div className="w-20 h-20 bg-yellow-bright border-4 border-ink flex items-center justify-center mx-auto mb-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Award className="w-10 h-10 text-ink" />
            </div>

            <h2 className="font-display font-black text-3xl text-ink uppercase tracking-tight mb-2">Practice Complete!</h2>
            <p className="font-mono text-xs text-ink/50 uppercase tracking-widest mb-6">Subject: {subject?.name}</p>
            
            <div className="max-w-md mx-auto grid grid-cols-2 gap-4 mb-8">
              <div className="border-4 border-ink p-4 bg-slate-50">
                <div className="text-2xl font-black font-mono text-ink">{correctCount} / {questions.length}</div>
                <div className="font-mono text-[9px] text-ink/50 uppercase font-black tracking-wider mt-1">Questions Correct</div>
              </div>
              <div className="border-4 border-ink p-4 bg-slate-50">
                <div className="text-2xl font-black font-mono text-ink">{Math.round((correctCount / questions.length) * 100)}%</div>
                <div className="font-mono text-[9px] text-ink/50 uppercase font-black tracking-wider mt-1">Percentage Score</div>
              </div>
            </div>

            <p className="text-ink/65 text-xs font-bold leading-relaxed max-w-sm mx-auto mb-8">
              {correctCount === questions.length ? (
                "Excellent! You have fully mastered this subject's core concepts. You are ready for exam assessments!"
              ) : correctCount >= questions.length / 2 ? (
                "Good job! You understand most of the concepts. Review the explanations of the questions you missed."
              ) : (
                "Review the syllabus notes and try again to improve your score and solidfy your fundamentals."
              )}
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link href={`/subjects/${slug}`} className="font-mono text-xs font-black border-4 border-ink bg-white px-6 py-3 uppercase tracking-wider hover:bg-slate-50 transition-colors shadow-hard-sm">
                Back to Subject
              </Link>
              <button 
                onClick={restartQuiz}
                className="font-mono text-xs font-black border-4 border-ink bg-yellow-bright text-ink px-6 py-3 uppercase tracking-widest hover:bg-yellow-400 transition-colors shadow-hard-sm flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" /> Reset and Retry
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
