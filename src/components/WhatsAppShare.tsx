'use client'

import { useState } from 'react'
import { Share2, Check, MessageCircle, Link2 } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type ShareType = 'lesson' | 'subject' | 'pulse' | 'tool'

type WhatsAppShareProps = {
  type: ShareType
  title: string
  url?: string            // defaults to current page if not provided
  subjectName?: string    // for lessons — "Polymer Chemistry"
  description?: string    // optional extra context
  compact?: boolean       // true = icon only, false = full button
}

// ─── Message builders ─────────────────────────────────────────────────────────

function buildWhatsAppMessage(props: WhatsAppShareProps, fullUrl: string): string {
  const { type, title, subjectName, description } = props

  switch (type) {
    case 'lesson':
      return `📚 *${title}*\n\n${description ? description + '\n\n' : ''}Part of the *${subjectName || 'Polymer Engineering'}* course on PolymerHub — India's first PPE knowledge platform.\n\n🔗 ${fullUrl}\n\n_Free to read — AI Tutor + practice questions available_`

    case 'subject':
      return `🎓 *${title} — Full Course*\n\n6 world-class lessons on ${title} with AI Tutor support, practice MCQs, and Indian industry examples.\n\n🔗 ${fullUrl}\n\n_PolymerHub — Built for PPE students in India_`

    case 'pulse':
      return `🔥 *Today in Plastics*\n\n${title}\n\n🔗 ${fullUrl}\n\n_Daily plastics industry news on PolymerHub_`

    case 'tool':
      return `🛠️ *${title}*\n\n${description || 'Useful engineering tool for PPE students.'}\n\n🔗 ${fullUrl}\n\n_PolymerHub — India's Polymer Engineering Platform_`

    default:
      return `Check this out on PolymerHub 👆\n\n${title}\n\n🔗 ${fullUrl}`
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function WhatsAppShare({
  type,
  title,
  url,
  subjectName,
  description,
  compact = false,
}: WhatsAppShareProps) {
  const [copied, setCopied] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

  const fullUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  const message = buildWhatsAppMessage({ type, title, url, subjectName, description }, fullUrl)
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: message, url: fullUrl })
      } catch {
        // user cancelled
      }
    } else {
      window.open(whatsappUrl, '_blank')
    }
  }

  // ── Compact version (icon button only) ────────────────────────────────────
  if (compact) {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on WhatsApp"
        className="border-4 border-ink w-10 h-10 flex items-center justify-center hover:bg-green hover:border-green hover:text-white transition-colors shadow-hard-sm group"
        style={{ backgroundColor: '#F0FDF4' }}
      >
        <MessageCircle className="w-4 h-4 text-green group-hover:text-white" />
      </a>
    )
  }

  // ── Full button with share options ─────────────────────────────────────────
  return (
    <div className="relative">
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="border-4 border-ink flex items-center gap-2 px-4 py-2.5 font-mono text-[10px] font-black uppercase tracking-wider hover:bg-ink hover:text-white transition-all shadow-hard-sm group"
        style={{ backgroundColor: '#F0FDF4' }}
      >
        <Share2 className="w-3.5 h-3.5 text-green group-hover:text-white" />
        <span className="text-ink group-hover:text-white">Share</span>
      </button>

      {/* Dropdown */}
      {showOptions && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowOptions(false)}
          />
          <div className="absolute top-full left-0 mt-1 z-20 border-4 border-ink bg-canvas shadow-hard-lg min-w-52">
            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowOptions(false)}
              className="flex items-center gap-3 px-4 py-3 border-b-2 border-ink hover:bg-green hover:text-white group transition-colors w-full"
            >
              <div className="w-7 h-7 border-2 border-green bg-green flex items-center justify-center flex-shrink-0 group-hover:border-white">
                <MessageCircle className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <div className="font-mono text-[10px] font-black uppercase tracking-wider text-ink group-hover:text-white">WhatsApp</div>
                <div className="font-mono text-[8px] text-ink/40 group-hover:text-white/60">Share to group or contact</div>
              </div>
            </a>

            {/* Copy link */}
            <button
              onClick={() => { handleCopyLink(); setShowOptions(false) }}
              className="flex items-center gap-3 px-4 py-3 border-b-2 border-ink hover:bg-ink/5 group transition-colors w-full text-left"
            >
              <div className="w-7 h-7 border-2 border-ink flex items-center justify-center flex-shrink-0">
                {copied ? <Check className="w-3.5 h-3.5 text-green" /> : <Link2 className="w-3.5 h-3.5 text-ink" />}
              </div>
              <div>
                <div className="font-mono text-[10px] font-black uppercase tracking-wider text-ink">
                  {copied ? 'Link Copied!' : 'Copy Link'}
                </div>
                <div className="font-mono text-[8px] text-ink/40">Paste anywhere</div>
              </div>
            </button>

            {/* Native share (mobile) */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={() => { handleNativeShare(); setShowOptions(false) }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-ink/5 group transition-colors w-full text-left"
              >
                <div className="w-7 h-7 border-2 border-ink flex items-center justify-center flex-shrink-0">
                  <Share2 className="w-3.5 h-3.5 text-ink" />
                </div>
                <div>
                  <div className="font-mono text-[10px] font-black uppercase tracking-wider text-ink">More Options</div>
                  <div className="font-mono text-[8px] text-ink/40">Telegram, Instagram, etc.</div>
                </div>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Lesson Share Bar (horizontal strip at bottom of every lesson) ─────────────

export function LessonShareBar({
  lessonTitle,
  lessonUrl,
  subjectName,
  lessonSummary,
}: {
  lessonTitle: string
  lessonUrl: string
  subjectName: string
  lessonSummary: string
}) {
  const message = `📚 *${lessonTitle}*\n\n${lessonSummary}\n\nPart of *${subjectName}* on PolymerHub — India's first PPE knowledge platform.\n\n🔗 ${lessonUrl}\n\n_Free to read. AI Tutor + Practice Questions available._`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(lessonUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* fallback */ }
  }

  return (
    <div className="border-t-4 border-ink mt-8 pt-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="font-mono text-[9px] font-bold text-ink/40 uppercase tracking-widest mb-0.5">
            Found this useful?
          </div>
          <div className="font-display text-base font-black text-ink">
            Share with your batch
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border-4 border-ink flex items-center gap-2 px-4 py-2.5 font-mono text-[10px] font-black uppercase tracking-wider transition-all shadow-hard-sm"
            style={{ backgroundColor: '#25D366', color: 'white', borderColor: '#0A0A0A' }}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp
          </a>

          {/* Copy link */}
          <button
            onClick={handleCopy}
            className="border-4 border-ink flex items-center gap-2 px-4 py-2.5 font-mono text-[10px] font-black uppercase tracking-wider hover:bg-ink hover:text-white transition-all shadow-hard-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green" /> : <Link2 className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>
    </div>
  )
}
