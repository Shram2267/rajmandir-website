import type { BulkOfferRow } from "@/app/admin/offers/actions";

/** Excel serial date -> ISO string (Excel epoch is 1899-12-30). */
function excelSerialToISO(value: unknown): string | null {
  if (value == null || value === "") return null;
  const n = Number(value);
  if (!Number.isFinite(n)) {
    const d = new Date(String(value));
    return isNaN(d.getTime()) ? null : d.toISOString();
  }
  const ms = Math.round((n - 25569) * 86400 * 1000);
  const d = new Date(ms);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

/** Blank markers people commonly type into a sheet cell to mean "nothing". */
const BLANK_MARKER = /^(n\/?a|na|none|null|nil|-+|—+)$/i;

/**
 * Parse a possibly-dirty numeric cell into a number. Handles currency symbols,
 * thousands separators and stray spaces ("₹1,234.50", "Rs. 99", " 324 ") plus
 * common blank markers ("-", "N/A"). Returns null when there's no usable number.
 */
function cleanNum(v: unknown): number | null {
  if (v == null) return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  const raw = String(v).trim();
  if (!raw || BLANK_MARKER.test(raw)) return null;
  // Drop thousands separators, then grab the first real number token. Matching
  // (rather than stripping every non-digit) avoids stray punctuation like the
  // "." in "Rs. 99" merging into the value.
  const m = raw.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
  if (!m) return null;
  const n = Number(m[0]);
  return Number.isFinite(n) ? n : null;
}

/** Money cleaner — a price must be positive, so 0/negatives become null. */
function cleanPrice(v: unknown): number | null {
  const n = cleanNum(v);
  return n != null && n > 0 ? n : null;
}

/** Integer cleaner for stock — rounded and clamped to >= 0 (no negative stock). */
function cleanInt(v: unknown): number | null {
  const n = cleanNum(v);
  if (n == null) return null;
  return Math.max(0, Math.round(n));
}

/** Trim and collapse internal whitespace runs to a single space. */
function cleanText(v: unknown): string {
  return String(v ?? "").replace(/\s+/g, " ").trim();
}

/** Trim a photo URL; blank markers ("-", "N/A", …) collapse to "". */
function cleanPhoto(v: unknown): string {
  const s = String(v ?? "").trim();
  return BLANK_MARKER.test(s) ? "" : s;
}

/** Lenient yes/y/true/1 → true; everything else → false. */
function parseYes(v: unknown): boolean {
  return /^(yes|y|true|1)$/i.test(String(v ?? "").trim());
}

/**
 * Maps rows from the "Offer Item" feed (ITM_CODE/ITM_NAME/Brand/... columns,
 * whether parsed from an uploaded .xlsx file or a Google Sheet export) into
 * BulkOfferRow records ready for bulkUploadOffers / the sheet sync.
 *
 * All values are cleaned here so both the manual Excel upload and the
 * automatic Google Sheet sync write normalised data: prices stripped of
 * currency symbols/commas, whitespace collapsed, blank markers ("-", "N/A")
 * turned into empty/null, and invalid (0/negative) prices dropped so the site
 * never shows "₹0" cards or emits invalid Product/Offer structured data.
 */
export function parseOfferRows(json: Record<string, unknown>[]): BulkOfferRow[] {
  const rows: BulkOfferRow[] = [];
  for (const r of json) {
    const name = cleanText(r["ITM_NAME"]);
    const storeCode = cleanText(r["STORE"]).toUpperCase();
    if (!name || !storeCode) continue; // require name + store
    rows.push({
      itm_code: cleanText(r["ITM_CODE"]),
      name,
      brand: cleanText(r["Brand"]),
      scheme_status: parseYes(r["SchemeStatus"]),
      mrp: cleanPrice(r["MRP"]),
      sale_price: cleanPrice(r["SalePrice"]),
      closing_stock: cleanInt(r["ClosingStock"]),
      remarks: cleanText(r["Remarks"]),
      fetch_time: excelSerialToISO(r["FetchTime"]),
      store_code: storeCode,
      cat: cleanText(r["CATEGORY"]),
      photo1: cleanPhoto(r["Photo 1"]),
      photo2: cleanPhoto(r["Photo 2"]),
    });
  }
  return rows;
}
