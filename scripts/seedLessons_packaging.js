// scripts/seedLessons_packaging.js
// Seeds Plastic Packaging Engineering — 8 lessons
// Run: node scripts/seedLessons_packaging.js

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const { GoogleGenerativeAI } = require('@google/generative-ai')

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

async function generateWithRetry(prompt, retries = 5, delayMs = 45000) {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent(prompt)
      return result
    } catch (err) {
      const is429 = err.status === 429 || String(err).includes('429') || String(err).includes('quota')
      if (is429 && i < retries - 1) {
        console.warn(`   ⚠️ Rate limit (429) hit. Retrying in ${delayMs / 1000}s... (Attempt ${i + 1}/${retries})`)
        await new Promise(r => setTimeout(r, delayMs))
        continue
      }
      throw err
    }
  }
}

const SUBJECTS = [
  {
    name: 'Plastic Packaging Engineering',
    slug: 'plastic-packaging-engineering',
    description: 'The science and engineering of plastic packaging — barrier properties, flexible films, rigid packaging, multilayer structures, food contact regulations, and sustainable packaging design. Packaging represents 40% of all plastic demand.',
    color: '#15803D',
    order_index: 13,
    lessons: [
      { order_index: 1, title: 'Introduction to Plastic Packaging — The Largest Sector in Plastics', slug: 'introduction-plastic-packaging', summary: 'Global and Indian packaging market, packaging functions (protection, communication, convenience), polymer selection for packaging, and sustainability challenges. India\'s ₹3.5 lakh crore packaging market.', gate_relevant: false },
      { order_index: 2, title: 'Barrier Properties — OTR, WVTR, and CO2 Transmission', slug: 'barrier-properties-otr-wvtr', summary: 'Oxygen transmission rate, water vapour transmission rate, CO2 permeability — measurement methods, polymer selection for food packaging, and how crystallinity, orientation, and coatings improve barrier.', gate_relevant: true },
      { order_index: 3, title: 'Flexible Packaging Films — LDPE, LLDPE, BOPP, PET, and PA Films', slug: 'flexible-packaging-films', summary: 'Cast vs. blown film processes, biaxial orientation (BOPP, BOPET), film properties vs. process parameters, sealability, heat seal strength, and Indian film manufacturers.', gate_relevant: false },
      { order_index: 4, title: 'Multilayer Structures and Co-extrusion — Combining Polymers for Performance', slug: 'multilayer-structures-coextrusion', summary: 'Why multilayer structures, tie layer selection, common structures (PE/EVOH/PE, PA/PE, PP/EVOH/PP), blown film co-extrusion with 7-11 layers, and barrier enhancement.', gate_relevant: false },
      { order_index: 5, title: 'Rigid Packaging — PET Bottles, HDPE Containers, and PP Food Containers', slug: 'rigid-packaging-pet-hdpe-pp', summary: 'Stretch blow moulding of PET (SBM parameters, preform design), HDPE extrusion blow moulding for containers, injection moulded PP containers, and Indian beverage and FMCG packaging standards.', gate_relevant: false },
      { order_index: 6, title: 'Food Contact Regulations and Packaging Safety', slug: 'food-contact-regulations-packaging', summary: 'India\'s FSSAI food contact material regulations, EU Regulation 10/2011, FDA 21 CFR, overall migration limits, specific migration, and how to select compliant packaging polymers.', gate_relevant: false },
      { order_index: 7, title: 'Active and Intelligent Packaging', slug: 'active-intelligent-packaging', summary: 'Oxygen scavengers, moisture absorbers, antimicrobial packaging, time-temperature indicators, QR code-enabled packaging, and the Indian market for smart packaging.', gate_relevant: false },
      { order_index: 8, title: 'Sustainable Packaging Design — Mono-Materials, Recyclability, and EPR', slug: 'sustainable-packaging-design-epr', summary: 'Designing for recyclability (mono-material PE, PP), lightweighting, recycled content requirements under EPR, compostable packaging claims, and case studies from Amul, ITC, and HUL.', gate_relevant: false },
    ],
    prompt: (lesson) => `Write a DEEP packaging engineering lesson: "${lesson.title}". Summary: ${lesson.summary}

Structure:
# ${lesson.title}
## Learning Objectives (4-5 specific objectives)
## Introduction (Indian packaging market context, specific market size data)
## Core Concept (deep technical explanation)
## Mathematical Foundation (all equations with worked examples — e.g., OTR calculations, SBM stretch ratios)
## Material Performance Table (polymer | property | typical value | application)
## Indian Industry Case Study (specific company, product, and packaging choice with reasoning)
## Regulatory Requirements (FSSAI, BIS, EU, FDA as relevant)
## Common Mistakes (3-5 with corrections)
## GATE-Style Questions (2-3 with solutions)
## Key Takeaways (5-7 bullets)
Min 2500 words. Real data. Indian examples.`
  },
]

async function seedSubject(subjectDef) {
  console.log(`\n🚀 Seeding: ${subjectDef.name}\n`)
  const { data: subject, error } = await supabase.from('subjects').upsert({ name: subjectDef.name, slug: subjectDef.slug, description: subjectDef.description, color: subjectDef.color, order_index: subjectDef.order_index }, { onConflict: 'slug' }).select().single()
  if (error) { console.error('❌', error.message); return }
  console.log(`✅ Subject: ${subject.id}\n`)
  for (const lesson of subjectDef.lessons) {
    console.log(`[${lesson.order_index}/${subjectDef.lessons.length}] ${lesson.title}`)
    const { data: existing } = await supabase.from('lessons').select('id').eq('slug', lesson.slug).single()
    if (existing) { console.log('   ⏭️  Skipping\n'); continue }
    const result = await generateWithRetry(subjectDef.prompt(lesson))
    const content = result.response.text()
    const { error: le } = await supabase.from('lessons').insert({
      subject_id: subject.id,
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
  console.log(`✅ ${subjectDef.name} complete!\n`)
}

seedSubject(SUBJECTS[0]).catch(err => { console.error(err); process.exit(1) })
