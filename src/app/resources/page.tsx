'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, BookOpen, Search, X, Brain, Scale } from 'lucide-react'

const BOOKS = [
  {
    id: 'allen-baker', title: 'Handbook of Plastic Technology', authors: 'Allen & Baker',
    tier: 'processing', difficulty: 'Foundational', color: '#EA580C', bg: '#FFF7ED',
    focus: 'Industrial processing: injection, compression, transfer, blow moulding with troubleshooting',
    topics: ['Injection moulding parameters', 'Defect troubleshooting', 'Compression moulding', 'Blow moulding', 'Machine setup'],
    studentUse: 'The go-to reference when you face a processing defect on the plant floor. Practical, direct, no unnecessary theory.',
    careers: ['Process Engineer', 'Production Engineer', 'QA/QC Engineer'],
    subjects: [{ name: 'Polymer Processing', slug: 'polymer-processing' }, { name: 'Mould Design', slug: 'mould-design' }],
  },
  {
    id: 'rosato', title: 'Plastics Processing Data Handbook', authors: 'D.V. Rosato',
    tier: 'processing', difficulty: 'Intermediate', color: '#EA580C', bg: '#FFF7ED',
    focus: 'Fabrication data, troubleshooting matrices, instrumentation, and process-property relationships',
    topics: ['Screw design data', 'Troubleshooting matrices', 'Process-property relationships', 'Instrumentation', 'Rotational moulding'],
    studentUse: 'The most data-dense practical handbook. Use it when you need exact corrective actions backed by empirical data.',
    careers: ['Process Engineer', 'Plant Manager', 'QA/QC Engineer'],
    subjects: [{ name: 'Polymer Processing', slug: 'polymer-processing' }, { name: 'Polymer Testing', slug: 'polymer-testing' }],
  },
  {
    id: 'kutz', title: 'Applied Plastics Engineering Handbook', authors: 'Myer Kutz',
    tier: 'processing', difficulty: 'Intermediate', color: '#EA580C', bg: '#FFF7ED',
    focus: 'Materials, additives, fillers, sustainability, and 3D printing for working engineers',
    topics: ['Bio-based polymers', 'Additives and fillers', '3D printing with polymers', 'Recycling', 'Engineering rules of thumb'],
    studentUse: "The practical engineer's companion. Covers what university textbooks skip — real design rules, additive selection, modern technologies.",
    careers: ['R&D Engineer', 'Materials Engineer', 'Design Engineer'],
    subjects: [{ name: 'Polymer Composites', slug: 'polymer-composites' }, { name: 'Sustainable Plastics', slug: 'sustainable-plastics' }],
  },
  {
    id: 'osswald', title: 'Plastics Engineering', authors: 'Tim A. Osswald',
    tier: 'processing', difficulty: 'Intermediate', color: '#EA580C', bg: '#FFF7ED',
    focus: 'Integrating polymer science with mechanical design, FEA, and CAD/mould architecture',
    topics: ['Mechanical design for plastics', 'Fibre orientation', 'Finite element analysis', 'Mould CAD', 'Flow simulation'],
    studentUse: "The design engineer's textbook. Connects polymer science to mechanical design decisions you'll make every day.",
    careers: ['Design Engineer', 'CAE Engineer', 'Product Development'],
    subjects: [{ name: 'Mould Design', slug: 'mould-design' }, { name: 'Polymer Composites', slug: 'polymer-composites' }],
  },
  {
    id: 'eiri', title: 'Handbook of Plastic Materials and Processing Technology', authors: 'EIRI Board',
    tier: 'processing', difficulty: 'Foundational', color: '#EA580C', bg: '#FFF7ED',
    focus: 'Properties of plastics, extrusion, thermoforming, polymer synthesis and compounding',
    topics: ['Structure and classification', 'Synthesis routes', 'Physical and mechanical properties', 'Extrusion parameters', 'Compounding'],
    studentUse: 'Best single reference for understanding both the material and the process together — ideal for final year project work.',
    careers: ['Process Engineer', 'Materials Engineer', 'R&D Engineer'],
    subjects: [{ name: 'Polymer Chemistry', slug: 'polymer-chemistry' }, { name: 'Polymer Processing', slug: 'polymer-processing' }],
  },
  {
    id: 'fried', title: 'Polymer Science and Technology', authors: 'Joel R. Fried',
    tier: 'science', difficulty: 'Intermediate', color: '#1D4ED8', bg: '#EFF6FF',
    focus: 'Bridging fundamental polymer chemistry and applied mechanical engineering',
    topics: ['Chain conformation', 'Molecular weight and MWD', 'Viscoelasticity', 'Glass transition', 'Polymer solutions'],
    studentUse: 'The single best book to truly understand the science behind what you are processing. Converts memorised formulae into genuine understanding.',
    careers: ['R&D Engineer', 'Materials Scientist', 'Process Engineer'],
    subjects: [{ name: 'Polymer Chemistry', slug: 'polymer-chemistry' }, { name: 'Polymer Testing', slug: 'polymer-testing' }],
  },
  {
    id: 'brandrup', title: 'Polymer Handbook', authors: 'J. Brandrup, E.H. Immergut, E.A. Grulke',
    tier: 'science', difficulty: 'Reference', color: '#1D4ED8', bg: '#EFF6FF',
    focus: 'The most comprehensive source of physical property data — 350+ properties for 2,500+ polymers',
    topics: ['Physical constants (Tg, Tm, density)', 'Melt rheology data', 'Thermodynamic properties', 'Solubility parameters', 'Kinetics data'],
    studentUse: 'The data bible. When a datasheet is incomplete or you need to compare Tg values across polymer families, this is your reference.',
    careers: ['Materials Engineer', 'R&D Engineer', 'QA/QC Engineer'],
    subjects: [{ name: 'Polymer Chemistry', slug: 'polymer-chemistry' }, { name: 'Polymer Testing', slug: 'polymer-testing' }],
  },
  {
    id: 'mark', title: 'Encyclopedia of Polymer Science and Technology', authors: 'Herman F. Mark (Ed.), 17 volumes',
    tier: 'science', difficulty: 'Reference', color: '#1D4ED8', bg: '#EFF6FF',
    focus: 'The definitive academic and industrial reference covering the entire polymer field',
    topics: ['Complete polymer chemistry and physics', 'Self-healing polymers', 'Nanotechnology', 'Imaging techniques', 'Sustainability'],
    studentUse: "The authoritative reference when you need a definitive answer on any polymer topic. Use it like a scientific encyclopedia.",
    careers: ['R&D Engineer', 'Materials Scientist', 'Academic/Researcher'],
    subjects: [{ name: 'Polymer Chemistry', slug: 'polymer-chemistry' }, { name: 'Polymer Testing', slug: 'polymer-testing' }],
  },
  {
    id: 'chanda', title: 'Plastics Technology Handbook', authors: 'Manas Chanda',
    tier: 'science', difficulty: 'Advanced', color: '#1D4ED8', bg: '#EFF6FF',
    focus: 'Advanced topics: nanocomposites, smart polymers, novel processing, recycling, and future technology',
    topics: ['Polymer nanocomposites', 'Smart and self-healing polymers', 'Electrospinning', 'Shape-memory polymers', 'Recycling trends'],
    studentUse: 'The forward-looking reference. Read this when you want to understand where the industry is heading.',
    careers: ['R&D Engineer', 'Materials Scientist', 'Sustainability Engineer'],
    subjects: [{ name: 'Polymer Composites', slug: 'polymer-composites' }, { name: 'Recycling Technology', slug: 'recycling-technology' }],
  },
  {
    id: 'cheremisinoff', title: 'Handbook of Polymer Science and Technology', authors: 'N.P. Cheremisinoff, 4 volumes',
    tier: 'science', difficulty: 'Advanced', color: '#1D4ED8', bg: '#EFF6FF',
    focus: 'Synthesis, characterization, industrial applications, composites, and elastomers',
    topics: ['Synthesis and properties', 'Elastomers: NR, SBR, NBR, EPDM', 'Composites and specialty applications', 'Industrial processing', 'Recycling'],
    studentUse: 'The most complete treatment of rubber and elastomers alongside conventional plastics — essential alongside your Rubber Technology subject.',
    careers: ['Rubber Technologist', 'Elastomer Compounder', 'Materials Engineer'],
    subjects: [{ name: 'Rubber Technology', slug: 'rubber-technology' }, { name: 'Polymer Composites', slug: 'polymer-composites' }],
  },
  {
    id: 'rout', title: 'Plastic Waste Management in India', authors: 'Dr. Chadetrik Rout & Er. Parveen Kumar',
    tier: 'sustainability', difficulty: 'Foundational', color: '#15803D', bg: '#F0FDF4',
    focus: 'India-specific recycling infrastructure, EPR framework, informal sector, and circular economy policy',
    topics: ['India PWM Rules 2022', 'Informal waste economy', 'EPR portal and compliance', 'Source-specific recovery', '3.4M tonnes generated annually'],
    studentUse: 'The only India-specific textbook on plastic waste at this depth. Essential for recycling, sustainability, or EPR compliance career tracks.',
    careers: ['Recycling Engineer', 'EPR Compliance Manager', 'Sustainability Officer'],
    subjects: [{ name: 'Recycling Technology', slug: 'recycling-technology' }, { name: 'Sustainable Plastics', slug: 'sustainable-plastics' }],
  },
  {
    id: 'kumari', title: 'Sustainable Technologies for Plastic Waste', authors: 'Abha Kumari et al.',
    tier: 'sustainability', difficulty: 'Advanced', color: '#15803D', bg: '#F0FDF4',
    focus: 'Advanced chemical recycling, waste-to-energy, pyrolysis, and circular economy technologies',
    topics: ['Plastic waste to liquid fuel', 'Plastic to hydrogen', 'Depolymerization', 'Waste-to-value chemicals', 'LCA frameworks'],
    studentUse: 'The technical companion to the India policy book — covers the actual chemical engineering of converting plastic waste into valuable products.',
    careers: ['Chemical Recycling Engineer', 'Sustainability Engineer', 'Process Engineer'],
    subjects: [{ name: 'Recycling Technology', slug: 'recycling-technology' }, { name: 'Entrepreneurship in Plastics', slug: 'entrepreneurship-plastics' }],
  },
  {
    id: 'mondal', title: 'Remediation of Plastic and Microplastic Waste', authors: 'Surajit Mondal et al.',
    tier: 'sustainability', difficulty: 'Intermediate', color: '#15803D', bg: '#F0FDF4',
    focus: 'Environmental engineering, microplastic pollution mitigation, bioaccumulation, and bio-remediation',
    topics: ['Microplastic sources and pathways', 'Bioaccumulation in ecosystems', 'Human health impacts', 'Mitigation strategies', 'Bio-remediation'],
    studentUse: 'The environmental science perspective on plastic pollution — useful for sustainability and regulatory roles.',
    careers: ['Environmental Engineer', 'Sustainability Officer', 'Regulatory Affairs'],
    subjects: [{ name: 'Recycling Technology', slug: 'recycling-technology' }, { name: 'Sustainable Plastics', slug: 'sustainable-plastics' }],
  },
  {
    id: 'lee', title: 'Microplastics Pollution and Worldwide Policies', authors: 'Tin Sin Lee & Soo Tueen Bee',
    tier: 'sustainability', difficulty: 'Intermediate', color: '#15803D', bg: '#F0FDF4',
    focus: 'Global microplastic pollution and comparative policy frameworks across Asia, Europe, Americas, and Africa',
    topics: ['Microplastic occurrence mechanisms', 'Asian policy frameworks', 'EU plastics policies and PPWR', 'Americas and Africa regulations', 'Compliance requirements'],
    studentUse: 'The global policy perspective. Essential for students targeting export markets or international companies.',
    careers: ['Regulatory Affairs', 'Sustainability Officer', 'EPR Compliance Manager'],
    subjects: [{ name: 'Recycling Technology', slug: 'recycling-technology' }, { name: 'Sustainable Plastics', slug: 'sustainable-plastics' }],
  },
  {
    id: 'arun', title: 'Biodegradable Polymers, Blends and Biocomposites', authors: 'A. Arun et al.',
    tier: 'sustainability', difficulty: 'Advanced', color: '#15803D', bg: '#F0FDF4',
    focus: 'Green materials, eco-plastics, agricultural waste biocomposites, and end-of-life pathways',
    topics: ['PLA, PHA, PHB, starch blends', 'Agricultural waste biocomposites', 'Microbial biocomposites', 'Composting and anaerobic digestion', 'Formulation techniques'],
    studentUse: 'The most practically detailed book on bioplastics formulation. Directly useful for understanding how PLA/PHA blends are designed.',
    careers: ['Bioplastics Engineer', 'Sustainability Engineer', 'R&D Engineer'],
    subjects: [{ name: 'Sustainable Plastics', slug: 'sustainable-plastics' }, { name: 'Polymer Composites', slug: 'polymer-composites' }],
  },
  {
    id: 'mittal', title: 'Handbook of Polymer Applications in Medicine', authors: 'V. Mittal',
    tier: 'specialized', difficulty: 'Advanced', color: '#7C3AED', bg: '#F5F3FF',
    focus: 'Medical plastics, biocompatibility, implant engineering, regulatory compliance, and nano-scale devices',
    topics: ['ISO 10993 biocompatibility', 'Medical-grade PVC, PP, PEEK', 'Sterilization compatibility', 'Implantable polymers', 'Nano-scale medical devices'],
    studentUse: "The entry point to medical plastics — one of India's highest-growth polymer sectors. Required reading before any medical device interview.",
    careers: ['Medical Device Engineer', 'Biomedical Polymer Engineer', 'Regulatory Affairs'],
    subjects: [{ name: 'Medical Plastics & Biomaterials', slug: 'medical-plastics' }, { name: 'Polymer Chemistry', slug: 'polymer-chemistry' }],
  },
  {
    id: 'allen-bevington', title: 'Comprehensive Polymer Science', authors: 'Geoffrey Allen & James Bevington, 9 volumes',
    tier: 'science', difficulty: 'Advanced', color: '#1D4ED8', bg: '#EFF6FF',
    focus: 'Theoretical polymer physics, crystallization, chain kinetics, and spectroscopy at graduate depth',
    topics: ['Polymer characterization (GPC, NMR, FTIR)', 'Crystallization kinetics', 'Chain polymerization mechanisms', 'Solid-state properties', 'Spectroscopy and microscopy'],
    studentUse: 'For students pursuing M.Tech or research — the deepest theoretical treatment of polymer physics.',
    careers: ['Research Scientist', 'Academic/Faculty', 'Analytical Chemist'],
    subjects: [{ name: 'Polymer Chemistry', slug: 'polymer-chemistry' }, { name: 'Polymer Testing', slug: 'polymer-testing' }],
  },
]

const TIERS = {
  processing:   { label: 'Processing & Manufacturing', color: '#EA580C', bg: '#FFF7ED', desc: 'The "How" — machines, process parameters, defect troubleshooting' },
  science:      { label: 'Material Science & Theory', color: '#1D4ED8', bg: '#EFF6FF', desc: 'The "Why" — polymer physics, data, fundamental science' },
  sustainability:{ label: 'Sustainability & Circular Economy', color: '#15803D', bg: '#F0FDF4', desc: 'The "Future" — recycling, bioplastics, policy, microplastics' },
  specialized:  { label: 'Specialized Applications', color: '#7C3AED', bg: '#F5F3FF', desc: 'High-growth niches — medical, composites, smart materials' },
}

const DIFFICULTY_CONFIG: Record<string, { color: string; bg: string }> = {
  Foundational: { color: '#15803D', bg: '#F0FDF4' },
  Intermediate: { color: '#1D4ED8', bg: '#EFF6FF' },
  Advanced:     { color: '#EA580C', bg: '#FFF7ED' },
  Reference:    { color: '#7C3AED', bg: '#F5F3FF' },
}

const READING_PATHS = [
  { track: 'Process & Production Engineer', books: ['Allen & Baker', 'Rosato', 'Fried', 'Osswald'], color: '#EA580C' },
  { track: 'R&D / Materials Scientist', books: ['Fried', 'Brandrup', 'Chanda', 'Cheremisinoff'], color: '#1D4ED8' },
  { track: 'Recycling & Sustainability', books: ['Rout & Kumar', 'Kumari', 'Arun', 'Lee & Bee', 'Mondal'], color: '#15803D' },
  { track: 'Medical Device Engineer', books: ['Mittal', 'Fried', 'Cheremisinoff'], color: '#7C3AED' },
  { track: 'Design / CAE Engineer', books: ['Osswald', 'Kutz', 'Brandrup'], color: '#EA580C' },
  { track: 'Entrepreneur', books: ['Kutz', 'Rout & Kumar', 'Allen & Baker', 'EIRI'], color: '#CA8A04' },
]

function BookCard({ book, onClick }: { book: typeof BOOKS[0]; onClick: () => void }) {
  const diff = DIFFICULTY_CONFIG[book.difficulty]
  return (
    <button
      onClick={onClick}
      className="group text-left border-4 border-ink overflow-hidden w-full block"
      style={{
        boxShadow: `4px 4px 0px 0px ${book.color}`,
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translate(-2px, -2px)'
        el.style.boxShadow = `6px 6px 0px 0px ${book.color}`
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translate(0, 0)'
        el.style.boxShadow = `4px 4px 0px 0px ${book.color}`
      }}
    >
      <div className="border-b-4 border-ink p-4 flex items-start gap-3" style={{ backgroundColor: book.bg }}>
        <div className="w-10 h-10 border-4 border-ink flex items-center justify-center flex-shrink-0" style={{ backgroundColor: book.color }}>
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="font-mono text-[9px] font-black border-2 px-2 py-0.5 uppercase tracking-wider" style={{ borderColor: diff.color, color: diff.color, backgroundColor: diff.bg }}>
            {book.difficulty}
          </span>
        </div>
      </div>
      <div className="p-4 bg-canvas">
        <h3 className="font-display text-base font-black text-ink leading-tight mb-1 group-hover:underline" style={{ textDecorationColor: book.color }}>
          {book.title}
        </h3>
        <p className="font-mono text-[10px] text-ink/50 mb-2">{book.authors}</p>
        <p className="text-xs text-ink/60 leading-relaxed mb-2 line-clamp-2">{book.focus}</p>
        <div className="flex flex-wrap gap-1 mt-3">
          {book.subjects.slice(0, 2).map((s) => (
            <span key={s.slug} className="font-mono text-[8px] border-2 border-ink/20 text-ink/50 px-1.5 py-0.5 uppercase tracking-wider">
              {s.name}
            </span>
          ))}
        </div>
      </div>
    </button>
  )
}

function BookModal({ book, onClose }: { book: typeof BOOKS[0]; onClose: () => void }) {
  const diff = DIFFICULTY_CONFIG[book.difficulty]
  return (
    <div className="fixed inset-0 bg-ink/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="bg-canvas w-full sm:max-w-xl border-4 border-ink sm:shadow-hard-xl max-h-[90vh] overflow-y-auto">
        <div className="border-b-4 border-ink p-5 flex items-start justify-between" style={{ backgroundColor: book.bg }}>
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 border-4 border-ink flex items-center justify-center flex-shrink-0" style={{ backgroundColor: book.color }}>
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-display text-xl font-black text-ink leading-tight">{book.title}</h2>
              <p className="font-mono text-[10px] text-ink/50 mt-0.5">{book.authors}</p>
            </div>
          </div>
          <button onClick={onClose} className="border-4 border-ink p-1 hover:bg-ink hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-5">
          <div className="flex gap-2">
            <span className="font-mono text-[9px] font-black border-2 px-2 py-1 uppercase tracking-wider" style={{ borderColor: diff.color, color: diff.color, backgroundColor: diff.bg }}>{book.difficulty}</span>
            <span className="font-mono text-[9px] font-black border-2 px-2 py-1 uppercase tracking-wider" style={{ borderColor: book.color, color: book.color, backgroundColor: book.bg }}>{TIERS[book.tier as keyof typeof TIERS].label}</span>
          </div>
          <p className="text-sm text-ink leading-relaxed">{book.focus}</p>
          <div>
            <div className="font-mono text-[9px] font-bold text-ink/50 uppercase tracking-widest mb-2">Key Topics</div>
            <div className="space-y-1.5">
              {book.topics.map((t) => (
                <div key={t} className="flex items-start gap-2">
                  <div className="w-2 h-2 border-2 border-ink flex-shrink-0 mt-1.5" style={{ backgroundColor: book.color }} />
                  <span className="text-sm text-ink">{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="border-l-4 pl-4 py-2" style={{ borderColor: book.color, backgroundColor: book.bg }}>
            <div className="font-mono text-[9px] font-black mb-1 uppercase tracking-wider" style={{ color: book.color }}>Why Students Should Read This</div>
            <p className="text-sm text-ink leading-relaxed">{book.studentUse}</p>
          </div>
          <div>
            <div className="font-mono text-[9px] font-bold text-ink/50 uppercase tracking-widest mb-2">Connected Lessons</div>
            <div className="space-y-2">
              {book.subjects.map((s) => (
                <Link key={s.slug} href={`/subjects/${s.slug}`} onClick={onClose}
                  className="flex items-center justify-between border-4 border-ink p-3 hover:bg-ink hover:text-white group transition-colors shadow-hard-sm">
                  <span className="text-sm font-bold group-hover:text-white">{s.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div className="font-mono text-[9px] font-bold text-ink/50 uppercase tracking-widest mb-2">Career Relevance</div>
            <div className="flex flex-wrap gap-1.5">
              {book.careers.map((c) => (
                <span key={c} className="font-mono text-[9px] border-2 border-ink px-2 py-1 uppercase tracking-wider text-ink">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResourcesPage() {
  const [selected, setSelected] = useState<typeof BOOKS[0] | null>(null)
  const [activeTier, setActiveTier] = useState<string>('all')
  const [search, setSearch] = useState('')

  const filtered = BOOKS.filter((b) => {
    const matchTier = activeTier === 'all' || b.tier === activeTier
    const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.authors.toLowerCase().includes(search.toLowerCase()) || b.focus.toLowerCase().includes(search.toLowerCase())
    return matchTier && matchSearch
  })

  return (
    <div className="min-h-screen bg-canvas">
      <div className="h-2 bg-violet" />

      {/* Hero */}
      <section className="border-b-4 border-ink bg-ink px-6 md:px-12 py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-violet border-4 border-violet flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-mono text-[10px] font-black text-yellow-bright border-2 border-yellow-bright px-3 py-1 uppercase tracking-widest">Reference Library</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-black text-white leading-none mb-4">
            17 BOOKS THAT<br />
            <span className="text-yellow-bright italic">DEFINE THE</span><br />
            GLOBAL PLASTICS SECTOR.
          </h1>
          <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
            From the Brandrup Polymer Handbook (2,500 polymers, 350 properties each) to India-specific EPR policy — every book mapped to your subjects and career tracks.
          </p>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-b-4 border-ink">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x-4 divide-ink">
          {[
            { val: '17', label: 'Reference books', color: '#7C3AED' },
            { val: '4', label: 'Knowledge tiers', color: '#1D4ED8' },
            { val: '10', label: 'Subjects mapped', color: '#EA580C' },
            { val: '6', label: 'Career tracks', color: '#15803D' },
          ].map((s) => (
            <div key={s.val} className="p-5 text-center" style={{ backgroundColor: s.color + '12' }}>
              <div className="font-display text-3xl font-black" style={{ color: s.color }}>{s.val}</div>
              <div className="font-mono text-[9px] text-ink/50 uppercase tracking-wider mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Filters + search */}
      <div className="border-b-4 border-ink px-6 md:px-10 py-4 flex flex-col sm:flex-row gap-3 sticky top-14 z-30 bg-canvas/95 backdrop-blur">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full border-4 border-ink pl-10 pr-4 py-2 text-sm text-ink font-medium focus:outline-none shadow-hard-sm"
            placeholder="Search books, authors, topics..."
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', ...Object.keys(TIERS)].map((t) => {
            const tier = t === 'all' ? null : TIERS[t as keyof typeof TIERS]
            const isActive = activeTier === t
            return (
              <button key={t} onClick={() => setActiveTier(t)}
                className="font-mono text-[9px] font-black border-4 border-ink px-3 py-2 uppercase tracking-wider transition-all"
                style={{
                  backgroundColor: isActive ? (tier?.color ?? '#0A0A0A') : 'white',
                  color: isActive ? 'white' : '#0A0A0A',
                  boxShadow: isActive ? `2px 2px 0px 0px ${tier?.color ?? '#0A0A0A'}` : '2px 2px 0px 0px #0A0A0A',
                }}
              >
                {t === 'all' ? 'All' : tier?.label.split(' ')[0]}
              </button>
            )
          })}
        </div>
      </div>

      {/* Books grid */}
      <section className="px-6 md:px-10 py-10">
        <div className="max-w-7xl mx-auto">
          {activeTier === 'all' ? (
            Object.entries(TIERS).map(([tierKey, tier]) => {
              const tierBooks = filtered.filter((b) => b.tier === tierKey)
              if (!tierBooks.length) return null
              return (
                <div key={tierKey} className="mb-12">
                  <div className="flex items-center gap-3 mb-5 border-b-4 border-ink pb-4">
                    <div className="w-2 h-10 flex-shrink-0" style={{ backgroundColor: tier.color }} />
                    <div>
                      <h2 className="font-display text-xl font-black text-ink">{tier.label}</h2>
                      <p className="text-xs text-ink/50">{tier.desc}</p>
                    </div>
                    <span className="font-mono text-[9px] font-black border-2 border-ink px-2 py-0.5 ml-auto" style={{ color: tier.color }}>{tierBooks.length} books</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {tierBooks.map((book) => <BookCard key={book.id} book={book} onClick={() => setSelected(book)} />)}
                  </div>
                </div>
              )
            })
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((book) => <BookCard key={book.id} book={book} onClick={() => setSelected(book)} />)}
            </div>
          )}
          {filtered.length === 0 && (
            <div className="py-20 text-center border-4 border-ink border-dashed">
              <p className="font-display text-2xl font-black text-ink/30">No books match your search</p>
            </div>
          )}
        </div>
      </section>

      {/* Reading paths */}
      <section className="border-t-4 border-b-4 border-ink px-6 md:px-10 py-10 bg-ink">
        <div className="max-w-5xl mx-auto">
          <div className="border-b-4 border-white/10 pb-4 mb-6">
            <div className="font-mono text-[9px] font-bold text-yellow-bright uppercase tracking-widest mb-1">Recommended Reading Paths</div>
            <h2 className="font-display text-2xl font-black text-white uppercase">Where to Start, By Career Track</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {READING_PATHS.map((path) => (
              <div key={path.track} className="border-4 border-white/20 p-4 hover:border-white transition-colors">
                <div className="font-display text-sm font-black text-white mb-3" style={{ borderBottom: `2px solid ${path.color}`, paddingBottom: '6px' }}>{path.track}</div>
                <div className="flex flex-wrap gap-1.5">
                  {path.books.map((b) => (
                    <span key={b} className="font-mono text-[8px] border border-white/20 text-white/60 px-1.5 py-0.5 uppercase">{b}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="border-t-4 border-ink bg-violet px-6 md:px-12 py-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="font-mono text-[9px] text-white/50 uppercase tracking-widest mb-1">AI Tutor</div>
            <h3 className="font-display text-2xl font-black text-white">Ask about any concept from these books</h3>
            <p className="text-white/60 text-sm mt-1">The AI Tutor covers the core content of all 17 references across 60 lessons.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link href="/ai-tutor" className="cn-btn bg-white text-violet border-white">
              <Brain className="w-4 h-4" /> Ask AI Tutor
            </Link>
            <Link href="/comparator" className="cn-btn bg-transparent text-white border-white hover:bg-white hover:text-violet transition-colors">
              <Scale className="w-4 h-4" /> Comparator
            </Link>
          </div>
        </div>
      </section>

      {selected && <BookModal book={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
