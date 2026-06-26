-- =============================================================================
-- Phase 4 migration — make the offers table match the "Offer Item.xlsx" feed.
-- Run this in the Supabase SQL Editor.
--
-- Final offers columns = id, created_at, store_id (relational) + the Excel feed:
--   itm_code, name, brand, scheme_status, mrp, sale_price, closing_stock,
--   remarks, fetch_time, cat, photo1, photo2
-- Everything else (price/discount/availability/offer text) is computed in the
-- app from these, so the legacy columns are dropped.
-- =============================================================================

-- 1. Add the feed columns (additive, idempotent) ---------------------------
ALTER TABLE offers ADD COLUMN IF NOT EXISTS itm_code      TEXT;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS brand         TEXT;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS scheme_status BOOLEAN DEFAULT true;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS mrp           NUMERIC;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS sale_price    NUMERIC;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS closing_stock INTEGER;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS remarks       TEXT;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS fetch_time    TIMESTAMPTZ;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS photo1        TEXT;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS photo2        TEXT;

CREATE INDEX IF NOT EXISTS idx_offers_itm_code ON offers(itm_code);

-- 2. OPTIONAL but recommended: clear the old placeholder offers -------------
--    The original ~11 demo offers (copied to every store) have no MRP/sale
--    price/photos, so after this change they'd show blank. Uncomment to wipe
--    them and start fresh from the Excel upload:
--
-- DELETE FROM offers WHERE mrp IS NULL AND sale_price IS NULL;

-- 3. Drop the legacy columns (now derived in the app) -----------------------
ALTER TABLE offers DROP COLUMN IF EXISTS offer;
ALTER TABLE offers DROP COLUMN IF EXISTS note;
ALTER TABLE offers DROP COLUMN IF EXISTS off;
ALTER TABLE offers DROP COLUMN IF EXISTS off_num;
ALTER TABLE offers DROP COLUMN IF EXISTS price_num;
ALTER TABLE offers DROP COLUMN IF EXISTS available;
