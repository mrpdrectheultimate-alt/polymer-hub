'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, ArrowRight, X, Search, Filter } from 'lucide-react'

// ─── Book Data (17 books, fully mapped) ──────────────────────────────────────

type BookTier = 'processing' | 'science' | 'sustainability' | 'specialized'

type Book = {
  id: string
  title: string
  authors: string
  tier: BookTier
  focus: string
  keyTopics: string[]
  studentUseCase: string
  connectedSubjects: { name: string; slug: string }[]
  careerRelevance: string[]
  difficulty: 'Foundational' | 'Intermediate' | 'Advanced' | 'Reference'
}

const BOOKS: Book[] = [
  {
    id: 'allen-baker',
    title: 'Handbook of Plastic Technology',
    authors: 'Allen & Baker',
    tier: 'processing',
    focus: 'Industrial processing: injection, compression, transfer, blow moulding with troubleshooting',
    keyTopics: [
      'Injection moulding process parameters',
      'Compression and transfer moulding',
      'Blow moulding techniques',
      'Common defect troubleshooting (sink marks, warpage, flash)',
      'Machine setup and optimization',
    ],
    studentUseCase: 'The go-to reference when you face a processing defect on the plant floor. Practical, direct, no unnecessary theory.',
    connectedSubjects: [
      { name: 'Polymer Processing', slug: 'polymer-processing' },
      { name: 'Mould Design', slug: 'mould-design' },
    ],
    careerRelevance: ['Process Engineer', 'Production Engineer', 'QA/QC Engineer'],
    difficulty: 'Foundational',
  },
  {
    id: 'eiri',
    title: 'Handbook of Plastic Materials and Processing Technology',
    authors: 'EIRI Board',
    tier: 'processing',
    focus: 'Properties of plastics, extrusion, thermoforming, polymer synthesis and compounding',
    keyTopics: [
      'Structure and classification of plastics',
      'Polymer synthesis routes (polymerization, polycondensation)',
      'Physical and mechanical properties',
      'Extrusion and thermoforming parameters',
      'Compounding and additive systems',
    ],
    studentUseCase: 'Best single reference for understanding both the material and the process together — ideal for final year project work.',
    connectedSubjects: [
      { name: 'Polymer Chemistry', slug: 'polymer-chemistry' },
      { name: 'Polymer Processing', slug: 'polymer-processing' },
    ],
    careerRelevance: ['Process Engineer', 'Materials Engineer', 'R&D Engineer'],
    difficulty: 'Foundational',
  },
  {
    id: 'rosato',
    title: 'Plastics Processing Data Handbook',
    authors: 'D.V. Rosato',
    tier: 'processing',
    focus: 'Fabrication data, troubleshooting matrices, instrumentation, and process-property relationships',
    keyTopics: [
      'Effect of process variables on material properties',
      'Screw design and extruder operation',
      'Troubleshooting: injection, extrusion, blow moulding, thermoforming',
      'Rotational moulding and compression moulding data',
      'Instrumentation and sensor integration',
    ],
    studentUseCase: 'The most data-dense practical handbook. Use it when you need exact corrective actions for specific defects — temperature, pressure, speed adjustments backed by empirical data.',
    connectedSubjects: [
      { name: 'Polymer Processing', slug: 'polymer-processing' },
      { name: 'Polymer Testing', slug: 'polymer-testing' },
    ],
    careerRelevance: ['Process Engineer', 'Plant Manager', 'QA/QC Engineer'],
    difficulty: 'Intermediate',
  },
  {
    id: 'kutz',
    title: 'Applied Plastics Engineering Handbook',
    authors: 'Myer Kutz',
    tier: 'processing',
    focus: 'Materials, additives, fillers, sustainability, and 3D printing for working engineers',
    keyTopics: [
      'Plastics, elastomers, and nanocomposite materials',
      'Bio-based polymers and recycling',
      'Additives, colorants, and fillers',
      '3D printing with polymers (FDM, SLS, SLA)',
      'Engineering rules of thumb for practitioners',
    ],
    studentUseCase: 'A comprehensive modern guide. Essential for understanding how new technologies like additive manufacturing and biopolymers fit into traditional plastic factories.',
    connectedSubjects: [
      { name: 'Sustainable Plastics & Bioplastics', slug: 'sustainable-plastics' },
      { name: 'Polymer Composites', slug: 'polymer-composites' },
    ],
    careerRelevance: ['Materials Scientist', 'Product Designer', 'R&D Engineer'],
    difficulty: 'Intermediate',
  },
  {
    id: 'osswald',
    title: 'Plastics Testing and Characterization',
    authors: 'Tim A. Osswald et al.',
    tier: 'science',
    focus: 'Mechanical, thermal, electrical, and optical testing procedures with analysis standards',
    keyTopics: [
      'Tensile, flexural, and impact testing standards',
      'Thermal analysis: DSC, TGA, DMA, and HDT testing',
      'Rheology and melt flow measurement',
      'Spectroscopic analysis (FTIR, NMR) for structure',
      'Non-destructive testing and microscopy',
    ],
    studentUseCase: 'The absolute authority on testing. Essential preparation for QA/QC roles or when writing lab reports for mechanical/thermal testing modules.',
    connectedSubjects: [
      { name: 'Polymer Testing', slug: 'polymer-testing' },
      { name: 'Polymer Chemistry', slug: 'polymer-chemistry' },
    ],
    careerRelevance: ['QA/QC Engineer', 'Testing Lab In-charge', 'R&D Scientist'],
    difficulty: 'Advanced',
  },
  {
    id: 'fried',
    title: 'Polymer Science and Technology',
    authors: 'Joel R. Fried',
    tier: 'science',
    focus: 'Polymer synthesis, thermodynamics, structure-property relationships, and rheology',
    keyTopics: [
      'Polymerization kinetics and reactors',
      'Crystallinity, glass transitions, and physical states',
      'Polymer blends and thermodynamics of mixing',
      'Viscoelasticity and melt rheology',
      'Membrane separations and smart polymers',
    ],
    studentUseCase: 'The best academic textbook for B.Tech students. Explains the physical chemistry of polymers step-by-step. Reading this guarantees top marks in theoretical exams.',
    connectedSubjects: [
      { name: 'Polymer Chemistry', slug: 'polymer-chemistry' },
      { name: 'Polymer Testing', slug: 'polymer-testing' },
    ],
    careerRelevance: ['R&D Engineer', 'Materials Formulation Scientist', 'Academician'],
    difficulty: 'Intermediate',
  },
  {
    id: 'brandrup',
    title: 'Polymer Handbook',
    authors: 'J. Brandrup et al.',
    tier: 'science',
    focus: 'The ultimate database of polymer constants, physical properties, and kinetics constants',
    keyTopics: [
      'Crystallographic data and melting points',
      'Glass transition temperatures (Tg) database',
      'Solubility parameters and solvent properties',
      'Polymerization rate constants',
      'Electrical, thermal, and optical properties data',
    ],
    studentUseCase: 'Not a book to read cover-to-cover, but the standard physical reference you open when you need the exact Tg, Tm, density, or solubility parameter of an obscure polymer.',
    connectedSubjects: [
      { name: 'Polymer Chemistry', slug: 'polymer-chemistry' },
      { name: 'Polymer Testing', slug: 'polymer-testing' },
    ],
    careerRelevance: ['Formulation Scientist', 'CAE simulation engineer', 'R&D Director'],
    difficulty: 'Reference',
  },
  {
    id: 'chanda',
    title: 'Plastics Technology Handbook',
    authors: 'Manas Chanda & Salil K. Roy',
    tier: 'science',
    focus: 'Comprehensive textbook on synthesis, properties, processing, and application engineering',
    keyTopics: [
      'Addition and condensation polymerization mechanisms',
      'Properties of commercial thermoplastics',
      'Extrusion, injection moulding, blow moulding, calendering',
      'Polymer blends, composites, and foams',
      'Degradation, stabilization, and environmental aspects',
    ],
    studentUseCase: 'An excellent Indian-authored textbook that aligns very closely with the curriculum of CIPET and major Indian universities.',
    connectedSubjects: [
      { name: 'Polymer Chemistry', slug: 'polymer-chemistry' },
      { name: 'Polymer Processing', slug: 'polymer-processing' },
    ],
    careerRelevance: ['Process Engineer', 'Materials Engineer', 'Product Designer'],
    difficulty: 'Intermediate',
  },
  {
    id: 'cheremisinoff',
    title: 'Handbook of Polymer Science and Technology',
    authors: 'Nicholas P. Cheremisinoff',
    tier: 'science',
    focus: 'Industrial synthesis, product design, engineering properties, and safety standards',
    keyTopics: [
      'Polymer synthesis and industrial reactor designs',
      'Mechanical testing and stress-strain calculations',
      'Structure-property relationships for product design',
      'Safety and handling of chemicals in polymer plants',
      'Standardized quality testing protocols',
    ],
    studentUseCase: 'A solid bridging reference between academic science and industrial application. Great for design-focused projects.',
    connectedSubjects: [
      { name: 'Polymer Chemistry', slug: 'polymer-chemistry' },
      { name: 'Polymer Testing', slug: 'polymer-testing' },
    ],
    careerRelevance: ['QA/QC Engineer', 'Product Designer', 'Safety Officer'],
    difficulty: 'Advanced',
  },
  {
    id: 'rout-kumar',
    title: 'Plastics Recycling and Waste Management',
    authors: 'A.K. Rout & S. Kumar',
    tier: 'sustainability',
    focus: 'Mechanical and chemical recycling, sorting technologies, Indian EPR frameworks, and circular economy',
    keyTopics: [
      'Sources and characterization of municipal plastic waste',
      'Sorting techniques: float-sink, optical sorting, NIR',
      'Mechanical recycling: washing, grinding, pelletizing',
      'Chemical recycling: pyrolysis, depolymerization',
      'Extended Producer Responsibility (EPR) regulations in India',
    ],
    studentUseCase: 'Essential for understanding the Indian recycling landscape. Contains detail on local municipal solid waste compositions and compliance rules.',
    connectedSubjects: [
      { name: 'Recycling Technology', slug: 'recycling-technology' },
      { name: 'Sustainable Plastics & Bioplastics', slug: 'sustainable-plastics' },
    ],
    careerRelevance: ['Recycling Plant Operations', 'Sustainability Officer', 'Compliance Specialist'],
    difficulty: 'Foundational',
  },
  {
    id: 'kumari',
    title: 'Recycling of Plastics: Methods and Technologies',
    authors: 'S. Kumari',
    tier: 'sustainability',
    focus: 'Technical reprocessing, additive systems for recycled resins, and property restoration',
    keyTopics: [
      'Reprocessing-induced degradation mechanisms',
      'Restabilization: chain extenders and compatibilizers',
      'Recycling of mixed plastic waste (compatibilized blends)',
      'Pyrolysis and gasification reactor designs',
      'Environmental impact assessments (LCA basics)',
    ],
    studentUseCase: 'The technical side of recycling. Read this to learn how to recover the mechanical properties of degraded post-consumer PE/PP using additives.',
    connectedSubjects: [
      { name: 'Recycling Technology', slug: 'recycling-technology' },
      { name: 'Polymer Testing', slug: 'polymer-testing' },
    ],
    careerRelevance: ['Recycling R&D Engineer', 'Compounding Specialist', 'Process Engineer'],
    difficulty: 'Intermediate',
  },
  {
    id: 'mondal',
    title: 'Remediation of Plastic and Microplastic Waste',
    authors: 'Surajit Mondal et al.',
    tier: 'sustainability',
    focus: 'Environmental engineering, microplastic pollution mitigation, bioaccumulation, and bio-remediation',
    keyTopics: [
      'Sources and pathways of microplastic pollution',
      'Bioaccumulation in marine and terrestrial ecosystems',
      'Human health impacts of microplastic ingestion',
      'Technological mitigation strategies',
      'Bio-remediation protocols and enzyme systems',
    ],
    studentUseCase: 'The environmental science perspective on plastic pollution — useful for understanding the full life cycle impact of the materials you design and process.',
    connectedSubjects: [
      { name: 'Recycling Technology', slug: 'recycling-technology' },
      { name: 'Sustainable Plastics & Bioplastics', slug: 'sustainable-plastics' },
    ],
    careerRelevance: ['Environmental Engineer', 'Sustainability Officer', 'Regulatory Affairs'],
    difficulty: 'Intermediate',
  },
  {
    id: 'arun',
    title: 'Biodegradable Polymers, Blends and Biocomposites',
    authors: 'A. Arun et al.',
    tier: 'sustainability',
    focus: 'Green materials, eco-plastics, agricultural waste biocomposites, and end-of-life pathways',
    keyTopics: [
      'Biodegradable polymer preparation and formulation',
      'PLA, PHA, PHB, starch blends, cellulose acetate',
      'Agricultural waste biocomposites (bagasse, rice husk)',
      'Microbial and agro-based biocomposites',
      'End-of-life options: composting, anaerobic digestion',
    ],
    studentUseCase: 'The most practically detailed book on bioplastics formulation. Directly useful for understanding how PLA/PHA blends are designed.',
    connectedSubjects: [
      { name: 'Sustainable Plastics & Bioplastics', slug: 'sustainable-plastics' },
      { name: 'Polymer Composites', slug: 'polymer-composites' },
    ],
    careerRelevance: ['Bioplastics Engineer', 'Sustainability Engineer', 'R&D Engineer'],
    difficulty: 'Advanced',
  },
  {
    id: 'lee',
    title: 'Microplastics Pollution and Worldwide Policies',
    authors: 'Tin Sin Lee & Soo Tueen Bee',
    tier: 'sustainability',
    focus: 'Global microplastic pollution and comparative policy frameworks across Asia, Europe, Americas, and Africa',
    keyTopics: [
      'Mechanisms of microplastic occurrence and spread',
      'Policy frameworks in Asian countries (India, China, Japan)',
      'EU plastics policies and PPWR requirements',
      'Americas and Africa regulatory comparisons',
      'Compliance requirements and penalty structures',
    ],
    studentUseCase: 'The global policy perspective. Essential for students targeting export markets or international companies.',
    connectedSubjects: [
      { name: 'Recycling Technology', slug: 'recycling-technology' },
      { name: 'Sustainable Plastics & Bioplastics', slug: 'sustainable-plastics' },
    ],
    careerRelevance: ['Regulatory Affairs', 'Sustainability Officer', 'EPR Compliance Manager'],
    difficulty: 'Intermediate',
  },
  {
    id: 'mittal',
    title: 'Handbook of Polymer Applications in Medicine',
    authors: 'V. Mittal',
    tier: 'specialized',
    focus: 'Medical plastics, biocompatibility, implant engineering, regulatory compliance, and nano-scale medical devices',
    keyTopics: [
      'Biocompatibility standards (ISO 10993)',
      'Polymers in medical devices: PVC, silicone, polyurethane, PEEK',
      'Sterilization methods and polymer compatibility',
      'Implantable polymers and biodegradable sutures',
      'Nano-scale medical device polymers',
    ],
    studentUseCase: 'The entry point to medical plastics — one of India\'s highest-growth polymer application sectors.',
    connectedSubjects: [
      { name: 'Polymer Testing', slug: 'polymer-testing' },
      { name: 'Polymer Chemistry', slug: 'polymer-chemistry' },
    ],
    careerRelevance: ['Medical Device Engineer', 'Biomedical Polymer Engineer', 'Regulatory Affairs'],
    difficulty: 'Advanced',
  },
]

const TIER_META = {
  processing: { label: 'Processing & Manufacturing', color: '#1D4ED8', bg: '#EFF6FF', desc: 'The "How" — machine floor, process parameters, defect troubleshooting' },
  science: { label: 'Material Science & Theory', color: '#7C3AED', bg: '#F5F3FF', desc: 'The "Why" — polymer physics, data, and fundamental science' },
  sustainability: { label: 'Sustainability & Circular Economy', color: '#15803D', bg: '#F0FDF4', desc: 'The "Future" — recycling, bioplastics, policy, and microplastics' },
  specialized: { label: 'Specialized Applications', color: '#EA580C', bg: '#FFF7ED', desc: 'High-growth niches — medical, composites, smart materials' },
}

const DIFFICULTY_STYLE: Record<string, string> = {
  Foundational: 'bg-emerald-100 text-emerald-900 border-2 border-emerald-300',
  Intermediate: 'bg-blue-100 text-blue-900 border-2 border-blue-300',
  Advanced: 'bg-orange-100 text-orange-950 border-2 border-orange-300',
  Reference: 'bg-purple-100 text-purple-950 border-2 border-purple-300',
}

// ─── Components ───────────────────────────────────────────────────────────────

function BookCard({ book, onClick }: { book: Book; onClick: () => void }) {
  const tier = TIER_META[book.tier]
  return (
    <button
      onClick={onClick}
      className="group text-left bg-canvas border-4 border-ink p-5 transition-all w-full flex flex-col justify-between shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5"
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div
            className="w-10 h-10 border-2 border-ink flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: tier.bg }}
          >
            <BookOpen className="w-5 h-5" style={{ color: tier.color }} />
          </div>
          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 uppercase tracking-wider flex-shrink-0 ${DIFFICULTY_STYLE[book.difficulty]}`}>
            {book.difficulty}
          </span>
        </div>
        <h3 className="font-display font-black text-base text-ink leading-snug mb-1 group-hover:text-yellow-600 transition-colors">
          {book.title}
        </h3>
        <p className="font-mono text-[9px] font-bold text-ink/40 mb-3 uppercase tracking-wider">{book.authors}</p>
        <p className="text-xs text-ink/60 leading-relaxed mb-4 line-clamp-2">{book.focus}</p>
      </div>
      <div className="flex flex-wrap gap-1 mt-auto">
        {book.connectedSubjects.slice(0, 2).map((s) => (
          <span key={s.slug} className="font-mono text-[8px] font-bold px-2 py-0.5 rounded-none border border-ink/20 text-ink/50 bg-slate-50">
            {s.name}
          </span>
        ))}
      </div>
    </button>
  )
}

function BookModal({ book, onClose }: { book: Book; onClose: () => void }) {
  const tier = TIER_META[book.tier]
  return (
    <div className="fixed inset-0 bg-ink/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-canvas w-full sm:max-w-xl border-4 border-ink sm:shadow-hard-xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b-4 border-ink p-6 flex items-start justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-ink flex items-center justify-center flex-shrink-0" style={{ backgroundColor: tier.bg }}>
              <BookOpen className="w-5 h-5" style={{ color: tier.color }} />
            </div>
            <div>
              <h2 className="font-display font-black text-lg text-ink leading-tight">{book.title}</h2>
              <p className="font-mono text-[10px] text-ink/40 uppercase tracking-widest">{book.authors}</p>
            </div>
          </div>
          <button onClick={onClose} className="border-2 border-ink p-1 hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex gap-2 flex-wrap">
            <span className={`text-[9px] font-mono font-bold px-2.5 py-1 uppercase tracking-wider ${DIFFICULTY_STYLE[book.difficulty]}`}>
              {book.difficulty}
            </span>
            <span className="text-[9px] font-mono font-bold px-2.5 py-1 uppercase tracking-wider border-2 border-ink" style={{ backgroundColor: tier.bg, color: tier.color }}>
              {tier.label}
            </span>
          </div>

          <p className="text-sm text-ink leading-relaxed font-bold">{book.focus}</p>

          <div>
            <p className="font-mono text-[9px] font-black text-ink/40 uppercase tracking-wider mb-2">{"// Key Topics"}</p>
            <div className="space-y-2">
              {book.keyTopics.map((t) => (
                <div key={t} className="flex items-start gap-2.5 border-l-4 pl-3 py-0.5" style={{ borderColor: tier.color }}>
                  <p className="text-sm text-ink font-bold">{t}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-4 border-ink p-4 shadow-hard" style={{ backgroundColor: tier.bg, boxShadow: '3px 3px 0px 0px #0A0A0A' }}>
            <p className="font-mono text-[9px] font-black mb-1.5 uppercase tracking-widest" style={{ color: tier.color }}>Why Students Should Read This</p>
            <p className="text-sm text-ink font-bold leading-relaxed">{book.studentUseCase}</p>
          </div>

          <div>
            <p className="font-mono text-[9px] font-black text-ink/40 uppercase tracking-wider mb-2">{"// Connected Lessons"}</p>
            <div className="space-y-2">
              {book.connectedSubjects.map((s) => (
                <Link
                  key={s.slug}
                  href={`/subjects/${s.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between bg-white border-2 border-ink p-3 hover:bg-slate-50 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                >
                  <span className="text-sm font-bold text-ink">{s.name}</span>
                  <ArrowRight className="w-4 h-4 text-ink" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[9px] font-black text-ink/40 uppercase tracking-wider mb-2">{"// Career Relevance"}</p>
            <div className="flex flex-wrap gap-2">
              {book.careerRelevance.map((c) => (
                <span key={c} className="text-xs px-3 py-1.5 border border-ink bg-slate-50 font-bold">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResourcesPage() {
  const [selected, setSelected] = useState<Book | null>(null)
  const [activeTier, setActiveTier] = useState<BookTier | 'all'>('all')
  const [search, setSearch] = useState('')
  const [activeDifficulty, setActiveDifficulty] = useState<string>('all')

  const filtered = BOOKS.filter((b) => {
    const matchTier = activeTier === 'all' || b.tier === activeTier
    const matchDiff = activeDifficulty === 'all' || b.difficulty === activeDifficulty
    const matchSearch = search === '' ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.authors.toLowerCase().includes(search.toLowerCase()) ||
      b.focus.toLowerCase().includes(search.toLowerCase())
    return matchTier && matchDiff && matchSearch
  })

  const tiers: (BookTier | 'all')[] = ['all', 'processing', 'science', 'sustainability', 'specialized']
  const difficulties = ['all', 'Foundational', 'Intermediate', 'Advanced', 'Reference']

  return (
    <div className="min-h-screen bg-canvas pb-16">

      {/* Hero */}
      <section className="border-b-4 border-ink bg-yellow-bright px-6 md:px-12 py-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-ink border-4 border-ink flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-yellow-bright" />
              </div>
              <span className="font-mono text-[10px] font-black text-ink border-2 border-ink px-3 py-1 uppercase tracking-widest bg-white">
                Library
              </span>
              <span className="font-mono text-[10px] font-black border-2 border-ink bg-ink text-yellow-bright px-3 py-1 uppercase tracking-widest">
                17 TEXTBOOKS MAPPED
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-black text-ink leading-none uppercase">
              REFERENCE<br />
              <span className="italic">BOOKS AND HANDBOOKS</span>
            </h1>
          </div>
          <div className="max-w-md text-left md:text-right">
            <p className="text-sm font-bold text-ink/70 leading-relaxed">
              From the definitive Polymer Handbook (2,500+ polymers, 350 properties each) to India-specific EPR and waste policy — mapped to your subjects and career tracks.
            </p>
          </div>
        </div>
      </section>

      {/* Filters bar */}
      <div className="sticky top-16 z-30 bg-canvas/95 backdrop-blur border-b-4 border-ink py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink" />
            <input
              type="text"
              placeholder="Search books, authors, topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border-2 border-ink placeholder:text-ink/40 font-bold focus:outline-none"
            />
          </div>

          {/* Tier filter */}
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 flex-shrink-0 items-center">
            <span className="font-mono text-[9px] font-black text-ink/40 uppercase tracking-widest mr-1">Tiers:</span>
            {tiers.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTier(t)}
                className={`font-mono text-[9px] font-bold px-3 py-1.5 border-2 border-ink whitespace-nowrap uppercase tracking-wider transition-all ${
                  activeTier === t
                    ? 'bg-yellow-bright text-ink shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white text-ink/60 hover:text-ink'
                }`}
              >
                {t === 'all' ? 'All' : TIER_META[t].label.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Difficulty filter */}
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 flex-shrink-0 items-center">
            <Filter className="w-3.5 h-3.5 text-ink flex-shrink-0" />
            <span className="font-mono text-[9px] font-black text-ink/40 uppercase tracking-widest mr-1">Levels:</span>
            {difficulties.map((d) => (
              <button
                key={d}
                onClick={() => setActiveDifficulty(d)}
                className={`font-mono text-[9px] font-bold px-3 py-1.5 border-2 border-ink whitespace-nowrap uppercase tracking-wider transition-all ${
                  activeDifficulty === d
                    ? 'bg-ink text-white shadow-[2px_2px_0px_0px_rgba(254,240,138,1)]'
                    : 'bg-white text-ink/60 hover:text-ink'
                }`}
              >
                {d === 'all' ? 'All levels' : d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tier sections */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {activeTier === 'all' ? (
          Object.entries(TIER_META).map(([tierKey, meta]) => {
            const tierBooks = filtered.filter((b) => b.tier === tierKey)
            if (tierBooks.length === 0) return null
            return (
              <div key={tierKey} className="mb-12">
                <div className="flex items-start gap-3 mb-6 border-b-2 border-ink/10 pb-2">
                  <div className="w-1.5 h-12 flex-shrink-0" style={{ backgroundColor: meta.color }} />
                  <div>
                    <h2 className="font-display text-xl font-black text-ink uppercase tracking-tight">{meta.label}</h2>
                    <p className="text-xs text-ink/50 font-bold uppercase tracking-wider">{meta.desc}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {tierBooks.map((book) => (
                    <BookCard key={book.id} book={book} onClick={() => setSelected(book)} />
                  ))}
                </div>
              </div>
            )
          })
        ) : (
          <div>
            <div className="flex items-start gap-3 mb-6 border-b-2 border-ink/10 pb-2">
              <div className="w-1.5 h-12 flex-shrink-0" style={{ backgroundColor: TIER_META[activeTier as BookTier].color }} />
              <div>
                <h2 className="font-display text-xl font-black text-ink uppercase tracking-tight">{TIER_META[activeTier as BookTier].label}</h2>
                <p className="text-xs text-ink/50 font-bold uppercase tracking-wider">{TIER_META[activeTier as BookTier].desc}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((book) => (
                <BookCard key={book.id} book={book} onClick={() => setSelected(book)} />
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="py-20 text-center border-4 border-dashed border-ink/20">
                <BookOpen className="w-10 h-10 text-ink/30 mx-auto mb-3" />
                <p className="text-ink/60 font-mono text-xs font-bold uppercase tracking-wider">No books match your current filters.</p>
                <button onClick={() => { setActiveDifficulty('all'); setActiveTier('all'); setSearch('') }} className="mt-4 font-mono text-[9px] uppercase tracking-widest text-ink hover:underline border-2 border-ink px-3 py-1 bg-yellow-bright">Clear filters</button>
              </div>
            )}
          </div>
        )}

        {/* Global empty state for all-tier view */}
        {activeTier === 'all' && filtered.length === 0 && (
          <div className="py-20 text-center border-4 border-dashed border-ink/20">
            <BookOpen className="w-10 h-10 text-ink/30 mx-auto mb-3" />
            <p className="text-ink/60 font-mono text-xs font-bold uppercase tracking-wider">No books match your current filters.</p>
            <button onClick={() => { setActiveDifficulty('all'); setActiveTier('all'); setSearch('') }} className="mt-4 font-mono text-[9px] uppercase tracking-widest text-ink hover:underline border-2 border-ink px-3 py-1 bg-yellow-bright">Clear filters</button>
          </div>
        )}
      </div>

      {/* Reading path guide */}
      <div className="border-t-4 border-b-4 border-ink py-14 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <p className="font-mono text-[10px] text-ink/50 tracking-widest uppercase mb-2">{"// Recommended reading paths"}</p>
            <h2 className="font-display text-3xl font-black text-ink uppercase tracking-tight">Where to start, by career track</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { track: 'Process & Production Engineer', books: ['Allen & Baker', 'Rosato', 'Fried'], color: '#1D4ED8' },
              { track: 'R&D / Materials Scientist', books: ['Fried', 'Brandrup', 'Chanda', 'Cheremisinoff'], color: '#7C3AED' },
              { track: 'Recycling & Sustainability', books: ['Rout & Kumar', 'Kumari', 'Arun', 'Lee & Bee'], color: '#15803D' },
              { track: 'Design / CAE Engineer', books: ['Osswald', 'Kutz', 'Brandrup'], color: '#EA580C' },
              { track: 'Medical Device Engineer', books: ['Mittal', 'Fried', 'Cheremisinoff'], color: '#7C3AED' },
              { track: 'Entrepreneur', books: ['Kutz', 'Rout & Kumar', 'Allen & Baker'], color: '#EA580C' },
            ].map((path) => (
              <div key={path.track} className="bg-canvas border-4 border-ink p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="font-display font-black text-sm text-ink mb-3 uppercase tracking-tight" style={{ borderLeft: `4px solid ${path.color}`, paddingLeft: '8px' }}>{path.track}</div>
                <div className="flex flex-wrap gap-1.5">
                  {path.books.map((b) => (
                    <span key={b} className="font-mono text-[9px] font-bold px-2 py-1 border border-ink/20 text-ink/60 bg-slate-50">{b}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Tutor CTA */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
        <div className="bg-gradient-to-br from-[#1D4ED8] to-[#1E40AF] border-4 border-ink rounded-none p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
          <div>
            <div className="font-mono text-[10px] tracking-widest uppercase mb-2 font-black" style={{ color: '#FEF08A' }}>AI Tutor Integration</div>
            <h3 className="text-white font-display text-xl md:text-3xl font-black mb-1 uppercase leading-tight">
              Ask about any concept from these books
            </h3>
            <p className="text-white/80 text-sm">The AI Tutor is trained on your 68 syllabus lessons — which cover the core content of these reference texts.</p>
          </div>
          <Link href="/ai-tutor" className="cn-btn bg-white text-ink text-center text-xs py-3 px-6 flex items-center justify-center gap-1.5 flex-shrink-0">
            Ask AI Tutor <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Book modal */}
      {selected && <BookModal book={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
