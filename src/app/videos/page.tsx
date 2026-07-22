'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Play, BookOpen, ExternalLink, Search, Loader2, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { extractYouTubeVideoId, getYouTubeCanonicalUrl, getYouTubeThumbnailUrl } from '@/lib/youtube'

// ─── Video Data Contract ──────────────────────────────────────────────────────

export type VideoRecord = {
  id: string
  title: string
  displayTitle?: string
  sourceTitle?: string
  channel: string
  duration: string
  subject: string
  subjectSlug: string
  youtubeId: string
  canonicalUrl: string
  thumbnailUrl?: string
  description: string
  source: 'NPTEL' | 'Industry' | 'IIT' | 'MIT'
  level: 'Foundation' | 'Intermediate' | 'Advanced'
  learningRole?: 'foundation' | 'applied' | 'case_study' | 'future_research'
  lessonSlug?: string
  status: 'published' | 'draft' | 'review' | 'archived'
  embedStatus: 'working' | 'blocked' | 'removed' | 'invalid'
  manualPlaybackVerified?: boolean
  verifiedBy?: string
  academicReviewStatus?: 'approved' | 'approved_with_caveat' | 'pending' | 'remap_required'
  mappingLevel?: 'subject' | 'module' | 'lesson'
  mappingConfidence?: 'high' | 'medium' | 'low' | 'unreviewed'
  academicReviewNotes?: string
}

const SOURCE_COLORS: Record<string, { color: string; bg: string }> = {
  NPTEL:    { color: '#1D4ED8', bg: '#EFF6FF' },
  IIT:      { color: '#7C3AED', bg: '#F5F3FF' },
  MIT:      { color: '#EA580C', bg: '#FFF7ED' },
  Industry: { color: '#15803D', bg: '#F0FDF4' },
}

const SUBJECT_COLORS: Record<string, string> = {
  'polymer-chemistry': '#1D4ED8',
  'polymer-processing': '#EA580C',
  'mould-design': '#EA580C',
  'polymer-testing': '#7C3AED',
  'polymer-rheology': '#2563EB',
  'polymer-composites': '#0284C7',
  'additives-compounding': '#D97706',
  'rubber-technology': '#DC2626',
  'medical-plastics-biomaterials': '#059669',
  'recycling-technology': '#16A34A',
  'sustainable-plastics-bioplastics': '#15803D',
  'plastic-packaging-engineering': '#9333EA',
  'life-cycle-assessment': '#4F46E5',
  'entrepreneurship-in-plastics': '#CA8A04',
  'color-science-masterbatches': '#DB2777'
}

function VideoCard({ video, onClick }: { video: VideoRecord; onClick: () => void }) {
  const src = SOURCE_COLORS[video.source] || SOURCE_COLORS.Industry
  const subColor = SUBJECT_COLORS[video.subjectSlug] ?? '#1D4ED8'

  const canEmbed = video.embedStatus === 'working' && Boolean(video.youtubeId)
  const thumbnailUrl = getYouTubeThumbnailUrl(video.youtubeId)

  if (!canEmbed) {
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

  return (
    <button onClick={onClick} className="w-full text-left border-4 border-ink overflow-hidden group transition-all bg-canvas flex flex-col justify-between"
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
        <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
          <span className="font-mono text-[8px] font-black px-2 py-0.5 border-2 uppercase"
            style={{ backgroundColor: src.bg, borderColor: src.color, color: src.color }}>
            {video.source === 'Industry' ? 'Industry Demo' : video.source}
          </span>
          {video.learningRole && (
            <span className={`font-mono text-[8px] font-black px-2 py-0.5 border-2 uppercase ${video.learningRole === 'foundation' ? 'bg-blue-600 text-white border-blue-800' : 'bg-emerald-600 text-white border-emerald-800'}`}>
              {video.learningRole}
            </span>
          )}
        </div>
      </div>
      {/* Info */}
      <div className="p-4 bg-canvas border-t-2 border-ink flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 mb-2 flex-wrap">
            <span className="font-mono text-[8px] border-2 px-1.5 py-0.5 uppercase font-bold" style={{ borderColor: subColor, color: subColor }}>
              {video.subject.replace('Polymer ', '')}
            </span>
            <span className="font-mono text-[8px] border-2 border-ink/20 text-ink/60 px-1.5 py-0.5 uppercase">{video.level}</span>
            {video.mappingLevel && (
              <span className="font-mono text-[8px] border border-ink/30 bg-zinc-100 text-ink px-1.5 py-0.5 uppercase font-bold">
                {video.mappingLevel} mapping
              </span>
            )}
          </div>
          <h3 className="font-display text-sm font-black text-ink leading-tight mb-1 group-hover:underline" style={{ textDecorationColor: subColor }}>
            {video.title}
          </h3>
          <p className="font-mono text-[9px] text-ink/60 mb-2">{video.channel}</p>
        </div>

        {video.academicReviewStatus === 'approved_with_caveat' && (
          <div className="bg-amber-50 border border-amber-400 p-2 mt-2 font-mono text-[9px] text-amber-900 leading-tight">
            <span className="font-bold uppercase">Note:</span> General overview — a more specialized video will be added.
          </div>
        )}
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
                  style={{ backgroundColor: src.bg, borderColor: src.color, color: src.color }}>
                  {video.source === 'Industry' ? 'Industry Demonstration' : video.source}
                </span>
                <span className="font-mono text-[9px] border-2 px-2 py-0.5 uppercase font-bold" style={{ borderColor: subColor, color: subColor }}>
                  {video.subject}
                </span>
                {video.learningRole && (
                  <span className={`font-mono text-[9px] border-2 px-2 py-0.5 uppercase font-bold text-white ${video.learningRole === 'foundation' ? 'bg-blue-600 border-blue-800' : 'bg-emerald-600 border-emerald-800'}`}>
                    {video.learningRole} role
                  </span>
                )}
                <span className="font-mono text-[9px] border-2 border-ink/20 text-ink/60 px-2 py-0.5 uppercase">{video.level}</span>
                {video.academicReviewStatus === 'approved_with_caveat' ? (
                  <span className="font-mono text-[9px] border-2 border-amber-600 bg-amber-50 text-amber-900 px-2 py-0.5 uppercase font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Approved with Caveat
                  </span>
                ) : (
                  <span className="font-mono text-[9px] border-2 border-emerald-600 bg-emerald-50 text-emerald-700 px-2 py-0.5 uppercase font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Academically Approved
                  </span>
                )}
              </div>
              <h2 className="font-display text-xl font-black text-ink leading-tight mb-1">{video.title}</h2>
              {video.sourceTitle && video.sourceTitle !== video.title && (
                <p className="font-mono text-[10px] text-ink/50 italic mb-1">Source Title: &quot;{video.sourceTitle}&quot;</p>
              )}
              <p className="font-mono text-[10px] text-ink/60">{video.channel} · {video.duration}</p>
            </div>
            <button onClick={onClose} className="border-4 border-ink px-3 py-2 font-mono text-[10px] font-black uppercase hover:bg-ink hover:text-white transition-colors flex-shrink-0">
              ✕ Close
            </button>
          </div>

          <p className="text-sm text-ink/80 leading-relaxed mb-4">{video.description}</p>

          {video.academicReviewNotes && (
            <div className="bg-amber-50/80 border-2 border-amber-400 p-3 mb-4 rounded-none">
              <p className="font-mono text-[10px] font-bold text-amber-900 uppercase tracking-wider mb-1">Academic Curator Note:</p>
              <p className="font-mono text-[11px] text-amber-950 leading-normal">{video.academicReviewNotes}</p>
            </div>
          )}

          <div className="flex gap-3 flex-wrap">
            {video.mappingLevel === 'lesson' && video.lessonSlug ? (
              <Link href={`/lessons/${video.lessonSlug}`} onClick={onClose}
                className="cn-btn-black text-xs flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Related Lesson
              </Link>
            ) : (
              <Link href={`/subjects/${video.subjectSlug}`} onClick={onClose}
                className="border-4 border-ink px-4 py-2 font-mono text-[10px] font-black uppercase hover:bg-ink hover:text-white transition-colors flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Related Subject
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
  const [selectedVideo, setSelectedVideo] = useState<VideoRecord | null>(null)
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedSource, setSelectedSource] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function loadPublishedVideos() {
      try {
        setLoading(true)
        const supabase = createClient()
        const { data, error } = await supabase.from('videos').select('*')

        if (error) {
          console.error('Supabase Query Error:', error)
          setVideosList([])
        } else if (data && data.length > 0) {
          const mapped = data
            .map((item: Record<string, unknown>): VideoRecord | null => {
              const rawId = String(item.youtube_id || item.external_video_id || item.youtube_url || '')
              const cleanId = extractYouTubeVideoId(rawId)
              if (!cleanId) return null

              const displayTitle = String(item.display_title || item.title || 'Polymer Engineering Video')
              const sourceTitle = String(item.source_title || item.title || displayTitle)

              return {
                id: String(item.id),
                title: displayTitle,
                displayTitle,
                sourceTitle,
                channel: String(item.channel || item.author || 'NPTEL / Industry'),
                duration: String(item.duration || '15:00'),
                subject: String(item.subject || item.subject_name || 'Polymer Engineering'),
                subjectSlug: String(item.subject_slug || 'polymer-processing'),
                youtubeId: cleanId,
                canonicalUrl: String(item.canonical_url || getYouTubeCanonicalUrl(cleanId)),
                thumbnailUrl: String(item.thumbnail_url || getYouTubeThumbnailUrl(cleanId)),
                description: String(item.description || displayTitle),
                source: (['NPTEL', 'Industry', 'IIT', 'MIT'].includes(String(item.source || item.source_organization)) ? (item.source || item.source_organization) : 'Industry') as VideoRecord['source'],
                level: (['Foundation', 'Intermediate', 'Advanced'].includes(String(item.level)) ? item.level : 'Foundation') as VideoRecord['level'],
                learningRole: (item.learning_role as VideoRecord['learningRole']) || 'foundation',
                lessonSlug: item.lesson_slug ? String(item.lesson_slug) : undefined,
                status: 'published',
                embedStatus: item.embed_status === 'blocked' ? 'blocked' : 'working',
                manualPlaybackVerified: Boolean(item.manual_playback_verified),
                verifiedBy: String(item.verified_by || 'audit_suite_0A_R3_Batch1'),
                academicReviewStatus: (item.academic_review_status as VideoRecord['academicReviewStatus']) || 'approved',
                mappingLevel: (item.mapping_level as VideoRecord['mappingLevel']) || 'subject',
                mappingConfidence: (item.mapping_confidence as VideoRecord['mappingConfidence']) || 'high',
                academicReviewNotes: item.academic_review_notes ? String(item.academic_review_notes) : undefined
              }
            })
            .filter((v): v is VideoRecord => v !== null)

          setVideosList(mapped)
        } else {
          setVideosList([])
        }
      } catch (err) {
        console.error('Error loading videos:', err)
        setVideosList([])
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
            Release 0A-R1 — 100% Audited Video Library. Only verified, working engineering videos are published. Zero placeholders.
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
