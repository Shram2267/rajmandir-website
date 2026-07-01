import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { shouldRunNow } from "@/lib/syncScheduler";
import { runSheetSync } from "@/app/admin/offers/syncActions";

// Never cache/prerender — this must read live DB state on every ping.
export const dynamic = "force-dynamic";

/**
 * Pinged by an external cron service (e.g. cron-job.org) every few minutes.
 * Checks the saved schedule and only actually runs the sheet sync when it's
 * due — see lib/syncScheduler.ts for the "is it time yet" logic. Serverless
 * hosts (Vercel) have no persistent process to tick a setInterval, so the
 * schedule check has to live behind an HTTP endpoint like this instead.
 */
export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  const { data: settings, error: settingsError } = await admin
    .from("sheet_sync_settings")
    .select("*")
    .eq("id", 1)
    .single();
  if (settingsError) {
    return NextResponse.json({ error: settingsError.message }, { status: 500 });
  }

  const { data: recentLogs } = await admin
    .from("sheet_sync_logs")
    .select("run_at")
    .order("run_at", { ascending: false })
    .limit(1);
  const lastRunAt = recentLogs?.[0]?.run_at ? new Date(recentLogs[0].run_at) : null;

  if (!shouldRunNow(settings, lastRunAt)) {
    return NextResponse.json({ skipped: true });
  }

  const result = await runSheetSync("scheduled");
  return NextResponse.json(result);
}
