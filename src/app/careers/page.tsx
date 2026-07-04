'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronDown, ChevronUp, Brain, BookOpen, Briefcase } from 'lucide-react'

const TRACKS = [
  {
    id: 'design',
    title: 'Design & Simulation Engineer',
    subtitle: 'CAD · CAE · Moldflow',
    color: '#1D4ED8', bg: '#EFF6FF',
    salary: '₹6–22 LPA',
    growth: 'High Demand',
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&q=80',
    desc: 'Design plastic parts and moulds using CAD, simulate filling and warpage using Moldflow or Moldex3D before any steel is cut.',
    skills: ['SolidWorks / CATIA', 'Autodesk Moldflow', 'Mould design fundamentals', 'GD&T tolerancing', 'Design for Manufacturing'],
    recruiters: ['Motherson Sumi', 'Varroc Engineering', 'Mold-Tek Technologies', 'Lumax Industries'],
    lessons: [{ name: 'Gate Design in Injection Moulds', slug: 'gate-design-in-injection-moulds-types-location-and-selection' }],
  },
  {
    id: 'process',
    title: 'Process & Production Engineer',
    subtitle: 'Injection · Extrusion · Blow Moulding',
    color: '#EA580C', bg: '#FFF7ED',
    salary: '₹5–18 LPA',
    growth: 'Steady',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80',
    desc: 'Set up and optimize processing lines — minimizing defects, reducing cycle time, and maintaining dimensional consistency.',
    skills: ['Injection moulding parameters', 'Extrusion screw design', 'PLC/SCADA basics', 'Six Sigma / Lean', 'Defect troubleshooting'],
    recruiters: ['Supreme Industries', 'Astral Pipes', 'Finolex Industries', 'Sintex BAPL'],
    lessons: [{ name: 'Injection Moulding: Process, Parameters, and Defects', slug: 'injection-moulding-process-parameters-and-defects' }],
  },
  {
    id: 'rnd',
    title: 'Materials & R&D Engineer',
    subtitle: 'Compounding · Formulation · Innovation',
    color: '#7C3AED', bg: '#F5F3FF',
    salary: '₹8–28 LPA',
    growth: 'Very High',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80',
    desc: 'Develop new polymer compounds, engineer blends for specific applications, push the frontier from bioplastics to carbon-fibre composites.',
    skills: ['Polymer chemistry fundamentals', 'Compound formulation', 'DSC/TGA/FTIR characterization', 'Blending & compatibilization', 'Patent writing'],
    recruiters: ['BASF India', 'SABIC India', 'Reliance R&D', 'DIC India', 'Lanxess India'],
    lessons: [{ name: 'Polymer Degradation and Stabilization', slug: 'polymer-degradation-and-stabilization' }],
  },
  {
    id: 'sustainability',
    title: 'Recycling & Sustainability Engineer',
    subtitle: 'Circular Economy · EPR · LCA',
    color: '#15803D', bg: '#F0FDF4',
    salary: '₹7–20 LPA',
    growth: 'Fastest Growing',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80',
    desc: 'The most future-proof career in the sector. Design recycling lines, navigate EPR compliance, help companies hit circular economy targets.',
    skills: ['Mechanical recycling processes', 'Chemical recycling (pyrolysis, enzymatic)', 'EPR compliance', 'Life Cycle Assessment (LCA)', 'Carbon footprint calculation'],
    recruiters: ['Reliance Green', 'Dalmia Polypro', 'UPL Sustainability', 'HDFC ESG roles'],
    lessons: [{ name: 'Introduction to the Plastics Recycling Landscape', slug: 'introduction-to-the-plastics-recycling-landscape-why-it-matters-now' }],
  },
  {
    id: 'qaqc',
    title: 'QA / QC Engineer',
    subtitle: 'Testing · Standards · Compliance',
    color: '#7C3AED', bg: '#F5F3FF',
    salary: '₹4–15 LPA',
    growth: 'Stable',
    image: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=800&q=80',
    desc: 'The quality gatekeeper — runs incoming material testing, in-process checks, and finished product certification against IS, ASTM, and ISO standards.',
    skills: ['MFI, tensile, impact testing', 'IS / ASTM / ISO standards', 'ISO 9001 / IATF 16949', 'Statistical Process Control', 'BIS certification'],
    recruiters: ['CIPET', 'Finolex Industries', 'Supreme Industries', 'Motherson Sumi'],
    lessons: [{ name: 'Tensile and Flexural Testing', slug: 'tensile-and-flexural-testing-measuring-mechanical-strength' }],
  },
  {
    id: 'entrepreneur',
    title: 'Entrepreneur',
    subtitle: 'Build Your Own Plastics Business',
    color: '#CA8A04', bg: '#FEFCE8',
    salary: 'Unlimited',
    growth: 'High Risk → High Return',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    desc: "India's plastics sector has some of the lowest barriers to entry in manufacturing. Your engineering knowledge is the moat most business owners lack.",
    skills: ['Product costing & pricing', 'Machine selection & CAPEX planning', 'Vendor/raw material sourcing', 'BIS/IS compliance', 'Export-import basics'],
    recruiters: [],
    lessons: [{ name: 'The Plastics Entrepreneurship Landscape in India', slug: 'the-plastics-entrepreneurship-landscape-in-india-why-your-degree-is-the-moat' }],
  },
]

const SALARY_BANDS = [
  { range: '₹4–6 LPA', label: 'Fresher (0–1 yr)', desc: 'CIPET / tier-2 college hire, QA/QC, production assistant', color: '#6B7280' },
  { range: '₹8–14 LPA', label: 'Mid-level (3–5 yr)', desc: 'Process engineer, mould designer, materials technician', color: '#1D4ED8' },
  { range: '₹16–22 LPA', label: 'Senior (7–10 yr)', desc: 'R&D lead, CAE specialist, plant head, sustainability officer', color: '#EA580C' },
  { range: '₹25–40+ LPA', label: 'Expert / MNC (10+ yr)', desc: 'BASF, SABIC, Dow — formulation leads, global project managers', color: '#7C3AED' },
]

const GATE_MAPPING = [
  { topic: 'Polymer Chemistry & Structure', paper: 'CH — Section 3', slug: 'introduction-to-polymer-structure-and-molecular-weight' },
  { topic: 'Polymerization Mechanisms', paper: 'CH — Reaction Engineering', slug: 'polymerization-mechanisms-addition-vs-condensation' },
  { topic: 'Polymer Processing — Injection', paper: 'CH — Mass Transfer + Heat Transfer', slug: 'injection-moulding-process-parameters-and-defects' },
  { topic: 'Rheology & Melt Flow', paper: 'CH — Fluid Mechanics + Rheology', slug: 'rheological-testing-understanding-melt-flow-behavior' },
  { topic: 'Thermal Analysis (DSC/TGA)', paper: 'CH — Thermodynamics', slug: 'thermal-analysis-dsc-tga-and-hdt-testing' },
]

const ENTREPRENEUR_TIERS = [
  { capex: '₹10–25 Lakh', tier: 'Entry', color: '#15803D', bg: '#F0FDF4', products: ['Air bubble wrap sheets', 'Stretch / cling films', 'PP woven bags (120µ+)'] },
  { capex: '₹25–75 Lakh', tier: 'Growth', color: '#1D4ED8', bg: '#EFF6FF', products: ['Masterbatch compounding', 'PVC pipe fittings (IS 7834)', 'PP/HDPE woven sacks (FIBC)'] },
  { capex: '₹75L–2 Crore', tier: 'Scale', color: '#EA580C', bg: '#FFF7ED', products: ['HDPE/uPVC pipe extrusion line', 'PET mechanical recycling plant', 'Blown film line (LDPE/LLDPE)'] },
]

function TrackCard({ track }: { track: typeof TRACKS[0] }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-4 border-ink overflow-hidden" style={{ boxShadow: `4px 4px 0px 0px ${track.color}` }}>
      <button onClick={() => setOpen(!open)} className="w-full text-left">
        <div className="relative border-b-4 border-ink overflow-hidden" style={{ height: '120px' }}>
          <img src={track.image} alt={track.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ backgroundColor: track.color + 'CC' }} />
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <div>
              <div className="font-mono text-[9px] font-bold text-white/70 uppercase tracking-wider">{track.subtitle}</div>
              <h3 className="font-display text-lg font-black text-white leading-tight">{track.title}</h3>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="font-mono text-[9px] font-black text-white border-2 border-white px-2 py-0.5">{track.salary}</span>
              <span className="font-mono text-[8px] text-white/70 uppercase">{track.growth}</span>
            </div>
          </div>
        </div>
        <div className="px-5 py-3 flex items-center justify-between" style={{ backgroundColor: track.bg }}>
          <p className="text-xs text-ink/70 flex-1 pr-3">{track.desc}</p>
          {open ? <ChevronUp className="w-4 h-4 text-ink/60 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-ink/60 flex-shrink-0" />}
        </div>
      </button>

      {open && (
        <div className="border-t-4 border-ink p-5 space-y-4 bg-canvas">
          <div>
            <div className="font-mono text-[9px] font-bold uppercase tracking-widest text-ink/50 mb-2">Skills to Build</div>
            <div className="space-y-1.5">
              {track.skills.map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className="w-2 h-2 border-2 border-ink flex-shrink-0" style={{ backgroundColor: track.color }} />
                  <span className="text-sm text-ink">{s}</span>
                </div>
              ))}
            </div>
          </div>
          {track.recruiters.length > 0 && (
            <div>
              <div className="font-mono text-[9px] font-bold uppercase tracking-widest text-ink/50 mb-2">Top Recruiters</div>
              <div className="flex flex-wrap gap-2">
                {track.recruiters.map((r) => (
                  <span key={r} className="font-mono text-[9px] border-2 border-ink px-2 py-0.5 text-ink">{r}</span>
                ))}
              </div>
            </div>
          )}
          {track.lessons.map((l) => (
            <Link
              key={l.slug}
              href={`/lessons/${l.slug}`}
              className="flex items-center justify-between border-4 border-ink p-3 hover:bg-ink hover:text-white group transition-colors shadow-hard-sm"
            >
              <span className="text-sm font-medium group-hover:text-white">{l.name}</span>
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <div className="h-2 bg-violet" />

      {/* Hero */}
      <section className="border-b-4 border-ink bg-ink px-6 md:px-12 py-14 md:py-18 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 animate-blob-pulse" style={{ backgroundColor: '#7C3AED', filter: 'blur(60px)' }} />
        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-violet border-4 border-violet flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="font-mono text-[10px] font-black text-yellow-bright border-2 border-yellow-bright px-3 py-1 uppercase tracking-widest">Career Hub</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-black text-white leading-none mb-5">
            YOUR DEGREE<br />
            OPENS <span className="text-yellow-bright italic">6 DISTINCT</span><br />
            CAREER PATHS.
          </h1>
          <p className="text-white/70 text-lg max-w-xl leading-relaxed mb-8">
            From designing rocket components in composite polymers to building a recycling plant in Gujarat — every path below is real, in-demand, and directly connected to what you are learning.
          </p>
          <div className="flex flex-wrap gap-4">
            {[
              { val: '₹4–40 LPA', label: 'Starting to senior range', color: '#FACC15' },
              { val: '12+', label: 'Active career roles', color: '#4ADE80' },
              { val: '8.5%', label: 'India industry CAGR', color: '#A78BFA' },
            ].map((s) => (
              <div key={s.val} className="border-4 border-white/20 px-5 py-3 text-center">
                <div className="font-mono text-2xl font-black" style={{ color: s.color }}>{s.val}</div>
                <div className="font-mono text-[9px] text-white/50 mt-0.5 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Career tracks */}
      <section className="px-6 md:px-10 py-10 border-b-4 border-ink">
        <div className="max-w-5xl mx-auto">
          <div className="border-b-4 border-ink pb-4 mb-6 flex items-center justify-between">
            <h2 className="font-display text-2xl font-black text-ink uppercase">6 Career Tracks — Click to Expand</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {TRACKS.map((track) => <TrackCard key={track.id} track={track} />)}
          </div>
        </div>
      </section>

      {/* Salary reality */}
      <section className="border-b-4 border-ink px-6 md:px-10 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="border-b-4 border-ink pb-4 mb-6">
            <h2 className="font-display text-2xl font-black text-ink uppercase">What This Degree Actually Pays</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SALARY_BANDS.map((band) => (
              <div key={band.label} className="border-4 border-ink p-5 flex gap-4" style={{ boxShadow: `4px 4px 0px 0px ${band.color}` }}>
                <div className="w-1.5 flex-shrink-0" style={{ backgroundColor: band.color }} />
                <div>
                  <div className="font-mono text-xl font-black text-ink">{band.range}</div>
                  <div className="font-mono text-[10px] font-bold mb-1.5 uppercase tracking-wider" style={{ color: band.color }}>{band.label}</div>
                  <p className="text-sm text-ink/60 leading-relaxed">{band.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GATE section */}
      <section className="border-b-4 border-ink px-6 md:px-10 py-10 bg-violet">
        <div className="max-w-5xl mx-auto">
          <div className="border-b-4 border-white/20 pb-4 mb-6">
            <div className="font-mono text-[9px] font-bold text-yellow-bright uppercase tracking-widest mb-1">GATE Prep</div>
            <h2 className="font-display text-2xl font-black text-white uppercase">Your Lessons Map Directly to GATE Polymer Science</h2>
          </div>
          <div className="space-y-2">
            {GATE_MAPPING.map((item) => (
              <Link
                key={item.topic}
                href={`/lessons/${item.slug}`}
                className="flex items-center gap-4 border-4 border-white/20 p-4 hover:border-white hover:bg-white/10 group transition-colors"
              >
                <div className="w-2 h-2 border-2 border-yellow-bright bg-yellow-bright flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-white group-hover:underline">{item.topic}</div>
                  <div className="font-mono text-[9px] text-white/50 uppercase tracking-wider mt-0.5">{item.paper}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-white/50 group-hover:text-white flex-shrink-0" />
              </Link>
            ))}
          </div>
          <div className="border-4 border-yellow-bright p-4 mt-4 bg-yellow-bright/10">
            <p className="text-sm text-yellow-bright font-bold">Pro tip: Polymer Chemistry and Polymer Testing on PolymerHub cover ~65% of the GATE Polymer Science paper directly. Use the AI Tutor to practice exam-style questions.</p>
          </div>
        </div>
      </section>

      {/* Entrepreneur tiers */}
      <section className="border-b-4 border-ink px-6 md:px-10 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="border-b-4 border-ink pb-4 mb-6">
            <div className="font-mono text-[9px] font-bold text-yellow uppercase tracking-widest mb-1">Entrepreneurship Track</div>
            <h2 className="font-display text-2xl font-black text-ink uppercase">Start a Plastics Business. Your Degree Is the Moat.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ENTREPRENEUR_TIERS.map((tier) => (
              <div key={tier.tier} className="border-4 border-ink overflow-hidden" style={{ boxShadow: `4px 4px 0px 0px ${tier.color}` }}>
                <div className="border-b-4 border-ink p-4" style={{ backgroundColor: tier.color }}>
                  <div className="font-mono text-[9px] font-black text-white/70 uppercase tracking-widest">{tier.tier}</div>
                  <div className="font-display text-xl font-black text-white">{tier.capex}</div>
                </div>
                <div className="p-4" style={{ backgroundColor: tier.bg }}>
                  <div className="font-mono text-[9px] font-bold text-ink/50 uppercase tracking-wider mb-2">Products</div>
                  {tier.products.map((p) => (
                    <div key={p} className="flex items-center gap-2 mb-1.5">
                      <div className="w-2 h-2 border-2 border-ink flex-shrink-0" style={{ backgroundColor: tier.color }} />
                      <span className="text-xs text-ink">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="border-4 border-yellow bg-yellow-light mt-4 p-4" style={{ borderColor: '#CA8A04', backgroundColor: '#FEFCE8' }}>
            <p className="text-sm font-bold" style={{ color: '#CA8A04' }}>Funding: MUDRA loans (up to ₹10L), SIDBI SMILE (up to ₹25L), PMEGP grant (15–35% of project cost), Gujarat SSIP (student startup grant). CGTMSE guarantees collateral-free loans up to ₹2 crore.</p>
          </div>
        </div>
      </section>

      {/* AI Tutor CTA */}
      <section className="border-t-4 border-ink bg-ink px-6 md:px-12 py-12 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-black text-white mb-3">Not Sure Which Path Fits You?</h2>
          <p className="text-white/60 mb-8 leading-relaxed">Ask the AI Tutor — describe your interests and it will map them to the right career track and the lessons to start with.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/ai-tutor" className="cn-btn-yellow text-sm">
              <Brain className="w-4 h-4" /> Ask AI Tutor
            </Link>
            <Link href="/subjects" className="cn-btn-white text-sm">
              <BookOpen className="w-4 h-4" /> Browse All Subjects
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
