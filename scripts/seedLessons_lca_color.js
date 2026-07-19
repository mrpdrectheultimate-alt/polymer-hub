// scripts/seedLessons_lca.js — Life Cycle Assessment & Color Science
// Run: node scripts/seedLessons_lca.js

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const { GoogleGenerativeAI } = require('@google/generative-ai')

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

const LCA_SUBJECT = {
  name: 'Life Cycle Assessment',
  slug: 'life-cycle-assessment',
  description: 'The science of measuring the true environmental footprint of plastic products — from raw material extraction to end of life. ISO 14040/14044 framework, carbon footprint calculation, and how LCA drives sustainable design decisions in Indian industry.',
  color: '#15803D',
  order_index: 14,
}

const LCA_LESSONS = [
  { order_index: 1, title: 'Introduction to LCA — Measuring the True Cost of Plastic', slug: 'introduction-lca-plastic-footprint', summary: 'What is LCA, why it matters for plastic products, ISO 14040 framework overview, goal and scope definition, and Indian regulatory drivers pushing LCA adoption.' },
  { order_index: 2, title: 'Life Cycle Inventory — Quantifying Inputs and Outputs', slug: 'life-cycle-inventory-lci', summary: 'Data collection for LCI, mass and energy balances, primary vs. secondary data, ecoinvent database, Indian-specific emission factors, and system boundary decisions for plastic products.' },
  { order_index: 3, title: 'Impact Assessment — Carbon Footprint, Water, and Eutrophication', slug: 'lca-impact-assessment-categories', summary: 'Global Warming Potential (GWP100), water scarcity footprint, fossil resource depletion, eutrophication, characterization factors, and how to read an LCA report for plastic products.' },
  { order_index: 4, title: 'LCA of Packaging — Comparing Plastic vs. Alternatives', slug: 'lca-packaging-plastic-vs-alternatives', summary: 'Comparative LCA of PET bottle vs. glass vs. aluminium can, plastic bag vs. cotton bag (the 7,100 uses myth), HDPE milk pouch vs. glass bottle — real data showing where plastic wins and loses environmentally.' },
  { order_index: 5, title: 'Carbon Footprint of Polymer Production — From Naphtha to Pellet', slug: 'carbon-footprint-polymer-production', summary: 'Scope 1/2/3 emissions in polymer manufacturing, GHG intensity of PP vs. PET vs. PC vs. bio-PLA, how recycling reduces carbon footprint, and Reliance and Indian petrochemical carbon data.' },
  { order_index: 6, title: 'LCA in Practice — How Indian Companies Use It for EPR and ESG Reporting', slug: 'lca-practice-india-epr-esg', summary: 'How Tata, ITC, HUL use LCA for ESG reports, EPR footprint calculation under PWM Rules 2022, Product Environmental Footprint (PEF) for EU exports, and building LCA capability in India.' },
]

const LCA_PROMPT = (lesson) => `Write a DEEP LCA lesson: "${lesson.title}". Summary: ${lesson.summary}

Structure:
# ${lesson.title}
## Learning Objectives (4-5)
## Introduction (why this matters for plastics engineers, Indian regulatory context)
## Core Concept (ISO 14040/14044 framework, detailed methodology)
## Calculation Examples (worked examples with real emission factors and values — GWP in kgCO2eq, etc.)
## Comparative Data Table (products/materials | GWP | water | fossil | India-specific data where available)
## Indian Industry Case Study (specific company using LCA — Tata, ITC, HUL, or FMCG sector)
## Regulatory Connection (EPR, EU PPWR, GHG reporting, ESG frameworks)
## Common Mistakes (3-5 LCA interpretation errors)
## Key Takeaways (5-7 bullets)
Min 2000 words. Real emission factors. Indian examples.`

// ─── Color Science & Masterbatches ──────────────────────────────────────────

const COLOR_SUBJECT = {
  name: 'Color Science & Masterbatches',
  slug: 'color-science-masterbatches',
  description: 'The science of polymer coloration — pigment chemistry, color measurement, masterbatch formulation, let-down ratios, and the Indian masterbatch industry worth ₹12,000+ crore.',
  color: '#EA580C',
  order_index: 15,
}

const COLOR_LESSONS = [
  { order_index: 1, title: 'Introduction to Color in Plastics — Pigments vs. Dyes', slug: 'introduction-color-plastics-pigments-dyes', summary: 'Organic vs. inorganic pigments, dyes, why pigments dominate plastics, dispersibility, heat stability, light fastness ratings, and the Indian color concentrate market.' },
  { order_index: 2, title: 'Titanium Dioxide — The Most Important Pigment in Plastics', slug: 'titanium-dioxide-plastics-pigment', summary: 'Rutile vs. anatase TiO2, scattering efficiency, surface treatment, loading levels (typically 5-20% in white masterbatch), chalking in outdoor applications, and Indian suppliers.' },
  { order_index: 3, title: 'Organic Pigments — Phthalocyanines, Azo, and High-Performance Pigments', slug: 'organic-pigments-phthalocyanines-azo', summary: 'Blue/green phthalocyanines, azo yellows/oranges/reds, high-performance pigments (quinacridone, DPP, perylene), heat stability requirements vs. processing temperature, and bleed/migration.' },
  { order_index: 4, title: 'Color Measurement and Matching — Spectrophotometry and Delta E', slug: 'color-measurement-spectrophotometry-delta-e', summary: 'CIE L*a*b* color space, spectrophotometer operation, metamerism, Delta E tolerances for acceptance, standard illuminants, and practical color matching in a plastics factory.' },
  { order_index: 5, title: 'Masterbatch Formulation and Manufacturing', slug: 'masterbatch-formulation-manufacturing', summary: 'Carrier resin selection, pigment loading (20-70% in concentrate), dispersion quality (filter pressure value), twin-screw compounding for masterbatch, and let-down ratio calculation for injection moulding and film.' },
  { order_index: 6, title: 'Special Effects — Pearl, Metallic, Fluorescent, and Thermochromic', slug: 'special-effects-masterbatch-pearl-metallic', summary: 'Mica-based pearlescent pigments, aluminium flake metallic effects, fluorescent brighteners (OBAs), thermochromic and photochromic pigments, and applications in Indian consumer goods and packaging.' },
]

const COLOR_PROMPT = (lesson) => `Write a DEEP color science / masterbatch lesson: "${lesson.title}". Summary: ${lesson.summary}

Structure:
# ${lesson.title}
## Learning Objectives (4-5)
## Introduction (Indian masterbatch market, ₹12,000 crore industry context)
## Core Concept (detailed technical explanation of chemistry/physics)
## Technical Data Table (pigment/material | key property | typical value | application | Indian brand/supplier)
## Calculation Example (let-down ratio, pigment loading, or color difference calculation)
## Industrial Application (specific Indian application with actual formulation details)
## Quality Control (how to test and verify color in production — instruments, methods, standards)
## Common Mistakes (3-5 formulation/processing errors)
## Key Takeaways (5-7 bullets)
Min 2000 words. Real data. Indian industry examples.`

async function seedSubject(subject, lessons, promptFn) {
  console.log(`\n🚀 Seeding: ${subject.name}\n`)
  const { data: subj, error } = await supabase.from('subjects').upsert({ name: subject.name, slug: subject.slug, description: subject.description, color: subject.color, order_index: subject.order_index }, { onConflict: 'slug' }).select().single()
  if (error) { console.error('❌', error.message); return }
  console.log(`✅ Subject: ${subj.id}\n`)

  for (const lesson of lessons) {
    console.log(`[${lesson.order_index}/${lessons.length}] ${lesson.title}`)
    const { data: existing } = await supabase.from('lessons').select('id').eq('slug', lesson.slug).single()
    if (existing) { console.log('   ⏭️  Skipping\n'); continue }
    const result = await model.generateContent(promptFn(lesson))
    const content = result.response.text()
    const { error: le } = await supabase.from('lessons').insert({
      subject_id: subj.id,
      title: lesson.title,
      slug: lesson.slug,
      summary: lesson.summary,
      content,
      order_index: lesson.order_index,
      is_premium: lesson.order_index > 2
    })
    if (le) { console.error('   ❌', le.message); continue }
    console.log(`   ✅ ${content.length} chars\n`)
    await new Promise(r => setTimeout(r, 2000))
  }
  console.log(`✅ ${subject.name} complete!\n`)
}

async function main() {
  await seedSubject(LCA_SUBJECT, LCA_LESSONS, LCA_PROMPT)
  await seedSubject(COLOR_SUBJECT, COLOR_LESSONS, COLOR_PROMPT)
}

main().catch(err => { console.error(err); process.exit(1) })
