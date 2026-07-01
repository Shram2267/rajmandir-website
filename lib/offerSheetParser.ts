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

function toNum(v: unknown): number | null {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/** Like toNum but rounded to an integer (closing_stock is an INTEGER column). */
function toInt(v: unknown): number | null {
  const n = toNum(v);
  return n == null ? null : Math.round(n);
}

/**
 * Maps rows from the "Offer Item" feed (ITM_CODE/ITM_NAME/Brand/... columns,
 * whether parsed from an uploaded .xlsx file or a Google Sheet CSV export)
 * into BulkOfferRow records ready for bulkUploadOffers / the sheet sync.
 */
export function parseOfferRows(json: Record<string, unknown>[]): BulkOfferRow[] {
  const rows: BulkOfferRow[] = [];
  for (const r of json) {
    const name = String(r["ITM_NAME"] ?? "").trim();
    const storeCode = String(r["STORE"] ?? "").trim();
    if (!name || !storeCode) continue; // require name + store
    rows.push({
      itm_code: String(r["ITM_CODE"] ?? "").trim(),
      name,
      brand: String(r["Brand"] ?? "").trim(),
      scheme_status: String(r["SchemeStatus"] ?? "").trim().toLowerCase() === "yes",
      mrp: toNum(r["MRP"]),
      sale_price: toNum(r["SalePrice"]),
      closing_stock: toInt(r["ClosingStock"]),
      remarks: String(r["Remarks"] ?? "").trim(),
      fetch_time: excelSerialToISO(r["FetchTime"]),
      store_code: storeCode,
      cat: String(r["CATEGORY"] ?? "").trim(),
      photo1: String(r["Photo 1"] ?? "").trim(),
      photo2: String(r["Photo 2"] ?? "").trim(),
    });
  }
  return rows;
}
