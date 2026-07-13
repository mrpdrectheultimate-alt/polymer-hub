// scripts/seedQuizzes.js
// Generates 5 MCQ questions per lesson using Gemini AI
// Creates quiz records and seeds questions into Supabase
//
// Run: node scripts/seedQuizzes.js
// Prerequisites: npm install @supabase/supabase-js @google/generative-ai

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const { GoogleGenerativeAI } = require('@google/generative-ai')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

// ─── Generate 5 MCQs for a lesson ────────────────────────────────────────────

async function generateQuestions(lesson, subjectName) {
  const prompt = `You are an expert polymer engineering educator for Indian B.Tech PPE students.

Generate exactly 5 MCQ questions for this lesson. Mix difficulty: 2 easy, 2 medium, 1 hard.

LESSON TITLE: ${lesson.title}
SUBJECT: ${subjectName}
LESSON SUMMARY: ${lesson.summary}
LESSON CONTENT (first 2000 chars): ${(lesson.content || '').slice(0, 2000)}

Return ONLY a valid JSON array with exactly 5 objects. No markdown, no backticks, no preamble.
Each object must have these exact keys:
{
  "question_text": "The question text here",
  "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
  "correct_index": 0,
  "explanation": "Why this answer is correct, with technical detail",
  "difficulty": "easy"
}

Rules:
- correct_index must be 0, 1, 2, or 3 (0-based index into options array)
- questions must be based ONLY on the lesson content provided
- explanations must be 30-60 words, technically accurate
- options must all be plausible (no obviously wrong answers)
- difficulty: 2 "easy", 2 "medium", 1 "hard"
- DO NOT include the correct answer letter in the question text`

  try {
    const result = await model.generateContent(prompt)
    let text = result.response.text().trim()

    // Clean up any markdown formatting
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    // Extract JSON array
    const start = text.indexOf('[')
    const end = text.lastIndexOf(']') + 1
    if (start === -1 || end === 0) throw new Error('No JSON array found in response')

    const questions = JSON.parse(text.slice(start, end))

    // Validate
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Invalid questions array')
    }

    return questions.slice(0, 5) // Max 5
  } catch (err) {
    console.error(`  ⚠️  Generation failed: ${err.message}`)
    return null
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seedAllQuizzes() {
  console.log('\n🚀 PolymerHub — Quiz Auto-Generation\n')
  console.log('Generating 5 MCQs per lesson × 60 lessons = 300 questions\n')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.GEMINI_API_KEY) {
    console.error('❌ Missing environment variables')
    process.exit(1)
  }

  // Fetch all lessons with subject names
  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('id, title, summary, content, order_index, subject_id, subjects(name, slug)')
    .order('subject_id')
    .order('order_index')

  if (lessonsError || !lessons) {
    console.error('❌ Failed to fetch lessons:', lessonsError?.message)
    process.exit(1)
  }

  console.log(`📚 Found ${lessons.length} lessons to process\n`)

  let totalQuizzes = 0
  let totalQuestions = 0
  let totalSkipped = 0
  let totalFailed = 0

  for (let i = 0; i < lessons.length; i++) {
    const lesson = lessons[i]
    const subjectName = lesson.subjects?.name || 'Polymer Engineering'

    console.log(`[${i + 1}/${lessons.length}] ${lesson.title.slice(0, 60)}...`)

    // Check if quiz already exists for this lesson
    const { data: existingQuiz } = await supabase
      .from('quizzes')
      .select('id')
      .eq('lesson_id', lesson.id)
      .single()

    if (existingQuiz) {
      console.log(`   ⏭️  Quiz already exists — skipping\n`)
      totalSkipped++
      continue
    }

    // Generate questions via Gemini
    process.stdout.write(`   🤖 Generating questions...`)
    const questions = await generateQuestions(lesson, subjectName)

    if (!questions || questions.length === 0) {
      console.log(` FAILED\n`)
      totalFailed++
      continue
    }

    console.log(` ${questions.length} generated`)

    // Insert quiz record
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .insert({
        lesson_id: lesson.id,
        title: `${lesson.title} — Topic Quiz`,
        passing_score: 70,
      })
      .select()
      .single()

    if (quizError || !quiz) {
      console.error(`   ❌ Quiz insert failed: ${quizError?.message}\n`)
      totalFailed++
      continue
    }

    // Insert questions
    const questionsToInsert = questions.map((q, idx) => ({
      quiz_id: quiz.id,
      question_text: q.question_text,
      options: q.options,
      correct_index: q.correct_index,
      explanation: q.explanation || 'No explanation provided.',
      difficulty: q.difficulty || 'medium',
      order_index: idx + 1,
    }))

    const { error: qError } = await supabase
      .from('quiz_questions')
      .insert(questionsToInsert)

    if (qError) {
      console.error(`   ❌ Questions insert failed: ${qError.message}\n`)
      // Delete the quiz if questions failed
      await supabase.from('quizzes').delete().eq('id', quiz.id)
      totalFailed++
      continue
    }

    console.log(`   ✅ Quiz + ${questionsToInsert.length} questions saved\n`)
    totalQuizzes++
    totalQuestions += questionsToInsert.length

    // Rate limit: 4.5 seconds between Gemini calls to avoid 429
    await new Promise(r => setTimeout(r, 4500))
  }

  // Summary
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('✅ QUIZ GENERATION COMPLETE\n')
  console.log(`📊 Quizzes created:    ${totalQuizzes}`)
  console.log(`📊 Questions seeded:   ${totalQuestions}`)
  console.log(`📊 Already existed:    ${totalSkipped}`)
  console.log(`📊 Failed:             ${totalFailed}`)
  console.log(`\n🎯 Run again to retry any failed lessons.`)
  console.log(`📝 Next: Build the quiz UI page (/quiz/[lessonSlug])\n`)
}

seedAllQuizzes().catch(err => {
  console.error('❌ Fatal error:', err)
  process.exit(1)
})
