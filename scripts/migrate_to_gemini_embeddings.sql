-- migrate_to_gemini_embeddings.sql
-- Switches lesson_embeddings from 1536-dim → 768-dim (Gemini gemini-embedding-001)
-- Safe to re-run: uses DROP IF EXISTS throughout.
-- Run ONLY this file in Supabase SQL Editor, then run: node scripts/ingest-embeddings-gemini.js

-- ── 1. Enable pgvector ────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS vector;

-- ── 2. Recreate lesson_embeddings with 768-dim column ─────────────────────────
-- Drop and rebuild cleanly so there's no dimension mismatch
DROP TABLE IF EXISTS lesson_embeddings;

CREATE TABLE lesson_embeddings (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id   uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  chunk_text  text NOT NULL,
  chunk_index int  NOT NULL DEFAULT 0,
  embedding   vector(768),
  created_at  timestamptz DEFAULT now()
);

-- ── 3. IVFFlat index for fast cosine similarity search ────────────────────────
CREATE INDEX lesson_embeddings_embedding_idx
  ON lesson_embeddings
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- ── 4. Recreate match_lesson_chunks RPC (768-dim) ─────────────────────────────
DROP FUNCTION IF EXISTS match_lesson_chunks(vector, float, int);

CREATE OR REPLACE FUNCTION match_lesson_chunks(
  query_embedding  vector(768),
  match_threshold  float,
  match_count      int
)
RETURNS TABLE (
  id          uuid,
  lesson_id   uuid,
  chunk_text  text,
  chunk_index int,
  similarity  float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    le.id,
    le.lesson_id,
    le.chunk_text,
    le.chunk_index,
    1 - (le.embedding <=> query_embedding) AS similarity
  FROM lesson_embeddings le
  WHERE 1 - (le.embedding <=> query_embedding) > match_threshold
  ORDER BY le.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- ── 5. Row Level Security (open read — embeddings are not sensitive) ───────────
ALTER TABLE lesson_embeddings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Embeddings readable by all" ON lesson_embeddings;
CREATE POLICY "Embeddings readable by all"
  ON lesson_embeddings FOR SELECT
  USING (true);

-- Done. Run: node scripts/ingest-embeddings-gemini.js
