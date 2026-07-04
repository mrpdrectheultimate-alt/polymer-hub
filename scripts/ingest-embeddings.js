// scripts/ingest-embeddings.js
// Chunks all lessons, generates OpenAI embeddings, stores in lesson_embeddings (pgvector)
// Safe to re-run anytime lessons are added/updated — wipes and rebuilds all embeddings.
// Run with: node scripts/ingest-embeddings.js

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const EMBEDDING_MODEL = 'text-embedding-3-small'; // 1536 dimensions — matches schema
const CHUNK_WORD_SIZE = 300; // words per chunk
const CHUNK_OVERLAP_WORDS = 40; // overlap so context isn't lost at chunk boundaries

// ─── Helper: split markdown content into overlapping word-based chunks ────────
function chunkText(text, chunkSize = CHUNK_WORD_SIZE, overlap = CHUNK_OVERLAP_WORDS) {
  // Strip markdown code fences and excessive whitespace for cleaner embedding input
  const cleaned = text
    .replace(/```[\s\S]*?```/g, (match) => match.replace(/```/g, '')) // keep code content, drop fences
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const words = cleaned.split(/\s+/);
  const chunks = [];

  if (words.length <= chunkSize) {
    return [cleaned];
  }

  let start = 0;
  while (start < words.length) {
    const end = Math.min(start + chunkSize, words.length);
    chunks.push(words.slice(start, end).join(' '));
    if (end === words.length) break;
    start += chunkSize - overlap;
  }

  return chunks;
}

// ─── Helper: sleep to respect rate limits ──────────────────────────────────────
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ─── Main ingestion function ───────────────────────────────────────────────────
async function ingestEmbeddings() {
  console.log('🚀 PolymerHub — Embedding Ingestion Pipeline\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // 1. Validate environment
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY ||
    !process.env.OPENAI_API_KEY
  ) {
    console.error('❌ Missing required environment variables.');
    console.error('   Need: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY');
    process.exit(1);
  }

  // 2. Fetch all lessons
  console.log('📚 Fetching all lessons from Supabase...');
  const { data: lessons, error: lessonError } = await supabase
    .from('lessons')
    .select('id, title, content, subject_id')
    .order('order_index');

  if (lessonError) {
    console.error('❌ Failed to fetch lessons:', lessonError.message);
    process.exit(1);
  }

  console.log(`   Found ${lessons.length} lessons.\n`);

  if (lessons.length === 0) {
    console.error('❌ No lessons found. Run lesson seed scripts first.');
    process.exit(1);
  }

  // 3. Clear existing embeddings (full rebuild — safest approach when content has changed)
  console.log('🗑️  Clearing existing embeddings for a clean rebuild...');
  const { error: deleteError } = await supabase
    .from('lesson_embeddings')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // delete all rows

  if (deleteError) {
    console.error('❌ Failed to clear old embeddings:', deleteError.message);
    process.exit(1);
  }
  console.log('   Cleared.\n');

  // 4. Process each lesson: chunk -> embed -> insert
  let totalChunks = 0;
  let totalTokensEstimate = 0;

  for (let i = 0; i < lessons.length; i++) {
    const lesson = lessons[i];
    const chunks = chunkText(lesson.content);

    console.log(`[${i + 1}/${lessons.length}] "${lesson.title}"`);
    console.log(`   → ${chunks.length} chunk(s)`);

    for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
      const chunkContent = chunks[chunkIndex];

      // Prepend lesson title for better semantic context in each chunk
      const embeddingInput = `${lesson.title}\n\n${chunkContent}`;

      try {
        const response = await openai.embeddings.create({
          model: EMBEDDING_MODEL,
          input: embeddingInput,
        });

        const embedding = response.data[0].embedding;
        totalTokensEstimate += response.usage?.total_tokens || 0;

        const { error: insertError } = await supabase
          .from('lesson_embeddings')
          .insert({
            lesson_id: lesson.id,
            chunk_text: chunkContent,
            embedding,
            chunk_index: chunkIndex,
          });

        if (insertError) {
          console.error(`   ❌ Failed to insert chunk ${chunkIndex}:`, insertError.message);
          continue;
        }

        totalChunks++;

        // Respect OpenAI rate limits — small delay between calls
        await sleep(150);
      } catch (err) {
        console.error(`   ❌ Embedding API error on chunk ${chunkIndex}:`, err.message);
        // Wait longer on error (likely rate limit) then continue
        await sleep(2000);
      }
    }

    console.log(`   ✅ Done\n`);
  }

  // 5. Summary
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ EMBEDDING INGESTION COMPLETE\n');
  console.log(`📊 Lessons processed:     ${lessons.length}`);
  console.log(`📊 Total chunks embedded: ${totalChunks}`);
  console.log(`📊 Estimated tokens used: ~${totalTokensEstimate.toLocaleString()}`);
  console.log(`📊 Estimated cost:        ~$${((totalTokensEstimate / 1_000_000) * 0.02).toFixed(4)} (text-embedding-3-small @ $0.02/1M tokens)`);
  console.log('\n🎯 The AI tutor can now retrieve content from all lessons via match_lesson_chunks().');
  console.log('   Test it by asking a question about any of the 30 lessons.\n');
}

ingestEmbeddings().catch((err) => {
  console.error('❌ Fatal error during ingestion:', err);
  process.exit(1);
});
