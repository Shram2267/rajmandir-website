// Shared shape + helpers for offers coming from Supabase.
//
// The offers table stores ONLY the canonical "Offer Item.xlsx" fields. Every
// display value (price, discount %, availability, deal text) is derived here.

/** Stock at/above this level counts as "In Stock". */
export const IN_STOCK_THRESHOLD = 10;

export type RawOffer = {
  id: number;
  store_id?: number;
  itm_code?: string | null;
  name: string;
  brand?: string | null;
  scheme_status?: boolean | null;
  mrp?: number | null;
  sale_price?: number | null;
  closing_stock?: number | null;
  remarks?: string | null;
  fetch_time?: string | null;
  cat: string;
  photo1?: string | null;
  photo2?: string | null;
};

export type FormattedOffer = RawOffer & {
  /** Derived display fields */
  available: boolean;
  offNum: number; // discount % (for sorting/badge)
  priceNum: number; // sale price (for sorting)
  off: string; // e.g. "25%"
  offer: string; // headline deal text (remarks or price)
  note: string; // e.g. "MRP ₹510"
  deal: string | null; // short deal label, e.g. "B1G1"
  img: string;
  /** First usable product image URL (Drive links converted), or null. */
  photo: string | null;
};

/**
 * Normalise a remarks string into a short deal label.
 * "B 1.00 G 1.00 Free" -> "B1G1", "B 3.00 G 1.00 Free" -> "B3G1".
 * Returns the trimmed remark for other formats, or null if empty.
 */
export function dealLabel(remarks: string | null | undefined): string | null {
  const r = (remarks ?? "").trim();
  if (!r) return null;
  const m = r.match(/B\s*(\d+(?:\.\d+)?)\s*G\s*(\d+(?:\.\d+)?)/i);
  if (m) return `B${parseInt(m[1], 10)}G${parseInt(m[2], 10)}`;
  return r;
}

/** Build the derived display fields the UI components use. */
export function formatOffer(o: RawOffer): FormattedOffer {
  const mrp = o.mrp ?? null;
  const sale = o.sale_price ?? null;
  const remarks = (o.remarks ?? "").trim();

  const offNum = mrp != null && sale != null && mrp > 0 ? Math.round(((mrp - sale) / mrp) * 100) : 0;
  const priceNum = sale ?? 0;
  const available = (o.closing_stock ?? 0) > IN_STOCK_THRESHOLD;

  return {
    ...o,
    available,
    offNum,
    priceNum,
    off: offNum > 0 ? `${offNum}%` : "",
    offer: remarks || (sale != null ? `₹${sale}` : ""),
    note: mrp != null ? `MRP ₹${mrp}` : "",
    deal: dealLabel(o.remarks),
    img: "[ product ]",
    photo: drivePhotoUrl(o.photo1) ?? drivePhotoUrl(o.photo2),
  };
}

/**
 * Convert a Google Drive share link to a directly-embeddable image URL.
 * Returns the input unchanged if it's already a normal URL, or null if empty.
 */
export function drivePhotoUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  const m =
    trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (m) return `https://drive.google.com/thumbnail?id=${m[1]}&sz=w800`;
  return trimmed;
}
