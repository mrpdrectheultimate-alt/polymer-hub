'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Play, BookOpen, ExternalLink, Search, Loader2, ShieldCheck, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { extractYouTubeVideoId, getYouTubeCanonicalUrl, getYouTubeThumbnailUrl } from '@/lib/youtube'

// ─── Video Data Contract ──────────────────────────────────────────────────────

export type VideoRecord = {
  id: string
  title: string
  channel: string
  duration: string
  subject: string
  subjectSlug: string
  youtubeId: string
  canonicalUrl: string
  description: string
  source: 'NPTEL' | 'Industry' | 'IIT' | 'MIT'
  level: 'Foundation' | 'Intermediate' | 'Advanced'
  lessonSlug?: string
  status: 'published' | 'draft' | 'review' | 'archived'
  embedStatus: 'working' | 'blocked' | 'removed' | 'invalid'
}

// ─── Audited 100% Real Verified Polymer Videos (Release 0A-R1) ────────────────

const AUDITED_VERIFIED_VIDEOS: VideoRecord[] = [
  {
    id: 'audited-v1',
    title: 'Plastic Injection Molding Process — Machinery & Polymer Flow',
    channel: 'engineerguy (Prof. Bill Hammack)',
    duration: '11:13',
    subject: 'Polymer Processing',
    subjectSlug: 'polymer-processing',
    youtubeId: 'RMjtmsr3CqA',
    canonicalUrl: 'https://www.youtube.com/watch?v=RMjtmsr3CqA',
    description: 'Full engineering explanation of injection moulding machines: reciprocating screw, plasticization, clamping force, cooling channels, and part ejection.',
    source: 'Industry',
    level: 'Foundation',
    lessonSlug: 'injection-moulding-process-parameters-and-defects',
    status: 'published',
    embedStatus: 'working'
  }
]

const SOURCE_COLORS: Record<string, { color: string; bg: string }> = {
  NPTEL:    { color: '#1D4ED8', bg: '#EFF6FF' },
  IIT:      { color: '#7C3AED', bg: '#F5F3FF' },
  MIT:      { color: '#EA580C', bg: '#FFF7ED' },
  Industry: { color: '#15803D', bg: '#F0FDF4' },
}

const SUBJECT_COLORS: Record<string, string> = {
  'polymer-chemistry': '#1D4ED8', 'polymer-processing': '#EA580C',
  'mould-design': '#EA580C', 'polymer-testing': '#7C3AED',
  'rubber-technology': '#EA580C', 'recycling-technology': '#15803D',
  'sustainable-plastics': '#15803D', 'polymer-composites': '#1D4ED8',
  'entrepreneurship-plastics': '#CA8A04', 'medical-plastics': '#7C3AED',
}

function VideoCard({ video, onClick }: { video: VideoRecord; onClick: () => void }) {
  const src = SOURCE_COLORS[video.source] || SOURCE_COLORS.Industry
  const subColor = SUBJECT_COLORS[video.subjectSlug] ?? '#1D4ED8'

  const canEmbed = video.embedStatus === 'working' && Boolean(video.youtubeId)
  const thumbnailUrl = getYouTubeThumbnailUrl(video.youtubeId)

  if (!canEmbed) {
    // External-only video card behavior — link directly to YouTube, no broken modal!
    return (
      <a href={video.canonicalUrl} target="_blank" rel="noopener noreferrer"
        className="w-full block text-left border-4 border-ink overflow-hidden group transition-all bg-canvas"
        style={{ boxShadow: `3px 3px 0px 0px ${subColor}` }}>
        <div className="relative bg-ink/90 aspect-video flex items-center justify-center overflow-hidden">
          <img src={thumbnailUrl} alt={video.title} className="w-full h-full object-cover absolute inset-0 opacity-80 group-hover:scale-105 transition-transform duration-300" />
          <div className="relative border-2 border-white bg-black/70 px-3 py-1.5 font-mono text-[9px] font-bold text-white flex items-center gap-1.5">
            <ExternalLink className="w-3.5 h-3.5" /> Watch on YouTube
          </div>
          <div className="absolute top-2 left-2 font-mono text-[8px] font-black px-2 py-0.5 border-2 uppercase"
            style={{ backgroundColor: src.bg, borderColor: src.color, color: src.color }}>
            {video.source}
          </div>
        </div>
        <div className="p-4 bg-canvas border-t-2 border-ink">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="font-mono text-[8px] border-2 px-1.5 py-0.5 uppercase font-bold" style={{ borderColor: subColor, color: subColor }}>
              {video.subject.replace('Polymer ', '')}
            </span>
            <span className="font-mono text-[8px] border-2 border-yellow-bright bg-yellow-bright/10 text-yellow-800 px-1.5 py-0.5 uppercase font-bold">External Only</span>
          </div>
          <h3 className="font-display text-sm font-black text-ink leading-tight mb-1 group-hover:underline">
            {video.title}
          </h3>
          <p className="font-mono text-[9px] text-ink/60">{video.channel}</p>
        </div>
      </a>
    )
  }

  // Embedded video card behavior
  return (
    <button onClick={onClick} className="w-full text-left border-4 border-ink overflow-hidden group transition-all bg-canvas"
      style={{ boxShadow: `3px 3px 0px 0px ${subColor}` }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translate(-2px,-2px)'; el.style.boxShadow = `5px 5px 0px 0px ${subColor}` }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translate(0,0)'; el.style.boxShadow = `3px 3px 0px 0px ${subColor}` }}>
      {/* Thumbnail */}
      <div className="relative bg-ink/90 aspect-video flex items-center justify-center overflow-hidden">
        <img src={thumbnailUrl} alt={video.title} className="w-full h-full object-cover absolute inset-0 opacity-80 group-hover:scale-105 transition-transform duration-300" />
        <div className="relative w-14 h-14 border-4 border-white bg-black/40 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
          <Play className="w-6 h-6 text-white fill-white ml-0.5" />
        </div>
        <div className="absolute bottom-2 right-2 bg-ink/90 font-mono text-[9px] text-white px-2 py-0.5 font-bold border border-white/20">{video.duration}</div>
        <div className="absolute top-2 left-2 font-mono text-[8px] font-black px-2 py-0.5 border-2 uppercase"
          style={{ backgroundColor: src.bg, borderColor: src.color, color: src.color }}>
          {video.source}
        </div>
      </div>
      {/* Info */}
      <div className="p-4 bg-canvas border-t-2 border-ink">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="font-mono text-[8px] border-2 px-1.5 py-0.5 uppercase font-bold" style={{ borderColor: subColor, color: subColor }}>
            {video.subject.replace('Polymer ', '')}
          </span>
          <span className="font-mono text-[8px] border-2 border-ink/20 text-ink/60 px-1.5 py-0.5 uppercase">{video.level}</span>
        </div>
        <h3 className="font-display text-sm font-black text-ink leading-tight mb-1 group-hover:underline" style={{ textDecorationColor: subColor }}>
          {video.title}
        </h3>
        <p className="font-mono text-[9px] text-ink/60">{video.channel}</p>
      </div>
    </button>
  )
}

function VideoModal({ video, onClose }: { video: VideoRecord; onClose: () => void }) {
  const src = SOURCE_COLORS[video.source] || SOURCE_COLORS.Industry
  const subColor = SUBJECT_COLORS[video.subjectSlug] ?? '#1D4ED8'

  return (
    <div className="fixed inset-0 bg-ink/80 z-50 flex items-center justify-center p-4">
      <div className="bg-canvas w-full max-w-3xl border-4 border-ink shadow-hard-xl max-h-[90vh] overflow-y-auto">
        {/* Video embed */}
        <div className="aspect-video bg-ink">
          <iframe
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        {/* Details */}
        <div className="border-t-4 border-ink p-5">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="font-mono text-[9px] font-black px-2 py-0.5 border-2 uppercase"
                  style={{ backgroundColor: src.bg, borderColor: src.color, color: src.color }}>{video.source}</span>
                <span className="font-mono text-[9px] border-2 px-2 py-0.5 uppercase font-bold" style={{ borderColor: subColor, color: subColor }}>
                  {video.subject}
                </span>
                <span className="font-mono text-[9px] border-2 border-ink/20 text-ink/60 px-2 py-0.5 uppercase">{video.level}</span>
                <span className="font-mono text-[9px] border-2 border-emerald-600 bg-emerald-50 text-emerald-700 px-2 py-0.5 uppercase font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Audited & Verified
                </span>
              </div>
              <h2 className="font-display text-xl font-black text-ink leading-tight mb-1">{video.title}</h2>
              <p className="font-mono text-[10px] text-ink/60">{video.channel} · {video.duration}</p>
            </div>
            <button onClick={onClose} className="border-4 border-ink px-3 py-2 font-mono text-[10px] font-black uppercase hover:bg-ink hover:text-white transition-colors flex-shrink-0">
              ✕ Close
            </button>
          </div>
          <p className="text-sm text-ink/80 leading-relaxed mb-4">{video.description}</p>
          <div className="flex gap-3 flex-wrap">
            {video.lessonSlug && (
              <Link href={`/lessons/${video.lessonSlug}`} onClick={onClose}
                className="cn-btn-black text-xs flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Related Lesson
              </Link>
            )}
            <a href={video.canonicalUrl} target="_blank" rel="noopener noreferrer"
              className="border-4 border-ink px-4 py-2 font-mono text-[10px] font-black uppercase hover:bg-ink hover:text-white transition-colors flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5" /> Watch on YouTube
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VideoLibraryPage() {
  const [videosList, setVideosList] = useState<VideoRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<VideoRecord | null>(null)
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedSource, setSelectedSource] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function loadPublishedVideos() {
      setLoading(true)
      setErrorMsg(null)
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .eq('status', 'published')
          .in('embed_status', ['working', 'blocked'])
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Supabase Query Error:', error)
          setErrorMsg(error.message)
          setVideosList(process.env.NODE_ENV === 'development' ? AUDITED_VERIFIED_VIDEOS : [])
        } else if (data && data.length > 0) {
          const mapped = data
            .map((item: Record<string, unknown>): VideoRecord | null => {
              const rawId = String(item.youtube_id || item.external_video_id || '')
              const cleanId = extractYouTubeVideoId(rawId)
              if (!cleanId) return null

              return {
                id: String(item.id),
                title: String(item.title || ''),
                channel: String(item.channel || 'Industry Channel'),
                duration: String(item.duration || '15:00'),
                subject: String(item.subject_name || 'Polymer Processing'),
                subjectSlug: String(item.subject_slug || 'polymer-processing'),
                youtubeId: cleanId,
                canonicalUrl: String(item.canonical_url || getYouTubeCanonicalUrl(cleanId)),
                description: String(item.description || item.title || ''),
                source: (['NPTEL', 'Industry', 'IIT', 'MIT'].includes(String(item.source)) ? item.source : 'Industry') as VideoRecord['source'],
                level: (['Foundation', 'Intermediate', 'Advanced'].includes(String(item.level)) ? item.level : 'Foundation') as VideoRecord['level'],
                lessonSlug: item.lesson_slug ? String(item.lesson_slug) : undefined,
                status: 'published' as const,
                embedStatus: (item.embed_status === 'blocked' ? 'blocked' : 'working') as const
              }
            })
            .filter((v): v is VideoRecord => v !== null)

          setVideosList(mapped)
        } else {
          // DB returned 0 published videos
          if (process.env.NODE_ENV === 'development') {
            setVideosList(AUDITED_VERIFIED_VIDEOS)
          } else {
            setVideosList([])
          }
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown database error'
        console.error('Database connection failed:', msg)
        setErrorMsg(msg)
        if (process.env.NODE_ENV === 'development') {
          setVideosList(AUDITED_VERIFIED_VIDEOS)
        }
      } finally {
        setLoading(false)
      }
    }

    loadPublishedVideos()
  }, [])

  const subjects = Array.from(new Set(videosList.map(v => v.subject)))

  const filtered = videosList.filter(v => {
    const matchSubject = selectedSubject === 'all' || v.subject === selectedSubject
    const matchSource = selectedSource === 'all' || v.source === selectedSource
    const matchSearch = !search || v.title.toLowerCase().includes(search.toLowerCase()) || v.description.toLowerCase().includes(search.toLowerCase())
    return matchSubject && matchSource && matchSearch
  })

  return (
    <div className="min-h-screen bg-canvas">
      <div className="h-2 bg-blue" />

      {/* Hero */}
      <section className="border-b-4 border-ink bg-ink px-6 md:px-12 py-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue border-4 border-blue flex items-center justify-center">
              <Play className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-mono text-[10px] font-black text-yellow-bright border-2 border-yellow-bright px-3 py-1 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Audited Video Library
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-black text-white leading-none mb-3">
            SEE IT.<br />
            <span className="text-yellow-bright italic">UNDERSTAND IT.</span>
          </h1>
          <p className="text-white/70 max-w-xl leading-relaxed">
            Curated engineering videos from NPTEL, IIT lectures, MIT OCW, and verified manufacturers — zero broken embeds, zero unverified placeholders.
          </p>
        </div>
      </section>

      {/* Filters */}
      <div className="border-b-4 border-ink px-6 md:px-10 py-4 flex flex-col sm:flex-row gap-3 sticky top-14 z-20 bg-canvas/95 backdrop-blur">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full border-4 border-ink pl-10 pr-4 py-2 text-sm text-ink focus:outline-none focus:border-blue shadow-hard-sm"
            placeholder="Search audited videos..." />
        </div>
        <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}
          className="border-4 border-ink px-4 py-2 text-sm font-bold text-ink bg-canvas focus:outline-none shadow-hard-sm">
          <option value="all">All Subjects ({videosList.length} verified)</option>
          {subjects.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <div className="flex gap-2 flex-wrap">
          {['all', 'NPTEL', 'IIT', 'MIT', 'Industry'].map(src => {
            const cfg = src !== 'all' ? SOURCE_COLORS[src] : { color: '#0A0A0A', bg: '#F9FAFB' }
            return (
              <button key={src} onClick={() => setSelectedSource(src)}
                className="font-mono text-[9px] font-black border-4 border-ink px-3 py-2 uppercase transition-all"
                style={{ backgroundColor: selectedSource === src ? cfg.color : 'white', color: selectedSource === src ? 'white' : '#6B7280' }}>
                {src}
              </button>
            )
          })}
        </div>
      </div>

      {/* Stats strip */}
      <div className="border-b-4 border-ink grid grid-cols-2 md:grid-cols-4 divide-x-4 divide-ink">
        {[
          { val: videosList.length, label: 'Audited & Published', color: '#1D4ED8' },
          { val: videosList.filter(v => v.source === 'NPTEL' || v.source === 'IIT').length, label: 'NPTEL / IIT Lectures', color: '#7C3AED' },
          { val: videosList.filter(v => v.source === 'Industry').length, label: 'Industry Demos', color: '#15803D' },
          { val: subjects.length, label: 'Subjects Covered', color: '#EA580C' },
        ].map(s => (
          <div key={s.label} className="p-4 text-center" style={{ backgroundColor: s.color + '10' }}>
            <div className="font-display text-2xl font-black" style={{ color: s.color }}>{s.val}</div>
            <div className="font-mono text-[8px] text-ink/60 uppercase tracking-wider mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="border-4 border-ink p-12 text-center flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue animate-spin mb-3" />
            <p className="font-mono text-sm text-ink/60">Verifying video publication status...</p>
          </div>
        ) : errorMsg ? (
          <div className="border-4 border-ink p-8 bg-red-50 text-center">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <h3 className="font-display text-lg font-black text-red-900 mb-1">Database Sync Error</h3>
            <p className="font-mono text-xs text-red-700">{errorMsg}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="border-4 border-ink border-dashed p-12 text-center bg-canvas">
            <p className="font-display text-2xl font-black text-ink/30 mb-2">No audited videos match your filter</p>
            <p className="font-mono text-xs text-ink/50 max-w-md mx-auto mb-4">
              All entries pass strict verification before publication. Reset your filters or select another domain.
            </p>
            <button onClick={() => { setSelectedSubject('all'); setSelectedSource('all'); setSearch(''); }}
              className="cn-btn-blue text-xs">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(video => (
              <VideoCard key={video.id} video={video} onClick={() => setSelectedVideo(video)} />
            ))}
          </div>
        )}
      </div>

      {selectedVideo && <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
    </div>
  )
}
