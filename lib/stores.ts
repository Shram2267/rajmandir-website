// Helpers for per-store URLs. Store `name` is NOT unique across branches
// (e.g. three "ASHOK VIHAR" stores), but the short code `n` is unique — so the
// slug combines both to stay unique and human/SEO readable.

export type StoreLike = {
  n: string;
  name: string;
  [key: string]: unknown;
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Unique, readable slug for a store, e.g. "ashok-vihar-avb". */
export function storeSlug(store: StoreLike): string {
  return `${slugify(store.name)}-${slugify(store.n)}`;
}

/** Find a store (and its index) by slug. Returns null if not found. */
export function findStoreBySlug<T extends StoreLike>(
  stores: T[],
  slug: string,
): { store: T; index: number } | null {
  const i = stores.findIndex((s) => storeSlug(s) === slug);
  return i === -1 ? null : { store: stores[i], index: i };
}

/** Build a wa.me link; prefers the store's WhatsApp number, falls back to phone. */
export function whatsappLink(
  whatsapp: string | null | undefined,
  phone: string | null | undefined,
  message?: string,
): string | null {
  const raw = (whatsapp || phone || "").replace(/[^0-9]/g, "");
  if (!raw) return null;
  // Assume Indian numbers; prefix country code if a bare 10-digit number.
  const num = raw.length === 10 ? `91${raw}` : raw;
  const q = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${num}${q}`;
}
