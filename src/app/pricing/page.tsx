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
    <div className="fixed inset-0 bg-ink/60 z-50 flex items-center justify-center p-4">
      <div className="bg-canvas border-4 border-ink w-full max-w-md shadow-hard-xl">

        {/* Header */}
        <div className="bg-blue border-b-4 border-ink px-6 py-5 relative">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white border-2 border-ink flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-blue" />
            </div>
            <div>
              <h2 className="text-white font-display font-black uppercase text-base tracking-wide">Upgrade to Premium</h2>
              <p className="text-white/80 font-mono text-[9px] font-bold uppercase tracking-wider">₹149/month · UPI payment</p>
            </div>
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-yellow-bright text-xl font-bold">×</button>
        </div>

        <div className="p-6">

          {step === 'info' && (
            <div className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] font-black text-ink uppercase tracking-wider mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-2.5 border-2 border-ink text-sm font-bold focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] font-black text-ink uppercase tracking-wider mb-1.5">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@college.edu.in"
                  className="w-full px-4 py-2.5 border-2 border-ink text-sm font-bold focus:outline-none"
                />
              </div>
              <button
                onClick={() => setStep('payment')}
                disabled={!name.trim() || !email.trim()}
                className="w-full border-4 border-ink bg-blue text-white font-mono font-black text-xs py-3 uppercase tracking-widest hover:bg-blue/90 disabled:opacity-60 disabled:cursor-not-allowed shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-4">
              <div className="border-4 border-ink p-4 text-center bg-slate-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                {/* UPI QR placeholder */}
                <div className="w-40 h-40 bg-white border-4 border-ink rounded-none mx-auto mb-3 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <QrCode className="w-20 h-20 text-ink" />
                </div>
                <p className="font-display font-black text-sm text-ink mb-1 uppercase tracking-tight">Scan and Pay ₹149</p>
                <p className="text-[10px] font-mono text-ink/40 uppercase tracking-widest font-black">Paytm · PhonePe · Google Pay · BHIM</p>
                <div className="mt-3 bg-yellow-bright border-2 border-ink px-4 py-2">
                  <p className="font-mono text-[9px] font-black text-ink/40 uppercase tracking-widest">UPI ID</p>
                  <p className="text-sm font-black text-ink font-mono tracking-tight select-all">polymerhub@upi</p>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] font-black text-ink uppercase tracking-wider mb-1.5">
                  UTR / Transaction ID
                </label>
                <input
                  type="text"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  placeholder="12-digit UTR number"
                  className="w-full px-4 py-2.5 border-2 border-ink text-sm font-mono font-bold focus:outline-none"
                />
                <p className="text-[9px] font-mono text-ink/40 mt-1 uppercase tracking-wider font-bold">Found in your UPI app receipt details</p>
              </div>

              <button
                onClick={() => setStep('upload')}
                disabled={!utrNumber.trim()}
                className="w-full border-4 border-ink bg-blue text-white font-mono font-black text-xs py-3 uppercase tracking-widest hover:bg-blue/90 disabled:opacity-60 disabled:cursor-not-allowed shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
              >
                Upload Payment Screenshot
              </button>
            </div>
          )}

          {step === 'upload' && (
            <div className="space-y-4">
              <div className="border-2 border-green bg-green/10 p-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green flex-shrink-0" />
                <p className="font-mono text-[9px] font-black text-green uppercase tracking-wider">Payment ID recorded. Upload verification image.</p>
              </div>

              <div>
                <label className="block font-mono text-[10px] font-black text-ink uppercase tracking-wider mb-1.5">
                  Payment Screenshot
                </label>
                <label className={`flex flex-col items-center justify-center border-4 border-dashed rounded-none p-6 cursor-pointer transition-colors ${
                  file ? 'border-blue bg-blue/5' : 'border-ink/20 hover:border-ink hover:bg-slate-50'
                }`}>
                  <Upload className={`w-8 h-8 mb-2 ${file ? 'text-blue' : 'text-ink/40'}`} />
                  <p className="text-xs font-bold text-ink">
                    {file ? file.name : 'Tap to upload screenshot'}
                  </p>
                  <p className="text-[9px] font-mono text-ink/40 mt-1 uppercase tracking-widest">PNG, JPG up to 5MB</p>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!file || uploading}
                className="w-full border-4 border-ink bg-blue text-white font-mono font-black text-xs py-3.5 uppercase tracking-widest hover:bg-blue/90 disabled:opacity-60 disabled:cursor-not-allowed shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
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
              <div className="w-16 h-16 bg-emerald-50 border-4 border-ink flex items-center justify-center mx-auto mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <CheckCircle className="w-8 h-8 text-emerald-700" />
              </div>
              <h3 className="font-display font-black text-xl text-ink uppercase tracking-tight mb-2">Request submitted!</h3>
              <p className="text-ink/65 text-xs font-bold mb-4 leading-relaxed">
                We will verify your payment UTR and activate Premium within <strong>2 hours</strong>. Confirmation sent to <span className="text-blue font-bold">{email}</span>.
              </p>
              <div className="border-4 border-ink p-4 text-left mb-6 bg-slate-50">
                <p className="text-[10px] font-mono font-bold text-ink/50 leading-relaxed uppercase">
                  Verification runs automatically. You can read free lessons while waiting.
                </p>
              </div>
              <button onClick={onClose} className="font-mono text-[10px] font-black border-2 border-ink px-4 py-2 uppercase hover:bg-ink hover:text-white transition-colors">
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
    <div className="min-h-screen bg-canvas pb-16">

      {/* Hero */}
      <section className="border-b-4 border-ink bg-yellow-bright px-6 md:px-12 py-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-ink border-4 border-ink flex items-center justify-center">
                <Zap className="w-5 h-5 text-yellow-bright" />
              </div>
              <span className="font-mono text-[10px] font-black text-ink border-2 border-ink px-3 py-1 uppercase tracking-widest bg-white">
                Pricing
              </span>
              <span className="font-mono text-[10px] font-black border-2 border-ink bg-ink text-yellow-bright px-3 py-1 uppercase tracking-widest">
                PLANS
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-black text-ink leading-none uppercase">
              SIMPLE, HONEST<br />
              <span className="italic">PRICING PLANS</span>
            </h1>
          </div>
          <div className="max-w-md text-left md:text-right">
            <p className="text-sm font-bold text-ink/70 leading-relaxed">
              Core B.Tech syllabus notes are free forever. Upgrade to Premium to unlock advanced tools, datasets, and unlimited AI tutoring support.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing cards */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Free plan */}
          <div className="bg-white border-4 border-ink p-7 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
            <div>
              <div className="mb-6 border-b-2 border-ink/10 pb-4">
                <h2 className="font-display font-black text-xl text-ink uppercase tracking-tight mb-1">Free Tier</h2>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-black text-ink font-mono">₹0</span>
                  <span className="text-ink/40 font-mono text-xs uppercase font-bold">/ forever</span>
                </div>
                <p className="text-xs font-bold text-ink/50 uppercase">Essential study tools to get started.</p>
              </div>

              <div className="space-y-3 mb-8">
                {FREE_FEATURES.map((f) => (
                  <div key={f.text} className="flex items-start gap-3">
                    {f.included
                      ? <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      : <X className="w-4 h-4 text-ink/20 flex-shrink-0 mt-0.5" />
                    }
                    <span className={`text-xs font-bold ${f.included ? 'text-ink' : 'text-ink/30'}`}>
                      {f.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/login"
              className="w-full text-center border-4 border-ink bg-white hover:bg-slate-50 text-ink font-mono font-black text-xs py-3.5 uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
            >
              Get started free
            </Link>
          </div>

          {/* Premium plan */}
          <div className="bg-white border-4 border-ink p-7 md:p-8 shadow-[4px_4px_0px_0px_rgba(29,78,216,1)] flex flex-col justify-between">
            <div>
              <div className="mb-6 border-b-2 border-ink/10 pb-4">
                <div className="inline-flex items-center gap-1.5 bg-rose-500 text-white text-[9px] font-mono font-black px-2.5 py-1 uppercase border-2 border-ink shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] mb-3">
                  <Zap className="w-3 h-3" /> Most Popular
                </div>
                <h2 className="font-display font-black text-xl text-ink uppercase tracking-tight mb-1">Premium Tier</h2>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-black text-ink font-mono">₹149</span>
                  <span className="text-blue font-mono text-xs uppercase font-bold">/ month</span>
                </div>
                <p className="text-xs font-bold text-blue uppercase">Complete platform unlock. Cancel anytime.</p>
              </div>

              <div className="space-y-3 mb-8">
                {PREMIUM_FEATURES.map((f) => (
                  <div key={f.text} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-blue flex-shrink-0 mt-0.5" />
                    <span className="text-xs font-bold text-ink">{f.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="w-full border-4 border-ink bg-blue hover:bg-blue/90 text-white font-mono font-black text-xs py-3.5 uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
            >
              Upgrade to Premium
            </button>
          </div>
        </div>

        {/* Promo code */}
        <div className="mt-6 border-4 border-ink p-5 shadow-hard" style={{ backgroundColor: '#FEFCE8', boxShadow: '3px 3px 0px 0px #EA580C' }}>
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-display font-black text-sm text-ink uppercase tracking-tight mb-1">
                3 months free promotion
              </p>
              <p className="text-xs text-ink/70 font-bold leading-normal">
                Use code <span className="font-mono font-black bg-white border border-ink px-1.5 py-0.5">PIIU2025</span> when submitting payment. Paste it into the verification message input box.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <div className="border-b-4 border-ink pb-2 mb-6">
            <h2 className="font-mono text-xs font-black text-ink uppercase tracking-widest">Common questions</h2>
          </div>
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
              <div key={q} className="border-4 border-ink p-5 bg-white shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="font-display font-black text-sm text-ink mb-2 uppercase tracking-tight">{q}</h3>
                <p className="text-xs text-ink/70 font-bold leading-relaxed">{a}</p>
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
