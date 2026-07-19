// scripts/seedLessons_rheology.js
// Seeds Polymer Rheology subject with 6 deep lessons
// Run: node scripts/seedLessons_rheology.js

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const { GoogleGenerativeAI } = require('@google/generative-ai')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

const SUBJECT = {
  name: 'Polymer Rheology',
  slug: 'polymer-rheology',
  description: 'The science of polymer melt flow — viscosity, viscoelasticity, shear-thinning behavior, die swell, and melt fracture. Essential for understanding and troubleshooting all polymer processing operations.',
  color: '#7C3AED',
  order_index: 11,
}

const LESSONS = [
  {
    order_index: 1,
    title: 'Introduction to Rheology — Why Polymer Melts Flow Differently',
    slug: 'introduction-to-rheology-polymer-melts',
    summary: 'Newtonian vs non-Newtonian fluids, viscosity definition, and why understanding melt flow is essential for every processing engineer.',
    gate_relevant: true,
  },
  {
    order_index: 2,
    title: 'Shear-Thinning and the Power Law Model',
    slug: 'shear-thinning-power-law-model',
    summary: 'How polymer viscosity decreases with shear rate, the power law (Ostwald-de Waele) model, flow behavior index n, and practical implications for injection moulding and extrusion.',
    gate_relevant: true,
  },
  {
    order_index: 3,
    title: 'Viscoelasticity — The Memory of Polymer Melts',
    slug: 'viscoelasticity-polymer-melt-memory',
    summary: 'Elastic recovery, die swell (Barus effect), Weissenberg effect, Maxwell and Kelvin-Voigt models, and why polymer melts behave like both liquids and solids.',
    gate_relevant: true,
  },
  {
    order_index: 4,
    title: 'Capillary Rheometry and Viscosity Measurement',
    slug: 'capillary-rheometry-viscosity-measurement',
    summary: 'How capillary rheometers measure viscosity at processing shear rates, Rabinowitsch correction, Bagley correction, and interpreting viscosity curves for material selection.',
    gate_relevant: true,
  },
  {
    order_index: 5,
    title: 'Melt Fracture, Sharkskin, and Flow Instabilities',
    slug: 'melt-fracture-sharkskin-flow-instabilities',
    summary: 'Flow instabilities in extrusion — sharkskin, gross melt fracture, slip-stick oscillation — their causes, critical shear stress values, and industrial solutions.',
    gate_relevant: false,
  },
  {
    order_index: 6,
    title: 'Rheology in Practice — Selecting and Processing Polymer Grades',
    slug: 'rheology-in-practice-selecting-processing-grades',
    summary: 'Using rheological data for grade selection, how MFI relates to the viscosity curve, time-temperature superposition, WLF equation, and practical processing window determination.',
    gate_relevant: false,
  },
]

const LESSON_PROMPT = (lesson, subjectName) => `You are an expert polymer engineering educator writing for Indian B.Tech PPE students at CIPET and similar institutions.

Write a DEEP, COMPREHENSIVE lesson on: "${lesson.title}"
Subject: ${subjectName}
Summary: ${lesson.summary}

REQUIRED STRUCTURE (follow exactly, use markdown):

# ${lesson.title}

## Learning Objectives
List 4-5 specific, measurable objectives starting with action verbs (calculate, explain, differentiate, apply).

## Introduction
2-3 paragraphs giving industrial context. Connect to real processing scenarios. Mention Indian industry where relevant (Reliance, Supreme Industries, CIPET, etc.).

## Core Concept
Main technical explanation. Use clear headings (##, ###). Explain the physics/chemistry deeply. Use real values and data.

## Mathematical Foundation
Include ALL relevant equations with:
- Variable definitions
- Units
- Typical values for common polymers (PP, HDPE, ABS, PC, Nylon)
- At least ONE fully worked numerical example with step-by-step solution

## Key Polymer Data Table
A markdown table with data for at least 4 common polymers relevant to this topic.

## Industrial Application
Real case study from Indian or global plastics industry. Specific machine settings, polymer grades, and outcomes.

## Common Mistakes and Misconceptions
3-5 things students and operators get wrong. Correct each one clearly.

## GATE Previous Year Connection
2-3 sample GATE-style questions on this topic with complete solutions. Mark them as GATE-style.

## Standards Reference
Relevant ASTM, ISO, or BIS standards for this topic with brief explanation of what each covers.

## Key Takeaways
5-7 bullet points summarizing the most important concepts.

WRITING RULES:
- Minimum 2500 words
- Use real technical values (not vague ranges)
- Include Indian industry examples
- All equations must be complete and correct
- Tables must have real data from polymer handbooks
- Write for students preparing for both industry and GATE exam
- No fluff, no padding — every sentence must add value`

async function generateLesson(lesson, subjectName) {
  console.log(`   🤖 Generating: ${lesson.title}...`)
  const result = await model.generateContent(LESSON_PROMPT(lesson, subjectName))
  return result.response.text()
}

async function seed() {
  console.log('\n🚀 PolymerHub — Seeding Polymer Rheology\n')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  // Upsert subject
  const { data: subject, error: subjectError } = await supabase
    .from('subjects')
    .upsert({
      name: SUBJECT.name,
      slug: SUBJECT.slug,
      description: SUBJECT.description,
      color: SUBJECT.color,
      order_index: SUBJECT.order_index,
    }, { onConflict: 'slug' })
    .select()
    .single()

  if (subjectError) { console.error('❌ Subject error:', subjectError.message); process.exit(1) }
  console.log(`✅ Subject: ${SUBJECT.name} (ID: ${subject.id})\n`)

  for (const lesson of LESSONS) {
    console.log(`[${lesson.order_index}/${LESSONS.length}] ${lesson.title}`)

    // Check if exists
    const { data: existing } = await supabase.from('lessons').select('id').eq('slug', lesson.slug).single()
    if (existing) { console.log('   ⏭️  Already exists — skipping\n'); continue }

    const content = await generateLesson(lesson, SUBJECT.name)

    const { error } = await supabase.from('lessons').insert({
      subject_id: subject.id,
      title: lesson.title,
      slug: lesson.slug,
      summary: lesson.summary,
      content,
      order_index: lesson.order_index,
      is_premium: lesson.order_index > 2,
    })

    if (error) { console.error(`   ❌ Error: ${error.message}\n`); continue }
    console.log(`   ✅ Saved (${content.length} chars)\n`)
    await new Promise(r => setTimeout(r, 2000))
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('✅ Polymer Rheology seeding complete!\n')
}

seed().catch(err => { console.error('Fatal:', err); process.exit(1) })
