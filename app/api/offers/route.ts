import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";
import { formatOffer, type RawOffer } from "@/lib/offers";

/**
 * Returns offers for a given store: /api/offers?store_id=123
 * Resilient to the pre-migration state — if the store_id column doesn't exist
 * yet, it returns an empty list instead of erroring so the site keeps working.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get("store_id");

  if (!storeId) {
    return NextResponse.json({ offers: [] });
  }

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("offers")
    .select("*")
    .eq("store_id", Number(storeId))
    .order("id", { ascending: false });

  if (error) {
    // Most likely the migration hasn't been run yet (no store_id column).
    console.warn(`[offers API] query failed: ${error.message}`);
    return NextResponse.json({ offers: [] });
  }

  const offers = (data as RawOffer[]).map(formatOffer);
  return NextResponse.json({ offers });
}
