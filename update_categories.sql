-- =============================================================================
-- Remap existing offers' `cat` values to the new 15-category taxonomy.
-- Run in the Supabase SQL Editor AFTER deploying the new category list.
-- Safe to re-run (each UPDATE only touches the old value).
-- =============================================================================

-- Beverages is split by product name into hot vs cold drinks --------------
UPDATE offers SET cat = 'Tea, Coffee & Milk Drinks'
WHERE cat = 'Beverages'
  AND (name ILIKE '%tea%' OR name ILIKE '%coffee%' OR name ILIKE '%horlicks%'
       OR name ILIKE '%bournvita%' OR name ILIKE '%milk%');

UPDATE offers SET cat = 'Cold Drinks & Juices'      WHERE cat = 'Beverages';

-- Straightforward renames --------------------------------------------------
UPDATE offers SET cat = 'Personal Care'             WHERE cat = 'Personal Care'; -- unchanged (kept for clarity)
UPDATE offers SET cat = 'Cleaning Essentials'       WHERE cat = 'Household';
UPDATE offers SET cat = 'Snacks & Munchies'         WHERE cat = 'Snacks';
UPDATE offers SET cat = 'Atta, Rice & Dal'          WHERE cat IN ('Atta·Rice·Dal', 'Atta · Rice · Dal');
UPDATE offers SET cat = 'Masala, Oil & More'        WHERE cat IN ('Oil & Ghee', 'Oil &amp; Ghee');
UPDATE offers SET cat = 'Fruits & Vegetables'       WHERE cat IN ('Fruits & Veg', 'Fruits & Vegetables');
UPDATE offers SET cat = 'Dairy, Bread & Eggs'       WHERE cat IN ('Dairy & Eggs', 'Dairy, Bread & Eggs');

-- Check what remains unmapped (run separately to review):
-- SELECT cat, count(*) FROM offers GROUP BY cat ORDER BY count(*) DESC;
