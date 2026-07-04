'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight, Brain } from 'lucide-react'

const ERAS = [
  {
    id: 'parkesine', year: '1862', period: 'past' as const,
    title: 'Parkesine — The First Synthetic Polymer',
    body: 'Alexander Parkes unveils Parkesine at the International Exhibition in London — the first man-made plastic, derived from cellulose. It can be moulded when heated and holds its shape when cooled.',
    insight: 'Before Parkesine, every material humans used was either grown, mined, or quarried. Parkes proved you could design a material from scratch — the idea that defines polymer engineering to this day.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    color: '#7A6F5C', bg: '#F5F2EB', accent: '#0A0A0A',
  },
  {
    id: 'bakelite', year: '1907', period: 'past' as const,
    title: 'Bakelite — The First Fully Synthetic Plastic',
    body: 'Leo Baekeland invents Bakelite — the first plastic made entirely from synthetic components. It is heat-resistant, durable, and can be moulded into almost anything. Telephones, radios, electrical switches.',
    insight: 'Bakelite triggered the first plastics boom. For the first time, plastic meant precision-engineered, not improvised. The same thermoset chemistry you study in Polymer Chemistry lesson 1.',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80',
    color: '#7A6F5C', bg: '#F5F2EB', accent: '#0A0A0A',
  },
  {
    id: 'nylon', year: '1935', period: 'past' as const,
    title: 'Nylon Changes Textiles and War Manufacturing',
    body: "DuPont's Wallace Carothers patents nylon — the first true synthetic fiber. By WWII it replaces scarce silk in parachutes, ropes, and tents. The tyre cord in every MRF tyre today uses the same principle.",
    insight: 'Nylon proved polymers could replace strategic natural materials at industrial scale — a lesson that shaped how nations thought about material security for the rest of the 20th century.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    color: '#7A6F5C', bg: '#F5F2EB', accent: '#0A0A0A',
  },
  {
    id: 'polyolefins', year: '1950s–70s', period: 'past' as const,
    title: 'The Polyolefin Boom',
    body: 'Ziegler and Natta develop catalysts enabling mass production of polyethylene and polypropylene. Plastics shift from speciality to everyday infrastructure — packaging, pipes, consumer goods.',
    insight: 'This is the moment plastic became invisible — so embedded in daily life that nobody thought to mention it. Reliance Industries was founded in this era and now produces millions of tonnes of PP and PE annually.',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80',
    color: '#7A6F5C', bg: '#F5F2EB', accent: '#0A0A0A',
  },
  {
    id: 'today', year: 'TODAY', period: 'present' as const,
    title: 'The Polymer Age — Quietly Running Everything',
    body: 'Every industry on Earth depends on engineered polymers. India alone processes over 20 million tonnes annually — pipes carrying water to cities, PET in every bottle, polyamide gears in machines running 24/7.',
    insight: 'This is the world you are entering as a PPE engineer. Not a niche field — the quiet infrastructure layer of modern civilization. You are studying the material that everything else depends on.',
    indianContext: 'Reliance Industries alone produces enough polyolefins annually to supply every Indian pipe, packaging, and automotive manufacturer. CIPET trains the engineers keeping it running.',
    image: 'https://images.unsplash.com/photo-1581093458791-9d58e74010a8?w=800&q=80',
    color: '#15803D', bg: '#F0FDF4', accent: '#15803D',
  },
  {
    id: 'circular', year: '2030s', period: 'future' as const,
    title: 'The Circular Economy Era Begins',
    body: 'Chemical recycling matures. Enzymes like PETase break PET back into raw monomers. Bioplastics (PLA, PHA) move from niche to mainstream packaging. The industry\'s biggest mistake — designing for disposal — starts getting undone.',
    insight: 'PETase-based recycling is already in pilot plants. Carbios has opened a commercial facility. The engineers building this at scale are studying polymer chemistry right now — possibly in the same lessons you are reading here.',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80',
    color: '#EA580C', bg: '#FFF7ED', accent: '#EA580C',
  },
  {
    id: 'future', year: '2040s', period: 'future' as const,
    title: 'Self-Healing and Bio-Integrated Polymers',
    body: 'Materials that repair their own micro-cracks. Polymers that safely biodegrade in soil but stay stable indoors. Medical polymers that integrate with human tissue instead of merely tolerating it.',
    insight: "The gap between 'living material' and 'engineered material' keeps narrowing. Someone has to design that boundary. Your generation of polymer engineers will be the ones doing it.",
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80',
    color: '#7C3AED', bg: '#F5F3FF', accent: '#7C3AED',
  },
]

const PERIOD_CONFIG = {
  past: { label: 'PAST', color: '#0A0A0A', bg: '#F9FAFB', trackColor: '#6B7280' },
  present: { label: 'PRESENT', color: '#15803D', bg: '#F0FDF4', trackColor: '#15803D' },
  future: { label: 'FUTURE', color: '#7C3AED', bg: '#F5F3FF', trackColor: '#7C3AED' },
}

export default function HistoryPage() {
  const [active, setActive] = useState(4) // default: Today
  const era = ERAS[active]
  const period = PERIOD_CONFIG[era.period]
  const fillPct = (active / (ERAS.length - 1)) * 100

  return (
    <div className="min-h-screen bg-canvas">
      <div className="h-2" style={{ backgroundColor: era.accent }} />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="border-b-4 border-ink bg-ink px-6 md:px-12 py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <span className="font-mono text-[10px] font-black text-yellow-bright border-2 border-yellow-bright px-3 py-1 uppercase tracking-widest">
              Past · Present · Future
            </span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-black text-white leading-none mb-4">
            162 YEARS OF A<br />
            <span className="text-yellow-bright italic">MATERIAL THAT</span><br />
            REMADE CIVILIZATION
          </h1>
          <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
            Drag through the timeline. This is the story you are stepping into as a polymer engineer — and the part you could write next.
          </p>
        </div>
      </section>

      {/* ── TIMELINE ─────────────────────────────────────── */}
      <section className="border-b-4 border-ink px-6 md:px-12 py-10">
        <div className="max-w-4xl mx-auto">

          {/* Year labels */}
          <div className="flex justify-between mb-2">
            <span className="font-mono text-[9px] font-bold text-ink/40 uppercase tracking-widest">1862 — PAST</span>
            <span className="font-mono text-[9px] font-bold uppercase tracking-widest" style={{ color: '#15803D' }}>TODAY</span>
            <span className="font-mono text-[9px] font-bold uppercase tracking-widest" style={{ color: '#7C3AED' }}>2040s — FUTURE</span>
          </div>

          {/* Track */}
          <div className="relative h-2 bg-ink/10 border-2 border-ink mb-6">
            <div
              className="absolute top-0 left-0 h-full transition-all duration-500"
              style={{ width: `${fillPct}%`, backgroundColor: era.accent }}
            />
            {ERAS.map((e, i) => {
              const pc = PERIOD_CONFIG[e.period]
              const pos = (i / (ERAS.length - 1)) * 100
              return (
                <button
                  key={e.id}
                  onClick={() => setActive(i)}
                  className="absolute -top-3 w-8 h-8 border-4 border-ink transition-all hover:scale-110"
                  style={{
                    left: `${pos}%`,
                    transform: 'translateX(-50%)',
                    backgroundColor: i === active ? pc.trackColor : '#F9FAFB',
                    boxShadow: i === active ? `2px 2px 0px 0px ${pc.trackColor}` : '2px 2px 0px 0px #0A0A0A',
                  }}
                  aria-label={e.title}
                />
              )
            })}
          </div>

          {/* Prev/Next */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setActive(Math.max(0, active - 1))}
              disabled={active === 0}
              className="border-4 border-ink w-10 h-10 flex items-center justify-center disabled:opacity-30 hover:bg-ink hover:text-white transition-colors shadow-hard-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {ERAS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className="h-2 border-2 border-ink transition-all"
                  style={{
                    width: i === active ? '28px' : '8px',
                    backgroundColor: i === active ? PERIOD_CONFIG[ERAS[i].period].trackColor : '#D1D5DB',
                  }}
                />
              ))}
            </div>
            <button
              onClick={() => setActive(Math.min(ERAS.length - 1, active + 1))}
              disabled={active === ERAS.length - 1}
              className="border-4 border-ink w-10 h-10 flex items-center justify-center disabled:opacity-30 hover:bg-ink hover:text-white transition-colors shadow-hard-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Era card */}
          <div className="border-4 border-ink overflow-hidden" style={{ boxShadow: `6px 6px 0px 0px ${era.accent}` }}>
            {/* Image */}
            <div className="relative border-b-4 border-ink" style={{ height: '240px' }}>
              <img src={era.image} alt={era.title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ backgroundColor: era.accent + 'CC' }} />
              <div className="absolute top-4 left-4 flex items-center gap-3">
                <span className="font-mono text-[10px] font-black text-white border-2 border-white px-3 py-1 uppercase tracking-widest">
                  {period.label}
                </span>
                <span className="font-display text-3xl font-black text-white">{era.year}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8" style={{ backgroundColor: era.bg }}>
              <h2 className="font-display text-2xl md:text-3xl font-black text-ink leading-tight mb-4">
                {era.title}
              </h2>
              <p className="text-ink/70 leading-relaxed mb-5">{era.body}</p>
              <div className="border-l-4 pl-4 py-2 mb-4" style={{ borderColor: era.accent }}>
                <p className="text-sm text-ink italic leading-relaxed">{era.insight}</p>
              </div>
              {era.indianContext && (
                <div className="border-4 border-ink p-4 flex items-start gap-3" style={{ backgroundColor: 'white' }}>
                  <span className="text-lg flex-shrink-0">🇮🇳</span>
                  <p className="text-sm text-ink/70 leading-relaxed">{era.indianContext}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── BE PART OF IT ─────────────────────────────────── */}
      <section className="border-b-4 border-ink px-6 md:px-12 py-12 bg-ink">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-4">
            HOW TO BE <span className="text-yellow-bright italic">PART OF IT</span>
          </h2>
          <p className="text-white/70 mb-10 max-w-xl mx-auto leading-relaxed">
            The future chapters — circular recycling, self-healing materials, bio-integrated polymers — get written by engineers who started exactly where you are now.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              { title: 'Learn the Fundamentals', desc: 'Master chemistry and processing that built this industry', href: '/subjects', color: '#1D4ED8' },
              { title: 'Explore Real Materials', desc: 'See the polymers shaping Indian manufacturing today', href: '/materials', color: '#EA580C' },
              { title: 'Ask Anything', desc: 'Get answers grounded in real engineering lessons', href: '/ai-tutor', color: '#15803D' },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group border-4 border-white/20 p-5 text-left hover:border-white transition-colors"
                style={{ backgroundColor: item.color + '30' }}
              >
                <h3 className="font-display text-lg font-black text-white mb-2 group-hover:underline">{item.title}</h3>
                <p className="text-xs text-white/60 leading-relaxed mb-3">{item.desc}</p>
                <span className="font-mono text-[10px] font-bold text-white/70 uppercase tracking-wider flex items-center gap-1">
                  Explore <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
          <Link href="/login" className="cn-btn-yellow text-base">
            Start Your Journey Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* AI Tutor CTA */}
      <section className="border-t-4 border-ink bg-violet px-6 md:px-12 py-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="font-mono text-[9px] font-bold text-white/60 uppercase tracking-widest mb-2">AI Tutor · Gemini RAG</div>
            <h3 className="font-display text-2xl font-black text-white">Curious how Bakelite actually worked?</h3>
            <p className="text-white/70 text-sm mt-1">Ask PolymerHub AI — it knows the chemistry behind every era.</p>
          </div>
          <Link href="/ai-tutor" className="cn-btn bg-white text-violet border-white flex-shrink-0">
            <Brain className="w-4 h-4" /> Ask AI Tutor
          </Link>
        </div>
      </section>
    </div>
  )
}
