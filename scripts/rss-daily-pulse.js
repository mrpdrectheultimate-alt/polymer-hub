// scripts/rss-daily-pulse.js
// Pulls headlines from plastics industry RSS feeds
// Generates 2-sentence summaries via Gemini API
// Inserts as DRAFTS (is_published: false) for your review before publishing
//
// Run daily: node scripts/rss-daily-pulse.js
// Review drafts at: /admin/today (toggle is_published to true)
//
// Prerequisites:
// npm install @supabase/supabase-js @google/generative-ai rss-parser

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const { GoogleGenerativeAI } = require('@google/generative-ai')
const Parser = require('rss-parser')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
const parser = new Parser({
  timeout: 10000,
  headers: { 'User-Agent': 'PolymerHub RSS Reader 1.0' },
})

// ─── RSS Feed Sources ──────────────────────────────────────────────────────────

const FEEDS = [
  {
    name: 'Plastics News',
    url: 'https://www.plasticsnews.com/rss',
    category_default: 'Research',
    priority: 1,
  },
  {
    name: 'PlasticsToday',
    url: 'https://www.plasticstoday.com/rss.xml',
    category_default: 'Innovation',
    priority: 1,
  },
  {
    name: 'Sustainable Plastics',
    url: 'https://www.sustainableplastics.com/rss',
    category_default: 'Sustainability',
    priority: 2,
  },
  {
    name: 'Plastics Technology',
    url: 'https://www.ptonline.com/rss/articles',
    category_default: 'Research',
    priority: 2,
  },
]

// ─── Category detection from headline/content ─────────────────────────────────

function detectCategory(headline) {
  const h = headline.toLowerCase()
  if (h.includes('recycl') || h.includes('waste') || h.includes('circular') || h.includes('petase')) return 'Recycling'
  if (h.includes('bio') || h.includes('compost') || h.includes('pla') || h.includes('pha') || h.includes('bioplastic')) return 'Bioplastics'
  if (h.includes('sustain') || h.includes('epr') || h.includes('eppr') || h.includes('carbon')) return 'Sustainability'
  if (h.includes('price') || h.includes('market') || h.includes('tonne') || h.includes('resin') || h.includes('crude')) return 'Market'
  if (h.includes('india') || h.includes('cipet') || h.includes('reliance') || h.includes('supreme') || h.includes('finolex') || h.includes('astral')) return 'India'
  if (h.includes('regulat') || h.includes('policy') || h.includes('bis') || h.includes('iso') || h.includes('ban') || h.includes('eu ')) return 'Policy'
  if (h.includes('nanocompos') || h.includes('3d print') || h.includes('self-heal') || h.includes('composites') || h.includes('carbon fibre')) return 'Innovation'
  return 'Research'
}

// ─── Subject/lesson mapping from category ─────────────────────────────────────

function suggestSubject(category) {
  const map = {
    Research: 'polymer-chemistry',
    Market: 'polymer-processing',
    India: 'entrepreneurship-plastics',
    Sustainability: 'sustainable-plastics',
    Policy: 'recycling-technology',
    Innovation: 'polymer-composites',
    Recycling: 'recycling-technology',
    Bioplastics: 'sustainable-plastics',
  }
  return map[category] || null
}

// ─── Default images per category ─────────────────────────────────────────────

function getDefaultImage(category) {
  const map = {
    Research:       'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&q=80',
    Market:         'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80',
    India:          'https://images.unsplash.com/photo-1581093458791-9d58e74010a8?w=600&q=80',
    Sustainability: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&q=80',
    Policy:         'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=600&q=80',
    Innovation:     'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&q=80',
    Recycling:      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&q=80',
    Bioplastics:    'https://images.unsplash.com/photo-1569427830807-c1429cbabed9?w=600&q=80',
  }
  return map[category] || map.Research
}

// ─── Generate summary via Gemini ──────────────────────────────────────────────

async function generateSummary(headline, description, retryCount = 0) {
  const prompt = `You are writing for PolymerHub, an educational platform for Indian B.Tech Plastic Polymer Engineering students.

Summarize this industry news in exactly 2 sentences (max 60 words total):
1. What happened / what was found / what was announced
2. Why it matters for polymer engineering students or the Indian plastics industry

Keep it factual, clear, and relevant to students learning polymer engineering.

Headline: ${headline}
Description: ${description?.slice(0, 500) || 'No description available'}

Write only the 2-sentence summary. No preamble, no "Summary:", no quotes.`

  try {
    const result = await model.generateContent(prompt)
    return result.response.text().trim()
  } catch (err) {
    if (err.message.includes('429') && retryCount < 2) {
      console.log(`      ⚠️  Gemini rate limit hit. Sleeping for 15 seconds before retry ${retryCount + 1}...`)
      await new Promise(resolve => setTimeout(resolve, 15000))
      return generateSummary(headline, description, retryCount + 1)
    }
    console.error('      ⚠️  Gemini summary failed:', err.message)
    // Fallback: use first 200 chars of description
    return description
      ? description.slice(0, 200).trim() + (description.length > 200 ? '...' : '')
      : 'No summary available. Read the full article for details.'
  }
}

// ─── Check if headline already exists for today ───────────────────────────────

async function isDuplicate(headline) {
  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('daily_updates')
    .select('id')
    .eq('publish_date', today)
    .ilike('headline', `%${headline.slice(0, 50)}%`)
    .limit(1)
  return data && data.length > 0
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function runRSSPull() {
  console.log('\n🚀 PolymerHub — Daily Pulse RSS Automation\n')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.GEMINI_API_KEY) {
    console.error('❌ Missing environment variables.')
    console.error('   Need: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY')
    process.exit(1)
  }

  const today = new Date().toISOString().split('T')[0]
  let totalAdded = 0
  let totalSkipped = 0

  for (const feed of FEEDS) {
    console.log(`📡 Fetching: ${feed.name}`)
    console.log(`   URL: ${feed.url}`)

    try {
      const parsed = await parser.parseURL(feed.url)
      const items = parsed.items.slice(0, 10) // top 10 items per feed

      console.log(`   Found ${items.length} items\n`)

      for (const item of items) {
        const headline = item.title?.trim()
        if (!headline) continue

        // Skip if already in DB today
        const dup = await isDuplicate(headline)
        if (dup) {
          console.log(`   ⏭️  Skip (duplicate): ${headline.slice(0, 60)}...`)
          totalSkipped++
          continue
        }

        // Detect category from headline
        const category = detectCategory(headline)
        const subjectSlug = suggestSubject(category)

        console.log(`   📰 Processing: ${headline.slice(0, 60)}...`)
        console.log(`      Category: ${category} → Subject: ${subjectSlug || 'none'}`)

        // Generate 2-sentence summary via Gemini
        const rawDescription = item.contentSnippet || item.content || item.summary || ''
        const summary = await generateSummary(headline, rawDescription)

        // Insert as DRAFT (is_published: false — requires your review)
        const { error } = await supabase
          .from('daily_updates')
          .insert({
            headline,
            summary,
            source_name: feed.name,
            source_url: item.link || null,
            image_url: getDefaultImage(category),
            category,
            related_subject_slug: subjectSlug,
            related_lesson_slug: null, // you can add manually in admin form
            publish_date: today,
            is_published: false, // DRAFT — requires review at /admin/today
            is_featured: false,
          })

        if (error) {
          console.log(`      ❌ Insert failed: ${error.message}`)
        } else {
          console.log(`      ✅ Added as draft`)
          totalAdded++
        }

        // Rate limit padding between calls
        await new Promise((r) => setTimeout(r, 1000))
      }
    } catch (err) {
      console.error(`   ❌ Feed fetch failed: ${err.message}`)
      console.error(`   (RSS URL may be wrong or feed may be temporarily unavailable)\n`)
    }

    console.log('')
  }

  // Summary
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('✅ RSS PULL COMPLETE\n')
  console.log(`📊 Drafts added:    ${totalAdded}`)
  console.log(`📊 Duplicates skip: ${totalSkipped}`)
  console.log('\n📝 NEXT STEPS:')
  console.log('1. Go to /admin/today in your browser')
  console.log('2. Review each draft — edit summary if needed')
  console.log('3. Toggle is_published = true for stories you approve')
  console.log('4. Mark 1 story as ⭐ Featured')
  console.log('5. Done — stories are live on /today immediately\n')
}

runRSSPull().catch((err) => {
  console.error('❌ Fatal error:', err)
  process.exit(1)
})
