-- =============================================================
-- Migration: Add vector embedding support to complaints table
-- =============================================================

-- 1. Enable pgvector extension (safe if already enabled)
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Add the embedding column for semantic duplicate detection
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS embedding VECTOR(384);

-- 3. Create an HNSW index for fast approximate-nearest-neighbor searches
--    (much faster than exact cosine similarity scans on large datasets)
CREATE INDEX IF NOT EXISTS idx_complaints_embedding
  ON complaints
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- 4. Grant admins RLS UPDATE access so the server-side route can write embeddings
--    (The initial schema only has INSERT for students; admins need UPDATE on all rows)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'complaints'
    AND policyname = 'Admins can update complaints'
  ) THEN
    CREATE POLICY "Admins can update complaints" ON complaints FOR UPDATE USING (
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
    );
  END IF;
END;
$$;

-- 5. Also ensure the student who owns the complaint can update it
--    (needed so the client-side complaint.service can write the embedding after insert)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'complaints'
    AND policyname = 'Students can update own complaints'
  ) THEN
    CREATE POLICY "Students can update own complaints" ON complaints FOR UPDATE USING (
      auth.uid() = student_id
    );
  END IF;
END;
$$;
