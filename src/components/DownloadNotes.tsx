'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Download, Lock, Loader2, FileText } from 'lucide-react'

type DownloadNotesProps = {
  lessonSlug: string
  lessonTitle: string
  isPremium: boolean
  compact?: boolean
}

export default function DownloadNotes({
  lessonSlug,
  lessonTitle,
  isPremium,
  compact = false,
}: DownloadNotesProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async () => {
    if (!isPremium) return
    setLoading(true)
    setError(null)

    try {
      // Open PDF in new tab — user can print/save from there
      const url = `/api/lesson/pdf?slug=${lessonSlug}`
      const win = window.open(url, '_blank')
      if (!win) {
        setError('Please allow popups for this site to download PDFs.')
      }
    } catch {
      setError('Failed to generate PDF. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Compact version (icon button for sidebar) ──────────────────────────────
  if (compact) {
    if (!isPremium) {
      return (
        <Link
          href="/pricing"
          title="Premium feature — Download PDF Notes"
          className="border-4 border-ink w-10 h-10 flex items-center justify-center hover:bg-yellow-bright transition-colors shadow-hard-sm opacity-60"
          style={{ backgroundColor: '#F9FAFB' }}
        >
          <Lock className="w-4 h-4 text-ink/50" />
        </Link>
      )
    }

    return (
      <button
        onClick={handleDownload}
        disabled={loading}
        title="Download PDF Notes"
        className="border-4 border-ink w-10 h-10 flex items-center justify-center hover:bg-yellow-bright transition-colors shadow-hard-sm disabled:opacity-50"
        style={{ backgroundColor: '#FEFCE8' }}
      >
        {loading
          ? <Loader2 className="w-4 h-4 animate-spin text-ink" />
          : <Download className="w-4 h-4 text-ink" />}
      </button>
    )
  }

  // ── Full button ────────────────────────────────────────────────────────────
  if (!isPremium) {
    return (
      <div className="border-4 border-ink overflow-hidden" style={{ boxShadow: '4px 4px 0px 0px #CA8A04' }}>
        <div className="border-b-4 border-ink px-5 py-3 bg-yellow-bright flex items-center gap-2">
          <FileText className="w-4 h-4 text-ink" />
          <span className="font-mono text-[10px] font-black text-ink uppercase tracking-widest">PDF Notes</span>
          <span className="font-mono text-[9px] font-black border-2 border-ink bg-ink text-yellow-bright px-2 py-0.5 ml-auto uppercase">Premium</span>
        </div>
        <div className="p-4 bg-canvas flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-bold text-sm text-ink mb-0.5">Download as PDF</p>
            <p className="text-xs text-ink/60">Study offline · Print for exams · Branded notes</p>
          </div>
          <Link href="/pricing" className="cn-btn-black text-xs flex-shrink-0 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> Unlock — ₹149/mo
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="border-4 border-ink overflow-hidden" style={{ boxShadow: '4px 4px 0px 0px #CA8A04', backgroundColor: '#FEFCE8' }}>
      <div className="border-b-4 border-ink px-5 py-3 bg-yellow-bright flex items-center gap-2">
        <FileText className="w-4 h-4 text-ink" />
        <span className="font-mono text-[10px] font-black text-ink uppercase tracking-widest">PDF Notes</span>
        <span className="font-mono text-[9px] font-black border-2 border-green text-green px-2 py-0.5 ml-auto uppercase">Premium ✓</span>
      </div>
      <div className="p-4 bg-canvas flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="font-bold text-sm text-ink mb-0.5">Download: {lessonTitle.slice(0, 50)}{lessonTitle.length > 50 ? '...' : ''}</p>
          <p className="text-xs text-ink/60">Opens print dialog → Save as PDF</p>
        </div>
        <button
          onClick={handleDownload}
          disabled={loading}
          className="cn-btn-black text-xs flex-shrink-0 flex items-center gap-1.5 disabled:opacity-50"
        >
          {loading
            ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...</>
            : <><Download className="w-3.5 h-3.5" /> Download PDF</>}
        </button>
      </div>
      {error && (
        <div className="px-4 pb-3">
          <p className="font-mono text-[9px] text-orange uppercase tracking-wider">{error}</p>
        </div>
      )}
    </div>
  )
}
