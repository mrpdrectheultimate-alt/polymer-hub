'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { CheckCircle2, Sparkles, Upload, Loader2, CreditCard, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'

export default function UpgradePage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<{ subscription_status?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [approving, setApproving] = useState(false)
  const [txnId, setTxnId] = useState('')
  const [fileAttached, setFileAttached] = useState(false)
  const [step, setStep] = useState(1) // 1 = pay, 2 = success
  
  const supabase = createClient()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      setProfile(profile)
      setLoading(false)
    }
    loadUser()
  }, [router, supabase])

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    if (!txnId.trim()) return

    setSubmitting(true)

    try {
      // Insert payment request record
      const { error } = await supabase.from('payment_requests').insert({
        user_id: user.id,
        amount: 99,
        screenshot_url: 'https://example.com/receipts/screenshot_' + Date.now() + '.jpg', // mock receipt URL
        status: 'pending',
      })

      if (error) throw error

      setStep(2)
      toast({
        title: 'Payment Proof Submitted!',
        description: 'Your request is pending verification. Use the simulation panel below for instant approval.',
      })
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: errorMessage || 'Could not log your payment request.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Instant admin auto-approval simulator for testing
  const handleInstantApprove = async () => {
    if (!user) return
    setApproving(true)
    try {
      // 1. Call the simulate API to update profiles status to premium and approve any pending requests
      const res = await fetch('/api/payment-simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Approval failed')
      }

      // 2. Fetch updated profile
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      setProfile(updatedProfile)

      toast({
        title: 'Premium Activated!',
        description: 'Simulation successful. You are now a Premium Member.',
      })
      
      router.push('/dashboard')
      router.refresh()
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      toast({
        variant: 'destructive',
        title: 'Simulation Failed',
        description: errorMessage || 'Could not simulate approval.',
      })
    } finally {
      setApproving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-[#0F4C81] animate-spin" />
      </div>
    )
  }

  const isPremium = profile?.subscription_status === 'premium'

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      {/* Main Container */}
      <main className="max-w-xl mx-auto px-4 sm:px-6 py-12">
        {isPremium ? (
          /* Already Premium State */
          <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center space-y-5 shadow-sm shadow-slate-100/50">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <div className="space-y-1.5">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">You are a Premium Member!</h1>
              <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto">
                Thank you for supporting PolymerHub. You have unlocked unlimited AI Tutor chat, all subjects/lessons, and our full reference database.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center bg-[#0F4C81] hover:bg-[#0A3560] text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-sm text-xs"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : step === 1 ? (
          /* Pay Step */
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-100 rounded-full px-3 py-1 text-xs text-[#F97316] font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                ₹99/month B.Tech Premium
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Upgrade to Premium</h1>
              <p className="text-slate-500 text-xs">Scan the UPI QR code below and submit payment details to unlock.</p>
            </div>

            {/* Simulated UPI Box */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm shadow-slate-100/50 space-y-6">
              <div className="flex flex-col items-center space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">UPI QR Code Scan</div>
                
                {/* Visual QR Simulator */}
                <div className="w-48 h-48 bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-slate-200 relative overflow-hidden p-4">
                  {/* Decorative QR Lines */}
                  <div className="w-full h-full border-4 border-slate-800 rounded flex flex-col justify-between p-2">
                    <div className="flex justify-between">
                      <div className="w-8 h-8 border-4 border-slate-800" />
                      <div className="w-8 h-8 border-4 border-slate-800" />
                    </div>
                    {/* Simulated dot matrix */}
                    <div className="flex-1 flex flex-wrap gap-1 p-2 items-center justify-center opacity-60">
                      {Array.from({ length: 64 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-1.5 h-1.5 rounded-sm ${i % 3 === 0 || i % 5 === 0 ? 'bg-slate-800' : 'bg-transparent'}`} 
                        />
                      ))}
                    </div>
                    <div className="flex justify-between">
                      <div className="w-8 h-8 border-4 border-slate-800" />
                      <div className="w-8 h-8 bg-slate-800 flex items-center justify-center text-[8px] text-white font-black rounded">PH</div>
                    </div>
                  </div>
                  {/* Overlay Price badge */}
                  <div className="absolute bg-[#F97316] text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md">
                    Pay ₹99
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-xs font-bold text-slate-700">UPI ID: polymerhub@paytm</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Payee Name: NextGenIndia PolymerHub</div>
                </div>
              </div>

              {/* Submission Form */}
              <form onSubmit={handleSubmitRequest} className="space-y-4 pt-4 border-t border-slate-50">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">12-Digit UPI Ref / Transaction ID</label>
                  <Input
                    type="text"
                    required
                    placeholder="E.g., 349182058193"
                    pattern="[0-9]{12}"
                    maxLength={12}
                    value={txnId}
                    onChange={(e) => setTxnId(e.target.value.replace(/\D/g, ''))}
                    className="h-11 border-slate-200 focus:border-[#0F4C81] focus:ring-[#0F4C81] rounded-xl text-xs font-semibold"
                  />
                </div>

                {/* Screenshot Upload Simulator */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Upload Screenshot Proof</label>
                  <div 
                    onClick={() => setFileAttached(true)}
                    className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 ${
                      fileAttached 
                        ? 'border-emerald-200 bg-emerald-50/25 text-emerald-800' 
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 text-slate-500'
                    }`}
                  >
                    {fileAttached ? (
                      <>
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        <span className="text-xs font-bold">receipt_screenshot.png attached</span>
                        <span className="text-[10px] text-emerald-600/70">Click to change</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-slate-400" />
                        <span className="text-xs font-semibold">Click to select receipt file</span>
                        <span className="text-[10px] text-slate-400">Supports PNG, JPG (Max 5MB)</span>
                      </>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={submitting || !fileAttached || txnId.length < 12}
                  className="w-full bg-[#0F4C81] hover:bg-[#0A3560] text-white font-semibold h-11 rounded-xl transition-all shadow-md mt-6 flex items-center justify-center gap-2 text-xs"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting payment proof...
                    </>
                  ) : (
                    <>
                      Submit Reference & Screenshot
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* UPI Checkout Tips */}
            <div className="bg-slate-100/50 border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-slate-400 shrink-0" />
              <p className="text-[10px] text-slate-400 leading-normal">
                After scans, please copy the 12-digit transaction ID from your Paytm/GPay confirmation screen and paste it here. Manual verification takes 1-2 hours.
              </p>
            </div>

            {/* Sandbox Testing Box (Auto-approve) */}
            <div className="bg-amber-50/70 border border-amber-100 rounded-3xl p-6 space-y-4">
              <div className="space-y-1">
                <h3 className="font-extrabold text-amber-800 text-xs flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-amber-600" />
                  🛠️ Sandbox Simulation Panel
                </h3>
                <p className="text-[10px] text-amber-700/80 leading-normal">
                  Want to bypass the wait? Click the button below to simulate administrative backend approval and instantly upgrade this account to Premium right now.
                </p>
              </div>

              <Button
                onClick={handleInstantApprove}
                disabled={approving}
                className="w-full bg-[#F97316] hover:bg-[#EA6C0A] text-white font-semibold h-10 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-xs"
              >
                {approving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Activating Premium...
                  </>
                ) : (
                  <>
                    Simulate Instant Admin Approval
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          /* Step 2: Request Logged Success State */
          <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center space-y-5 shadow-sm shadow-slate-100/50">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto border border-blue-100">
              <CheckCircle2 className="w-8 h-8 text-[#0F4C81]" />
            </div>
            <div className="space-y-1.5">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Payment Verification Pending</h1>
              <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto">
                Your payment reference has been recorded successfully. Once validated, your account will be upgraded to Premium.
              </p>
            </div>
            
            {/* Quick upgrade simulation */}
            <div className="border-t border-slate-50 pt-6 space-y-3.5">
              <div className="text-left bg-amber-50/50 border border-amber-100 rounded-2xl p-4 space-y-2">
                <div className="text-[10px] font-bold text-amber-800">Bypass wait time:</div>
                <Button
                  onClick={handleInstantApprove}
                  disabled={approving}
                  className="w-full bg-[#F97316] hover:bg-[#EA6C0A] text-white font-bold h-9 rounded-lg transition-all text-xs"
                >
                  {approving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" />
                  ) : (
                    'Simulate Instant Admin Approval'
                  )}
                </Button>
              </div>

              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center text-xs font-semibold text-[#0F4C81] hover:underline"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
