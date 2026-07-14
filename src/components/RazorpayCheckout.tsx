'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Zap } from 'lucide-react'

interface RazorpayInstance {
  open: () => void
  on: (event: string, callback: () => void) => void
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance
  }
}

type RazorpayCheckoutProps = {
  buttonText?: string
  buttonClass?: string
  onSuccess?: () => void
}

export default function RazorpayCheckout({
  buttonText = 'Get Premium — ₹149/mo',
  buttonClass = 'cn-btn-yellow w-full justify-center text-sm',
  onSuccess,
}: RazorpayCheckoutProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadRazorpay = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) { resolve(true); return }
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    setLoading(true)
    setError(null)

    try {
      // Load Razorpay script
      const loaded = await loadRazorpay()
      if (!loaded || !window.Razorpay) {
        setError('Failed to load payment gateway. Check your internet connection.')
        setLoading(false)
        return
      }

      // Create order
      const orderRes = await fetch('/api/payment/create-order', { method: 'POST' })
      if (!orderRes.ok) {
        const err = await orderRes.json()
        if (err.error === 'Already premium') {
          router.push('/dashboard')
          return
        }
        if (err.error === 'Not authenticated') {
          router.push('/login')
          return
        }
        throw new Error(err.error || 'Failed to create payment order')
      }

      const { order_id, amount, currency, user_name, user_email } = await orderRes.json()

      // Open Razorpay checkout
      const options: Record<string, unknown> = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: 'PolymerHub',
        description: 'Premium Plan — ₹149/month',
        image: 'https://polymer-hub-six.vercel.app/logo.png',
        order_id,
        prefill: {
          name: user_name,
          email: user_email,
        },
        theme: {
          color: '#0A0A0A',
          backdrop_color: '#0A0A0A',
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
            setError('Payment cancelled. Try again when ready.')
          },
        },
        handler: async (response: {
          razorpay_order_id: string
          razorpay_payment_id: string
          razorpay_signature: string
        }) => {
          try {
            // Verify payment server-side
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })

            if (verifyRes.ok) {
              onSuccess?.()
              router.push('/payment/success')
            } else {
              router.push('/payment/failed')
            }
          } catch {
            router.push('/payment/failed')
          }
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', () => {
        setLoading(false)
        router.push('/payment/failed')
      })
      rzp.open()

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Payment failed. Please try again.'
      setError(message)
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handlePayment}
        disabled={loading}
        className={buttonClass + ' disabled:opacity-50 disabled:cursor-not-allowed'}
      >
        {loading ? (
          'Opening payment...'
        ) : (
          <span className="flex items-center gap-1.5 justify-center"><Zap className="w-4 h-4" /> {buttonText}</span>
        )}
      </button>
      {error && (
        <p className="font-mono text-[10px] text-orange mt-2 text-center uppercase tracking-wider">{error}</p>
      )}
      <div className="flex items-center justify-center gap-1.5 mt-2">
        <Lock className="w-3 h-3 text-ink/30" />
        <span className="font-mono text-[8px] text-ink/30 uppercase tracking-wider">Secured by Razorpay · UPI · Cards · NetBanking</span>
      </div>
    </div>
  )
}
