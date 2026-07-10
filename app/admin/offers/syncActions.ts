"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchAllSheetRows } from "@/lib/googleSheetSync";
import { sendSyncErrorAlert } from "@/lib/notify";
import type { BulkOfferRow } from "./actions";

export type SheetSyncSettings = {
  spreadsheet_id: string | null;
  frequency: "daily" | "weekly";
  day_of_week: number | null;
  time_of_day: string;
  enabled: boolean;
};

export type SyncLog = {
  id: number;
  run_at: string;
  trigger: "manual" | "scheduled";
  status: "success" | "error";
  summary: Array<{ code: string; rows: number; cleared: boolean }> | null;
  error_message: string | null;
};

export async function getSyncSettings(): Promise<SheetSyncSettings> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sheet_sync_settings")
    .select("*")
    .eq("id", 1)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function saveSyncSettings(formData: FormData) {
  const supabase = await createClient();

  const frequency = (formData.get("frequency") as string) === "weekly" ? "weekly" : "daily";
  const dayOfWeekRaw = formData.get("day_of_week") as string;

  const { error } = await supabase
    .from("sheet_sync_settings")
    .update({
      spreadsheet_id: ((formData.get("spreadsheet_id") as string) || "").trim() || null,
      frequency,
      day_of_week: frequency === "weekly" && dayOfWeekRaw !== "" ? parseInt(dayOfWeekRaw) : null,
      time_of_day: (formData.get("time_of_day") as string) || "09:00",
      enabled: formData.get("enabled") === "on",
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/offers");
}

/** Returns sync logs from the last `days` days (default 7), newest first. */
export async function getSyncLogs(days = 7): Promise<SyncLog[]> {
  const supabase = await createClient();
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("sheet_sync_logs")
    .select("*")
    .gte("run_at", since)
    .order("run_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function triggerSyncNow() {
  return runSheetSync("manual");
}

/**
 * Fetches the whole Google Sheet (every tab, merged) and replaces each
 * store's offers with what was found (an empty result for a store clears
 * it — this sheet is the single source of truth, same as the manual Excel
 * bulk upload). Always uses the service-role admin client since the
 * scheduler calls this outside of any HTTP request (no cookies/session to
 * read).
 *
 * Any failure (fetch or DB write) is logged + alerted without throwing, so
 * the in-process scheduler's setInterval tick never crashes on a bad run.
 * Note: the per-store delete+insert isn't wrapped in a single DB transaction,
 * so a failure partway through the store loop can leave a partial replace —
 * acceptable for this scale, but worth knowing if debugging a stuck sync.
 */
/** Sync logs older than this are pruned on each run so the table stays small. */
const LOG_RETENTION_DAYS = 30;

export async function runSheetSync(trigger: "manual" | "scheduled") {
  const admin = createAdminClient();

  // Housekeeping: drop old log rows so sheet_sync_logs doesn't grow forever.
  // Best-effort — never let a prune failure abort the actual sync.
  try {
    const cutoff = new Date(Date.now() - LOG_RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString();
    await admin.from("sheet_sync_logs").delete().lt("run_at", cutoff);
  } catch {
    // ignore — pruning is non-critical
  }

  const { data: settings, error: settingsError } = await admin
    .from("sheet_sync_settings")
    .select("*")
    .eq("id", 1)
    .single();
  if (settingsError) throw new Error(settingsError.message);

  try {
    if (!settings?.spreadsheet_id) {
      throw new Error("Spreadsheet ID is not configured.");
    }

    const rows: BulkOfferRow[] = await fetchAllSheetRows(settings.spreadsheet_id);

    const grouped = new Map<string, BulkOfferRow[]>();
    for (const r of rows) {
      const code = r.store_code.trim().toUpperCase();
      if (!grouped.has(code)) grouped.set(code, []);
      grouped.get(code)!.push(r);
    }

    const { data: stores, error: storesError } = await admin.from("stores").select("id, short_name");
    if (storesError) throw new Error(storesError.message);

    const summary: Array<{ code: string; rows: number; cleared: boolean }> = [];

    for (const store of stores || []) {
      const code = String(store.short_name || "").trim().toUpperCase();
      if (!code) continue;
      const storeRows = grouped.get(code) || [];

      const { error: deleteError } = await admin.from("offers").delete().eq("store_id", store.id);
      if (deleteError) throw new Error(deleteError.message);

      if (storeRows.length > 0) {
        const records = storeRows.map((r) => ({
          store_id: store.id,
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
        }));

        // Chunk inserts to stay well under Supabase's request size limits.
        for (let i = 0; i < records.length; i += 500) {
          const chunk = records.slice(i, i + 500);
          const { error: insertError } = await admin.from("offers").insert(chunk);
          if (insertError) throw new Error(insertError.message);
        }
      }

      summary.push({ code, rows: storeRows.length, cleared: storeRows.length === 0 });
    }

    await admin.from("sheet_sync_logs").insert({ trigger, status: "success", summary });

    revalidatePath("/admin/offers");
    revalidatePath("/offers");
    revalidatePath("/");

    return { success: true, message: `Synced ${summary.length} stores.` };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await admin.from("sheet_sync_logs").insert({ trigger, status: "error", error_message: message });
    await sendSyncErrorAlert(`Offer sheet sync failed: ${message}`);
    return { success: false, message };
  }
}
