'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles, ChevronDown, RotateCcw, Scale, BookOpen } from 'lucide-react'

// ─── Data: 20 polymers with full property sets (Brandrup Handbook source) ─────

type PolymerProperty = {
  density: string
  tg: string
  tm: string
  tensileStrength: string
  flexuralModulus: string
  elongationBreak: string
  izodImpact: string
  hdt: string
  mfiRange: string
  processingTemp: string
  shrinkage: string
  waterAbsorption: string
  flammability: string
  chemicalResistance: string
  applications: string
  indianCompanies: string
}

type Polymer = {
  id: string
  name: string
  abbr: string
  family: string
  color: string
  bg: string
  type: 'commodity' | 'engineering' | 'specialty' | 'elastomer' | 'bioplastic'
  properties: PolymerProperty
}

const POLYMERS: Polymer[] = [
  {
    id: 'pp',
    name: 'Polypropylene',
    abbr: 'PP',
    family: 'Polyolefin',
    color: '#2D6A4F',
    bg: '#E8F0E8',
    type: 'commodity',
    properties: {
      density: '0.90–0.91 g/cm³',
      tg: '−10°C to 0°C (amorphous regions)',
      tm: '160–170°C',
      tensileStrength: '30–40 MPa',
      flexuralModulus: '1,200–1,700 MPa',
      elongationBreak: '100–600%',
      izodImpact: '20–80 J/m (notched)',
      hdt: '55–65°C (0.45 MPa) / 50–56°C (1.8 MPa)',
      mfiRange: '0.5–35 g/10min (230°C/2.16kg)',
      processingTemp: '200–280°C',
      shrinkage: '1.0–2.5%',
      waterAbsorption: '<0.02% (24hr)',
      flammability: 'HB (slow burning without flame retardant)',
      chemicalResistance: 'Excellent to acids, alkalis, salts; Poor to aromatic/chlorinated solvents',
      applications: 'Woven sacks, pipes, crates, automotive parts, packaging, fibres',
      indianCompanies: 'Reliance (Repol), GAIL, Haldia Petrochemicals',
    },
  },
  {
    id: 'hdpe',
    name: 'High-Density Polyethylene',
    abbr: 'HDPE',
    family: 'Polyolefin',
    color: '#1E5A6B',
    bg: '#E8F1F3',
    type: 'commodity',
    properties: {
      density: '0.94–0.97 g/cm³',
      tg: '−120°C',
      tm: '125–135°C',
      tensileStrength: '25–35 MPa',
      flexuralModulus: '800–1,200 MPa',
      elongationBreak: '300–800%',
      izodImpact: '40–100 J/m (notched)',
      hdt: '60–80°C (0.45 MPa) / 45–55°C (1.8 MPa)',
      mfiRange: '0.05–80 g/10min (190°C/2.16kg)',
      processingTemp: '160–280°C',
      shrinkage: '1.5–3.5%',
      waterAbsorption: '<0.01% (24hr)',
      flammability: 'HB (burns with dripping)',
      chemicalResistance: 'Excellent to most chemicals; Poor to strong oxidising acids',
      applications: 'Water pipes, fuel tanks, blow-moulded containers, geomembranes, milk pouches',
      indianCompanies: 'Reliance (Relene), GAIL, Haldia Petrochemicals',
    },
  },
  {
    id: 'ldpe',
    name: 'Low-Density Polyethylene',
    abbr: 'LDPE',
    family: 'Polyolefin',
    color: '#2D6A4F',
    bg: '#E8F0E8',
    type: 'commodity',
    properties: {
      density: '0.91–0.94 g/cm³',
      tg: '−120°C',
      tm: '105–115°C',
      tensileStrength: '8–20 MPa',
      flexuralModulus: '150–400 MPa',
      elongationBreak: '300–700%',
      izodImpact: 'No break (very tough)',
      hdt: '40–50°C (0.45 MPa)',
      mfiRange: '0.2–80 g/10min (190°C/2.16kg)',
      processingTemp: '160–240°C',
      shrinkage: '1.5–5.0%',
      waterAbsorption: '<0.01% (24hr)',
      flammability: 'HB (burns slowly)',
      chemicalResistance: 'Good to most chemicals; Limited at elevated temperature',
      applications: 'Flexible films, bubble wrap, squeeze bottles, cable insulation, coatings',
      indianCompanies: 'Reliance (Relene LD), ONGC Petro Additions',
    },
  },
  {
    id: 'pvc',
    name: 'Polyvinyl Chloride',
    abbr: 'PVC',
    family: 'Vinyl Polymer',
    color: '#7A6F5C',
    bg: '#F0EDE4',
    type: 'commodity',
    properties: {
      density: '1.35–1.45 g/cm³ (rigid) / 1.1–1.35 g/cm³ (plasticised)',
      tg: '80–85°C (rigid uPVC)',
      tm: 'No distinct Tm (amorphous)',
      tensileStrength: '40–55 MPa (rigid) / 10–25 MPa (flexible)',
      flexuralModulus: '2,400–4,200 MPa (rigid)',
      elongationBreak: '2–80% (rigid) / 200–400% (flexible)',
      izodImpact: '20–80 J/m (rigid, notched)',
      hdt: '60–80°C (rigid, 0.45 MPa)',
      mfiRange: 'K-value 57–80 (viscosity number — not standard MFI)',
      processingTemp: '160–200°C (rigid) — degrades above 220°C',
      shrinkage: '0.2–0.6% (rigid)',
      waterAbsorption: '0.04–0.4% (24hr)',
      flammability: 'V-0 (self-extinguishing due to chlorine content)',
      chemicalResistance: 'Excellent to acids and alkalis; Attacked by ketones, esters, aromatic solvents',
      applications: 'Pipes, window profiles, cable sheathing, flooring, bottles, medical tubing',
      indianCompanies: 'Finolex Industries, Supreme Industries, Chemplast Sanmar',
    },
  },
  {
    id: 'abs',
    name: 'Acrylonitrile Butadiene Styrene',
    abbr: 'ABS',
    family: 'Styrenic Copolymer',
    color: '#D97706',
    bg: '#FDF3E0',
    type: 'engineering',
    properties: {
      density: '1.03–1.06 g/cm³',
      tg: '100–125°C',
      tm: 'No distinct Tm (amorphous)',
      tensileStrength: '35–50 MPa',
      flexuralModulus: '2,000–2,800 MPa',
      elongationBreak: '10–50%',
      izodImpact: '100–400 J/m (notched) — excellent impact',
      hdt: '80–100°C (0.45 MPa) / 70–95°C (1.8 MPa)',
      mfiRange: '1–30 g/10min (220°C/10kg)',
      processingTemp: '200–250°C',
      shrinkage: '0.4–0.8%',
      waterAbsorption: '0.20–0.35% (24hr)',
      flammability: 'HB–V-2 (standard grades)',
      chemicalResistance: 'Good to dilute acids/alkalis; Attacked by esters, ketones, aromatic solvents',
      applications: 'Automotive dashboards, electronic housings, appliances, LEGO bricks, medical devices',
      indianCompanies: 'INEOS Styrolution India, LG Chem India, BASF India',
    },
  },
  {
    id: 'pc',
    name: 'Polycarbonate',
    abbr: 'PC',
    family: 'Polyester Carbonate',
    color: '#1E5A6B',
    bg: '#E8F1F3',
    type: 'engineering',
    properties: {
      density: '1.20–1.22 g/cm³',
      tg: '145–150°C',
      tm: 'No distinct Tm (amorphous)',
      tensileStrength: '55–70 MPa',
      flexuralModulus: '2,200–2,500 MPa',
      elongationBreak: '80–150%',
      izodImpact: '600–900 J/m (notched) — outstanding impact',
      hdt: '130–140°C (0.45 MPa) / 120–130°C (1.8 MPa)',
      mfiRange: '2–30 g/10min (300°C/1.2kg)',
      processingTemp: '270–320°C',
      shrinkage: '0.5–0.7%',
      waterAbsorption: '0.15–0.35% (24hr)',
      flammability: 'V-2 to V-0 depending on grade',
      chemicalResistance: 'Good to dilute acids; Poor to alkalis, ketones, aromatic solvents',
      applications: 'Safety helmets, bulletproof glazing, optical discs, medical devices, headlamp lenses',
      indianCompanies: 'SABIC India, Covestro India, Trinseo India',
    },
  },
  {
    id: 'nylon6',
    name: 'Nylon 6 (Polyamide 6)',
    abbr: 'PA6',
    family: 'Polyamide',
    color: '#7A6F5C',
    bg: '#F0EDE4',
    type: 'engineering',
    properties: {
      density: '1.12–1.15 g/cm³',
      tg: '40–60°C',
      tm: '215–225°C',
      tensileStrength: '70–85 MPa (dry) / 50–65 MPa (conditioned)',
      flexuralModulus: '2,600–3,200 MPa (dry)',
      elongationBreak: '30–100% (dry)',
      izodImpact: '40–80 J/m (notched, dry)',
      hdt: '60–70°C (0.45 MPa, dry) — rises significantly when dry',
      mfiRange: '5–80 g/10min (230°C/2.16kg, variants)',
      processingTemp: '230–290°C',
      shrinkage: '0.5–2.0% (direction-dependent)',
      waterAbsorption: '2.5–3.5% at equilibrium — highly hygroscopic',
      flammability: 'V-2 (standard); V-0 with flame retardant',
      chemicalResistance: 'Excellent to hydrocarbons, oils; Attacked by strong acids, phenols',
      applications: 'Gears, bearings, cable ties, tyre cord, sportswear, automotive engine parts',
      indianCompanies: 'SRF Limited, Gujarat State Fertilizers (GSFC), BASF India',
    },
  },
  {
    id: 'pet',
    name: 'Polyethylene Terephthalate',
    abbr: 'PET',
    family: 'Polyester',
    color: '#2D6A4F',
    bg: '#E8F0E8',
    type: 'engineering',
    properties: {
      density: '1.33–1.40 g/cm³',
      tg: '75–80°C',
      tm: '245–265°C',
      tensileStrength: '55–75 MPa (amorphous) / 170–220 MPa (oriented film)',
      flexuralModulus: '2,700–3,500 MPa',
      elongationBreak: '50–300% (amorphous)',
      izodImpact: '35–60 J/m (notched)',
      hdt: '65–75°C (0.45 MPa, amorphous) / 225°C (crystalline)',
      mfiRange: '2–200 g/10min (210°C/2.16kg) — IV 0.55–0.85 dL/g for bottles',
      processingTemp: '270–290°C (bottles) / 260–280°C (film)',
      shrinkage: '0.2–0.4% (injection moulded)',
      waterAbsorption: '0.10–0.20% (24hr) — must dry to <50 ppm before processing',
      flammability: 'HB–V-2',
      chemicalResistance: 'Good to dilute acids, alcohols; Attacked by alkalis, ketones',
      applications: 'Water and carbonated drink bottles, PET film, tyre cord, polyester fibre/fabric',
      indianCompanies: 'JBF Industries, Reliance (PET), Indorama Ventures India',
    },
  },
  {
    id: 'peek',
    name: 'Polyether Ether Ketone',
    abbr: 'PEEK',
    family: 'Polyaryletherketone',
    color: '#D97706',
    bg: '#FDF3E0',
    type: 'specialty',
    properties: {
      density: '1.30–1.32 g/cm³',
      tg: '143°C',
      tm: '343°C',
      tensileStrength: '100 MPa (unfilled) / 200+ MPa (30% CF filled)',
      flexuralModulus: '3,600–4,000 MPa (unfilled) / 13,000+ MPa (CF filled)',
      elongationBreak: '30–50% (unfilled)',
      izodImpact: '55–85 J/m (notched)',
      hdt: '160°C (0.45 MPa) / 152°C (1.8 MPa)',
      mfiRange: '3–20 g/10min (380°C/2.16kg)',
      processingTemp: '370–400°C',
      shrinkage: '1.0–1.5%',
      waterAbsorption: '0.10–0.50% (24hr)',
      flammability: 'V-0 (inherently flame retardant)',
      chemicalResistance: 'Outstanding — resistant to virtually all chemicals except concentrated H₂SO₄',
      applications: 'Aerospace structural parts, medical implants, semiconductor components, oil & gas seals',
      indianCompanies: 'Victrex (supply into India), specialty distributors — limited domestic production',
    },
  },
  {
    id: 'pom',
    name: 'Polyoxymethylene (Acetal)',
    abbr: 'POM',
    family: 'Acetal',
    color: '#1E5A6B',
    bg: '#E8F1F3',
    type: 'engineering',
    properties: {
      density: '1.41–1.43 g/cm³',
      tg: '−60°C (very low)',
      tm: '165–175°C (copolymer) / 175–185°C (homopolymer)',
      tensileStrength: '55–70 MPa',
      flexuralModulus: '2,500–3,200 MPa',
      elongationBreak: '25–75%',
      izodImpact: '70–120 J/m (notched)',
      hdt: '100–110°C (0.45 MPa)',
      mfiRange: '2–27 g/10min (190°C/2.16kg)',
      processingTemp: '185–220°C — narrow processing window, degrades above 240°C',
      shrinkage: '1.5–3.5% (high, directional)',
      waterAbsorption: '0.20–0.25% (24hr)',
      flammability: 'HB (burns with formaldehyde gas — toxic)',
      chemicalResistance: 'Excellent to fuels, solvents, oils; Poor to strong acids and alkalis',
      applications: 'Precision gears, zippers, fuel system parts, plumbing fittings, conveyor components',
      indianCompanies: 'BASF (Ultraform), DuPont (Delrin) — imported; limited domestic compounding',
    },
  },
  {
    id: 'ptfe',
    name: 'Polytetrafluoroethylene',
    abbr: 'PTFE',
    family: 'Fluoropolymer',
    color: '#7A6F5C',
    bg: '#F0EDE4',
    type: 'specialty',
    properties: {
      density: '2.10–2.20 g/cm³ (highest density common polymer)',
      tg: '−120°C (below)',
      tm: '325–335°C',
      tensileStrength: '20–35 MPa',
      flexuralModulus: '400–600 MPa (relatively low for semi-crystalline)',
      elongationBreak: '200–400%',
      izodImpact: '160 J/m (notched) — tough',
      hdt: '55°C (0.45 MPa) — deforms under load at relatively low temperature',
      mfiRange: 'Not injection-mouldable — sintered and ram-extruded only',
      processingTemp: '370–385°C (sintering temperature)',
      shrinkage: '3–6%',
      waterAbsorption: '<0.01% (24hr) — virtually zero',
      flammability: 'V-0 (non-flammable)',
      chemicalResistance: 'Outstanding — resistant to virtually all chemicals at all temperatures',
      applications: 'Non-stick coatings, chemical seals, cable insulation, bearings, laboratory equipment',
      indianCompanies: 'Gujarat Fluorochemicals (PTFE — India\'s only major producer), Chemours (supply)',
    },
  },
  {
    id: 'pla',
    name: 'Polylactic Acid',
    abbr: 'PLA',
    family: 'Biopolyester',
    color: '#16A34A',
    bg: '#F0FDF4',
    type: 'bioplastic',
    properties: {
      density: '1.21–1.25 g/cm³',
      tg: '55–65°C (critical commercial limitation)',
      tm: '150–175°C (depends on L/D ratio)',
      tensileStrength: '50–70 MPa',
      flexuralModulus: '3,200–4,000 MPa (stiffer than PP)',
      elongationBreak: '2–10% (brittle without modification)',
      izodImpact: '15–30 J/m (notched) — brittle',
      hdt: '50–55°C (0.45 MPa) — low, limits hot applications',
      mfiRange: '3–30 g/10min (210°C/2.16kg)',
      processingTemp: '180–220°C',
      shrinkage: '0.3–0.5%',
      waterAbsorption: '0.3–0.5% (24hr) — must dry before processing',
      flammability: 'V-2 (standard)',
      chemicalResistance: 'Good to most organic solvents; Attacked by strong alkalis (hydrolysis)',
      applications: 'Compostable food packaging, cutlery, 3D printing filament, disposable cups (cold fill)',
      indianCompanies: 'NatureWorks (US supply), Ecogreen Bioplastics (converter), Compostable India',
    },
  },
  {
    id: 'nr',
    name: 'Natural Rubber',
    abbr: 'NR',
    family: 'Natural Elastomer',
    color: '#2D6A4F',
    bg: '#E8F0E8',
    type: 'elastomer',
    properties: {
      density: '0.91–0.93 g/cm³',
      tg: '−70°C',
      tm: '36°C (crystallizes when stretched)',
      tensileStrength: '20–35 MPa (gum) / 25–30 MPa (filled)',
      flexuralModulus: 'Not applicable (elastomer) — Hardness: 30–80 Shore A',
      elongationBreak: '500–800%',
      izodImpact: 'Exceptionally high — does not break in standard tests',
      hdt: 'Not applicable — softens above 60°C without vulcanization',
      mfiRange: 'Not applicable — characterized by Mooney Viscosity ML(1+4) 50–80',
      processingTemp: 'Vulcanization: 140–180°C for 5–30 min',
      shrinkage: 'Not applicable (rubber, measured as cure shrinkage)',
      waterAbsorption: '0.1–1.0% depending on formulation',
      flammability: 'HB (burns, not self-extinguishing without additives)',
      chemicalResistance: 'Poor to oils/fuels; Good to dilute acids/alkalis; Poor to ozone (antiozonants needed)',
      applications: 'Tyres, conveyor belts, latex gloves, seals, vibration dampers, surgical equipment',
      indianCompanies: 'MRF Limited, Apollo Tyres, CEAT (major consumers), Rubfila (latex)',
    },
  },
  {
    id: 'sbr',
    name: 'Styrene-Butadiene Rubber',
    abbr: 'SBR',
    family: 'Synthetic Elastomer',
    color: '#7A6F5C',
    bg: '#F0EDE4',
    type: 'elastomer',
    properties: {
      density: '0.93–0.95 g/cm³',
      tg: '−50 to −60°C',
      tm: 'No distinct Tm (amorphous)',
      tensileStrength: '15–25 MPa (gum) / 20–25 MPa (filled)',
      flexuralModulus: 'Not applicable — Shore A hardness 40–80',
      elongationBreak: '300–600%',
      izodImpact: 'Very high — rubber, does not break',
      hdt: 'Not applicable — continuous use temperature −40 to +100°C',
      mfiRange: 'Not applicable — Mooney ML(1+4) at 100°C: 30–80',
      processingTemp: 'Vulcanization: 140–170°C for 5–25 min',
      shrinkage: 'Not applicable',
      waterAbsorption: '0.1–0.5%',
      flammability: 'HB — burns readily without flame retardants',
      chemicalResistance: 'Poor to oils/fuels; Better ozone resistance than NR; Good to dilute acids',
      applications: 'Tyre treads and sidewalls (blended with NR/BR), conveyor belts, footwear soles',
      indianCompanies: 'MRF, Apollo Tyres, Birla Carbon (carbon black supplier for SBR compounds)',
    },
  },
  {
    id: 'epdm',
    name: 'Ethylene Propylene Diene Monomer',
    abbr: 'EPDM',
    family: 'Synthetic Elastomer',
    color: '#1E5A6B',
    bg: '#E8F1F3',
    type: 'elastomer',
    properties: {
      density: '0.85–0.90 g/cm³',
      tg: '−50 to −65°C',
      tm: 'No distinct Tm (amorphous backbone)',
      tensileStrength: '10–20 MPa (gum) — lower than NR',
      flexuralModulus: 'Not applicable — Shore A hardness 40–90',
      elongationBreak: '200–500%',
      izodImpact: 'Very high — elastomeric',
      hdt: 'Not applicable — continuous use temperature −50 to +150°C',
      mfiRange: 'Not applicable — characterized by Mooney viscosity',
      processingTemp: 'Vulcanization: 160–180°C for 5–20 min',
      shrinkage: 'Not applicable',
      waterAbsorption: '<0.1%',
      flammability: 'HB — but excellent UV and ozone resistance without additional antiozonants',
      chemicalResistance: 'Outstanding weathering/ozone resistance; Poor to oils/fuels (saturated backbone is strength here)',
      applications: 'Automotive weatherstripping, roofing membranes, radiator hoses, outdoor seals, O-rings',
      indianCompanies: 'Lanxess India (EPDM supplier), Motherson Sumi (automotive seal applications)',
    },
  },
]

type CompareProperty = {
  key: keyof PolymerProperty
  label: string
  icon: string
  highlight: boolean
}

const COMPARE_PROPERTIES: CompareProperty[] = [
  { key: 'density', label: 'Density', icon: '⚖️', highlight: false },
  { key: 'tg', label: 'Glass Transition (Tg)', icon: '🌡️', highlight: true },
  { key: 'tm', label: 'Melting Point (Tm)', icon: '🔥', highlight: true },
  { key: 'tensileStrength', label: 'Tensile Strength', icon: '💪', highlight: true },
  { key: 'flexuralModulus', label: 'Flexural Modulus', icon: '📐', highlight: false },
  { key: 'elongationBreak', label: 'Elongation at Break', icon: '↔️', highlight: false },
  { key: 'izodImpact', label: 'Izod Impact (Notched)', icon: '🛡️', highlight: false },
  { key: 'hdt', label: 'Heat Deflection Temp (HDT)', icon: '♨️', highlight: true },
  { key: 'mfiRange', label: 'MFI / Flow Rate', icon: '🌊', highlight: false },
  { key: 'processingTemp', label: 'Processing Temperature', icon: '⚙️', highlight: false },
  { key: 'shrinkage', label: 'Moulding Shrinkage', icon: '📏', highlight: false },
  { key: 'waterAbsorption', label: 'Water Absorption (24hr)', icon: '💧', highlight: false },
  { key: 'flammability', label: 'Flammability', icon: '🔥', highlight: false },
  { key: 'chemicalResistance', label: 'Chemical Resistance', icon: '🧪', highlight: false },
  { key: 'applications', label: 'Typical Applications', icon: '🏭', highlight: false },
  { key: 'indianCompanies', label: 'Indian Industry', icon: '🇮🇳', highlight: false },
]

const TYPE_LABELS: Record<string, string> = {
  commodity: 'Commodity',
  engineering: 'Engineering',
  specialty: 'Specialty',
  elastomer: 'Elastomer',
  bioplastic: 'Bioplastic',
}

// ─── Components ───────────────────────────────────────────────────────────────

function PolymerSelector({
  label,
  selected,
  onChange,
  exclude,
}: {
  label: string
  selected: Polymer | null
  onChange: (p: Polymer) => void
  exclude: string | null
}) {
  const [open, setOpen] = useState(false)
  const types = ['commodity', 'engineering', 'specialty', 'elastomer', 'bioplastic']

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full text-left rounded-2xl border p-5 transition-all ${
          selected
            ? 'border-sage bg-background'
            : 'border-dashed border-border bg-background-card hover:border-sage'
        }`}
      >
        {selected ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-mono font-bold text-sm" style={{ backgroundColor: selected.bg, color: selected.color }}>
              {selected.abbr}
            </div>
            <div>
              <div className="font-semibold text-ink">{selected.name}</div>
              <div className="font-mono text-[10px] text-ink-muted">{selected.family}</div>
            </div>
            <ChevronDown className={`w-4 h-4 text-ink-muted ml-auto transition-transform ${open ? 'rotate-180' : ''}`} />
          </div>
        ) : (
          <div className="flex items-center gap-3 text-ink-muted">
            <div className="w-10 h-10 rounded-xl border-2 border-dashed border-border flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="font-medium text-sm">{label}</div>
              <div className="font-mono text-[10px]">Click to choose</div>
            </div>
            <ChevronDown className="w-4 h-4 ml-auto" />
          </div>
        )}
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-2xl shadow-xl z-20 overflow-hidden max-h-80 overflow-y-auto">
          {types.map((type) => {
            const group = POLYMERS.filter((p) => p.type === type && p.id !== exclude)
            if (group.length === 0) return null
            return (
              <div key={type}>
                <div className="px-4 py-2 font-mono text-[9px] text-ink-muted uppercase tracking-widest bg-background-card border-b border-border">
                  {TYPE_LABELS[type]}
                </div>
                {group.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { onChange(p); setOpen(false) }}
                    className="w-full text-left px-4 py-3 hover:bg-background-card flex items-center gap-3 border-b border-border last:border-0 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center font-mono text-[10px] font-bold flex-shrink-0" style={{ backgroundColor: p.bg, color: p.color }}>
                      {p.abbr}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-ink">{p.name}</div>
                      <div className="font-mono text-[9px] text-ink-muted">{p.family}</div>
                    </div>
                  </button>
                ))}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ComparatorPage() {
  const [polymerA, setPolymerA] = useState<Polymer | null>(null)
  const [polymerB, setPolymerB] = useState<Polymer | null>(null)
  const [showAll, setShowAll] = useState(false)

  const reset = () => { setPolymerA(null); setPolymerB(null); setShowAll(false) }
  const canCompare = polymerA && polymerB
  const visibleProps = showAll ? COMPARE_PROPERTIES : COMPARE_PROPERTIES.filter((p) => p.highlight)

  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <div className="bg-background-card border-b border-border px-6 md:px-10 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-teal-light rounded-full px-4 py-1.5 mb-5">
            <Scale className="w-3.5 h-3.5 text-teal" />
            <span className="font-mono text-[10px] text-teal tracking-widest uppercase">Polymer Comparator</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-ink mb-3 leading-tight">
            Compare any two polymers — 15 properties side by side
          </h1>
          <p className="text-ink-muted max-w-xl leading-relaxed mb-2">
            Property data drawn from the Brandrup Polymer Handbook and Plastics Technology Handbook. Select two materials to compare Tg, Tm, tensile strength, impact, HDT, MFI, and more.
          </p>
          <p className="font-mono text-[11px] text-ink-muted">20 polymers · Commodity · Engineering · Specialty · Elastomers · Bioplastics</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* Selector row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <PolymerSelector
            label="Select Polymer A"
            selected={polymerA}
            onChange={setPolymerA}
            exclude={polymerB?.id ?? null}
          />
          <PolymerSelector
            label="Select Polymer B"
            selected={polymerB}
            onChange={setPolymerB}
            exclude={polymerA?.id ?? null}
          />
        </div>

        {canCompare && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setShowAll(!showAll)}
                className="font-mono text-[10px] px-3.5 py-1.5 rounded-lg border border-border text-ink-muted hover:border-sage hover:text-sage transition-colors uppercase tracking-wider"
              >
                {showAll ? 'Show key properties' : 'Show all 15 properties'}
              </button>
            </div>
            <button onClick={reset} className="font-mono text-[10px] text-ink-muted hover:text-sage flex items-center gap-1 transition-colors">
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
        )}

        {/* Comparison table */}
        {canCompare && (
          <div className="space-y-2 animate-fade-up">

            {/* Header */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div />
              <div className="bg-background-card rounded-2xl border border-border p-4 text-center">
                <div className="font-mono font-bold text-xl mb-1" style={{ color: polymerA.color }}>{polymerA.abbr}</div>
                <div className="font-serif text-sm font-medium text-ink">{polymerA.name}</div>
                <div className="font-mono text-[10px] text-ink-muted mt-0.5">{polymerA.family}</div>
              </div>
              <div className="bg-background-card rounded-2xl border border-border p-4 text-center">
                <div className="font-mono font-bold text-xl mb-1" style={{ color: polymerB.color }}>{polymerB.abbr}</div>
                <div className="font-serif text-sm font-medium text-ink">{polymerB.name}</div>
                <div className="font-mono text-[10px] text-ink-muted mt-0.5">{polymerB.family}</div>
              </div>
            </div>

            {/* Property rows */}
            {visibleProps.map((prop) => (
              <div
                key={prop.key}
                className={`grid grid-cols-3 gap-3 rounded-2xl ${prop.highlight ? 'ring-1 ring-sage/20' : ''}`}
              >
                <div className={`flex items-center gap-2 px-4 py-3 rounded-2xl ${prop.highlight ? 'bg-sage-light' : 'bg-background-card'} border border-border`}>
                  <span className="text-base flex-shrink-0">{prop.icon}</span>
                  <span className={`font-mono text-[10px] uppercase tracking-wide ${prop.highlight ? 'text-sage font-semibold' : 'text-ink-muted'}`}>
                    {prop.label}
                  </span>
                </div>
                <div className="bg-background border border-border rounded-2xl px-4 py-3 flex items-center">
                  <p className="text-sm text-ink leading-relaxed">{polymerA.properties[prop.key]}</p>
                </div>
                <div className="bg-background border border-border rounded-2xl px-4 py-3 flex items-center">
                  <p className="text-sm text-ink leading-relaxed">{polymerB.properties[prop.key]}</p>
                </div>
              </div>
            ))}

            <p className="font-mono text-[10px] text-ink-muted pt-3">
              Source: Brandrup, Immergut & Grulke — Polymer Handbook · Chanda — Plastics Technology Handbook · Material supplier datasheets
            </p>
          </div>
        )}

        {/* Empty state */}
        {!polymerA && !polymerB && (
          <div className="text-center py-16">
            <Scale className="w-10 h-10 mx-auto mb-4 text-ink-muted opacity-30" />
            <p className="font-mono text-sm text-ink-muted">Select two polymers above to start comparing</p>
            <p className="font-mono text-[11px] text-ink-muted mt-1">20 materials · 15 properties each</p>
          </div>
        )}

        {polymerA && !polymerB && (
          <div className="text-center py-16">
            <p className="font-mono text-sm text-ink-muted">Now select a second polymer to compare against {polymerA.abbr}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-background-card border-t border-border px-6 py-10">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-sage" />
              <span className="font-mono text-[10px] text-sage uppercase tracking-widest">Materials Database</span>
            </div>
            <p className="font-serif text-lg font-medium text-ink">Explore full material profiles and supplier data</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link href="/materials" className="inline-flex items-center gap-2 bg-teal hover:bg-teal-hover text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors">
              Materials Database <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/resources" className="inline-flex items-center gap-2 bg-background border border-border text-ink font-semibold text-sm px-5 py-2.5 rounded-xl hover:border-teal transition-colors">
              <BookOpen className="w-3.5 h-3.5" /> Reference Books
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}