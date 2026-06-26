"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { editOffer, deleteOffer } from "./actions";
import { categories } from "@/lib/data";

interface Offer {
  id: number;
  name: string;
  cat: string;
  offer: string;
  off?: string;
  note?: string;
  off_num?: number;
  price_num?: number;
  brand?: string | null;
  itm_code?: string | null;
  mrp?: number | null;
  sale_price?: number | null;
  closing_stock?: number | null;
  remarks?: string | null;
  scheme_status?: boolean | null;
  photo1?: string | null;
  photo2?: string | null;
}

export default function OfferRowActions({ offer }: { offer: Offer }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const [deleteConfirming, setDeleteConfirming] = useState(false);

  async function handleEdit(formData: FormData) {
    setSaving(true);
    await editOffer(offer.id, formData);
    setSaving(false);
    setEditing(false);
    router.refresh();
  }

  return (
    <>
      <div className="flex gap-1.5 items-center justify-end flex-wrap">
        <button
          onClick={() => setEditing(true)}
          className="text-blue-600 hover:text-blue-900 font-bold bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors text-xs"
        >
          Edit
        </button>
        <button
          onClick={() => setDeleteConfirming(true)}
          className="text-red-600 hover:text-red-900 font-bold bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors text-xs"
        >
          Delete
        </button>
      </div>

      {deleteConfirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setDeleteConfirming(false)} />
          <div className="relative w-full max-w-sm rounded-2xl border border-line bg-white shadow-2xl p-6 text-left whitespace-normal font-normal animate-modal-pop">
            <h3 className="text-lg font-bold text-red-600 mb-2">Delete Offer</h3>
            <p className="text-stone-600 text-sm mb-6">"{offer.name}" ko permanently delete kar diya jayega. Kya aap sure hain?</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteConfirming(false)} className="px-4 py-2 text-sm font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors">Cancel</button>
              <button onClick={async () => { setDeleteConfirming(false); await deleteOffer(offer.id); router.refresh(); }} className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setEditing(false)} />
          <div className="relative w-full max-w-lg rounded-2xl border border-line bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-left whitespace-normal font-normal animate-modal-pop">
            <div className="flex items-center justify-between border-b border-line px-6 py-4 shrink-0">
              <h3 className="text-lg font-bold text-ink">Edit Offer</h3>
              <button onClick={() => setEditing(false)} className="text-stone-400 hover:text-ink text-xl leading-none font-bold">✕</button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form action={handleEdit} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Product Name (ITM_NAME)</label>
                  <input required name="name" type="text" defaultValue={offer.name} className="w-full px-3 py-2 border border-line rounded-lg text-sm bg-white text-ink" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1">Brand</label>
                    <input name="brand" type="text" defaultValue={offer.brand || ""} className="w-full px-3 py-2 border border-line rounded-lg text-sm bg-white text-ink" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1">Item Code</label>
                    <input name="itm_code" type="text" defaultValue={offer.itm_code || ""} className="w-full px-3 py-2 border border-line rounded-lg text-sm bg-white text-ink" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Category</label>
                  <select required name="cat" defaultValue={offer.cat} className="w-full px-3 py-2 border border-line rounded-lg text-sm bg-white text-ink">
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                    {/* Preserve any legacy value not in the canonical list */}
                    {!categories.includes(offer.cat as (typeof categories)[number]) && offer.cat && (
                      <option value={offer.cat}>{offer.cat}</option>
                    )}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1">MRP (₹)</label>
                    <input name="mrp" type="number" step="any" defaultValue={offer.mrp ?? ""} className="w-full px-3 py-2 border border-line rounded-lg text-sm bg-white text-ink" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1">Sale Price (₹)</label>
                    <input name="sale_price" type="number" step="any" defaultValue={offer.sale_price ?? ""} className="w-full px-3 py-2 border border-line rounded-lg text-sm bg-white text-ink" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Remarks / Offer Text</label>
                  <input name="remarks" type="text" defaultValue={offer.remarks || ""} placeholder="B 3.00 G 1.00 Free" className="w-full px-3 py-2 border border-line rounded-lg text-sm bg-white text-ink" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Closing Stock</label>
                  <input name="closing_stock" type="number" defaultValue={offer.closing_stock ?? ""} className="w-full px-3 py-2 border border-line rounded-lg text-sm bg-white text-ink" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Photo 1 URL</label>
                  <input name="photo1" type="url" defaultValue={offer.photo1 || ""} className="w-full px-3 py-2 border border-line rounded-lg text-sm bg-white text-ink" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Photo 2 URL</label>
                  <input name="photo2" type="url" defaultValue={offer.photo2 || ""} className="w-full px-3 py-2 border border-line rounded-lg text-sm bg-white text-ink" />
                </div>
                <label className="flex items-center gap-2 text-sm font-bold text-stone-600 pt-2">
                  <input type="checkbox" name="scheme_status" defaultChecked={offer.scheme_status ?? true} className="w-4 h-4 text-brand rounded border-stone-300" />
                  On Scheme (admin)
                </label>
                <button type="submit" disabled={saving} className="w-full bg-brand text-white font-bold py-2.5 rounded-lg hover:bg-brand-deep transition-colors mt-2 disabled:opacity-50">
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
