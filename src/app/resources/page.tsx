'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, ArrowRight, Sparkles, X, Search, Filter } from 'lucide-react'

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
    studentUseCase: 'The practical engineer\'s companion. Covers what university textbooks skip — real design rules, additive selection, and modern technologies like 3D printing.',
    connectedSubjects: [
      { name: 'Polymer Composites', slug: 'polymer-composites' },
      { name: 'Sustainable Plastics & Bioplastics', slug: 'sustainable-plastics' },
    ],
    careerRelevance: ['R&D Engineer', 'Materials Engineer', 'Design Engineer'],
    difficulty: 'Intermediate',
  },
  {
    id: 'chanda',
    title: 'Plastics Technology Handbook',
    authors: 'Manas Chanda',
    tier: 'science',
    focus: 'Advanced topics: nanocomposites, smart polymers, novel processing, recycling, and future technology',
    keyTopics: [
      'Polymer nanocomposites and nanomaterials',
      'Smart and self-healing polymer composites',
      'Electrospinning and advanced processing',
      'Electroactive and shape-memory polymers',
      'Recycling trends and upcycling concepts',
    ],
    studentUseCase: 'The forward-looking reference. Read this when you want to understand where the industry is heading — smart materials, self-healing composites, and nano-scale engineering.',
    connectedSubjects: [
      { name: 'Polymer Composites', slug: 'polymer-composites' },
      { name: 'Recycling Technology', slug: 'recycling-technology' },
    ],
    careerRelevance: ['R&D Engineer', 'Materials Scientist', 'Sustainability Engineer'],
    difficulty: 'Advanced',
  },
  {
    id: 'mark',
    title: 'Encyclopedia of Polymer Science and Technology',
    authors: 'Herman F. Mark (Ed.), 17 volumes',
    tier: 'science',
    focus: 'The definitive academic and industrial reference covering the entire polymer field from chemistry to sustainability',
    keyTopics: [
      'Complete polymer chemistry and physics',
      'Self-healing polymers and nanotechnology',
      'Imaging techniques and spectroscopy',
      'Controlled polymer architecture',
      'Sustainability and environmental impact',
    ],
    studentUseCase: 'The authoritative reference when you need a definitive answer on any polymer topic. Not for reading cover to cover — use it like a scientific encyclopedia to resolve specific technical questions.',
    connectedSubjects: [
      { name: 'Polymer Chemistry', slug: 'polymer-chemistry' },
      { name: 'Polymer Testing', slug: 'polymer-testing' },
    ],
    careerRelevance: ['R&D Engineer', 'Materials Scientist', 'Academic/Researcher'],
    difficulty: 'Reference',
  },
  {
    id: 'brandrup',
    title: 'Polymer Handbook',
    authors: 'J. Brandrup, E.H. Immergut, E.A. Grulke',
    tier: 'science',
    focus: 'The most comprehensive source of physical property data — ~350 properties for over 2,500 polymers',
    keyTopics: [
      'Physical constants of polymers (Tg, Tm, density)',
      'Melt rheology and viscosity data',
      'Thermodynamic properties of polymer solutions',
      'Solubility parameters and compatibility',
      'Polymerization and depolymerization kinetics',
    ],
    studentUseCase: 'The data bible. When a datasheet is incomplete or you need to compare Tg values across polymer families, this is your reference. Essential for materials selection projects.',
    connectedSubjects: [
      { name: 'Polymer Chemistry', slug: 'polymer-chemistry' },
      { name: 'Polymer Testing', slug: 'polymer-testing' },
      { name: 'Polymer Composites', slug: 'polymer-composites' },
    ],
    careerRelevance: ['Materials Engineer', 'R&D Engineer', 'QA/QC Engineer'],
    difficulty: 'Reference',
  },
  {
    id: 'allen-bevington',
    title: 'Comprehensive Polymer Science',
    authors: 'Geoffrey Allen & James Bevington, 9 volumes',
    tier: 'science',
    focus: 'Theoretical polymer physics, crystallization, chain kinetics, and spectroscopy at graduate depth',
    keyTopics: [
      'Polymer characterization (GPC, NMR, FTIR)',
      'Crystallization kinetics and crystalline structure',
      'Chain polymerization mechanisms in depth',
      'Solid-state and solution properties',
      'Spectroscopy and microscopy of polymers',
    ],
    studentUseCase: 'For students pursuing M.Tech or research — the deepest theoretical treatment of polymer physics. Particularly useful for understanding characterization techniques used in your polymer testing subject.',
    connectedSubjects: [
      { name: 'Polymer Chemistry', slug: 'polymer-chemistry' },
      { name: 'Polymer Testing', slug: 'polymer-testing' },
    ],
    careerRelevance: ['Research Scientist', 'Academic/Faculty', 'Analytical Chemist'],
    difficulty: 'Advanced',
  },
  {
    id: 'cheremisinoff',
    title: 'Handbook of Polymer Science and Technology',
    authors: 'N.P. Cheremisinoff, 4 volumes',
    tier: 'science',
    focus: 'Synthesis, characterization, industrial applications, composites, and elastomers',
    keyTopics: [
      'Synthesis and physical properties',
      'Elastomers: natural rubber, SBR, NBR, EPDM, TPEs',
      'Composites and specialty applications',
      'Industrial processing and downstream applications',
      'Recycling loops and waste management',
    ],
    studentUseCase: 'The most complete treatment of rubber and elastomers alongside conventional plastics — essential reading alongside your Rubber Technology subject for understanding the full elastomer family.',
    connectedSubjects: [
      { name: 'Rubber Technology', slug: 'rubber-technology' },
      { name: 'Polymer Composites', slug: 'polymer-composites' },
    ],
    careerRelevance: ['Rubber Technologist', 'Elastomer Compounder', 'Materials Engineer'],
    difficulty: 'Advanced',
  },
  {
    id: 'fried',
    title: 'Polymer Science and Technology',
    authors: 'Joel R. Fried',
    tier: 'science',
    focus: 'Bridging fundamental polymer chemistry and applied mechanical engineering — the best single-volume polymer science text',
    keyTopics: [
      'Polymer synthesis and chain conformation',
      'Molecular weight and polydispersity',
      'Viscoelasticity and rubber elasticity',
      'Solid-state properties and glass transition',
      'Polymer solutions and thermodynamics',
    ],
    studentUseCase: 'The single best book to read after your B.Tech lectures to truly understand the science behind what you are processing. Converts memorised formulae into genuine understanding.',
    connectedSubjects: [
      { name: 'Polymer Chemistry', slug: 'polymer-chemistry' },
      { name: 'Polymer Testing', slug: 'polymer-testing' },
    ],
    careerRelevance: ['R&D Engineer', 'Materials Scientist', 'Process Engineer'],
    difficulty: 'Intermediate',
  },
  {
    id: 'osswald',
    title: 'Plastics Engineering',
    authors: 'Tim A. Osswald',
    tier: 'processing',
    focus: 'Integrating polymer science with mechanical design, FEA, and CAD/mould architecture',
    keyTopics: [
      'Mechanical design principles for plastic parts',
      'Fiber orientation and fiber-reinforced composites',
      'Finite element analysis applied to plastics',
      'Thermal properties in design context',
      'Mould CAD and flow simulation concepts',
    ],
    studentUseCase: 'The design engineer\'s textbook. If you are headed toward mould design, CAD/CAE, or product development, this book connects polymer science to the mechanical design decisions you will make every day.',
    connectedSubjects: [
      { name: 'Mould Design', slug: 'mould-design' },
      { name: 'Polymer Composites', slug: 'polymer-composites' },
    ],
    careerRelevance: ['Design Engineer', 'CAE Engineer', 'Product Development Engineer'],
    difficulty: 'Intermediate',
  },
  {
    id: 'rout',
    title: 'Plastic Waste Management in India',
    authors: 'Dr. Chadetrik Rout & Er. Parveen Kumar',
    tier: 'sustainability',
    focus: 'India-specific recycling infrastructure, EPR framework, informal sector, and circular economy policy',
    keyTopics: [
      'India Plastic Waste Management Rules (2016, amended 2022)',
      'Informal waste economy and ragpicker networks',
      'EPR portals and compliance frameworks',
      'Source-specific recovery and sorting infrastructure',
      '3.4 million tonnes generated annually; 30% recycled',
    ],
    studentUseCase: 'The only India-specific textbook on plastic waste at this depth. Essential for anyone pursuing the recycling, sustainability, or EPR compliance career tracks — and for understanding the domestic regulatory landscape before working with any Indian packaging company.',
    connectedSubjects: [
      { name: 'Recycling Technology', slug: 'recycling-technology' },
      { name: 'Sustainable Plastics & Bioplastics', slug: 'sustainable-plastics' },
    ],
    careerRelevance: ['Recycling Engineer', 'EPR Compliance Manager', 'Sustainability Officer'],
    difficulty: 'Foundational',
  },
  {
    id: 'kumari',
    title: 'Sustainable Technologies for Plastic Waste',
    authors: 'Abha Kumari et al.',
    tier: 'sustainability',
    focus: 'Advanced chemical recycling, waste-to-energy, pyrolysis, and circular economy technologies',
    keyTopics: [
      'Plastic waste to liquid fuel via pyrolysis',
      'Plastic to hydrogen and aviation fuel',
      'Depolymerization and feedstock recycling',
      'Waste-to-value-added chemicals',
      'Circular economy frameworks and LCA',
    ],
    studentUseCase: 'The technical companion to the India policy book — covers the actual chemical engineering of converting plastic waste into valuable products. Directly relevant to career opportunities in chemical recycling plants.',
    connectedSubjects: [
      { name: 'Recycling Technology', slug: 'recycling-technology' },
      { name: 'Entrepreneurship in Plastics', slug: 'entrepreneurship-plastics' },
    ],
    careerRelevance: ['Chemical Recycling Engineer', 'Sustainability Engineer', 'Process Engineer'],
    difficulty: 'Advanced',
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
    studentUseCase: 'The environmental science perspective on plastic pollution — useful for understanding the full life cycle impact of the materials you design and process, and for sustainability and regulatory roles.',
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
    studentUseCase: 'The most practically detailed book on bioplastics formulation. Directly useful for understanding how PLA/PHA blends are designed and how Indian agricultural waste can become packaging — a growing domestic industry opportunity.',
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
    studentUseCase: 'The global policy perspective. Essential for students targeting export markets or international companies — understanding how different regulatory regimes treat microplastics directly affects product design and market access.',
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
    studentUseCase: 'The entry point to medical plastics — one of India\'s highest-growth polymer application sectors. If you are considering medical device manufacturing as a career direction, this is the required reading before any industry interview.',
    connectedSubjects: [
      { name: 'Polymer Testing', slug: 'polymer-testing' },
      { name: 'Polymer Chemistry', slug: 'polymer-chemistry' },
    ],
    careerRelevance: ['Medical Device Engineer', 'Biomedical Polymer Engineer', 'Regulatory Affairs'],
    difficulty: 'Advanced',
  },
]

const TIER_META = {
  processing: { label: 'Processing & Manufacturing', color: '#2D6A4F', bg: '#E8F0E8', desc: 'The "How" — machine floor, process parameters, defect troubleshooting' },
  science: { label: 'Material Science & Theory', color: '#1E5A6B', bg: '#E8F1F3', desc: 'The "Why" — polymer physics, data, and fundamental science' },
  sustainability: { label: 'Sustainability & Circular Economy', color: '#16A34A', bg: '#F0FDF4', desc: 'The "Future" — recycling, bioplastics, policy, and microplastics' },
  specialized: { label: 'Specialized Applications', color: '#D97706', bg: '#FDF3E0', desc: 'High-growth niches — medical, composites, smart materials' },
}

const DIFFICULTY_STYLE: Record<string, string> = {
  Foundational: 'bg-sage-light text-sage',
  Intermediate: 'bg-teal-light text-teal',
  Advanced: 'bg-amber-light text-amber',
  Reference: 'bg-[#F5F0FF] text-purple-700',
}

// ─── Components ───────────────────────────────────────────────────────────────

function BookCard({ book, onClick }: { book: Book; onClick: () => void }) {
  const tier = TIER_META[book.tier]
  return (
    <button
      onClick={onClick}
      className="group text-left bg-background-card rounded-2xl border border-border p-5 hover:border-sage hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 w-full"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: tier.bg }}
        >
          <BookOpen className="w-5 h-5" style={{ color: tier.color }} />
        </div>
        <span className={`text-[9px] font-mono font-medium px-2 py-1 rounded-md uppercase tracking-wider flex-shrink-0 ${DIFFICULTY_STYLE[book.difficulty]}`}>
          {book.difficulty}
        </span>
      </div>
      <h3 className="font-serif font-semibold text-sm text-ink leading-snug mb-1 group-hover:text-sage transition-colors">
        {book.title}
      </h3>
      <p className="font-mono text-[10px] text-ink-muted mb-3">{book.authors}</p>
      <p className="text-xs text-ink-muted leading-relaxed mb-3 line-clamp-2">{book.focus}</p>
      <div className="flex flex-wrap gap-1">
        {book.connectedSubjects.slice(0, 2).map((s) => (
          <span key={s.slug} className="font-mono text-[9px] px-2 py-0.5 rounded border border-border text-ink-muted">
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
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-background w-full sm:max-w-xl sm:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b border-border p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: tier.bg }}>
              <BookOpen className="w-5 h-5" style={{ color: tier.color }} />
            </div>
            <div>
              <h2 className="font-serif font-semibold text-lg text-ink leading-tight">{book.title}</h2>
              <p className="font-mono text-[11px] text-ink-muted">{book.authors}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-ink-muted hover:text-ink p-1 flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex gap-2 flex-wrap">
            <span className={`text-[9px] font-mono font-medium px-2.5 py-1 rounded-md uppercase tracking-wider ${DIFFICULTY_STYLE[book.difficulty]}`}>
              {book.difficulty}
            </span>
            <span className="text-[9px] font-mono font-medium px-2.5 py-1 rounded-md uppercase tracking-wider" style={{ backgroundColor: tier.bg, color: tier.color }}>
              {tier.label}
            </span>
          </div>

          <p className="text-sm text-ink leading-relaxed">{book.focus}</p>

          <div>
            <p className="font-mono text-[10px] text-ink-muted uppercase tracking-wider mb-2">Key Topics</p>
            <div className="space-y-2">
              {book.keyTopics.map((t) => (
                <div key={t} className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: tier.color }} />
                  <p className="text-sm text-ink">{t}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-background-card rounded-xl p-4 border-l-4" style={{ borderColor: tier.color }}>
            <p className="font-mono text-[10px] font-medium mb-1.5" style={{ color: tier.color }}>Why Students Should Read This</p>
            <p className="text-sm text-ink leading-relaxed">{book.studentUseCase}</p>
          </div>

          <div>
            <p className="font-mono text-[10px] text-ink-muted uppercase tracking-wider mb-2">Connected Lessons</p>
            <div className="space-y-2">
              {book.connectedSubjects.map((s) => (
                <Link
                  key={s.slug}
                  href={`/subjects/${s.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between bg-background-card rounded-xl p-3 hover:border-sage border border-border transition-colors group"
                >
                  <span className="text-sm font-medium text-ink group-hover:text-sage transition-colors">{s.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-ink-muted group-hover:text-sage" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[10px] text-ink-muted uppercase tracking-wider mb-2">Career Relevance</p>
            <div className="flex flex-wrap gap-2">
              {book.careerRelevance.map((c) => (
                <span key={c} className="text-xs px-3 py-1.5 rounded-full border border-border text-ink-muted">{c}</span>
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
    <div className="min-h-screen bg-background">


      {/* Hero */}
      <div className="bg-ink text-white px-6 md:px-10 py-14 md:py-18 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-80 h-80 bg-sage opacity-[0.07] rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-5">
            <Sparkles className="w-3.5 h-3.5 text-amber" />
            <span className="font-mono text-[10px] text-amber tracking-widest uppercase">Reference Library</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-white mb-4 leading-tight max-w-3xl">
            17 books that define the global plastics sector
          </h1>
          <p className="text-white/70 text-lg max-w-2xl leading-relaxed mb-8">
            From the definitive Polymer Handbook (2,500+ polymers, 350 properties each) to India-specific EPR and waste policy — mapped to your subjects and career tracks.
          </p>
          <div className="flex flex-wrap gap-4">
            {[
              { n: '17', l: 'Reference books' },
              { n: '4', l: 'Knowledge tiers' },
              { n: '9', l: 'Subjects covered' },
              { n: '6', l: 'Career tracks mapped' },
            ].map((s) => (
              <div key={s.l} className="bg-white/10 rounded-xl px-5 py-3 text-center">
                <div className="font-mono text-xl font-semibold text-amber">{s.n}</div>
                <div className="font-mono text-[10px] text-white/50 mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-muted" />
            <input
              type="text"
              placeholder="Search books, authors, topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-background-card border border-border rounded-xl text-ink placeholder:text-ink-muted focus:outline-none focus:border-sage transition-colors"
            />
          </div>

          {/* Tier filter */}
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 flex-shrink-0">
            {tiers.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTier(t)}
                className={`font-mono text-[10px] px-3 py-1.5 rounded-lg border whitespace-nowrap uppercase tracking-wider transition-all ${
                  activeTier === t
                    ? 'bg-sage text-white border-sage'
                    : 'bg-background text-ink-muted border-border hover:border-sage hover:text-sage'
                }`}
              >
                {t === 'all' ? 'All' : TIER_META[t].label.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Difficulty filter */}
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 flex-shrink-0">
            <Filter className="w-3.5 h-3.5 text-ink-muted self-center flex-shrink-0" />
            {difficulties.map((d) => (
              <button
                key={d}
                onClick={() => setActiveDifficulty(d)}
                className={`font-mono text-[10px] px-3 py-1.5 rounded-lg border whitespace-nowrap uppercase tracking-wider transition-all ${
                  activeDifficulty === d
                    ? 'bg-teal text-white border-teal'
                    : 'bg-background text-ink-muted border-border hover:border-teal hover:text-teal'
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
                <div className="flex items-start gap-3 mb-6">
                  <div className="w-1 h-12 rounded-full flex-shrink-0" style={{ backgroundColor: meta.color }} />
                  <div>
                    <h2 className="font-serif text-xl font-semibold text-ink">{meta.label}</h2>
                    <p className="text-sm text-ink-muted">{meta.desc}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {tierBooks.map((book) => (
                    <BookCard key={book.id} book={book} onClick={() => setSelected(book)} />
                  ))}
                </div>
              </div>
            )
          })
        ) : (
          <div>
            <div className="flex items-start gap-3 mb-6">
              <div className="w-1 h-12 rounded-full flex-shrink-0" style={{ backgroundColor: TIER_META[activeTier as BookTier].color }} />
              <div>
                <h2 className="font-serif text-xl font-semibold text-ink">{TIER_META[activeTier as BookTier].label}</h2>
                <p className="text-sm text-ink-muted">{TIER_META[activeTier as BookTier].desc}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((book) => (
                <BookCard key={book.id} book={book} onClick={() => setSelected(book)} />
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="py-20 text-center">
                <BookOpen className="w-10 h-10 text-ink-muted mx-auto mb-3 opacity-40" />
                <p className="text-ink-muted font-mono text-sm">No books match your current filters.</p>
                <button onClick={() => { setActiveDifficulty('all'); setSearch('') }} className="mt-4 font-mono text-[10px] uppercase tracking-wider text-sage hover:underline">Clear filters</button>
              </div>
            )}
          </div>
        )}

        {/* Global empty state for all-tier view */}
        {activeTier === 'all' && filtered.length === 0 && (
          <div className="py-20 text-center">
            <BookOpen className="w-10 h-10 text-ink-muted mx-auto mb-3 opacity-40" />
            <p className="text-ink-muted font-mono text-sm">No books match your current filters.</p>
            <button onClick={() => { setActiveDifficulty('all'); setSearch('') }} className="mt-4 font-mono text-[10px] uppercase tracking-wider text-sage hover:underline">Clear filters</button>
          </div>
        )}
      </div>

      {/* Reading path guide */}
      <div className="bg-background-card border-y border-border py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <p className="font-mono text-[10px] text-sage tracking-widest uppercase mb-2">{"// Recommended reading path"}</p>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-ink">Where to start, by career track</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { track: 'Process & Production Engineer', books: ['Allen & Baker', 'Rosato', 'Fried'], color: '#2D6A4F' },
              { track: 'R&D / Materials Scientist', books: ['Fried', 'Brandrup', 'Chanda', 'Cheremisinoff'], color: '#1E5A6B' },
              { track: 'Recycling & Sustainability', books: ['Rout & Kumar', 'Kumari', 'Arun', 'Lee & Bee'], color: '#16A34A' },
              { track: 'Design / CAE Engineer', books: ['Osswald', 'Kutz', 'Brandrup'], color: '#D97706' },
              { track: 'Medical Device Engineer', books: ['Mittal', 'Fried', 'Cheremisinoff'], color: '#7A6F5C' },
              { track: 'Entrepreneur', books: ['Kutz', 'Rout & Kumar', 'Allen & Baker'], color: '#D97706' },
            ].map((path) => (
              <div key={path.track} className="bg-background rounded-2xl border border-border p-5">
                <div className="font-serif font-semibold text-sm text-ink mb-3">{path.track}</div>
                <div className="flex flex-wrap gap-1.5">
                  {path.books.map((b) => (
                    <span key={b} className="font-mono text-[9px] px-2 py-1 rounded border border-border text-ink-muted">{b}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Tutor CTA */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
        <div className="bg-gradient-to-br from-teal to-[#164A57] rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="font-mono text-[10px] tracking-widest uppercase mb-2" style={{ color: '#FCD34D' }}>AI Tutor</div>
            <h3 className="text-white font-serif text-xl md:text-2xl font-semibold mb-1">
              Ask about any concept from these books
            </h3>
            <p className="text-white/70 text-sm">The AI Tutor is trained on your 62 lessons — which cover the core content of these references.</p>
          </div>
          <Link href="/ai-tutor" className="flex-shrink-0 bg-white text-teal font-semibold px-6 py-3 rounded-xl hover:bg-background transition-colors flex items-center gap-2">
            Ask AI Tutor <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Book modal */}
      {selected && <BookModal book={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
