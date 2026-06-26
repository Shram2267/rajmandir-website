"use client";

import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { bulkUploadStores } from "./actions";

interface ParsedStore {
  n: string;
  name: string;
  area: string;
  addr: string;
  pin_code: string;
  manager: string;
  phone: string;
  short_name: string;
  hours: string;
  lat?: number;
  lng?: number;
}

export default function BulkUpload() {
  const [parsed, setParsed] = useState<ParsedStore[]>([]);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setResult(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 });

      // Skip header row (Row | Location | Address | Pin Code | Store Manager | Contact No | Short Name | Hours | Latitude | Longitude | Zone)
      const stores: ParsedStore[] = [];
      for (let i = 1; i < json.length; i++) {
        const row = json[i];
        if (!row || !row[1]) continue; // skip empty rows, require location name
        stores.push({
          n: String(row[0] || ""),
          name: String(row[1] || ""),
          area: String(row[10] || ""), // Zone from Excel
          addr: String(row[2] || ""),
          pin_code: String(row[3] || ""),
          manager: String(row[4] || ""),
          phone: String(row[5] || ""),
          short_name: String(row[6] || ""),
          hours: String(row[7] || "Open 10 AM to 10 PM Daily"),
          lat: row[8] ? parseFloat(String(row[8])) : undefined,
          lng: row[9] ? parseFloat(String(row[9])) : undefined,
        });
      }
      setParsed(stores);
    };
    reader.readAsBinaryString(file);
  }

  async function handleUpload() {
    if (parsed.length === 0) return;
    setUploading(true);
    setResult(null);

    try {
      // Filter out empty fields and send
      const cleaned = parsed.map((s) => {
        const obj: Record<string, unknown> = {
          n: s.n,
          name: s.name,
          area: s.area,
          addr: s.addr,
          pin_code: s.pin_code,
          hours: s.hours,
          short_name: s.short_name,
          phone: s.phone || "",
          lat: s.lat || 0,
          lng: s.lng || 0,
        };
        if (s.manager) obj.manager = s.manager;
        return obj;
      });

      await bulkUploadStores(cleaned);
      setResult({ success: true, message: `Successfully uploaded ${cleaned.length} stores!` });
      setParsed([]);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      setResult({ success: false, message: String(err) });
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
          Format: Row | Location | Address | Pin Code | Manager | Contact | Short Name | Hours | Latitude | Longitude
        </p>
      </div>

      {parsed.length > 0 && (
        <div className="space-y-3">
          <div className="bg-stone-50 rounded-xl p-3 border border-line">
            <p className="text-sm font-bold text-ink mb-2">
              📋 Preview: {parsed.length} stores found
            </p>
            <div className="max-h-48 overflow-y-auto space-y-1">
              {parsed.slice(0, 10).map((s, i) => (
                <div key={i} className="text-xs text-stone-600 flex gap-2">
                  <span className="font-bold text-brand min-w-[24px]">{s.n}</span>
                  <span className="font-semibold">{s.name}</span>
                  <span className="text-stone-400">({s.short_name})</span>
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
            {uploading ? "Uploading..." : `Upload ${parsed.length} Stores`}
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
