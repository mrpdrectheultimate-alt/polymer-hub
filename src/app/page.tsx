'use client'

import Link from 'next/link'
import {
  ArrowRight, FlaskConical, Brain, Zap,
  Newspaper, BookOpen, Wrench, Scale
} from 'lucide-react'

// ─── Subject data with domain colors ─────────────────────────────────────────

const SUBJECTS = [
  {
    name: 'Polymer Chemistry',
    slug: 'polymer-chemistry',
    lessons: 6,
    color: 'blue',
    bg: '#EFF6FF',
    border: '#1D4ED8',
    shadow: '4px 4px 0px 0px #1D4ED8',
    tag: 'Foundation',
    desc: 'Polymerization, molecular structure, Tg, Tm, degradation',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&q=80',
    wide: true,
  },
  {
    name: 'Polymer Processing',
    slug: 'polymer-processing',
    lessons: 6,
    color: 'orange',
    bg: '#FFF7ED',
    border: '#EA580C',
    shadow: '4px 4px 0px 0px #EA580C',
    tag: 'Manufacturing',
    desc: 'Injection moulding, extrusion, blow moulding, defects',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80',
    wide: false,
  },
  {
    name: 'Mould Design',
    slug: 'mould-design',
    lessons: 6,
    color: 'orange',
    bg: '#FFF7ED',
    border: '#EA580C',
    shadow: '4px 4px 0px 0px #EA580C',
    tag: 'Engineering',
    desc: 'Gate design, cooling, ejection, CAD/CAE simulation',
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&q=80',
    wide: false,
  },
  {
    name: 'Polymer Testing',
    slug: 'polymer-testing',
    lessons: 6,
    color: 'violet',
    bg: '#F5F3FF',
    border: '#7C3AED',
    shadow: '4px 4px 0px 0px #7C3AED',
    tag: 'QA/QC',
    desc: 'Tensile, impact, DSC, TGA, MFI, Shore hardness',
    image: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=600&q=80',
    wide: false,
  },
  {
    name: 'Rubber Technology',
    slug: 'rubber-technology',
    lessons: 6,
    color: 'orange',
    bg: '#FFF7ED',
    border: '#EA580C',
    shadow: '4px 4px 0px 0px #EA580C',
    tag: 'Elastomers',
    desc: 'Vulcanization, NR/SBR/EPDM, tyre construction, latex',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    wide: false,
  },
  {
    name: 'Recycling Technology',
    slug: 'recycling-technology',
    lessons: 6,
    color: 'green',
    bg: '#F0FDF4',
    border: '#15803D',
    shadow: '4px 4px 0px 0px #15803D',
    tag: 'Circular Economy',
    desc: 'Mechanical recycling, pyrolysis, PETase enzymes, EPR',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&q=80',
    wide: true,
  },
  {
    name: 'Sustainable Plastics',
    slug: 'sustainable-plastics',
    lessons: 6,
    color: 'green',
    bg: '#F0FDF4',
    border: '#15803D',
    shadow: '4px 4px 0px 0px #15803D',
    tag: 'Bioplastics',
    desc: 'PLA, PHA, bio-PE, mono-material packaging design',
    image: 'https://images.unsplash.com/photo-1569427830807-c1429cbabed9?w=600&q=80',
    wide: false,
  },
  {
    name: 'Polymer Composites',
    slug: 'polymer-composites',
    lessons: 6,
    color: 'blue',
    bg: '#EFF6FF',
    border: '#1D4ED8',
    shadow: '4px 4px 0px 0px #1D4ED8',
    tag: 'Advanced',
    desc: 'CFRP, GFRP, natural fibre, failure modes, ISRO applications',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&q=80',
    wide: false,
  },
  {
    name: 'Entrepreneurship',
    slug: 'entrepreneurship-plastics',
    lessons: 6,
    color: 'yellow',
    bg: '#FEFCE8',
    border: '#CA8A04',
    shadow: '4px 4px 0px 0px #CA8A04',
    tag: 'Business',
    desc: '₹10L–2Cr startup tiers, BIS certification, EPR, export',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    wide: false,
  },
  {
    name: 'Medical Plastics',
    slug: 'medical-plastics',
    lessons: 6,
    color: 'violet',
    bg: '#F5F3FF',
    border: '#7C3AED',
    shadow: '4px 4px 0px 0px #7C3AED',
    tag: 'Specialised',
    desc: 'ISO 10993, PEEK implants, sterilization, cleanroom moulding',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&q=80',
    wide: false,
  },
]

const STATS = [
  { value: '102', unit: 'Lessons', label: 'Across 15 subjects', color: '#1D4ED8', bg: '#EFF6FF' },
  { value: '17', unit: 'Reference Books', label: 'Mapped to your career', color: '#7C3AED', bg: '#F5F3FF' },
  { value: '20+', unit: 'Polymers', label: 'With full property data', color: '#EA580C', bg: '#FFF7ED' },
  { value: '₹0', unit: 'To Start', label: '15 AI queries/day free', color: '#15803D', bg: '#F0FDF4' },
]

const TOOLS = [
  { name: 'Defect Troubleshooter', desc: 'Fix sink marks, warpage, flash — corrective actions from Rosato', href: '/troubleshooter', color: '#EA580C', bg: '#FFF7ED', icon: Wrench },
  { name: 'Property Comparator', desc: 'Compare 20 polymers across 15 properties from Brandrup Handbook', href: '/comparator', color: '#1D4ED8', bg: '#EFF6FF', icon: Scale },
  { name: 'Reference Library', desc: '17 books that define the global plastics sector — mapped to your subjects', href: '/resources', color: '#7C3AED', bg: '#F5F3FF', icon: BookOpen },
  { name: 'AI Tutor', desc: 'Ask anything — grounded in your actual lessons via real RAG pipeline', href: '/ai-tutor', color: '#15803D', bg: '#F0FDF4', icon: Brain },
]

// ─── Components ───────────────────────────────────────────────────────────────

function HeroTicker() {
  const items = [
    '🔥 Carbios opens world\'s first enzymatic PET recycling plant',
    '📊 Reliance Repol PP: ₹94.50/kg ▲0.8%',
    '🏭 India processes 20M+ tonnes of polymer annually',
    '🚀 ISRO PSLV uses CFRP composite structures',
    '♻️ EU PPWR mandates 30% recycled content in bottles by 2030',
    '🇮🇳 India\'s medical device market growing at 15-18% CAGR',
  ]

  return (
    <div className="bg-yellow-bright border-y-4 border-ink overflow-hidden h-10 flex items-center">
      <div className="bg-ink text-yellow-bright font-mono text-xs font-bold px-4 h-full flex items-center flex-shrink-0 border-r-4 border-ink uppercase tracking-widest">
        Live
      </div>
      <div className="overflow-hidden flex-1">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...items, ...items].map((item, i) => (
            <span key={i} className="font-mono text-xs font-semibold text-ink px-8 border-r-2 border-ink/20">
              {item}
            </span>
          ))}
        </div>
      </div>
      <Link href="/today" className="bg-ink text-yellow-bright font-mono text-xs font-bold px-4 h-full flex items-center flex-shrink-0 border-l-4 border-ink uppercase tracking-wider hover:bg-blue transition-colors">
        Daily Pulse →
      </Link>
    </div>
  )
}

function SubjectCard({ subject }: { subject: typeof SUBJECTS[0] }) {
  return (
    <Link
      href={`/subjects/${subject.slug}`}
      className="group block border-4 bg-canvas overflow-hidden"
      style={{ borderColor: subject.border, boxShadow: subject.shadow, transition: 'transform 0.15s ease, box-shadow 0.15s ease' }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translate(-3px, -3px)'
        el.style.boxShadow = subject.shadow.replace('4px 4px', '7px 7px')
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translate(0, 0)'
        el.style.boxShadow = subject.shadow
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: subject.wide ? '200px' : '160px' }}>
        <img
          src={subject.image}
          alt={subject.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0" style={{ background: `${subject.border}CC` }} />
        <div className="absolute top-3 left-3">
          <span className="font-mono text-[10px] font-bold text-white border-2 border-white px-2 py-0.5 uppercase tracking-wider bg-transparent">
            {subject.tag}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 font-mono text-[10px] font-bold text-white border-2 border-white px-2 py-0.5">
          {subject.lessons} LESSONS
        </div>
      </div>

      {/* Content */}
      <div className="p-4" style={{ backgroundColor: subject.bg }}>
        <h3
          className="font-display text-lg font-black text-ink mb-1 leading-tight group-hover:underline"
          style={{ textDecorationColor: subject.border }}
        >
          {subject.name}
        </h3>
        <p className="text-xs text-ink/70 leading-relaxed">{subject.desc}</p>
      </div>
    </Link>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen bg-canvas">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex flex-col justify-end overflow-hidden border-b-4 border-ink">

        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1530099486328-e021101a494a?w=1800&q=85"
            alt="Colorful polymer pellets"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-ink/70" />
        </div>

        {/* Floating domain blobs */}
        <div className="absolute top-10 right-10 w-48 h-48 rounded-full opacity-20 animate-blob-pulse" style={{ backgroundColor: '#1D4ED8', filter: 'blur(40px)' }} />
        <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full opacity-20 animate-blob-pulse" style={{ backgroundColor: '#EA580C', filter: 'blur(30px)', animationDelay: '2s' }} />
        <div className="absolute bottom-1/3 left-10 w-40 h-40 rounded-full opacity-15 animate-blob-pulse" style={{ backgroundColor: '#7C3AED', filter: 'blur(35px)', animationDelay: '4s' }} />

        {/* Hero content */}
        <div className="relative px-6 md:px-12 pb-12 pt-32 max-w-6xl mx-auto w-full">

          {/* Label */}
          <div className="inline-flex items-center gap-2 border-2 border-yellow-bright px-3 py-1 mb-6">
            <span className="w-2 h-2 rounded-full bg-yellow-bright animate-pulse" />
            <span className="font-mono text-xs font-bold text-yellow-bright uppercase tracking-widest">
              India&apos;s #1 Polymer Engineering Platform
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black text-white leading-none mb-4 max-w-4xl">
            THE WORLD{' '}
            <span className="text-yellow-bright italic">RUNS</span>
            {' '}ON PLASTIC.
            <br />
            <span className="text-blue-400">WE RUN</span> THE KNOWLEDGE.
          </h1>

          <p className="text-white/80 text-lg md:text-xl max-w-2xl mb-8 leading-relaxed font-medium">
            60 world-class lessons. AI Tutor grounded in your syllabus. Real industry data updated daily.
            Career clarity for every PPE student in India.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Link href="/subjects" className="cn-btn-yellow text-base">
              Start Learning Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/world" className="cn-btn-white text-base">
              Explore the World of Plastic
            </Link>
          </div>
        </div>
      </section>

      {/* ── LIVE TICKER ──────────────────────────────────────── */}
      <HeroTicker />

      {/* ── STATS STRIP ──────────────────────────────────────── */}
      <section className="border-b-4 border-ink">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x-4 divide-ink border-ink">
          {STATS.map((stat) => (
            <div key={stat.value} className="p-6 md:p-8 text-center" style={{ backgroundColor: stat.bg }}>
              <div className="font-display text-4xl md:text-5xl font-black mb-1" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-ink border-b-2 border-ink inline-block mb-1">
                {stat.unit}
              </div>
              <div className="text-xs text-ink/60 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SUBJECTS GRID ────────────────────────────────────── */}
      <section className="border-b-4 border-ink">
        {/* Section header */}
        <div className="border-b-4 border-ink px-6 md:px-12 py-5 flex items-center justify-between bg-ink">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-yellow-bright border-4 border-yellow-bright flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-ink" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-black text-white uppercase tracking-tight">
                15 Subjects · 102 Lessons
              </h2>
              <p className="font-mono text-xs text-white/60 uppercase tracking-wider">The complete PPE curriculum</p>
            </div>
          </div>
          <Link href="/subjects" className="cn-btn-yellow text-sm hidden md:inline-flex">
            All Subjects <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Asymmetric grid */}
        <div className="p-6 md:p-8">
          {/* Row 1: 2-wide + 2-standard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-2">
              <SubjectCard subject={SUBJECTS[0]} />
            </div>
            <div className="flex flex-col gap-4">
              <SubjectCard subject={SUBJECTS[1]} />
            </div>
          </div>

          {/* Row 2: 3 standard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <SubjectCard subject={SUBJECTS[2]} />
            <SubjectCard subject={SUBJECTS[3]} />
            <SubjectCard subject={SUBJECTS[4]} />
          </div>

          {/* Row 3: 2-wide + 1 standard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-2">
              <SubjectCard subject={SUBJECTS[5]} />
            </div>
            <SubjectCard subject={SUBJECTS[6]} />
          </div>

          {/* Row 4: 3 standard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <SubjectCard subject={SUBJECTS[7]} />
            <SubjectCard subject={SUBJECTS[8]} />
            <SubjectCard subject={SUBJECTS[9]} />
          </div>
        </div>
      </section>

      {/* ── QUOTE BREAKER 1 ──────────────────────────────────── */}
      <section className="cn-quote border-y-4 border-ink">
        <div className="max-w-4xl mx-auto">
          <p className="cn-quote-text text-yellow-bright mb-4">
            &quot;Plastics are the workhorses of modern civilization — invisible, indispensable, misunderstood.&quot;
          </p>
          <p className="font-mono text-sm text-white/50 uppercase tracking-widest">
            — Industry Perspective · PolymerHub
          </p>
        </div>
      </section>

      {/* ── TOOLS SECTION ────────────────────────────────────── */}
      <section className="border-b-4 border-ink">
        <div className="border-b-4 border-ink px-6 md:px-12 py-5 bg-violet flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-canvas border-4 border-canvas flex items-center justify-center">
              <Zap className="w-5 h-5 text-violet" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-black text-white uppercase tracking-tight">
                Interactive Tools
              </h2>
              <p className="font-mono text-xs text-white/60 uppercase tracking-wider">No textbook has these</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border-ink">
          {TOOLS.map((tool, i) => {
            const Icon = tool.icon
            return (
              <Link
                key={tool.name}
                href={tool.href}
                className="group border-4 border-ink p-6 md:p-8 block"
                style={{
                  backgroundColor: tool.bg,
                  borderColor: '#0A0A0A',
                  marginTop: i < 2 ? 0 : '-4px',
                  marginLeft: i % 2 === 1 ? '-4px' : 0,
                }}
              >
                <div
                  className="w-12 h-12 border-4 border-ink flex items-center justify-center mb-4"
                  style={{ backgroundColor: tool.color }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-xl font-black text-ink mb-2 group-hover:underline" style={{ textDecorationColor: tool.color }}>
                  {tool.name}
                </h3>
                <p className="text-sm text-ink/70 leading-relaxed mb-4">{tool.desc}</p>
                <span
                  className="font-mono text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1 border-b-2 pb-0.5"
                  style={{ color: tool.color, borderColor: tool.color }}
                >
                  Open Tool <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── EXPLORE STRIP ────────────────────────────────────── */}
      <section className="border-b-4 border-ink">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y-4 md:divide-y-0 md:divide-x-4 divide-ink">

          {/* History */}
          <Link href="/history" className="group relative overflow-hidden block border-ink" style={{ minHeight: '280px' }}>
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"
              alt="History of plastics"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-blue/80" />
            <div className="relative p-6 h-full flex flex-col justify-end">
              <div className="cn-label border-white text-white text-[10px] mb-3 w-fit">History</div>
              <h3 className="font-display text-2xl font-black text-white leading-tight mb-2">
                162 Years of a Material That Remade Civilization
              </h3>
              <span className="font-mono text-xs text-white/70 uppercase tracking-wider flex items-center gap-1">
                Explore Timeline <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

          {/* World */}
          <Link href="/world" className="group relative overflow-hidden block" style={{ minHeight: '280px' }}>
            <img
              src="https://images.unsplash.com/photo-1581093458791-9d58e74010a8?w=600&q=80"
              alt="World of plastic"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-orange/80" />
            <div className="relative p-6 h-full flex flex-col justify-end">
              <div className="cn-label border-white text-white text-[10px] mb-3 w-fit">World</div>
              <h3 className="font-display text-2xl font-black text-white leading-tight mb-2">
                Without Polymer Engineering, Modern Life Stops
              </h3>
              <span className="font-mono text-xs text-white/70 uppercase tracking-wider flex items-center gap-1">
                7 Industries <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

          {/* Careers */}
          <Link href="/careers" className="group relative overflow-hidden block" style={{ minHeight: '280px' }}>
            <img
              src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80"
              alt="Careers in plastics"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-green/80" />
            <div className="relative p-6 h-full flex flex-col justify-end">
              <div className="cn-label border-white text-white text-[10px] mb-3 w-fit">Careers</div>
              <h3 className="font-display text-2xl font-black text-white leading-tight mb-2">
                6 Career Tracks. ₹4–40 LPA Range. Your Choice.
              </h3>
              <span className="font-mono text-xs text-white/70 uppercase tracking-wider flex items-center gap-1">
                Career Hub <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ── AI TUTOR SECTION ─────────────────────────────────── */}
      <section className="border-b-4 border-ink bg-green">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="cn-label border-white text-white text-[10px] mb-4 w-fit bg-white/20">
              AI Tutor — Powered by Gemini
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-black text-white leading-tight mb-4">
              Ask Anything.<br />Get Answers Grounded<br />in Your Lessons.
            </h2>
            <p className="text-white/80 text-base leading-relaxed mb-6">
              Not a generic chatbot. The PolymerHub AI Tutor uses real pgvector similarity search across all 102 lessons — so every answer cites actual lesson content.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {['What is the difference between Izod and Charpy testing?', 'How does vulcanization work?', 'Which career suits me?'].map((q) => (
                <span key={q} className="font-mono text-xs border-2 border-white text-white px-3 py-1.5 bg-white/10">
                  {q}
                </span>
              ))}
            </div>
            <Link href="/ai-tutor" className="cn-btn bg-white text-green border-white font-black">
              Ask the AI Tutor <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="border-4 border-white bg-white/10 p-6 w-full md:w-80 flex-shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-yellow-bright animate-pulse" />
              <span className="font-mono text-xs font-bold text-white/80 uppercase tracking-wider">Live · 15 free queries/day</span>
            </div>
            <div className="space-y-3">
              <div className="bg-white/20 border-2 border-white/30 p-3">
                <p className="font-mono text-xs text-white/70 mb-1">Student asks:</p>
                <p className="text-sm text-white font-medium">&quot;Why does PP become brittle after gamma sterilization?&quot;</p>
              </div>
              <div className="bg-white border-2 border-white p-3">
                <p className="font-mono text-xs text-green mb-1">AI Tutor answers from Lesson 4:</p>
                <p className="text-sm text-ink">Standard PP undergoes chain scission under gamma radiation — radiation-stabilised grades with HALS antioxidants are required for medical devices...</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUOTE BREAKER 2 ──────────────────────────────────── */}
      <section className="cn-quote">
        <div className="max-w-4xl mx-auto">
          <p className="cn-quote-text text-orange mb-4">
            &quot;The next great polymer solving ocean waste is being designed right now.&quot;
          </p>
          <p className="font-display text-3xl md:text-4xl font-black text-white mt-3">
            Will it be you?
          </p>
          <div className="mt-8">
            <Link href="/login" className="cn-btn-yellow text-base">
              Start for Free — No Credit Card <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── DAILY PULSE TEASER ───────────────────────────────── */}
      <section className="border-b-4 border-ink">
        <div className="border-b-4 border-ink px-6 md:px-12 py-5 bg-yellow-bright flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Newspaper className="w-6 h-6 text-ink" />
            <h2 className="font-display text-2xl font-black text-ink uppercase">Daily Pulse</h2>
            <span className="font-mono text-xs font-bold border-2 border-ink px-2 py-0.5 bg-ink text-yellow-bright">LIVE</span>
          </div>
          <Link href="/today" className="cn-btn-black text-sm">
            Full Feed <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y-4 md:divide-y-0 md:divide-x-4 divide-ink">
          {[
            { tag: 'Research', color: '#1D4ED8', bg: '#EFF6FF', headline: 'MIT Engineers Synthesize Self-Healing Biopolymer From Marine Chitin', time: 'Today, 05:45 AM IST' },
            { tag: 'Market', color: '#EA580C', bg: '#FFF7ED', headline: 'Reliance Adjusts Repol PP Pricing Across Gujarat Distribution Hubs', time: 'Today, 08:15 AM IST' },
            { tag: 'Sustainability', color: '#15803D', bg: '#F0FDF4', headline: 'PETase Enzyme Trial Enters Pilot Scale at Carbios — PET Recycling Milestone', time: 'Today, 09:30 AM IST' },
          ].map((item) => (
            <div key={item.headline} className="p-6 md:p-8" style={{ backgroundColor: item.bg }}>
              <span
                className="font-mono text-[10px] font-bold border-2 border-ink px-2 py-0.5 uppercase tracking-wider mb-3 inline-block"
                style={{ borderColor: item.color, color: item.color }}
              >
                {item.tag}
              </span>
              <h3 className="font-display text-lg font-black text-ink leading-tight mb-3">
                {item.headline}
              </h3>
              <p className="font-mono text-[10px] text-ink/50 uppercase tracking-wider">{item.time}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="bg-ink border-t-4 border-ink">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-yellow-bright border-4 border-yellow-bright flex items-center justify-center">
                  <FlaskConical className="w-5 h-5 text-ink" />
                </div>
                <span className="font-display text-xl font-black text-white">PolymerHub</span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                India&apos;s first Plastic Polymer Engineering knowledge platform for B.Tech students.
              </p>
            </div>

            {[
              { title: 'Learn', links: [{ label: 'All Subjects', href: '/subjects' }, { label: 'Materials DB', href: '/materials' }, { label: 'AI Tutor', href: '/ai-tutor' }, { label: 'Reference Library', href: '/resources' }] },
              { title: 'Explore', links: [{ label: 'World of Plastic', href: '/world' }, { label: 'History', href: '/history' }, { label: 'Daily Pulse', href: '/today' }, { label: 'Careers', href: '/careers' }] },
              { title: 'Tools', links: [{ label: 'Defect Troubleshooter', href: '/troubleshooter' }, { label: 'Property Comparator', href: '/comparator' }, { label: 'Pricing — ₹149/mo', href: '/pricing' }, { label: 'Sign In', href: '/login' }] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-mono text-xs font-bold text-yellow-bright uppercase tracking-widest mb-4 border-b-2 border-yellow-bright pb-2">
                  {col.title}
                </h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm text-white/60 hover:text-white hover:underline transition-colors font-medium">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t-4 border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-mono text-xs text-white/40 uppercase tracking-wider">
              © 2026 PolymerHub · India&apos;s First PPE Knowledge Platform
            </p>
            <div className="flex gap-4">
              {['#1D4ED8', '#EA580C', '#15803D', '#CA8A04', '#7C3AED'].map((c) => (
                <div key={c} className="w-4 h-4 border-2 border-white/20" style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
