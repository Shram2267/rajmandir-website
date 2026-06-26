-- =============================================================================
-- Phase 7 migration — block-based pamphlet page builder.
-- Run this in the Supabase SQL Editor. (Supersedes the earlier grid model.)
--
-- One row per zone. `blocks` is an ordered JSON array the admin arranges freely.
-- Each block is one of:
--   { "id": "..", "type": "text",   "text": "Diwali Dhamaka..." }
--   { "id": "..", "type": "images", "cols": 2,
--     "items": [ { "url": "..", "fileName": ".." }, null ] }
-- The public /pamphlets page renders these blocks top-to-bottom per zone.
-- =============================================================================

CREATE TABLE IF NOT EXISTS pamphlet_pages (
  zone       TEXT PRIMARY KEY,
  blocks     JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- If the table already existed from an earlier phase, make sure the column is there.
ALTER TABLE pamphlet_pages ADD COLUMN IF NOT EXISTS blocks JSONB NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE pamphlet_pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read pamphlet_pages" ON pamphlet_pages;
DROP POLICY IF EXISTS "Authenticated insert pamphlet_pages" ON pamphlet_pages;
DROP POLICY IF EXISTS "Authenticated update pamphlet_pages" ON pamphlet_pages;
DROP POLICY IF EXISTS "Authenticated delete pamphlet_pages" ON pamphlet_pages;

CREATE POLICY "Public read pamphlet_pages"
  ON pamphlet_pages FOR SELECT USING (true);
CREATE POLICY "Authenticated insert pamphlet_pages"
  ON pamphlet_pages FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated update pamphlet_pages"
  ON pamphlet_pages FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated delete pamphlet_pages"
  ON pamphlet_pages FOR DELETE USING (auth.role() = 'authenticated');

-- The storage bucket "pamphlets" (Public) created earlier is reused for images.
