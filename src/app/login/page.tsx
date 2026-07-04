'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { FlaskConical, Mail, ArrowRight, Sparkles, CheckCircle } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A3560] via-[#0F4C81] to-[#1565A8] flex flex-col">

      {/* Dot pattern */}
      <div className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />


      {/* Main */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {!sent ? (
            /* ── Login form ── */
            <div className="bg-white rounded-3xl shadow-2xl shadow-blue-900/20 p-8 md:p-10">
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-[#EEF4FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FlaskConical className="w-7 h-7 text-[#0F4C81]" />
                </div>
                <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Welcome to PolymerHub</h1>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Enter your email to get a magic link — no password needed.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-[#0F172A] mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@college.edu.in"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-[#0F172A] placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full flex items-center justify-center gap-2 bg-[#0F4C81] hover:bg-[#0D3F6E] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-900/20"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending link...
                    </>
                  ) : (
                    <>
                      Send magic link
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-xs text-slate-400">What you get</span>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-2.5">
                {[
                  'Free access to all core lessons',
                  '15 AI tutor queries per day',
                  'Polymer materials database',
                  'Track your learning progress',
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {benefit}
                  </div>
                ))}
              </div>

              <p className="text-xs text-center text-slate-400 mt-6">
                By signing in, you agree to our terms of service. No spam, ever.
              </p>
            </div>

          ) : (
            /* ── Success state ── */
            <div className="bg-white rounded-3xl shadow-2xl shadow-blue-900/20 p-8 md:p-10 text-center">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-[#0F172A] mb-3">Check your inbox</h2>
              <p className="text-slate-500 text-sm mb-2">
                We sent a magic link to
              </p>
              <p className="font-semibold text-[#0F4C81] mb-5 text-sm">{email}</p>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Click the link in the email to sign in instantly. The link expires in 1 hour.
              </p>

              <div className="bg-[#F8FAFC] rounded-2xl p-4 mb-6 text-left">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-[#F97316] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-[#0F172A] mb-1">First 50 signups</p>
                    <p className="text-xs text-slate-500">
                      Use code <span className="font-bold text-[#0F4C81]">PIIU2025</span> to get 3 months Premium free.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => { setSent(false); setEmail('') }}
                className="text-sm text-slate-400 hover:text-[#0F4C81] transition-colors"
              >
                Use a different email
              </button>
            </div>
          )}

          <p className="text-center text-blue-200 text-xs mt-6">
            <Link href="/subjects" className="hover:text-white transition-colors underline underline-offset-2">
              Browse lessons without signing in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
