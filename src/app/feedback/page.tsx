'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowLeft, MessageSquare, AlertTriangle, Lightbulb, Heart, HelpCircle, CheckCircle } from 'lucide-react'

type FeedbackType = 'bug' | 'feature' | 'content' | 'general' | 'praise'

export default function FeedbackPage() {
  const supabase = createClient()

  // Form states
  const [type, setType] = useState<FeedbackType>('general')
  const [rating, setRating] = useState<number | null>(null)
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [pageUrl, setPageUrl] = useState('')

  // App states
  const [userId, setUserId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    async function loadUser() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          setUserId(session.user.id)
          setEmail(session.user.email ?? '')
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', session.user.id)
            .single()
          
          if (profile?.full_name) {
            setName(profile.full_name)
          }
        }
        setPageUrl(document.referrer || window.location.origin)
      } catch (err) {
        console.warn('Failed to pre-fill user metadata:', err)
      }
    }
    loadUser()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) {
      setErrorMsg('Please enter a feedback message')
      return
    }

    setSubmitting(true)
    setErrorMsg(null)

    try {
      const { error } = await supabase.from('feedback').insert({
        user_id: userId,
        type,
        rating,
        message,
        page_url: pageUrl || window.location.href,
        user_email: email || null,
        user_name: name || null,
        status: 'new'
      })

      if (error) throw error

      setSuccess(true)
      setMessage('')
      setRating(null)
    } catch (err) {
      console.error('Failed to submit feedback:', err)
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const TYPE_OPTIONS: { value: FeedbackType; label: string; icon: React.ElementType; color: string; bg: string }[] = [
    { value: 'general', label: 'General Feedback', icon: HelpCircle, color: '#1D4ED8', bg: '#EFF6FF' },
    { value: 'bug', label: 'Report a Bug', icon: AlertTriangle, color: '#EA580C', bg: '#FFF7ED' },
    { value: 'feature', label: 'Request a Feature', icon: Lightbulb, color: '#CA8A04', bg: '#FEFCE8' },
    { value: 'content', label: 'Content Issue', icon: MessageSquare, color: '#7C3AED', bg: '#F5F3FF' },
    { value: 'praise', label: 'Send Praise', icon: Heart, color: '#15803D', bg: '#F0FDF4' },
  ]

  return (
    <div className="min-h-screen bg-canvas pb-12">
      {/* Top Banner Accent */}
      <div className="h-2 bg-[#7C3AED]" />

      {/* Header */}
      <div className="border-b-4 border-ink px-6 md:px-10 py-5 flex items-center gap-3 bg-[#F5F3FF]">
        <Link href="/dashboard" className="w-8 h-8 border-4 border-ink bg-white flex items-center justify-center hover:translate-x-[-2px] transition-transform">
          <ArrowLeft className="w-4 h-4 text-ink" />
        </Link>
        <div>
          <div className="font-mono text-[9px] font-black uppercase tracking-widest text-[#7C3AED]">Support & Growth</div>
          <h1 className="font-display text-2xl font-black text-ink uppercase leading-none mt-1">
            Send Feedback
          </h1>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 mt-8">
        <div className="border-4 border-ink bg-white p-6 md:p-8 shadow-hard">
          {success ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-[#F0FDF4] border-4 border-[#15803D] flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-[#15803D]" />
              </div>
              <h2 className="font-display text-2xl font-black text-ink uppercase">Thank You!</h2>
              <p className="text-sm text-ink/60 leading-relaxed max-w-sm mx-auto">
                Your feedback has been logged successfully. The PolymerHub team reviews all submissions to improve the learning experience.
              </p>
              <div className="pt-4 flex gap-3 justify-center">
                <button onClick={() => setSuccess(false)} className="border-4 border-ink px-4 py-2 font-mono text-[10px] font-black uppercase hover:bg-canvas transition-colors">
                  Submit More Feedback
                </button>
                <Link href="/dashboard" className="cn-btn-black text-xs">
                  Go to Dashboard
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="font-display text-lg font-black text-ink uppercase mb-2">Help Us Improve</h2>
                <p className="text-xs text-ink/50 leading-relaxed">
                  Encountered a bug? Have an idea for a calculator or a subject? Let us know. We read every message.
                </p>
              </div>

              {errorMsg && (
                <div className="border-4 border-orange bg-[#FFF7ED] p-4 text-xs font-mono font-bold text-orange uppercase tracking-wide">
                  ⚠️ Error: {errorMsg}
                </div>
              )}

              {/* Type Select */}
              <div className="space-y-2">
                <label className="block font-mono text-[10px] font-black uppercase tracking-wide text-ink/75">
                  Feedback Category
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TYPE_OPTIONS.map(opt => {
                    const Icon = opt.icon
                    const isSelected = type === opt.value
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setType(opt.value)}
                        className="border-2 border-ink p-3 flex items-center gap-3 transition-all hover:bg-canvas text-left"
                        style={{
                          backgroundColor: isSelected ? opt.bg : 'white',
                          borderColor: isSelected ? opt.color : '#0A0A0A',
                          boxShadow: isSelected ? `2px 2px 0px 0px ${opt.color}` : 'none'
                        }}
                      >
                        <div className="w-7 h-7 border-2 border-ink flex items-center justify-center flex-shrink-0" style={{ backgroundColor: opt.color + '15' }}>
                          <Icon className="w-3.5 h-3.5" style={{ color: opt.color }} />
                        </div>
                        <span className="font-mono text-[10px] font-black uppercase tracking-wider text-ink">
                          {opt.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Rating 1-5 */}
              <div className="space-y-2">
                <label className="block font-mono text-[10px] font-black uppercase tracking-wide text-ink/75">
                  Rate your experience
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRating(num)}
                      className="w-10 h-10 border-2 border-ink flex items-center justify-center font-display text-sm font-black transition-all hover:bg-canvas"
                      style={rating === num ? { backgroundColor: '#7C3AED', color: 'white', borderColor: '#7C3AED', boxShadow: '2px 2px 0px 0px #0A0A0A' } : {}}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="block font-mono text-[10px] font-black uppercase tracking-wide text-ink/75">
                  Your Message
                </label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={4}
                  required
                  placeholder="Tell us what's on your mind..."
                  className="w-full border-4 border-ink p-3 text-sm text-ink focus:outline-none focus:border-[#7C3AED] shadow-hard-sm"
                />
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block font-mono text-[10px] font-black uppercase tracking-wide text-ink/75">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full border-4 border-ink px-3 py-2 text-sm text-ink focus:outline-none focus:border-[#7C3AED] shadow-hard-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block font-mono text-[10px] font-black uppercase tracking-wide text-ink/75">
                    Your Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@college.edu"
                    className="w-full border-4 border-ink px-3 py-2 text-sm text-ink focus:outline-none focus:border-[#7C3AED] shadow-hard-sm"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="cn-btn-black w-full justify-center text-sm disabled:opacity-50"
                >
                  {submitting ? 'Submitting Feedback...' : 'Submit Feedback'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
