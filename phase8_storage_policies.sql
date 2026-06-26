-- =============================================================================
-- Phase 8 — Storage RLS policies for the "pamphlets" bucket.
-- Run this in the Supabase SQL Editor.
--
-- Marking a bucket "Public" only makes files publicly READABLE by URL. Uploading
-- a file is an INSERT into storage.objects, which is still blocked by row-level
-- security until a policy allows it — hence:
--   "new row violates row-level security policy"
-- These policies let logged-in admins upload/replace/delete, and let anyone read.
-- =============================================================================

-- Public can read files in the pamphlets bucket (download / <img src>).
DROP POLICY IF EXISTS "pamphlets public read" ON storage.objects;
CREATE POLICY "pamphlets public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'pamphlets');

-- Authenticated users (admins) can upload.
DROP POLICY IF EXISTS "pamphlets authenticated insert" ON storage.objects;
CREATE POLICY "pamphlets authenticated insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'pamphlets');

-- Authenticated users can overwrite/replace.
DROP POLICY IF EXISTS "pamphlets authenticated update" ON storage.objects;
CREATE POLICY "pamphlets authenticated update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'pamphlets')
  WITH CHECK (bucket_id = 'pamphlets');

-- Authenticated users can delete.
DROP POLICY IF EXISTS "pamphlets authenticated delete" ON storage.objects;
CREATE POLICY "pamphlets authenticated delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'pamphlets');
