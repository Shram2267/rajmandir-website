import * as XLSX from "xlsx";
import { parseOfferRows } from "@/lib/offerSheetParser";
import type { BulkOfferRow } from "@/app/admin/offers/actions";

/**
 * Fetches the entire spreadsheet (every tab, in one request) via Google's
 * "export as xlsx" endpoint and merges all tabs' rows. No per-tab GID or
 * API key needed — the sheet just needs to be shared as "Anyone with the
 * link can view". Each tab must have its own STORE column (same as the
 * manual Excel bulk upload) since rows from every tab are merged together.
 */
export async function fetchAllSheetRows(spreadsheetId: string): Promise<BulkOfferRow[]> {
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=xlsx`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Spreadsheet fetch failed (HTTP ${res.status}). Check the sheet is shared as "Anyone with the link can view".`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("text/html")) {
    throw new Error("Spreadsheet did not return a file — it may not be shared publicly.");
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  const workbook = XLSX.read(buffer, { type: "buffer" });

  const all: BulkOfferRow[] = [];
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
    all.push(...parseOfferRows(json));
  }
  return all;
}
