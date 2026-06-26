"use client";

import { useState, useRef } from "react";
import { uploadPamphlet, deletePamphlet } from "./actions";

type Pamphlet = {
  id: number;
  zone: string;
  image_url: string;
  file_name: string;
  created_at: string;
};

export default function PamphletsAdminClient({
  zones,
  initialPamphlets,
}: {
  zones: string[];
  initialPamphlets: Pamphlet[];
}) {
  const [selectedZone, setSelectedZone] = useState<string>(zones[0] || "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredPamphlets = initialPamphlets.filter((p) => p.zone === selectedZone);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !selectedZone) return;

    setUploading(true);

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("zone", selectedZone);
      formData.append("file", files[i]);

      await uploadPamphlet(formData);
    }

    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ink">Manage Pamphlet Offers</h1>
          <p className="text-stone-500 mt-1">Upload and organize pamphlets by zone</p>
        </div>

        <div className="flex items-center gap-4 bg-white p-2 rounded-lg border border-line shadow-sm">
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-line rounded-lg text-sm font-medium focus:ring-brand focus:border-brand"
          >
            {zones.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>

          <label className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-bold cursor-pointer hover:bg-brand-dark transition-colors inline-flex items-center gap-2">
            {uploading ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></span>
                Uploading...
              </>
            ) : (
              <>
                <span>↑</span> Upload Images
              </>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleUpload}
              disabled={uploading || !selectedZone}
            />
          </label>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-line p-6 shadow-sm">
        <h2 className="text-lg font-bold text-ink mb-4">
          Pamphlets in {selectedZone || "Select a zone"}
        </h2>

        {filteredPamphlets.length === 0 ? (
          <div className="text-center py-12 text-stone-500 border-2 border-dashed border-line rounded-xl">
            No pamphlets uploaded for {selectedZone} yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredPamphlets.map((p) => (
              <div key={p.id} className="group relative border border-line rounded-lg overflow-hidden bg-stone-50 aspect-[3/4]">
                <img
                  src={p.image_url}
                  alt={p.file_name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-ink/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={async () => {
                      if (confirm("Are you sure you want to delete this pamphlet?")) {
                        await deletePamphlet(p.id, p.image_url);
                      }
                    }}
                    className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
