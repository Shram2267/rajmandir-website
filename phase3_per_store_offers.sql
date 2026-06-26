-- =============================================================================
-- Phase 3 migration — per-store offers + store WhatsApp number
-- Run this in the Supabase SQL Editor.
--
-- IMPORTANT: this rewrites the `offers` table. Take a backup / export first.
-- Strategy chosen: COPY every existing (global) offer to ALL stores, so no
-- store loses its current catalogue. After running, you can prune/edit per
-- store from the admin panel.
-- =============================================================================

BEGIN;

-- 1. Add the per-store foreign key (nullable for the backfill step) --------
ALTER TABLE offers
  ADD COLUMN IF NOT EXISTS store_id BIGINT REFERENCES stores(id) ON DELETE CASCADE;

-- 2. Backfill: duplicate each existing global offer to every store ---------
--    (rows that already have a store_id are left untouched, so this is safe
--     to re-run.)
INSERT INTO offers (name, cat, offer, note, off, off_num, price_num, available, store_id)
SELECT o.name, o.cat, o.offer, o.note, o.off, o.off_num, o.price_num, o.available, s.id
FROM offers o
CROSS JOIN stores s
WHERE o.store_id IS NULL;

-- 3. Remove the original global (store-less) rows --------------------------
DELETE FROM offers WHERE store_id IS NULL;

-- 4. Enforce the relationship going forward --------------------------------
ALTER TABLE offers ALTER COLUMN store_id SET NOT NULL;
CREATE INDEX IF NOT EXISTS idx_offers_store_id ON offers(store_id);

-- 5. Add a per-store WhatsApp number (optional; falls back to phone) --------
ALTER TABLE stores ADD COLUMN IF NOT EXISTS whatsapp TEXT;

COMMIT;

-- -----------------------------------------------------------------------------
-- ALTERNATIVE BACKFILL (do NOT run together with step 2/3 above):
--   To assign all existing offers to ONE store instead of copying to all,
--   replace steps 2 & 3 with:
--     UPDATE offers SET store_id = (SELECT id FROM stores ORDER BY id LIMIT 1)
--     WHERE store_id IS NULL;
-- -----------------------------------------------------------------------------
