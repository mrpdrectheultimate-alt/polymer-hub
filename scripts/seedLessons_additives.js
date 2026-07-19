// scripts/seedLessons_additives.js
// Seeds Additives & Compounding subject — 8 deep lessons
// Run: node scripts/seedLessons_additives.js

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const { GoogleGenerativeAI } = require('@google/generative-ai')

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

const SUBJECT = {
  name: 'Additives & Compounding',
  slug: 'additives-compounding',
  description: 'The science and industry of polymer additive systems — antioxidants, plasticizers, flame retardants, UV stabilizers, impact modifiers, nucleating agents, and twin-screw compounding. 70% of polymer properties come from additives.',
  color: '#EA580C',
  order_index: 12,
}

const LESSONS = [
  { order_index: 1, title: 'Introduction to Polymer Additives — Why Pure Polymers Are Unusable', slug: 'introduction-polymer-additives', summary: 'Why every commercial polymer formulation contains additives, the additive market in India, classification of additives by function, and the compounding process overview.', gate_relevant: false },
  { order_index: 2, title: 'Antioxidants — Protecting Polymers from Thermal and Oxidative Degradation', slug: 'antioxidants-polymer-stabilization', summary: 'Primary antioxidants (hindered phenols), secondary antioxidants (phosphites, thiosynergists), mechanism of oxidative degradation, and selection guidelines for polyolefins and engineering plastics.', gate_relevant: true },
  { order_index: 3, title: 'UV Stabilizers — HALS, Benzophenones, and Benzotriazoles', slug: 'uv-stabilizers-hals-benzotriazoles', summary: 'Mechanisms of UV degradation, UV absorbers vs. HALS mechanism, selection for outdoor applications, Indian applications in agricultural film and automotive exterior parts.', gate_relevant: false },
  { order_index: 4, title: 'Plasticizers — Flexibility by Design', slug: 'plasticizers-flexibility-pvc', summary: 'Primary vs. secondary plasticizers, DEHP and its alternatives (ATBC, DINP, TOTM), plasticizer selection for PVC, medical vs. industrial grade, and the REACH regulatory landscape.', gate_relevant: true },
  { order_index: 5, title: 'Flame Retardants — Making Plastics Safe', slug: 'flame-retardants-polymer-safety', summary: 'Halogenated vs. non-halogenated FR systems, intumescent systems, mineral hydroxides (ATH, MDH), mechanism of action, UL94 flammability ratings, and RoHS/REACH compliance.', gate_relevant: false },
  { order_index: 6, title: 'Impact Modifiers and Toughening Agents', slug: 'impact-modifiers-toughening-agents', summary: 'Core-shell rubber particles, MBS, ABS, EPDM toughening of PP, mechanism of rubber toughening, cavitation and crazing, and selection for PVC, nylon, and engineering plastics.', gate_relevant: true },
  { order_index: 7, title: 'Fillers, Nucleating Agents, and Processing Aids', slug: 'fillers-nucleating-agents-processing-aids', summary: 'Talc, calcium carbonate, wollastonite as functional fillers; nucleating agents for PP crystallization speed; fluoropolymer processing aids for reducing melt fracture.', gate_relevant: false },
  { order_index: 8, title: 'Twin-Screw Compounding — Masterbatch and Compound Manufacturing', slug: 'twin-screw-compounding-masterbatch', summary: 'Co-rotating twin-screw extruder design, mixing elements, screw configuration for different compounds, masterbatch let-down ratios, inline quality control, and the Indian masterbatch industry (₹12,000 crore market).', gate_relevant: false },
]

const LESSON_PROMPT = (lesson, subjectName) => `You are an expert polymer engineering educator writing for Indian B.Tech PPE students.

Write a DEEP, COMPREHENSIVE lesson: "${lesson.title}"
Subject: ${subjectName}
Summary: ${lesson.summary}

REQUIRED STRUCTURE (markdown):

# ${lesson.title}

## Learning Objectives
4-5 specific measurable objectives.

## Introduction
Industrial context. Indian market data. Real applications.

## Core Concept
Deep technical explanation with mechanisms, chemistry, and physics.

## Mathematical Foundation
All relevant equations with worked examples. Include loading calculations, let-down ratios, or performance predictions as relevant.

## Additive Selection Table
Markdown table: Additive | Polymer | Loading (phr) | Function | Indian Trade Name | Supplier

## Industrial Case Study
Specific formulation used in Indian industry (agricultural film, automotive, packaging, etc.) with actual additive loadings.

## Regulatory and Safety Considerations
REACH, RoHS, food contact, BIS regulations relevant to this additive class.

## Common Mistakes
3-5 formulation or processing mistakes with corrections.

## GATE-Style Questions
2-3 sample questions with solutions.

## Key Takeaways
5-7 bullet points.

RULES: Min 2500 words. Real data. Indian examples. All equations complete and correct.`

async function seed() {
  console.log('\n🚀 Seeding Additives & Compounding\n')
  const { data: subject, error } = await supabase.from('subjects').upsert({ name: SUBJECT.name, slug: SUBJECT.slug, description: SUBJECT.description, color: SUBJECT.color, order_index: SUBJECT.order_index }, { onConflict: 'slug' }).select().single()
  if (error) { console.error('❌', error.message); process.exit(1) }
  console.log(`✅ Subject created: ${subject.id}\n`)
  for (const lesson of LESSONS) {
    console.log(`[${lesson.order_index}/${LESSONS.length}] ${lesson.title}`)
    const { data: existing } = await supabase.from('lessons').select('id').eq('slug', lesson.slug).single()
    if (existing) { console.log('   ⏭️  Skipping\n'); continue }
    const result = await model.generateContent(LESSON_PROMPT(lesson, SUBJECT.name))
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
  console.log('✅ Additives & Compounding complete!\n')
}
seed().catch(err => { console.error(err); process.exit(1) })
