import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * A cookie-free Supabase client for PUBLIC reads (stores, offers, pamphlets).
 * Safe to use in statically-generated pages, generateStaticParams, sitemaps,
 * and route handlers — it never touches request cookies, so it won't throw
 * "cookies was called outside a request scope".
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}
