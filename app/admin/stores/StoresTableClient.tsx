"use client";

import { useState } from "react";
import StoreRowActions from "./StoreRowActions";
import { bulkDeleteStores } from "./actions";
import { useRouter } from "next/navigation";

export default function StoresTableClient({ stores }: { stores: any[] }) {
  const [selected, setSelected] = useState<number[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [bulkDeleteConfirming, setBulkDeleteConfirming] = useState(false);
  const router = useRouter();

  function handleSelectAll(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      setSelected(stores.map((s) => s.id));
    } else {
      setSelected([]);
    }
  }

  function handleSelect(id: number, checked: boolean) {
    if (checked) {
      setSelected((prev) => [...prev, id]);
    } else {
      setSelected((prev) => prev.filter((item) => item !== id));
    }
  }

  function handleBulkDeleteClick() {
    if (selected.length === 0) return;
    setBulkDeleteConfirming(true);
  }

  async function executeBulkDelete() {
    setIsDeleting(true);
    await bulkDeleteStores(selected);
    setSelected([]);
    setIsDeleting(false);
    router.refresh();
  }

  return (
    <>
      {selected.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center justify-between animate-fade-in">
          <span className="text-sm font-bold text-red-700">{selected.length} items selected</span>
          <button
            onClick={handleBulkDeleteClick}
            disabled={isDeleting}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete Selected"}
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-line overflow-y-auto overflow-x-auto max-h-[calc(100vh-200px)]">
        <table className="min-w-full divide-y divide-line">
          <thead className="bg-stone-50">
            <tr>
              <th className="sticky top-0 bg-stone-50 shadow-sm z-20 px-4 py-4 w-12 text-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-brand rounded border-stone-300"
                  onChange={handleSelectAll}
                  checked={stores.length > 0 && selected.length === stores.length}
                />
              </th>
              <th className="sticky top-0 bg-stone-50 shadow-sm z-20 px-4 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">S.No</th>
              <th className="sticky top-0 bg-stone-50 shadow-sm z-20 px-4 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Short</th>
              <th className="sticky top-0 bg-stone-50 shadow-sm z-20 px-4 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Location</th>
              <th className="sticky top-0 bg-stone-50 shadow-sm z-20 px-4 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider hidden md:table-cell">Address</th>
              <th className="sticky top-0 bg-stone-50 shadow-sm z-20 px-4 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Zone</th>
              <th className="sticky top-0 bg-stone-50 shadow-sm z-20 px-4 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider hidden lg:table-cell">Pin</th>
              <th className="sticky top-0 bg-stone-50 shadow-sm z-20 px-4 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider hidden lg:table-cell">Manager</th>
              <th className="sticky top-0 bg-stone-50 shadow-sm z-20 px-4 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider hidden md:table-cell">Contact</th>
              <th className="sticky top-0 bg-stone-50 shadow-sm z-20 px-4 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider hidden lg:table-cell">Hours</th>
              <th className="sticky top-0 bg-stone-50 shadow-sm z-20 px-4 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider hidden xl:table-cell">Lat</th>
              <th className="sticky top-0 bg-stone-50 shadow-sm z-20 px-4 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider hidden xl:table-cell">Lng</th>
              <th className="sticky top-0 bg-stone-50 shadow-sm z-20 px-4 py-4 text-right text-xs font-bold text-stone-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-line">
            {stores?.map((store, index) => (
              <tr key={store.id} className={`hover:bg-stone-50 transition-colors ${selected.includes(store.id) ? 'bg-red-50/50' : ''}`}>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-brand rounded border-stone-300"
                    checked={selected.includes(store.id)}
                    onChange={(e) => handleSelect(store.id, e.target.checked)}
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-brand">{index + 1}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-stone-100 text-stone-600">
                    {store.short_name || "—"}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-ink">{store.name}</td>
                <td className="px-4 py-3 text-xs text-stone-500 max-w-[250px] truncate hidden md:table-cell" title={store.addr}>
                  {store.addr}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-xs font-bold text-stone-600">{store.area || "—"}</td>
                <td className="px-4 py-3 whitespace-nowrap text-xs text-stone-500 hidden lg:table-cell">{store.pin_code || "—"}</td>
                <td className="px-4 py-3 whitespace-nowrap text-xs text-stone-600 hidden lg:table-cell">{store.manager || "—"}</td>
                <td className="px-4 py-3 whitespace-nowrap text-xs text-stone-500 hidden md:table-cell">{store.phone || "—"}</td>
                <td className="px-4 py-3 whitespace-nowrap text-xs text-stone-500 hidden lg:table-cell">{store.hours || "—"}</td>
                <td className="px-4 py-3 whitespace-nowrap text-xs text-stone-500 hidden xl:table-cell">{store.lat || "—"}</td>
                <td className="px-4 py-3 whitespace-nowrap text-xs text-stone-500 hidden xl:table-cell">{store.lng || "—"}</td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                  <StoreRowActions store={store} />
                </td>
              </tr>
            ))}
            {(!stores || stores.length === 0) && (
              <tr>
                <td colSpan={12} className="px-6 py-8 text-center text-sm text-stone-500">
                  No stores found in database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {bulkDeleteConfirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setBulkDeleteConfirming(false)} />
          <div className="relative w-full max-w-sm rounded-2xl border border-line bg-white shadow-2xl p-6 text-left whitespace-normal font-normal animate-modal-pop">
            <h3 className="text-lg font-bold text-red-600 mb-2">Delete {selected.length} Stores</h3>
            <p className="text-stone-600 text-sm mb-6">In sabhi selected stores ko permanently delete kar diya jayega. Kya aap sure hain?</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setBulkDeleteConfirming(false)} className="px-4 py-2 text-sm font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors">Cancel</button>
              <button onClick={async () => { setBulkDeleteConfirming(false); await executeBulkDelete(); }} className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
