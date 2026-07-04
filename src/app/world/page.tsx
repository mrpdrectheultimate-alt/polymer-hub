'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, X, Globe, Brain } from 'lucide-react'

const INDUSTRIES = [
  {
    id: 'packaging', name: 'Packaging', color: '#15803D', bg: '#F0FDF4',
    tagline: 'The reason food reaches you safely',
    image: 'https://images.unsplash.com/photo-1624517452488-04aec72f6a44?w=800&q=80',
    facts: [
      'PET barrier films extend food shelf life by weeks without refrigeration',
      'A single PP woven sack carries 50kg across thousands of kilometres without tearing',
      'Multi-layer flexible packaging keeps snacks crisp for months using polymer layers thinner than human hair',
    ],
    example: 'Manjushree Technopack produces billions of PET preforms a year for Coca-Cola and PepsiCo India — keeping carbonated drinks pressurized from factory to your hand.',
    subject: { name: 'Polymer Processing', slug: 'polymer-processing' },
  },
  {
    id: 'medicine', name: 'Medicine', color: '#7C3AED', bg: '#F5F3FF',
    tagline: 'The material that makes modern healthcare possible',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&q=80',
    facts: [
      'A single disposable syringe prevents infections that once killed millions through reused needles',
      'Silicone heart valves have kept patients alive for decades with zero rejection',
      'IV fluid bags, blood storage pouches, and surgical gloves all require biocompatible polymer engineering',
    ],
    example: 'HMD Hindustan Syringes manufactures over 2 billion auto-disable PP syringes annually in Faridabad — the largest syringe facility in the world.',
    subject: { name: 'Medical Plastics', slug: 'medical-plastics' },
  },
  {
    id: 'aerospace', name: 'Aerospace & Rockets', color: '#EA580C', bg: '#FFF7ED',
    tagline: "Why rockets don't weigh as much as you'd think",
    image: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=800&q=80',
    facts: [
      'Carbon-fibre reinforced polymers (CFRP) are stronger than steel at one-fifth the weight',
      'Every kilogram saved in rocket structure means more payload reaching orbit',
      'ISRO PSLV uses CFRP composite structures in multiple stages',
    ],
    example: 'Tata Advanced Materials produces aerospace-grade CFRP structures for ISRO and IAF programmes from their Bangalore facility.',
    subject: { name: 'Polymer Composites', slug: 'polymer-composites' },
  },
  {
    id: 'automotive', name: 'Automotive', color: '#1D4ED8', bg: '#EFF6FF',
    tagline: 'Every car you see is part plastic, by design',
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&q=80',
    facts: [
      'Modern cars are 10–15% polymer by weight — bumpers, dashboards, fuel tanks',
      'PP/EPDM bumper blends absorb impact and bounce back instead of denting',
      'Replacing metal with polymer composites cuts fuel consumption directly',
    ],
    example: 'Motherson Sumi supplies PP/EPDM bumper fascias to Maruti Suzuki, Hyundai, and Tata Motors — engineered to flex on impact, not shatter.',
    subject: { name: 'Mould Design', slug: 'mould-design' },
  },
  {
    id: 'electronics', name: 'Electronics', color: '#7C3AED', bg: '#F5F3FF',
    tagline: 'The invisible insulator behind every device',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    facts: [
      'Every phone, laptop, and charger relies on polymer insulation to prevent short circuits',
      'Flexible polyimide films enable foldable smartphone screens',
      'Flame-retardant polymer housings are mandatory safety engineering, not just design',
    ],
    example: 'Bakelite, invented in 1907, remains the standard for electrical switchgear in Indian homes — over a century later, the same material principle holds.',
    subject: { name: 'Polymer Chemistry', slug: 'polymer-chemistry' },
  },
  {
    id: 'textiles', name: 'Clothing & Textiles', color: '#CA8A04', bg: '#FEFCE8',
    tagline: 'The fiber industry runs on polymer chemistry',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    facts: [
      'Nylon and polyester are both synthetic polymers spun into fiber — engineered fabric, not fake fabric',
      'Performance sportswear relies on polymer fiber blends for moisture-wicking and stretch',
      'Elastic waistbands depend on continuous latex rubber thread production',
    ],
    example: 'Rubfila International in Kerala operates one of the world\'s largest continuous latex thread lines, supplying elastic thread to textile manufacturers globally.',
    subject: { name: 'Rubber Technology', slug: 'rubber-technology' },
  },
  {
    id: 'construction', name: 'Construction', color: '#15803D', bg: '#F0FDF4',
    tagline: 'The pipes, seals, and insulation holding buildings together',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80',
    facts: [
      'uPVC window profiles outlast wood without rotting or needing repainting',
      'HDPE and PVC pipes carry water and waste through nearly every modern building',
      'EPDM roofing membranes resist decades of UV and weather exposure',
    ],
    example: 'Astral Pipes and Finolex Industries supply HDPE and PVC piping to municipal water projects across India, engineered to IS 4984 standards.',
    subject: { name: 'Polymer Testing', slug: 'polymer-testing' },
  },
]

const STATS = [
  { value: '20M+', label: 'Tonnes of polymer processed in India annually', color: '#1D4ED8' },
  { value: '7', label: 'Major industries depending on polymer engineering', color: '#EA580C' },
  { value: '160+', label: 'Years since the first synthetic polymer', color: '#15803D' },
  { value: '₹20T', label: 'Indian polymer industry size by 2030', color: '#7C3AED' },
]

function IndustryCard({ industry, onClick }: { industry: typeof INDUSTRIES[0]; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group text-left border-4 border-ink overflow-hidden w-full block"
      style={{
        boxShadow: `4px 4px 0px 0px ${industry.color}`,
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translate(-3px, -3px)'
        el.style.boxShadow = `7px 7px 0px 0px ${industry.color}`
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translate(0, 0)'
        el.style.boxShadow = `4px 4px 0px 0px ${industry.color}`
      }}
    >
      <div className="relative border-b-4 border-ink overflow-hidden" style={{ height: '180px' }}>
        <img src={industry.image} alt={industry.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0" style={{ backgroundColor: industry.color + 'CC' }} />
        <div className="absolute bottom-3 left-3">
          <h3 className="font-display text-2xl font-black text-white leading-tight">{industry.name}</h3>
        </div>
      </div>
      <div className="p-4" style={{ backgroundColor: industry.bg }}>
        <p className="text-xs text-ink/70 leading-relaxed mb-3">{industry.tagline}</p>
        <span className="font-mono text-[10px] font-black uppercase tracking-wider flex items-center gap-1" style={{ color: industry.color }}>
          See the engineering <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </button>
  )
}

function IndustryModal({ industry, onClose }: { industry: typeof INDUSTRIES[0]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-ink/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="bg-canvas w-full sm:max-w-lg border-4 border-ink sm:shadow-hard-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b-4 border-ink p-5 flex items-start justify-between" style={{ backgroundColor: industry.color }}>
          <div>
            <div className="font-mono text-[9px] font-bold text-white/60 uppercase tracking-widest mb-1">Industry Deep Dive</div>
            <h2 className="font-display text-2xl font-black text-white">{industry.name}</h2>
            <p className="text-white/80 text-xs mt-0.5">{industry.tagline}</p>
          </div>
          <button onClick={onClose} className="border-2 border-white text-white p-1 hover:bg-white hover:text-ink transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Facts */}
          <div>
            <div className="font-mono text-[9px] font-bold uppercase tracking-widest text-ink/50 mb-3">What&apos;s Actually Happening</div>
            <div className="space-y-2">
              {industry.facts.map((fact, i) => (
                <div key={i} className="flex items-start gap-3 border-l-4 pl-3 py-1" style={{ borderColor: industry.color }}>
                  <p className="text-sm text-ink leading-relaxed">{fact}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Example */}
          <div className="border-4 border-ink p-4" style={{ backgroundColor: industry.bg }}>
            <div className="font-mono text-[9px] font-black mb-2 uppercase tracking-widest" style={{ color: industry.color }}>
              🇮🇳 Real-World Example
            </div>
            <p className="text-sm text-ink leading-relaxed">{industry.example}</p>
          </div>

          {/* Subject link */}
          <Link
            href={`/subjects/${industry.subject.slug}`}
            onClick={onClose}
            className="flex items-center justify-between border-4 border-ink p-4 hover:bg-ink hover:text-white group transition-colors shadow-hard"
          >
            <div>
              <div className="font-mono text-[9px] text-ink/50 group-hover:text-white/50 uppercase tracking-wider mb-0.5">Learn the science behind this</div>
              <div className="font-display text-lg font-black text-ink group-hover:text-white">{industry.subject.name}</div>
            </div>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function WorldPage() {
  const [selected, setSelected] = useState<typeof INDUSTRIES[0] | null>(null)

  return (
    <div className="min-h-screen bg-canvas">
      <div className="h-2 bg-orange" />

      {/* Hero */}
      <section className="border-b-4 border-ink relative overflow-hidden" style={{ minHeight: '400px' }}>
        <img src="https://images.unsplash.com/photo-1530099486328-e021101a494a?w=1800&q=80" alt="World of plastic" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-ink/75" />
        <div className="relative px-6 md:px-12 py-16 md:py-20 max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <Globe className="w-6 h-6 text-yellow-bright" />
            <span className="font-mono text-[10px] font-black text-yellow-bright border-2 border-yellow-bright px-3 py-1 uppercase tracking-widest">The World of Plastic</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-black text-white leading-none mb-5">
            WITHOUT POLYMER<br />
            <span className="text-yellow-bright italic">ENGINEERING,</span><br />
            MODERN LIFE STOPS.
          </h1>
          <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
            Packaging. Medicine. Rockets. Vehicles. Electronics. Clothing. Construction. Tap any industry to see the real engineering behind it.
          </p>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-b-4 border-ink">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x-4 divide-ink">
          {STATS.map((s) => (
            <div key={s.label} className="p-6 text-center border-b-4 border-ink md:border-b-0" style={{ backgroundColor: s.color + '15' }}>
              <div className="font-display text-4xl font-black mb-1" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-ink/60 leading-relaxed">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Industry grid */}
      <section className="px-6 md:px-10 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="border-b-4 border-ink pb-4 mb-6 flex items-center justify-between">
            <h2 className="font-display text-2xl font-black text-ink uppercase">7 Industries · Tap to Explore</h2>
            <span className="font-mono text-[10px] text-ink/40 border-2 border-ink/20 px-3 py-1 uppercase tracking-wider">Click any card</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {INDUSTRIES.map((ind) => (
              <IndustryCard key={ind.id} industry={ind} onClick={() => setSelected(ind)} />
            ))}
          </div>
        </div>
      </section>

      {/* Narrative */}
      <section className="border-t-4 border-b-4 border-ink bg-ink px-6 md:px-12 py-12 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="font-display text-3xl md:text-4xl font-black text-yellow-bright italic mb-3">
            &ldquo;This isn&apos;t a niche field.&rdquo;
          </p>
          <p className="font-display text-2xl md:text-3xl font-black text-white mb-6">
            It&apos;s the infrastructure layer of modern civilization.
          </p>
          <Link href="/history" className="cn-btn-yellow text-sm">
            See How We Got Here <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* AI CTA */}
      <section className="border-t-4 border-ink bg-orange px-6 md:px-12 py-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="font-mono text-[9px] font-bold text-white/60 uppercase tracking-widest mb-1">AI Tutor</div>
            <h3 className="font-display text-2xl font-black text-white">Wondering how your future industry actually works?</h3>
          </div>
          <Link href="/ai-tutor" className="cn-btn bg-white text-orange border-white flex-shrink-0">
            <Brain className="w-4 h-4" /> Ask AI Tutor
          </Link>
        </div>
      </section>

      {selected && <IndustryModal industry={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
