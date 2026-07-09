'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, ChevronDown, RotateCcw, Scale, BookOpen } from 'lucide-react'

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
    color: '#15803D',
    bg: '#F0FDF4',
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
    color: '#1D4ED8',
    bg: '#EFF6FF',
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
    color: '#15803D',
    bg: '#F0FDF4',
    type: 'commodity',
    properties: {
      density: '0.91–0.93 g/cm³',
      tg: '−120°C',
      tm: '105–115°C',
      tensileStrength: '10–20 MPa',
      flexuralModulus: '200–400 MPa',
      elongationBreak: '100–700%',
      izodImpact: 'Extremely high (no break)',
      hdt: '40–50°C (0.45 MPa) / 30–35°C (1.8 MPa)',
      mfiRange: '0.2–25 g/10min (190°C/2.16kg)',
      processingTemp: '160–240°C',
      shrinkage: '1.5–3.0%',
      waterAbsorption: '<0.01% (24hr)',
      flammability: 'HB (drips and burns easily)',
      chemicalResistance: 'Excellent to dilute/concentrated acids, alcohols; Poor to hydrocarbons',
      applications: 'Carry bags, squeeze bottles, wire insulation, lining films, packaging films',
      indianCompanies: 'Reliance (Relene), GAIL',
    },
  },
  {
    id: 'pvc',
    name: 'Polyvinyl Chloride',
    abbr: 'PVC',
    family: 'Vinyl',
    color: '#EA580C',
    bg: '#FFF7ED',
    type: 'commodity',
    properties: {
      density: '1.30–1.45 g/cm³ (unplasticized) / 1.10–1.35 g/cm³ (flexible)',
      tg: '81°C',
      tm: '100–260°C (degrades before melting if unstabilized)',
      tensileStrength: '35–60 MPa (rigid) / 10–25 MPa (flexible)',
      flexuralModulus: '2,000–3,300 MPa (rigid)',
      elongationBreak: '20–100% (rigid) / 150–400% (flexible)',
      izodImpact: '20–100 J/m (notched rigid)',
      hdt: '60–75°C (0.45 MPa) / 54–70°C (1.8 MPa)',
      mfiRange: 'Extrusion and injection grades measured by K-Value (e.g., K-67)',
      processingTemp: '170–210°C (requires thermal stabilizers like Pb or Ca-Zn)',
      shrinkage: '0.1–0.5% (rigid) / 1.0–5.0% (flexible)',
      waterAbsorption: '0.1–0.4% (24hr)',
      flammability: 'V-0 (inherently self-extinguishing due to 57% chlorine content)',
      chemicalResistance: 'Outstanding to acids, alkalis, aliphatic hydrocarbons; Poor to ketones/esters',
      applications: 'Rigid pipes, conduits, window frames, cables, medical tubing, blood bags',
      indianCompanies: 'Finolex Industries, Reliance (Reon), Chemplast Sanmar',
    },
  },
  {
    id: 'ps',
    name: 'Polystyrene (General Purpose)',
    abbr: 'GPPS',
    family: 'Styrenic',
    color: '#7C3AED',
    bg: '#F5F3FF',
    type: 'commodity',
    properties: {
      density: '1.04–1.06 g/cm³',
      tg: '100°C',
      tm: '240°C (amorphous, no sharp Tm)',
      tensileStrength: '35–50 MPa',
      flexuralModulus: '3,000–3,400 MPa',
      elongationBreak: '1.2–2.5%',
      izodImpact: '15–20 J/m (brittle)',
      hdt: '75–85°C (0.45 MPa) / 70–80°C (1.8 MPa)',
      mfiRange: '2.0–20 g/10min (200°C/5kg)',
      processingTemp: '180–250°C',
      shrinkage: '0.2–0.6%',
      waterAbsorption: '0.03–0.1% (24hr)',
      flammability: 'HB (burns with orange flame, black soot)',
      chemicalResistance: 'Good to dilute acids, alkalis; Dissolves in toluene, chlorinated solvents',
      applications: 'Disposable cups, jewel cases, petri dishes, cosmetic packaging',
      indianCompanies: 'Supreme Petrochem, Styrenix Performance Materials',
    },
  },
  {
    id: 'hips',
    name: 'High Impact Polystyrene',
    abbr: 'HIPS',
    family: 'Styrenic (butadiene rubber modified)',
    color: '#7C3AED',
    bg: '#F5F3FF',
    type: 'commodity',
    properties: {
      density: '1.03–1.05 g/cm³',
      tg: '100°C (polystyrene matrix) / −90°C (rubber phase)',
      tm: 'No distinct Tm',
      tensileStrength: '20–35 MPa',
      flexuralModulus: '1,600–2,400 MPa',
      elongationBreak: '20–65%',
      izodImpact: '50–120 J/m (notched)',
      hdt: '70–80°C (0.45 MPa) / 65–75°C (1.8 MPa)',
      mfiRange: '3.0–15 g/10min (200°C/5kg)',
      processingTemp: '180–260°C',
      shrinkage: '0.3–0.7%',
      waterAbsorption: '0.05–0.15% (24hr)',
      flammability: 'HB (burns with soot)',
      chemicalResistance: 'Good to acids, alkalis; Poor to organic solvents',
      applications: 'Refrigerator liners, toys, television housings, cassettes, food trays',
      indianCompanies: 'Supreme Petrochem, Styrenix Performance Materials',
    },
  },
  {
    id: 'abs',
    name: 'Acrylonitrile Butadiene Styrene',
    abbr: 'ABS',
    family: 'Styrenic Terpolymer',
    color: '#CA8A04',
    bg: '#FEFCE8',
    type: 'engineering',
    properties: {
      density: '1.03–1.06 g/cm³',
      tg: '105°C (matrix) / −90°C (butadiene)',
      tm: 'No distinct Tm (amorphous)',
      tensileStrength: '35–50 MPa',
      flexuralModulus: '1,800–2,600 MPa',
      elongationBreak: '10–50%',
      izodImpact: '150–400 J/m (high impact strength)',
      hdt: '85–100°C (0.45 MPa) / 80–95°C (1.8 MPa)',
      mfiRange: '1.5–25 g/10min (220°C/10kg)',
      processingTemp: '200–260°C',
      shrinkage: '0.4–0.7%',
      waterAbsorption: '0.2–0.4% (24hr)',
      flammability: 'HB (burns with yellow flame, black smoke)',
      chemicalResistance: 'Good resistance to dilute acids, alkalis, oils; Poor to ketones, esters',
      applications: 'Helmets, automotive grilles, electronic enclosures, piping, luggage shells',
      indianCompanies: 'Styrenix Performance Materials, Bhansali Engineering Polymers',
    },
  },
  {
    id: 'nylon6',
    name: 'Polyamide 6 (Nylon 6)',
    abbr: 'PA 6',
    family: 'Polyamide',
    color: '#CA8A04',
    bg: '#FEFCE8',
    type: 'engineering',
    properties: {
      density: '1.13–1.15 g/cm³',
      tg: '47°C (dry) / 0°C (conditioned/wet)',
      tm: '220°C',
      tensileStrength: '70–85 MPa (dry) / 45–55 MPa (conditioned)',
      flexuralModulus: '2,600–3,000 MPa (dry) / 900–1,200 MPa (conditioned)',
      elongationBreak: '60–300%',
      izodImpact: '50–100 J/m (notched dry)',
      hdt: '160–185°C (0.45 MPa) / 60–75°C (1.8 MPa)',
      mfiRange: 'Highly dependent on relative viscosity (RV) for yarn/moulding',
      processingTemp: '230–280°C (must dry to <0.1% moisture before processing)',
      shrinkage: '0.7–1.5%',
      waterAbsorption: '1.5–2.5% (24hr) / 8.5% (equilibrium saturation)',
      flammability: 'V-2 (drips and self-extinguishes)',
      chemicalResistance: 'Outstanding resistance to hydrocarbons, oils, fuels; Poor to strong mineral acids',
      applications: 'Gears, bearings, tyre cords, fishing lines, radiator tanks, textiles',
      indianCompanies: 'SRF Limited, Gujarat State Fertilizers & Chemicals (GSFC - Gujlon)',
    },
  },
  {
    id: 'pc',
    name: 'Polycarbonate',
    abbr: 'PC',
    family: 'Polyester (carbonate linked)',
    color: '#CA8A04',
    bg: '#FEFCE8',
    type: 'engineering',
    properties: {
      density: '1.20–1.22 g/cm³',
      tg: '145–150°C',
      tm: '220–230°C (crystallites melt, processed amorphous)',
      tensileStrength: '55–75 MPa',
      flexuralModulus: '2,200–2,500 MPa',
      elongationBreak: '80–120%',
      izodImpact: '600–800 J/m (extremely tough, notch sensitive)',
      hdt: '135–142°C (0.45 MPa) / 125–132°C (1.8 MPa)',
      mfiRange: '4.0–25 g/10min (300°C/1.2kg)',
      processingTemp: '280–320°C (must dry to <0.02% moisture to avoid hydrolytic degradation)',
      shrinkage: '0.5–0.7%',
      waterAbsorption: '0.15–0.2% (24hr)',
      flammability: 'V-2 (inherent flame resistance, charring)',
      chemicalResistance: 'Good to dilute acids, oils; Poor to alkalis, chlorinated solvents',
      applications: 'Safety glasses, bulletproof sheets, CDs, automotive headlamps, roofing domes',
      indianCompanies: 'LG Polymers, SABIC India (distributor/compounding)',
    },
  },
  {
    id: 'pet',
    name: 'Polyethylene Terephthalate',
    abbr: 'PET',
    family: 'Polyester',
    color: '#CA8A04',
    bg: '#FEFCE8',
    type: 'engineering',
    properties: {
      density: '1.33–1.38 g/cm³ (amorphous/semi-crystalline)',
      tg: '70–80°C',
      tm: '250–265°C',
      tensileStrength: '50–75 MPa',
      flexuralModulus: '2,800–3,100 MPa',
      elongationBreak: '50–150%',
      izodImpact: '30–50 J/m (notched)',
      hdt: '115°C (0.45 MPa) / 75°C (1.8 MPa)',
      mfiRange: 'Characterized by Intrinsic Viscosity (IV): 0.70–0.85 dL/g for bottles',
      processingTemp: '270–300°C (must dry to <0.005% or 50 ppm moisture)',
      shrinkage: '1.2–2.0%',
      waterAbsorption: '0.1–0.2% (24hr)',
      flammability: 'HB (burns with drip)',
      chemicalResistance: 'Good to organic acids, alcohols, oils; Poor to strong bases/alkalis',
      applications: 'Beverage bottles, film backing, polyester fabrics, packaging blister trays',
      indianCompanies: 'Reliance Industries (Relpet), JBF Industries, Dhunseri Petrochem',
    },
  },
  {
    id: 'pom',
    name: 'Polyoxymethylene (Acetal)',
    abbr: 'POM',
    family: 'Polyether (formaldehyde polymer)',
    color: '#CA8A04',
    bg: '#FEFCE8',
    type: 'engineering',
    properties: {
      density: '1.41–1.43 g/cm³',
      tg: '−60°C',
      tm: '165–175°C (highly crystalline)',
      tensileStrength: '60–70 MPa',
      flexuralModulus: '2,600–3,000 MPa',
      elongationBreak: '25–75%',
      izodImpact: '50–80 J/m (notched)',
      hdt: '150–160°C (0.45 MPa) / 110–120°C (1.8 MPa)',
      mfiRange: '2.5–15 g/10min (190°C/2.16kg)',
      processingTemp: '190–210°C (susceptible to formaldehyde gas emission on overheating)',
      shrinkage: '1.8–2.2%',
      waterAbsorption: '0.2–0.25% (24hr)',
      flammability: 'HB (burns with clean blue flame, formaldehyde odour)',
      chemicalResistance: 'Excellent resistance to organic solvents, fuels, bases; Poor to strong acids',
      applications: 'Precision gears, zippers, fuel sender units, conveyor links, electrical switches',
      indianCompanies: 'SABIC India, DuPont India (compounding lines)',
    },
  },
  {
    id: 'peek',
    name: 'Polyether Ether Ketone',
    abbr: 'PEEK',
    family: 'Polyaryletherketone (PAEK)',
    color: '#1E5A6B',
    bg: '#E8F1F3',
    type: 'specialty',
    properties: {
      density: '1.30–1.32 g/cm³',
      tg: '143°C',
      tm: '343°C (high performance crystalline)',
      tensileStrength: '90–100 MPa',
      flexuralModulus: '3,700–4,000 MPa',
      elongationBreak: '30–50%',
      izodImpact: '80–100 J/m (notched)',
      hdt: '315°C (0.45 MPa) / 160°C (1.8 MPa) — can reach 315C with glass/carbon fill',
      mfiRange: '3.0–8.0 g/10min (400°C/2.16kg)',
      processingTemp: '360–400°C (demands special high-temperature heaters)',
      shrinkage: '1.0–1.5%',
      waterAbsorption: '0.1% (24hr)',
      flammability: 'V-0 (inherently self-extinguishing, extremely low smoke generation)',
      chemicalResistance: 'Insoluble in virtually all common solvents; attacked only by concentrated sulfuric acid',
      applications: 'Aerospace structural brackets, spinal fusion cages, oil well sensors, semiconductor trays',
      indianCompanies: 'Gharda Chemicals (G-PAEK - leading global supplier of PEEK)',
    },
  },
  {
    id: 'ptfe',
    name: 'Polytetrafluoroethylene',
    abbr: 'PTFE',
    family: 'Fluoropolymer',
    color: '#1E5A6B',
    bg: '#E8F1F3',
    type: 'specialty',
    properties: {
      density: '2.14–2.20 g/cm³ (extremely heavy due to fluorine atoms)',
      tg: '−120°C / 120°C (complex transitions)',
      tm: '327°C',
      tensileStrength: '20–35 MPa (low strength)',
      flexuralModulus: '400–600 MPa (soft and flexible)',
      elongationBreak: '200–400%',
      izodImpact: '150 J/m (highly impact resistant)',
      hdt: '120°C (0.45 MPa) / 55°C (1.8 MPa)',
      mfiRange: 'Does not flow — melt viscosity too high (processed by sintering/compression)',
      processingTemp: 'Sintering temperature: 360–380°C',
      shrinkage: '3.0–5.0%',
      waterAbsorption: '0.00% (hydrophobic)',
      flammability: 'V-0 / Non-flammable (highest LOI at 95%)',
      chemicalResistance: 'Universal chemical resistance; inert to almost all chemicals',
      applications: 'Non-stick coatings, chemical gaskets, slide bearings, RF cable insulation',
      indianCompanies: 'Gujarat Fluorochemicals Limited (GFL - major global PTFE producer)',
    },
  },
  {
    id: 'pla',
    name: 'Polylactic Acid',
    abbr: 'PLA',
    family: 'Bio-polyester',
    color: '#15803D',
    bg: '#F0FDF4',
    type: 'bioplastic',
    properties: {
      density: '1.24–1.26 g/cm³',
      tg: '55–60°C (low Tg limits hot applications)',
      tm: '150–165°C',
      tensileStrength: '50–65 MPa (stiff and brittle)',
      flexuralModulus: '3,000–3,500 MPa (rigid)',
      elongationBreak: '3–6%',
      izodImpact: '25–35 J/m (brittle)',
      hdt: '50–55°C (0.45 MPa) / 45–52°C (1.8 MPa)',
      mfiRange: '3.0–15 g/10min (190°C/2.16kg)',
      processingTemp: '180–220°C (thermal degradation starts above 230°C)',
      shrinkage: '0.3–0.5%',
      waterAbsorption: '0.4–0.6% (24hr)',
      flammability: 'HB (burns with sweet odour, low smoke)',
      chemicalResistance: 'Good to water/alcohols; Hydrolytically degrades in composting environments',
      applications: '3D printing filament, compostable packaging, organic waste bags, disposable cups',
      indianCompanies: 'Total Corbion (imported), Godavari Biorefineries (R&D)',
    },
  },
  {
    id: 'pha',
    name: 'Polyhydroxyalkanoates',
    abbr: 'PHA',
    family: 'Bio-polyester (bacterial synthesis)',
    color: '#15803D',
    bg: '#F0FDF4',
    type: 'bioplastic',
    properties: {
      density: '1.20–1.25 g/cm³',
      tg: '0°C to 15°C (homopolymer PHB)',
      tm: '170–180°C',
      tensileStrength: '25–40 MPa',
      flexuralModulus: '1,500–2,500 MPa',
      elongationBreak: '5–20%',
      izodImpact: '30–60 J/m (notched)',
      hdt: '75–85°C (0.45 MPa) / 55–65°C (1.8 MPa)',
      mfiRange: '5.0–20 g/10min (180°C/2.16kg)',
      processingTemp: '160–185°C (narrow processing window, thermal degradation is fast)',
      shrinkage: '1.2–1.8%',
      waterAbsorption: '0.2–0.5% (24hr)',
      flammability: 'HB',
      chemicalResistance: 'Degrades rapidly in marine, soil, and industrial compost environments',
      applications: 'Marine-biodegradable packaging, agricultural mulch films, medical sutures',
      indianCompanies: 'Praj Industries (pilot scale), Truebio (re-sellers)',
    },
  },
  {
    id: 'nr',
    name: 'Natural Rubber (cis-polyisoprene)',
    abbr: 'NR',
    family: 'Natural Elastomer',
    color: '#2D6A4F',
    bg: '#E8F0E8',
    type: 'elastomer',
    properties: {
      density: '0.92–0.93 g/cm³',
      tg: '−70°C',
      tm: 'No distinct Tm (crystallizes on stretching)',
      tensileStrength: '20–25 MPa (unfilled gum) / 28–32 MPa (carbon black filled)',
      flexuralModulus: 'Not applicable — Shore A hardness 30–80 (vulcanized)',
      elongationBreak: '500–800%',
      izodImpact: 'Very high — does not break (elastic)',
      hdt: 'Not applicable — continuous use temperature −50 to +80°C',
      mfiRange: 'Does not apply — processability measured by Mooney Viscosity (e.g., Mooney 50)',
      processingTemp: 'Compounding at 50–90°C; Vulcanization (curing) at 140–165°C',
      shrinkage: 'Not applicable',
      waterAbsorption: '0.5–1.0%',
      flammability: 'HB (burns with strong odour)',
      chemicalResistance: 'Good to dilute acids, alkalis; Poor to petroleum oils, solvents, ozone',
      applications: 'Tyre treads, engine mounts, rubber bands, conveyor belts, footwear, latex gloves',
      indianCompanies: 'MRF Tyres, Apollo Tyres, CEAT Tyres, Harrisons Malayalam',
    },
  },
  {
    id: 'sbr',
    name: 'Styrene Butadiene Rubber',
    abbr: 'SBR',
    family: 'Synthetic Elastomer',
    color: '#2D6A4F',
    bg: '#E8F0E8',
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
    color: '#2D6A4F',
    bg: '#E8F0E8',
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
        className={`w-full text-left border-4 border-ink p-5 transition-all bg-white select-none ${
          selected
            ? 'shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
            : 'border-dashed shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:border-ink'
        }`}
      >
        {selected ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-ink flex items-center justify-center flex-shrink-0 font-mono font-black text-sm" style={{ backgroundColor: selected.bg, color: selected.color }}>
              {selected.abbr}
            </div>
            <div>
              <div className="font-display font-black text-ink">{selected.name}</div>
              <div className="font-mono text-[10px] text-ink/50 uppercase tracking-widest">{selected.family}</div>
            </div>
            <ChevronDown className={`w-5 h-5 text-ink ml-auto transition-transform ${open ? 'rotate-180' : ''}`} />
          </div>
        ) : (
          <div className="flex items-center gap-3 text-ink/40">
            <div className="w-10 h-10 border-2 border-dashed border-ink/30 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-black text-sm">{label}</div>
              <div className="font-mono text-[10px] uppercase tracking-wider">Click to select</div>
            </div>
            <ChevronDown className="w-5 h-5 ml-auto" />
          </div>
        )}
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-canvas border-4 border-ink shadow-hard z-20 overflow-hidden max-h-80 overflow-y-auto">
          {types.map((type) => {
            const group = POLYMERS.filter((p) => p.type === type && p.id !== exclude)
            if (group.length === 0) return null
            return (
              <div key={type}>
                <div className="px-4 py-2 font-mono text-[9px] font-black text-ink/50 uppercase tracking-widest bg-yellow-bright border-b-2 border-ink">
                  {TYPE_LABELS[type]}
                </div>
                {group.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { onChange(p); setOpen(false) }}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 border-b-2 border-ink/10 last:border-0 transition-colors"
                  >
                    <div className="w-8 h-8 border-2 border-ink flex items-center justify-center font-mono text-[10px] font-bold flex-shrink-0" style={{ backgroundColor: p.bg, color: p.color }}>
                      {p.abbr}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-ink">{p.name}</div>
                      <div className="font-mono text-[9px] text-ink/40">{p.family}</div>
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
    <div className="min-h-screen bg-canvas pb-16">

      {/* Hero */}
      <section className="border-b-4 border-ink bg-yellow-bright px-6 md:px-12 py-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-ink border-4 border-ink flex items-center justify-center">
                <Scale className="w-5 h-5 text-yellow-bright" />
              </div>
              <span className="font-mono text-[10px] font-black text-ink border-2 border-ink px-3 py-1 uppercase tracking-widest bg-white">
                Comparator
              </span>
              <span className="font-mono text-[10px] font-black border-2 border-ink bg-ink text-yellow-bright px-3 py-1 uppercase tracking-widest">
                20 POLYMERS MAPPED
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-black text-ink leading-none uppercase">
              COMPARE POLYMER<br />
              <span className="italic">PROPERTIES SIDE BY SIDE</span>
            </h1>
          </div>
          <div className="max-w-md text-left md:text-right">
            <p className="text-sm font-bold text-ink/70 leading-relaxed">
              Property data drawn from the Brandrup Polymer Handbook and Plastics Technology Handbook. Select two materials to begin.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* Selector row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
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
          <div className="flex items-center justify-between mb-8 pb-3 border-b-2 border-ink/10">
            <button
              onClick={() => setShowAll(!showAll)}
              className="font-mono text-[10px] font-black border-2 border-ink px-3.5 py-2 uppercase bg-yellow-bright text-ink tracking-wider hover:bg-ink hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
            >
              {showAll ? 'Show key properties' : 'Show all 15 properties'}
            </button>
            <button
              onClick={reset}
              className="font-mono text-[10px] font-black border-2 border-ink px-3.5 py-2 uppercase bg-white text-ink tracking-wider hover:bg-ink hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        )}

        {/* Comparison table */}
        {canCompare && (
          <div className="space-y-4 animate-fadeIn">

            {/* Header */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div />
              <div className="bg-canvas border-4 border-ink p-5 text-center shadow-hard" style={{ boxShadow: `4px 4px 0px 0px ${polymerA.color}` }}>
                <div className="font-mono font-black text-2xl mb-1" style={{ color: polymerA.color }}>{polymerA.abbr}</div>
                <div className="font-display text-base font-black text-ink leading-tight">{polymerA.name}</div>
                <div className="font-mono text-[9px] font-bold text-ink/40 mt-1 uppercase tracking-widest">{polymerA.family}</div>
              </div>
              <div className="bg-canvas border-4 border-ink p-5 text-center shadow-hard" style={{ boxShadow: `4px 4px 0px 0px ${polymerB.color}` }}>
                <div className="font-mono font-black text-2xl mb-1" style={{ color: polymerB.color }}>{polymerB.abbr}</div>
                <div className="font-display text-base font-black text-ink leading-tight">{polymerB.name}</div>
                <div className="font-mono text-[9px] font-bold text-ink/40 mt-1 uppercase tracking-widest">{polymerB.family}</div>
              </div>
            </div>

            {/* Property rows */}
            {visibleProps.map((prop) => (
              <div
                key={prop.key}
                className="grid grid-cols-3 gap-4"
              >
                {/* Prop name */}
                <div className={`flex items-center gap-2.5 px-4 py-3 border-2 border-ink ${prop.highlight ? 'bg-yellow-bright' : 'bg-slate-50'}`}>
                  <span className="text-lg flex-shrink-0">{prop.icon}</span>
                  <span className="font-mono text-[10px] font-black uppercase tracking-wider text-ink">
                    {prop.label}
                  </span>
                </div>
                {/* Polymer A prop value */}
                <div className="bg-canvas border-2 border-ink px-4 py-3 flex items-center">
                  <p className="text-xs text-ink leading-relaxed font-bold">{polymerA.properties[prop.key]}</p>
                </div>
                {/* Polymer B prop value */}
                <div className="bg-canvas border-2 border-ink px-4 py-3 flex items-center">
                  <p className="text-xs text-ink leading-relaxed font-bold">{polymerB.properties[prop.key]}</p>
                </div>
              </div>
            ))}

            <p className="font-mono text-[9px] text-ink/40 pt-4 text-right uppercase tracking-wider">
              Source: Brandrup, Immergut & Grulke — Polymer Handbook · Chanda — Plastics Technology Handbook
            </p>
          </div>
        )}

        {/* Empty state */}
        {!polymerA && !polymerB && (
          <div className="border-4 border-ink p-12 text-center shadow-hard bg-white">
            <Scale className="w-10 h-10 mx-auto mb-4 text-ink/40" />
            <div className="font-display text-2xl font-black text-ink mb-2">Comparator Engine Offline</div>
            <p className="text-ink/60 max-w-sm mx-auto font-mono text-xs">
              Select two polymer grades above to compare Glass Transition (Tg), Melting Point (Tm), mechanical strength, and chemical resistances.
            </p>
          </div>
        )}

        {polymerA && !polymerB && (
          <div className="border-4 border-ink p-8 text-center bg-slate-50 border-dashed">
            <p className="font-mono text-sm text-ink/60 font-bold uppercase tracking-wider">
              Now select a second polymer to compare against {polymerA.abbr}...
            </p>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <section className="border-t-4 border-ink bg-yellow-bright px-6 md:px-12 py-10 mt-16">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-ink" />
              <span className="font-mono text-[10px] font-black text-ink uppercase tracking-widest">
                Materials Database
              </span>
            </div>
            <p className="font-display text-2xl font-black text-ink leading-tight">
              Explore full material profiles and supplier data.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto flex-shrink-0">
            <Link
              href="/materials"
              className="cn-btn-black text-center text-xs py-3 px-5 flex items-center justify-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" /> Materials Database
            </Link>
            <Link
              href="/resources"
              className="cn-btn bg-white text-ink text-center text-xs py-3 px-5 flex items-center justify-center gap-1.5"
            >
              <Scale className="w-4 h-4" /> Reference Library
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}