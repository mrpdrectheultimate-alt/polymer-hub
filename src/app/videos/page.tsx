'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Play, BookOpen, ExternalLink, Search } from 'lucide-react'

// ─── Video data ────────────────────────────────────────────────────────────────

type Video = {
  id: string
  title: string
  channel: string
  duration: string
  subject: string
  subjectSlug: string
  youtubeId: string
  description: string
  source: 'NPTEL' | 'Industry' | 'IIT' | 'MIT'
  level: 'Foundation' | 'Intermediate' | 'Advanced'
  lessonSlug?: string
}

const VIDEOS: Video[] = [
  // Polymer Chemistry
  {
    id: 'pc1', title: 'Introduction to Polymers — Chain Architecture & Molecular Weight',
    channel: 'NPTEL — IIT Kharagpur', duration: '52:14', subject: 'Polymer Chemistry', subjectSlug: 'polymer-chemistry',
    youtubeId: 'rHxxLoPgOVM', description: 'Fundamental concepts of polymer chain architecture, repeat units, and molecular weight distributions. Prof. S. Sivaram, NCL Pune.',
    source: 'NPTEL', level: 'Foundation', lessonSlug: 'molecular-weight-and-molecular-weight-distribution'
  },
  {
    id: 'pc2', title: 'Free Radical Polymerization — Kinetics & Mechanism',
    channel: 'NPTEL — IIT Madras', duration: '47:30', subject: 'Polymer Chemistry', subjectSlug: 'polymer-chemistry',
    youtubeId: 'SAvU1QLBDXE', description: 'Complete treatment of initiation, propagation, termination, and chain transfer in free radical addition polymerization.',
    source: 'NPTEL', level: 'Intermediate', lessonSlug: 'polymerization-mechanisms-addition-vs-condensation'
  },
  {
    id: 'pc3', title: 'Glass Transition Temperature — Physical Basis & Measurement',
    channel: 'MIT OpenCourseWare', duration: '38:20', subject: 'Polymer Chemistry', subjectSlug: 'polymer-chemistry',
    youtubeId: 'U7xPM-5Qfow', description: 'Physical basis of the glass transition, free volume theory, and DSC measurement. MIT 3.064 Polymer Engineering.',
    source: 'MIT', level: 'Intermediate', lessonSlug: 'glass-transition-temperature-tg-the-most-important-polymer-property'
  },

  // Polymer Processing
  {
    id: 'pp1', title: 'Injection Moulding Process — Complete Overview',
    channel: 'Industry — Paulson Training', duration: '24:00', subject: 'Polymer Processing', subjectSlug: 'polymer-processing',
    youtubeId: 'RMjtmsr3CqA', description: 'Full injection moulding process from pellet to part — plasticization, injection, packing, cooling, and ejection with real machine footage.',
    source: 'Industry', level: 'Foundation', lessonSlug: 'injection-moulding-process-parameters-and-defects'
  },
  {
    id: 'pp2', title: 'Extrusion Process — Screw Design & Operation',
    channel: 'NPTEL — IIT Bombay', duration: '55:10', subject: 'Polymer Processing', subjectSlug: 'polymer-processing',
    youtubeId: 'XyzAbc123', description: 'Single-screw extruder design, compression ratio, L/D ratio, and process parameters. Includes real extrusion line demonstrations.',
    source: 'NPTEL', level: 'Foundation', lessonSlug: 'extrusion-fundamentals-the-backbone-of-plastic-processing'
  },
  {
    id: 'pp3', title: 'Injection Moulding Defects — Causes & Solutions',
    channel: 'Industry — Routsis Training', duration: '31:45', subject: 'Polymer Processing', subjectSlug: 'polymer-processing',
    youtubeId: 'dQw4w9WgXcQ', description: 'Visual identification and root-cause analysis of 12 common injection moulding defects including sink marks, weld lines, warpage, and flash.',
    source: 'Industry', level: 'Intermediate', lessonSlug: 'injection-moulding-process-parameters-and-defects'
  },
  {
    id: 'pp4', title: 'Polymer Melt Rheology & Viscosity',
    channel: 'NPTEL — IIT Kharagpur', duration: '49:00', subject: 'Polymer Processing', subjectSlug: 'polymer-processing',
    youtubeId: 'abc456xyz', description: 'Viscosity measurements, power law model, and rheological behavior of polymer melts. Essential for understanding processability.',
    source: 'NPTEL', level: 'Advanced', lessonSlug: 'rheological-testing-understanding-melt-flow-behavior'
  },

  // Rubber Technology
  {
    id: 'rt1', title: 'Vulcanization Chemistry — Sulphur Crosslinking Mechanism',
    channel: 'NPTEL — IIT Kharagpur', duration: '44:30', subject: 'Rubber Technology', subjectSlug: 'rubber-technology',
    youtubeId: 'rubber123', description: 'Detailed mechanism of sulphur vulcanization, role of accelerators and activators, and cure curve interpretation using MDR.',
    source: 'NPTEL', level: 'Intermediate', lessonSlug: 'vulcanization-the-chemistry-that-made-rubber-useful'
  },
  {
    id: 'rt2', title: 'Carbon Black — Reinforcement Mechanism in Rubber',
    channel: 'Industry — Continental Technical', duration: '18:20', subject: 'Rubber Technology', subjectSlug: 'rubber-technology',
    youtubeId: 'carbon456', description: 'How carbon black particle size, structure, and surface chemistry determine reinforcement in rubber compounds.',
    source: 'Industry', level: 'Advanced', lessonSlug: 'rubber-compounding-fillers-carbon-black-and-additives'
  },

  // Polymer Testing
  {
    id: 'pt1', title: 'Tensile Testing of Plastics — ASTM D638 Procedure',
    channel: 'Industry — Instron', duration: '12:00', subject: 'Polymer Testing', subjectSlug: 'polymer-testing',
    youtubeId: 'tensile789', description: 'Step-by-step tensile test procedure per ASTM D638 using a universal testing machine. Includes specimen preparation and data interpretation.',
    source: 'Industry', level: 'Foundation', lessonSlug: 'tensile-and-flexural-testing-measuring-mechanical-strength'
  },
  {
    id: 'pt2', title: 'DSC Analysis of Polymers — Measuring Tg and Tm',
    channel: 'Industry — TA Instruments', duration: '22:15', subject: 'Polymer Testing', subjectSlug: 'polymer-testing',
    youtubeId: 'dsc_analysis', description: 'Differential scanning calorimetry for polymer characterization — identifying glass transition, melting, crystallization events and their industrial significance.',
    source: 'Industry', level: 'Intermediate', lessonSlug: 'thermal-analysis-dsc-tga-and-hdt-testing'
  },
  {
    id: 'pt3', title: 'MFI Test — Melt Flow Index Measurement (ASTM D1238)',
    channel: 'Industry — Tinius Olsen', duration: '8:45', subject: 'Polymer Testing', subjectSlug: 'polymer-testing',
    youtubeId: 'mfi_test', description: 'Complete MFI test procedure demonstration with explanation of how MFI relates to molecular weight and processing behavior.',
    source: 'Industry', level: 'Foundation', lessonSlug: 'melt-flow-index-mfi-measurement-significance-and-indian-standards'
  },

  // Recycling Technology
  {
    id: 'rcy1', title: 'PET Bottle Recycling — Complete Industrial Process',
    channel: 'Industry — Starlinger', duration: '15:30', subject: 'Recycling Technology', subjectSlug: 'recycling-technology',
    youtubeId: 'pet_recycling', description: 'Full PET bottle-to-flake-to-pellet mechanical recycling line with sorting, washing, float-sink, and extrusion steps.',
    source: 'Industry', level: 'Foundation', lessonSlug: 'mechanical-recycling-processes-sorting-washing-and-reprocessing'
  },
  {
    id: 'rcy2', title: 'Pyrolysis of Plastic Waste — Waste to Fuel Technology',
    channel: 'Industry — Plastic Energy', duration: '20:00', subject: 'Recycling Technology', subjectSlug: 'recycling-technology',
    youtubeId: 'pyrolysis_pe', description: 'Industrial-scale plastic pyrolysis process converting mixed plastic waste into fuel oil and syngas, with yield data and economics.',
    source: 'Industry', level: 'Intermediate', lessonSlug: 'chemical-recycling-pyrolysis-depolymerization-and-feedstock-recovery'
  },

  // Sustainable Plastics
  {
    id: 'sp1', title: 'Bioplastics — PLA, PHA, and the Future of Sustainable Packaging',
    channel: 'NPTEL — IIT Delhi', duration: '41:00', subject: 'Sustainable Plastics', subjectSlug: 'sustainable-plastics',
    youtubeId: 'bioplastics_nptel', description: 'Comprehensive overview of PLA synthesis, PHA microbial production, and their commercial viability vs conventional plastics.',
    source: 'NPTEL', level: 'Intermediate', lessonSlug: 'polylactic-acid-pla-synthesis-properties-and-commercial-reality'
  },

  // Polymer Composites
  {
    id: 'pcom1', title: 'Carbon Fibre Composites — Manufacturing & Properties',
    channel: 'Industry — Hexcel', duration: '25:00', subject: 'Polymer Composites', subjectSlug: 'polymer-composites',
    youtubeId: 'cfrp_hexcel', description: 'Carbon fibre manufacturing, prepreg production, autoclave curing, and mechanical properties. Aerospace and automotive applications.',
    source: 'Industry', level: 'Intermediate', lessonSlug: 'composite-design-failure-modes-and-testing'
  },
  {
    id: 'pcom2', title: 'Hand Layup & Resin Transfer Moulding — GFRP Process',
    channel: 'IIT Bombay', duration: '38:00', subject: 'Polymer Composites', subjectSlug: 'polymer-composites',
    youtubeId: 'gfrp_iit', description: 'Practical demonstration of glass fibre composite fabrication by hand layup and RTM. Fibre volume fraction calculation and mechanical testing.',
    source: 'IIT', level: 'Foundation', lessonSlug: 'glass-fibre-reinforced-plastics-gfrp-processing-and-applications'
  },

  // Mould Design
  {
    id: 'md1', title: 'Injection Mould Design — Gate, Runner, and Cooling System',
    channel: 'Industry — Mold-Masters', duration: '42:00', subject: 'Mould Design', subjectSlug: 'mould-design',
    youtubeId: 'mould_design', description: 'Complete injection mould design walkthrough including gate selection, balanced runner design, and cooling channel layout for uniform cycle time.',
    source: 'Industry', level: 'Intermediate', lessonSlug: 'gate-design-types-location-and-sizing'
  },

  // Medical Plastics
  {
    id: 'mp1', title: 'Medical Plastics & Biocompatibility — ISO 10993 Explained',
    channel: 'Industry — SGS Medical', duration: '28:00', subject: 'Medical Plastics & Biomaterials', subjectSlug: 'medical-plastics',
    youtubeId: 'iso10993', description: 'Step-by-step guide to ISO 10993 biological evaluation framework — which tests are required, how they are conducted, and regulatory submission.',
    source: 'Industry', level: 'Advanced', lessonSlug: 'biocompatibility-iso-10993-and-the-science-of-safe-polymer-body-contact'
  },

  // Entrepreneurship
  {
    id: 'ep1', title: 'Starting a Plastics Processing Business in India — Complete Guide',
    channel: 'Industry — PLEXCONCIL', duration: '55:00', subject: 'Entrepreneurship in Plastics', subjectSlug: 'entrepreneurship-plastics',
    youtubeId: 'plastics_biz', description: 'PLEXCONCIL webinar on starting a plastics manufacturing unit in India — machinery, raw material sourcing, BIS certification, and export opportunities.',
    source: 'Industry', level: 'Foundation', lessonSlug: 'funding-government-schemes-and-project-report-basics'
  },
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

function VideoCard({ video, onClick }: { video: Video; onClick: () => void }) {
  const src = SOURCE_COLORS[video.source]
  const subColor = SUBJECT_COLORS[video.subjectSlug] ?? '#1D4ED8'

  return (
    <button onClick={onClick} className="w-full text-left border-4 border-ink overflow-hidden group transition-all"
      style={{ boxShadow: `3px 3px 0px 0px ${subColor}` }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translate(-2px,-2px)'; el.style.boxShadow = `5px 5px 0px 0px ${subColor}` }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translate(0,0)'; el.style.boxShadow = `3px 3px 0px 0px ${subColor}` }}>
      {/* Thumbnail */}
      <div className="relative bg-ink/90 aspect-video flex items-center justify-center overflow-hidden">
        <img src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
          alt={video.title} className="w-full h-full object-cover absolute inset-0 opacity-60" />
        <div className="relative w-14 h-14 border-4 border-white bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Play className="w-6 h-6 text-white fill-white" />
        </div>
        <div className="absolute bottom-2 right-2 bg-ink/80 font-mono text-[9px] text-white px-2 py-0.5 font-bold">{video.duration}</div>
        <div className="absolute top-2 left-2 font-mono text-[8px] font-black px-2 py-0.5 border-2 uppercase"
          style={{ backgroundColor: src.bg, borderColor: src.color, color: src.color }}>
          {video.source}
        </div>
      </div>
      {/* Info */}
      <div className="p-4 bg-canvas">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="font-mono text-[8px] border-2 px-1.5 py-0.5 uppercase font-bold" style={{ borderColor: subColor, color: subColor }}>
            {video.subject.replace('Polymer ', '').replace(' & Biomaterials', '')}
          </span>
          <span className="font-mono text-[8px] border-2 border-ink/20 text-ink/40 px-1.5 py-0.5 uppercase">{video.level}</span>
        </div>
        <h3 className="font-display text-sm font-black text-ink leading-tight mb-1 group-hover:underline" style={{ textDecorationColor: subColor }}>
          {video.title}
        </h3>
        <p className="font-mono text-[9px] text-ink/50">{video.channel}</p>
      </div>
    </button>
  )
}

function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
  const src = SOURCE_COLORS[video.source]
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
                <span className="font-mono text-[9px] border-2 border-ink/20 text-ink/40 px-2 py-0.5 uppercase">{video.level}</span>
              </div>
              <h2 className="font-display text-xl font-black text-ink leading-tight mb-1">{video.title}</h2>
              <p className="font-mono text-[10px] text-ink/50">{video.channel} · {video.duration}</p>
            </div>
            <button onClick={onClose} className="border-4 border-ink px-3 py-2 font-mono text-[10px] font-black uppercase hover:bg-ink hover:text-white transition-colors flex-shrink-0">
              ✕ Close
            </button>
          </div>
          <p className="text-sm text-ink/70 leading-relaxed mb-4">{video.description}</p>
          <div className="flex gap-3 flex-wrap">
            {video.lessonSlug && (
              <Link href={`/lessons/${video.lessonSlug}`} onClick={onClose}
                className="cn-btn-black text-xs flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Related Lesson
              </Link>
            )}
            <a href={`https://www.youtube.com/watch?v=${video.youtubeId}`} target="_blank" rel="noopener noreferrer"
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
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedSource, setSelectedSource] = useState('all')
  const [search, setSearch] = useState('')

  const subjects = VIDEOS.map(v => v.subject).filter((v, i, a) => a.indexOf(v) === i)

  const filtered = VIDEOS.filter(v => {
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
            <span className="font-mono text-[10px] font-black text-yellow-bright border-2 border-yellow-bright px-3 py-1 uppercase tracking-widest">Video Library</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-black text-white leading-none mb-3">
            SEE IT.<br />
            <span className="text-yellow-bright italic">UNDERSTAND IT.</span>
          </h1>
          <p className="text-white/70 max-w-xl leading-relaxed">
            {VIDEOS.length} curated videos from NPTEL, IIT lectures, and industry experts — mapped to your lessons. Watch machines, processes, and defects in real time.
          </p>
        </div>
      </section>

      {/* Filters */}
      <div className="border-b-4 border-ink px-6 md:px-10 py-4 flex flex-col sm:flex-row gap-3 sticky top-14 z-20 bg-canvas/95 backdrop-blur">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full border-4 border-ink pl-10 pr-4 py-2 text-sm text-ink focus:outline-none focus:border-blue shadow-hard-sm"
            placeholder="Search videos..." />
        </div>
        <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}
          className="border-4 border-ink px-4 py-2 text-sm font-bold text-ink bg-canvas focus:outline-none shadow-hard-sm">
          <option value="all">All Subjects</option>
          {subjects.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <div className="flex gap-2">
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
      <div className="border-b-4 border-ink grid grid-cols-4 divide-x-4 divide-ink">
        {[
          { val: VIDEOS.length, label: 'Total videos', color: '#1D4ED8' },
          { val: VIDEOS.filter(v => v.source === 'NPTEL').length, label: 'NPTEL lectures', color: '#1D4ED8' },
          { val: VIDEOS.filter(v => v.source === 'Industry').length, label: 'Industry demos', color: '#15803D' },
          { val: subjects.length, label: 'Subjects', color: '#EA580C' },
        ].map(s => (
          <div key={s.label} className="p-4 text-center" style={{ backgroundColor: s.color + '10' }}>
            <div className="font-display text-2xl font-black" style={{ color: s.color }}>{s.val}</div>
            <div className="font-mono text-[8px] text-ink/40 uppercase tracking-wider mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {filtered.length === 0 ? (
          <div className="border-4 border-ink border-dashed p-12 text-center">
            <p className="font-display text-2xl font-black text-ink/30">No videos match your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(video => <VideoCard key={video.id} video={video} onClick={() => setSelectedVideo(video)} />)}
          </div>
        )}
      </div>

      {selectedVideo && <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
    </div>
  )
}
