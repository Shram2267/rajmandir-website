"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function num(formData: FormData, key: string): number | null {
  const v = formData.get(key) as string;
  if (v === null || v === undefined || v.trim() === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function str(formData: FormData, key: string): string | null {
  return ((formData.get(key) as string) || "").trim() || null;
}

/**
 * Build an offer record (minus store_id) from the admin form fields.
 * Only the canonical columns are written — price/discount/availability are
 * derived from these at render time (see lib/offers formatOffer).
 */
function buildOfferFromForm(formData: FormData) {
  return {
    name: formData.get("name") as string,
    cat: formData.get("cat") as string,
    brand: str(formData, "brand"),
    itm_code: str(formData, "itm_code"),
    mrp: num(formData, "mrp"),
    sale_price: num(formData, "sale_price"),
    closing_stock: (() => {
      const n = num(formData, "closing_stock");
      return n == null ? null : Math.round(n);
    })(),
    remarks: str(formData, "remarks"),
    // scheme_status is admin-only; the Add form omits it, so default to true.
    scheme_status: formData.has("scheme_status") ? formData.get("scheme_status") === "on" : true,
    photo1: str(formData, "photo1"),
    photo2: str(formData, "photo2"),
  };
}

export async function addOffer(formData: FormData) {
  const supabase = await createClient();

  const base = buildOfferFromForm(formData);

  const storeValue = formData.get("store_id") as string;

  // "all" → create the offer at every store; otherwise a single store.
  let rows: Array<Record<string, unknown>>;
  if (storeValue === "all") {
    const { data: stores, error: storesError } = await supabase.from("stores").select("id");
    if (storesError) throw new Error(storesError.message);
    rows = (stores || []).map((s) => ({ ...base, store_id: s.id }));
  } else {
    rows = [{ ...base, store_id: parseInt(storeValue) }];
  }

  const { error } = await supabase.from("offers").insert(rows);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/offers");
  revalidatePath("/offers");
  revalidatePath("/");
}

export async function editOffer(id: number, formData: FormData) {
  const supabase = await createClient();

  const data = buildOfferFromForm(formData);

  const { error } = await supabase.from("offers").update(data).eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/offers");
  revalidatePath("/offers");
  revalidatePath("/");
}

export type BulkOfferRow = {
  itm_code?: string;
  name: string;
  brand?: string;
  scheme_status?: boolean;
  mrp?: number | null;
  sale_price?: number | null;
  closing_stock?: number | null;
  remarks?: string;
  fetch_time?: string | null;
  store_code: string; // matches stores.short_name
  cat?: string;
  photo1?: string;
  photo2?: string;
};

export async function bulkUploadOffers(rows: BulkOfferRow[]) {
  const supabase = await createClient();

  // Resolve store short codes (e.g. "DM", "KNN") to store ids.
  const { data: stores, error: storesError } = await supabase
    .from("stores")
    .select("id, short_name");
  if (storesError) throw new Error(storesError.message);

  const codeToId = new Map<string, number>();
  (stores || []).forEach((s) => {
    if (s.short_name) codeToId.set(String(s.short_name).trim().toUpperCase(), s.id);
  });

  const records: Array<Record<string, unknown>> = [];
  const skippedCodes = new Set<string>();

  for (const r of rows) {
    const code = (r.store_code || "").trim().toUpperCase();
    const storeId = codeToId.get(code);
    if (!storeId) {
      if (code) skippedCodes.add(code);
      continue;
    }
    records.push({
      store_id: storeId,
      name: r.name,
      cat: r.cat || "",
      brand: r.brand || null,
      itm_code: r.itm_code || null,
      mrp: r.mrp ?? null,
      sale_price: r.sale_price ?? null,
      closing_stock: r.closing_stock == null ? null : Math.round(r.closing_stock),
      remarks: (r.remarks || "").trim() || null,
      scheme_status: r.scheme_status ?? true,
      photo1: r.photo1 || null,
      photo2: r.photo2 || null,
      fetch_time: r.fetch_time || null,
    });
  }

  if (records.length > 0) {
    const { error } = await supabase.from("offers").insert(records);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/offers");
  revalidatePath("/offers");
  revalidatePath("/");

  return {
    inserted: records.length,
    skipped: rows.length - records.length,
    skippedCodes: Array.from(skippedCodes),
  };
}

export async function bulkDeleteOffers(ids: number[]) {
  const supabase = await createClient();

  const { error } = await supabase.from("offers").delete().in("id", ids);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/offers");
  revalidatePath("/offers");
  revalidatePath("/");
}

export async function deleteOffer(id: number) {
  const supabase = await createClient();

  const { error } = await supabase.from("offers").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/offers");
  revalidatePath("/offers");
  revalidatePath("/");
}
