require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const embeddingModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });

const CHUNK_WORD_SIZE = 300;
const CHUNK_OVERLAP_WORDS = 40;

function chunkText(text, chunkSize = CHUNK_WORD_SIZE, overlap = CHUNK_OVERLAP_WORDS) {
  if (!text) return [];
  const cleaned = text
    .replace(/```[\s\S]*?```/g, (match) => match.replace(/```/g, ''))
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const words = cleaned.split(/\s+/);
  if (words.length <= chunkSize) return [cleaned];

  const chunks = [];
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

async function embedWithRetry(text, retries = 5, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await embeddingModel.embedContent({
        content: { parts: [{ text }] },
        outputDimensionality: 768,
      });
      return result.embedding.values;
    } catch (err) {
      if (err.message.includes('429') || err.message.includes('Resource exhausted') || err.message.includes('503')) {
        console.log(`   ⏳ Rate limit / 503 hit. Waiting ${delay / 1000}s before retry ${i + 1}/${retries}...`);
        await sleep(delay);
        delay *= 2;
      } else {
        // Try fallback to gemini-embedding-001 if model fails
        try {
          const fallbackModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
          const res = await fallbackModel.embedContent({ content: { parts: [{ text }] } });
          return res.embedding.values;
        } catch (e2) {
          throw err;
        }
      }
    }
  }
  throw new Error('Max retries exceeded');
}

async function safeIngestEmbeddings() {
  console.log('🚀 PolymerHub — Incremental Embedding Ingestion Pipeline\n');

  const { data: lessons, error } = await supabase.from('lessons').select('id, title, content');
  if (error || !lessons) {
    console.error('Failed to fetch lessons:', error);
    return;
  }

  // Get lessons already in lesson_embeddings
  const { data: existingEmbeddings } = await supabase.from('lesson_embeddings').select('lesson_id');
  const existingSet = new Set(existingEmbeddings?.map(e => e.lesson_id) || []);

  const unEmbeddedLessons = lessons.filter(l => !existingSet.has(l.id));
  console.log(`Total lessons: ${lessons.length}`);
  console.log(`Already embedded: ${existingSet.size}`);
  console.log(`Remaining to embed: ${unEmbeddedLessons.length}\n`);

  for (let i = 0; i < unEmbeddedLessons.length; i++) {
    const lesson = unEmbeddedLessons[i];
    const chunks = chunkText(lesson.content);
    console.log(`[${i + 1}/${unEmbeddedLessons.length}] "${lesson.title}" (${chunks.length} chunks)`);

    for (let cIdx = 0; cIdx < chunks.length; cIdx++) {
      const chunkTextContent = chunks[cIdx];
      const embeddingInput = `${lesson.title}\n\n${chunkTextContent}`;

      try {
        const embedding = await embedWithRetry(embeddingInput);
        const { error: insErr } = await supabase.from('lesson_embeddings').insert({
          lesson_id: lesson.id,
          chunk_text: chunkTextContent,
          embedding,
          chunk_index: cIdx,
        });

        if (insErr) {
          console.error(`   ❌ Failed chunk ${cIdx}:`, insErr.message);
        } else {
          console.log(`   Chunk ${cIdx + 1}/${chunks.length} embedded`);
        }
      } catch (err) {
        console.error(`   ❌ Error on chunk ${cIdx}:`, err.message);
      }
      await sleep(1000); // 1 sec delay between calls to prevent 429
    }
  }

  console.log('\n✅ Incremental Embedding Ingestion Finished!');
}

safeIngestEmbeddings();
