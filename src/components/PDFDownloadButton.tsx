'use client'

import { Download, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'

type PDFDownloadButtonProps = {
  isPremium: boolean
}

export default function PDFDownloadButton({ isPremium }: PDFDownloadButtonProps) {
  const router = useRouter()

  const handleDownload = () => {
    if (!isPremium) {
      router.push('/pricing')
    } else {
      window.print()
    }
  }

  return (
    <button
      onClick={handleDownload}
      className={`cn-btn w-full justify-center text-xs no-print border-4 border-ink font-bold uppercase tracking-wider py-3 px-4 inline-flex items-center gap-2 transition-all shadow-[4px_4px_0px_0px_#0a0a0a] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#0a0a0a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#0a0a0a] ${
        isPremium ? 'bg-yellow-bright text-ink' : 'bg-ink text-white'
      }`}
    >
      {isPremium ? (
        <>
          <Download className="w-3.5 h-3.5" /> Download PDF Note
        </>
      ) : (
        <>
          <Lock className="w-3.5 h-3.5" /> Unlock PDF Download
        </>
      )}
    </button>
  )
}
