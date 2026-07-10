"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import {
  getSyncSettings,
  saveSyncSettings,
  getSyncLogs,
  triggerSyncNow,
  type SheetSyncSettings,
  type SyncLog,
} from "./syncActions";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function SheetSyncPanel() {
  const [settings, setSettings] = useState<SheetSyncSettings | null>(null);
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const [spreadsheetId, setSpreadsheetId] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");
  const [dayOfWeek, setDayOfWeek] = useState(0);
  const [timeOfDay, setTimeOfDay] = useState("09:00");
  const [enabled, setEnabled] = useState(false);

  const load = useCallback(async () => {
    const [s, l] = await Promise.all([getSyncSettings(), getSyncLogs()]);
    setSettings(s);
    setLogs(l);
    setSpreadsheetId(s.spreadsheet_id || "");
    setFrequency(s.frequency);
    setDayOfWeek(s.day_of_week ?? 0);
    setTimeOfDay(s.time_of_day);
    setEnabled(s.enabled);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setResult(null);
    try {
      const fd = new FormData();
      fd.set("spreadsheet_id", spreadsheetId);
      fd.set("frequency", frequency);
      fd.set("day_of_week", String(dayOfWeek));
      fd.set("time_of_day", timeOfDay);
      if (enabled) fd.set("enabled", "on");
      await saveSyncSettings(fd);
      await load();
      setResult({ success: true, message: "Settings saved." });
    } catch (err) {
      setResult({ success: false, message: String(err) });
    } finally {
      setSaving(false);
    }
  }

  async function handleSyncNow() {
    setSyncing(true);
    setResult(null);
    try {
      const res = await triggerSyncNow();
      setResult(res);
      await load();
    } catch (err) {
      setResult({ success: false, message: String(err) });
    } finally {
      setSyncing(false);
    }
  }

  if (!settings) {
    return <p className="text-sm text-stone-400">Loading…</p>;
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-stone-600 mb-1">Google Spreadsheet ID</label>
          <input
            type="text"
            value={spreadsheetId}
            onChange={(e) => setSpreadsheetId(e.target.value)}
            className="w-full px-3 py-2 border border-line rounded-lg text-sm focus:ring-brand focus:border-brand"
            placeholder="1AbCDefGhIjKlmNoPQrsTuv..."
          />
          <p className="text-[11px] text-stone-400 mt-1">
            From the sheet&apos;s URL: docs.google.com/spreadsheets/d/<b>THIS_PART</b>/edit. Every tab is read and
            merged automatically (each must have its own STORE column) — just share the sheet as &quot;Anyone with
            the link can view&quot;.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1">Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as "daily" | "weekly")}
              className="w-full px-3 py-2 border border-line rounded-lg text-sm focus:ring-brand focus:border-brand"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1">Time (IST)</label>
            <input
              type="time"
              value={timeOfDay}
              onChange={(e) => setTimeOfDay(e.target.value)}
              className="w-full px-3 py-2 border border-line rounded-lg text-sm focus:ring-brand focus:border-brand"
            />
          </div>
        </div>

        {frequency === "weekly" && (
          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1">Day of week</label>
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-line rounded-lg text-sm focus:ring-brand focus:border-brand"
            >
              {DAYS.map((d, i) => (
                <option key={d} value={i}>{d}</option>
              ))}
            </select>
          </div>
        )}

        <label className="flex items-center gap-2 text-sm font-semibold text-stone-700">
          <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
          Enable automatic sync
        </label>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-brand text-white font-bold py-2.5 rounded-lg hover:bg-brand-deep transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Settings"}
          </button>
          <button
            type="button"
            onClick={handleSyncNow}
            disabled={syncing}
            className="flex-1 bg-stone-100 text-stone-700 font-bold py-2.5 rounded-lg hover:bg-stone-200 transition-colors disabled:opacity-50 border border-line"
          >
            {syncing ? "Syncing…" : "Sync Now"}
          </button>
        </div>
      </form>

      {result && (
        <div
          className={`p-3 rounded-lg text-sm font-semibold ${
            result.success
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {result.message}
        </div>
      )}

      <div>
        <p className="text-xs font-bold text-stone-600 mb-2">Sync History (last 7 days)</p>
        {logs.length === 0 ? (
          <p className="text-xs text-stone-400">No syncs in the last 7 days.</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {logs.map((log) => (
              <div key={log.id} className="bg-stone-50 rounded-lg p-3 border border-line text-xs">
                <div className="flex items-center justify-between mb-1 gap-2">
                  <span className="font-semibold text-ink">
                    {new Date(log.run_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                  </span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                      log.status === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {log.status} · {log.trigger}
                  </span>
                </div>
                {log.status === "success" && log.summary && (
                  <p className="text-stone-500">
                    {log.summary.map((s) => `${s.code}: ${s.rows}${s.cleared ? " (cleared)" : ""}`).join(" · ")}
                  </p>
                )}
                {log.status === "error" && log.error_message && <p className="text-red-600">{log.error_message}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
