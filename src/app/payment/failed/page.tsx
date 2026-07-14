'use client'

import Link from 'next/link'
import { XCircle, RotateCcw } from 'lucide-react'

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="border-4 border-ink overflow-hidden" style={{ boxShadow: '6px 6px 0px 0px #EA580C' }}>
          <div className="border-b-4 border-ink px-6 py-5 bg-orange text-center">
            <XCircle className="w-12 h-12 text-white mx-auto mb-2" />
            <h1 className="font-display text-3xl font-black text-white">Payment Failed</h1>
          </div>
          <div className="p-6 bg-canvas text-center">
            <p className="text-ink/70 mb-6 leading-relaxed">
              Your payment was not completed. No amount has been charged.
              This can happen due to network issues, bank declines, or UPI timeout.
            </p>
            <div className="space-y-3">
              <Link href="/pricing" className="cn-btn-black w-full justify-center text-sm">
                <RotateCcw className="w-4 h-4" /> Try Again
              </Link>
              <Link href="/dashboard" className="block font-mono text-[10px] text-ink/40 hover:text-ink uppercase tracking-wider transition-colors text-center">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
        <p className="font-mono text-[9px] text-ink/30 text-center mt-4 uppercase tracking-wider">
          Need help? Contact us — no payment was deducted
        </p>
      </div>
    </div>
  )
}
