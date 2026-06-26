"use client";

import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { bulkUploadOffers, type BulkOfferRow } from "./actions";

/** Excel serial date -> ISO string (Excel epoch is 1899-12-30). */
function excelSerialToISO(value: unknown): string | null {
  if (value == null || value === "") return null;
  const n = Number(value);
  if (!Number.isFinite(n)) {
    const d = new Date(String(value));
    return isNaN(d.getTime()) ? null : d.toISOString();
  }
  const ms = Math.round((n - 25569) * 86400 * 1000);
  const d = new Date(ms);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

function toNum(v: unknown): number | null {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/** Like toNum but rounded to an integer (closing_stock is an INTEGER column). */
function toInt(v: unknown): number | null {
  const n = toNum(v);
  return n == null ? null : Math.round(n);
}

/** Rows per server-action call — keeps each payload well under the 1 MB limit. */
const CHUNK_SIZE = 500;

export default function OffersBulkUpload() {
  const [parsed, setParsed] = useState<BulkOfferRow[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setResult(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target?.result;
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });

      const rows: BulkOfferRow[] = [];
      for (const r of json) {
        const name = String(r["ITM_NAME"] ?? "").trim();
        const storeCode = String(r["STORE"] ?? "").trim();
        if (!name || !storeCode) continue; // require name + store
        rows.push({
          itm_code: String(r["ITM_CODE"] ?? "").trim(),
          name,
          brand: String(r["Brand"] ?? "").trim(),
          scheme_status: String(r["SchemeStatus"] ?? "").trim().toLowerCase() === "yes",
          mrp: toNum(r["MRP"]),
          sale_price: toNum(r["SalePrice"]),
          closing_stock: toInt(r["ClosingStock"]),
          remarks: String(r["Remarks"] ?? "").trim(),
          fetch_time: excelSerialToISO(r["FetchTime"]),
          store_code: storeCode,
          cat: String(r["CATEGORY"] ?? "").trim(),
          photo1: String(r["Photo 1"] ?? "").trim(),
          photo2: String(r["Photo 2"] ?? "").trim(),
        });
      }
      setParsed(rows);
    };
    reader.readAsArrayBuffer(file);
  }

  async function handleUpload() {
    if (parsed.length === 0) return;
    setUploading(true);
    setResult(null);
    setProgress(0);

    let inserted = 0;
    let skipped = 0;
    const skippedCodes = new Set<string>();

    try {
      // Upload in batches so each Server Action payload stays under 1 MB.
      for (let i = 0; i < parsed.length; i += CHUNK_SIZE) {
        const chunk = parsed.slice(i, i + CHUNK_SIZE);
        const res = await bulkUploadOffers(chunk);
        inserted += res.inserted;
        skipped += res.skipped;
        res.skippedCodes.forEach((c) => skippedCodes.add(c));
        setProgress(Math.min(i + CHUNK_SIZE, parsed.length));
      }

      let msg = `Uploaded ${inserted} offers.`;
      if (skipped > 0) {
        msg += ` Skipped ${skipped}`;
        if (skippedCodes.size) msg += ` (unknown store codes: ${Array.from(skippedCodes).join(", ")})`;
        msg += ".";
      }
      setResult({ success: true, message: msg });
      setParsed([]);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      setResult({
        success: false,
        message: `${String(err)} — ${inserted} offers were uploaded before the error.`,
      });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-stone-600 mb-2">Upload Excel File (.xlsx)</label>
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFile}
          className="w-full text-sm text-stone-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-brand-wash file:text-brand hover:file:bg-brand hover:file:text-white file:transition-colors file:cursor-pointer"
        />
        <p className="text-xs text-stone-400 mt-1.5">
          Columns: ITM_CODE · ITM_NAME · Brand · SchemeStatus · MRP · SalePrice · ClosingStock · Remarks · FetchTime · STORE · CATEGORY · Photo 1 · Photo 2
        </p>
        <p className="text-xs text-stone-400 mt-1">
          STORE must match a store&apos;s Short Name (e.g. DM, KNN, BP). Discount % is auto-calculated.
        </p>
      </div>

      {parsed.length > 0 && (
        <div className="space-y-3">
          <div className="bg-stone-50 rounded-xl p-3 border border-line">
            <p className="text-sm font-bold text-ink mb-2">📋 Preview: {parsed.length} offers found</p>
            <div className="max-h-48 overflow-y-auto space-y-1">
              {parsed.slice(0, 10).map((r, i) => (
                <div key={i} className="text-xs text-stone-600 flex gap-2">
                  <span className="font-bold text-brand min-w-[40px]">{r.store_code}</span>
                  <span className="font-semibold truncate">{r.name}</span>
                  <span className="text-stone-400">₹{r.sale_price ?? "—"}</span>
                </div>
              ))}
              {parsed.length > 10 && (
                <p className="text-xs text-stone-400 pt-1">...and {parsed.length - 10} more</p>
              )}
            </div>
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full bg-brand text-white font-bold py-2.5 rounded-lg hover:bg-brand-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading
              ? `Uploading… ${progress}/${parsed.length}`
              : `Upload ${parsed.length} Offers`}
          </button>
        </div>
      )}

      {result && (
        <div className={`p-3 rounded-lg text-sm font-semibold ${
          result.success
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {result.message}
        </div>
      )}
    </div>
  );
}
