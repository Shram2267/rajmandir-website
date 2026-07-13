import type { SheetSyncSettings } from "@/app/admin/offers/syncActions";

// India Standard Time has no daylight saving — a fixed +5:30 offset, so we
// can compute "IST wall-clock" fields by shifting the UTC timestamp instead
// of relying on Intl/timezone-name lookups.
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

function toIST(date: Date): Date {
  return new Date(date.getTime() + IST_OFFSET_MS);
}

/** IST weekday (0=Sun..6=Sat) for the given instant. */
function istWeekday(date: Date): number {
  return toIST(date).getUTCDay();
}

/** The next/most-recent instant (real UTC) that corresponds to "today's IST calendar date at HH:MM IST". */
function targetInstantFor(now: Date, timeOfDay: string): Date {
  const [targetH, targetM] = timeOfDay.split(":").map(Number);
  const nowIST = toIST(now);
  const targetShifted = Date.UTC(
    nowIST.getUTCFullYear(),
    nowIST.getUTCMonth(),
    nowIST.getUTCDate(),
    targetH,
    targetM,
    0,
    0
  );
  return new Date(targetShifted - IST_OFFSET_MS);
}

/**
 * Decides whether a scheduled sync should fire right now, given the saved
 * settings and the most recent sync_logs.run_at (used to avoid firing twice
 * for the same scheduled slot across repeated cron pings).
 */
export function shouldRunNow(
  settings: Pick<SheetSyncSettings, "enabled" | "frequency" | "day_of_week" | "time_of_day"> | null | undefined,
  lastRunAt: Date | null,
  now: Date = new Date()
): boolean {
  if (!settings?.enabled) return false;
  if (settings.frequency === "weekly" && settings.day_of_week !== istWeekday(now)) return false;

  const target = targetInstantFor(now, settings.time_of_day);

  // Fire once we've reached today's scheduled time. We deliberately do NOT cap
  // how *late* we'll still fire: on Vercel's Hobby plan the daily cron trigger
  // is only approximate (it can arrive up to ~an hour after the scheduled
  // minute), so a tight upper window would silently skip the run — which is
  // exactly the "auto-sync never happens" bug this endpoint exists to avoid.
  // The lastRunAt >= target check de-dupes, so we still fire at most once per
  // scheduled slot no matter how many times the cron pings.
  if (now.getTime() < target.getTime()) return false;
  if (lastRunAt && lastRunAt.getTime() >= target.getTime()) return false;

  return true;
}
