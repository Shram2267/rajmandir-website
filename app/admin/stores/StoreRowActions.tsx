"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { editStore, deleteStore } from "./actions";

interface Store {
  id: number;
  n: string;
  name: string;
  area?: string;
  addr: string;
  pin_code?: string;
  manager?: string;
  phone?: string;
  whatsapp?: string;
  short_name?: string;
  hours?: string;
  lat?: number;
  lng?: number;
}

export default function StoreRowActions({ store }: { store: Store }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const [deleteConfirming, setDeleteConfirming] = useState(false);

  async function handleEdit(formData: FormData) {
    setSaving(true);
    const phone = formData.get("phone") as string;
    const manager = formData.get("manager") as string;
    const lat = formData.get("lat") as string;
    const lng = formData.get("lng") as string;

    const data: Record<string, unknown> = {
      name: formData.get("name") as string,
      area: formData.get("area") as string,
      addr: formData.get("addr") as string,
      pin_code: formData.get("pin_code") as string,
      short_name: formData.get("short_name") as string,
      hours: formData.get("hours") as string,
    };

    const whatsapp = formData.get("whatsapp") as string;

    if (phone) data.phone = phone;
    else data.phone = null;
    if (manager) data.manager = manager;
    else data.manager = null;
    data.whatsapp = whatsapp || null;
    if (lat) data.lat = parseFloat(lat);
    if (lng) data.lng = parseFloat(lng);

    await editStore(store.id, data);
    setSaving(false);
    setEditing(false);
    router.refresh();
  }

  return (
    <>
      <div className="flex gap-1.5 justify-end">
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
            <h3 className="text-lg font-bold text-red-600 mb-2">Delete Store</h3>
            <p className="text-stone-600 text-sm mb-6">"{store.name}" ko permanently delete kar diya jayega. Kya aap sure hain?</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteConfirming(false)} className="px-4 py-2 text-sm font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors">Cancel</button>
              <button onClick={async () => { setDeleteConfirming(false); await deleteStore(store.id); router.refresh(); }} className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setEditing(false)} />
          <div className="relative w-full max-w-lg rounded-2xl border border-line bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-left whitespace-normal font-normal animate-modal-pop">
            <div className="flex items-center justify-between border-b border-line px-6 py-4 shrink-0">
              <h3 className="text-lg font-bold text-ink">Edit Store</h3>
              <button onClick={() => setEditing(false)} className="text-stone-400 hover:text-ink text-xl leading-none font-bold">✕</button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form action={handleEdit} className="space-y-4 text-left">
                <div className="mb-4">
                  <label className="block text-xs font-bold text-stone-600 mb-1">Short Name</label>
                  <input required name="short_name" type="text" defaultValue={store.short_name || ""} className="w-full px-3 py-2 border border-line rounded-lg text-sm bg-white text-ink" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Location</label>
                  <input required name="name" type="text" defaultValue={store.name} className="w-full px-3 py-2 border border-line rounded-lg text-sm bg-white text-ink" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Zone</label>
                  <input required name="area" type="text" defaultValue={store.area || ""} placeholder="North West Delhi" className="w-full px-3 py-2 border border-line rounded-lg text-sm bg-white text-ink" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Full Address</label>
                  <textarea required name="addr" rows={2} defaultValue={store.addr} className="w-full px-3 py-2 border border-line rounded-lg text-sm bg-white text-ink" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1">Pin Code</label>
                    <input required name="pin_code" type="text" defaultValue={store.pin_code || ""} className="w-full px-3 py-2 border border-line rounded-lg text-sm bg-white text-ink" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1">Contact No.</label>
                    <input name="phone" type="text" defaultValue={store.phone || ""} className="w-full px-3 py-2 border border-line rounded-lg text-sm bg-white text-ink" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1">Store Manager</label>
                    <input name="manager" type="text" defaultValue={store.manager || ""} className="w-full px-3 py-2 border border-line rounded-lg text-sm bg-white text-ink" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1">WhatsApp No.</label>
                    <input name="whatsapp" type="text" defaultValue={store.whatsapp || ""} placeholder="9311239211" className="w-full px-3 py-2 border border-line rounded-lg text-sm bg-white text-ink" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Hours</label>
                  <input name="hours" type="text" defaultValue={store.hours || "Open 10 AM to 10 PM Daily"} className="w-full px-3 py-2 border border-line rounded-lg text-sm bg-white text-ink" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1">Latitude</label>
                    <input name="lat" step="any" type="number" defaultValue={store.lat || ""} className="w-full px-3 py-2 border border-line rounded-lg text-sm bg-white text-ink" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1">Longitude</label>
                    <input name="lng" step="any" type="number" defaultValue={store.lng || ""} className="w-full px-3 py-2 border border-line rounded-lg text-sm bg-white text-ink" />
                  </div>
                </div>
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
