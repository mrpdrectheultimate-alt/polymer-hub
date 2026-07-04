// scripts/ingest-embeddings-gemini.js
// Chunks all lessons, generates Gemini embeddings, stores in pgvector
// Run with: node scripts/ingest-embeddings-gemini.js
//
// PREREQUISITE: Run migrate_to_gemini_embeddings.sql in Supabase SQL Editor FIRST
// (switches the embedding column from 1536-dim to 768-dim)

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Use 'gemini-embedding-001' as 'text-embedding-004' is deprecated/retired.
const embeddingModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });

const CHUNK_WORD_SIZE = 300;
const CHUNK_OVERLAP_WORDS = 40;

// ─── Helper: split markdown content into overlapping word-based chunks ────────
function chunkText(text, chunkSize = CHUNK_WORD_SIZE, overlap = CHUNK_OVERLAP_WORDS) {
  const cleaned = text
    .replace(/```[\s\S]*?```/g, (match) => match.replace(/```/g, ''))
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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ─── Main ingestion function ───────────────────────────────────────────────────
async function ingestEmbeddings() {
  console.log('🚀 PolymerHub — Gemini Embedding Ingestion Pipeline\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY ||
    !process.env.GEMINI_API_KEY
  ) {
    console.error('❌ Missing required environment variables.');
    console.error('   Need: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY');
    process.exit(1);
  }

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

  console.log('🗑️  Clearing existing embeddings for a clean rebuild...');
  const { error: deleteError } = await supabase
    .from('lesson_embeddings')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (deleteError) {
    console.error('❌ Failed to clear old embeddings:', deleteError.message);
    process.exit(1);
  }
  console.log('   Cleared.\n');

  let totalChunks = 0;
  let failedChunks = 0;

  for (let i = 0; i < lessons.length; i++) {
    const lesson = lessons[i];
    const chunks = chunkText(lesson.content);

    console.log(`[${i + 1}/${lessons.length}] "${lesson.title}"`);
    console.log(`   → ${chunks.length} chunk(s)`);

    for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
      const chunkContent = chunks[chunkIndex];
      const embeddingInput = `${lesson.title}\n\n${chunkContent}`;

      try {
        const result = await embeddingModel.embedContent({
          content: { parts: [{ text: embeddingInput }] },
          outputDimensionality: 768,
        });
        const embedding = result.embedding.values; // 768-dim array

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
          failedChunks++;
          continue;
        }

        totalChunks++;

        // Gemini free tier: stay well under rate limits (15 RPM on some tiers)
        await sleep(300);
      } catch (err) {
        console.error(`   ❌ Embedding API error on chunk ${chunkIndex}:`, err.message);
        failedChunks++;
        await sleep(3000);
      }
    }

    console.log(`   ✅ Done\n`);
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ EMBEDDING INGESTION COMPLETE\n');
  console.log(`📊 Lessons processed:     ${lessons.length}`);
  console.log(`📊 Total chunks embedded: ${totalChunks}`);
  if (failedChunks > 0) {
    console.log(`⚠️  Failed chunks:        ${failedChunks} (re-run script to retry — upsert-safe)`);
  }
  console.log(`📊 Cost:                  $0.00 (Gemini free tier)`);
  console.log('\n🎯 The AI tutor can now retrieve content from all lessons via match_lesson_chunks().');
  console.log('   Test it by asking a question about any of the 30 lessons.\n');
}

ingestEmbeddings().catch((err) => {
  console.error('❌ Fatal error during ingestion:', err);
  process.exit(1);
});
