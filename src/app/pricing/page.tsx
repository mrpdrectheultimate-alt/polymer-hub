'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, X, Sparkles, ArrowRight, Upload, CheckCircle, QrCode, Zap } from 'lucide-react'

const FREE_FEATURES = [
  { text: 'All core lessons (30+ lessons)', included: true },
  { text: '15 AI tutor queries per day', included: true },
  { text: 'Polymer materials database (basic)', included: true },
  { text: 'Subject-wise lesson navigation', included: true },
  { text: 'Mobile-friendly reading', included: true },
  { text: 'Unlimited AI tutor queries', included: false },
  { text: 'Advanced material properties', included: false },
  { text: 'Chemical resistance tables', included: false },
  { text: 'PDF lesson downloads', included: false },
  { text: 'Premium lessons (advanced topics)', included: false },
]

const PREMIUM_FEATURES = [
  { text: 'Everything in Free', included: true },
  { text: 'Unlimited AI tutor queries', included: true },
  { text: 'Advanced material properties', included: true },
  { text: 'Chemical resistance tables', included: true },
  { text: 'PDF lesson downloads', included: true },
  { text: 'Premium lessons (advanced topics)', included: true },
  { text: 'Processing condition datasheets', included: true },
  { text: 'Priority email support', included: true },
]

type Step = 'info' | 'payment' | 'upload' | 'done'

function PaymentModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>('info')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [utrNumber, setUtrNumber] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0])
  }

  const handleSubmit = async () => {
    if (!file || !email || !utrNumber) return
    setUploading(true)

    // Simulate upload — replace with Supabase Storage upload in production
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setUploading(false)
    setStep('done')
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#0F4C81] to-[#1565A8] px-6 py-5 relative">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/15 rounded-xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold">Upgrade to Premium</h2>
              <p className="text-blue-200 text-xs">₹149/month · UPI payment</p>
            </div>
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white text-xl font-light">×</button>
        </div>

        <div className="p-6">

          {step === 'info' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@college.edu.in"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81] transition-all"
                />
              </div>
              <button
                onClick={() => setStep('payment')}
                disabled={!name.trim() || !email.trim()}
                className="w-full bg-[#0F4C81] hover:bg-[#0D3F6E] disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Continue to Payment <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-2xl p-4 text-center">
                {/* UPI QR placeholder — replace with real QR image */}
                <div className="w-40 h-40 bg-white border-2 border-slate-200 rounded-2xl mx-auto mb-3 flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-slate-300" />
                </div>
                <p className="text-sm font-semibold text-[#0F172A] mb-1">Scan & Pay ₹149</p>
                <p className="text-xs text-slate-400">Google Pay · PhonePe · Paytm · Any UPI</p>
                <div className="mt-3 bg-[#EEF4FF] rounded-xl px-4 py-2.5">
                  <p className="text-xs text-slate-500 mb-1">UPI ID</p>
                  <p className="text-sm font-bold text-[#0F4C81] font-mono">polymerhub@upi</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">
                  UTR / Transaction Number
                </label>
                <input
                  type="text"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  placeholder="12-digit UTR number"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0F4C81] transition-all"
                />
                <p className="text-xs text-slate-400 mt-1">Found in your UPI app after payment</p>
              </div>

              <button
                onClick={() => setStep('upload')}
                disabled={!utrNumber.trim()}
                className="w-full bg-[#0F4C81] hover:bg-[#0D3F6E] disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                I&apos;ve paid — Upload Screenshot <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 'upload' && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <p className="text-sm text-green-700 font-medium">Payment recorded. Now upload your screenshot.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">
                  Payment Screenshot
                </label>
                <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 cursor-pointer transition-colors ${
                  file ? 'border-[#0F4C81] bg-[#EEF4FF]' : 'border-slate-200 hover:border-[#0F4C81] hover:bg-slate-50'
                }`}>
                  <Upload className={`w-8 h-8 mb-2 ${file ? 'text-[#0F4C81]' : 'text-slate-300'}`} />
                  <p className="text-sm font-medium text-slate-600">
                    {file ? file.name : 'Tap to upload screenshot'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!file || uploading}
                className="w-full bg-[#0F4C81] hover:bg-[#0D3F6E] disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>Submit for Review <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          )}

          {step === 'done' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-2">Request submitted!</h3>
              <p className="text-slate-500 text-sm mb-4 leading-relaxed">
                We&apos;ll verify your payment and activate Premium within <strong>2 hours</strong>. You&apos;ll receive a confirmation email at <span className="text-[#0F4C81] font-medium">{email}</span>.
              </p>
              <div className="bg-[#F8FAFC] rounded-2xl p-4 text-left mb-4">
                <p className="text-xs text-slate-500">
                  While you wait, you can continue reading free lessons. Premium access will unlock automatically once verified.
                </p>
              </div>
              <button onClick={onClose} className="text-sm text-slate-400 hover:text-[#0F4C81] transition-colors">
                Back to PolymerHub
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PricingPage() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="min-h-screen bg-[#F8FAFC]">


      {/* ── Hero ── */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-full px-4 py-1.5 mb-5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-semibold text-amber-700">First 50 students get 3 months free with code PIIU2025</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-3">
            Simple, honest pricing.
          </h1>
          <p className="text-slate-500 max-w-md mx-auto">
            Core content is free forever. Premium unlocks everything else for less than two chais a week.
          </p>
        </div>
      </div>

      {/* ── Pricing cards ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Free */}
          <div className="bg-white rounded-3xl border border-slate-100 p-7 md:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-[#0F172A] mb-1">Free</h2>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold text-[#0F172A]">₹0</span>
                <span className="text-slate-400 text-sm">/forever</span>
              </div>
              <p className="text-sm text-slate-500">Everything you need to get started.</p>
            </div>

            <div className="space-y-3 mb-8">
              {FREE_FEATURES.map((f) => (
                <div key={f.text} className="flex items-start gap-3">
                  {f.included
                    ? <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    : <X className="w-4 h-4 text-slate-200 flex-shrink-0 mt-0.5" />
                  }
                  <span className={`text-sm ${f.included ? 'text-slate-600' : 'text-slate-300'}`}>
                    {f.text}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 border-2 border-[#0F4C81] text-[#0F4C81] font-semibold py-3.5 rounded-xl hover:bg-[#EEF4FF] transition-colors"
            >
              Get started free
            </Link>
          </div>

          {/* Premium */}
          <div className="relative bg-gradient-to-br from-[#0F4C81] to-[#1565A8] rounded-3xl p-7 md:p-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full opacity-[0.04] -translate-y-8 translate-x-8" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#F97316] rounded-full opacity-[0.07] translate-y-8 -translate-x-8" />

            <div className="relative">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 bg-[#F97316] text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                <Zap className="w-3 h-3" /> Most Popular
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-bold text-white mb-1">Premium</h2>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-white">₹149</span>
                  <span className="text-blue-200 text-sm">/month</span>
                </div>
                <p className="text-sm text-blue-200">Unlock everything. Cancel anytime.</p>
              </div>

              <div className="space-y-3 mb-8">
                {PREMIUM_FEATURES.map((f) => (
                  <div key={f.text} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-blue-100">{f.text}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="w-full flex items-center justify-center gap-2 bg-white text-[#0F4C81] font-bold py-3.5 rounded-xl hover:bg-blue-50 transition-colors"
              >
                Upgrade to Premium <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-blue-300 text-xs text-center mt-3">
                UPI payment · Activated within 2 hours
              </p>
            </div>
          </div>
        </div>

        {/* Promo code */}
        <div className="mt-6 bg-amber-50 border border-amber-100 rounded-2xl p-5 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-[#0F172A] mb-1">
                3 months free for first 50 students
              </p>
              <p className="text-xs text-slate-500">
                Use code <span className="font-bold text-[#0F4C81] bg-[#EEF4FF] px-1.5 py-0.5 rounded font-mono">PIIU2025</span> when upgrading. Mention it in the payment screenshot message.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-[#0F172A] mb-5">Common questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'How does payment work?',
                a: 'Pay ₹149 via any UPI app (Google Pay, PhonePe, Paytm) to our UPI ID. Upload your payment screenshot. We verify and activate your account within 2 hours.',
              },
              {
                q: 'Can I cancel anytime?',
                a: "Yes. Premium is month-to-month. Just don't pay next month and your account reverts to the free plan automatically.",
              },
              {
                q: 'Is the free plan really free forever?',
                a: 'Yes. All core lessons (30+), basic materials database, and 15 AI queries/day are free forever. No trial, no expiry.',
              },
              {
                q: 'What if I have a question the AI can\'t answer?',
                a: 'Premium users get priority email support. We respond within 24 hours for subject-specific questions.',
              },
              {
                q: 'Is this useful for GATE preparation?',
                a: 'Yes. Our lessons cover topics tested in GATE Polymer Science paper. The AI tutor is great for quick revision before the exam.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="bg-white rounded-2xl border border-slate-100 p-5">
                <h3 className="font-semibold text-[#0F172A] text-sm mb-2">{q}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showModal && <PaymentModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
