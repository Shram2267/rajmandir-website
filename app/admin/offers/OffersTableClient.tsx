"use client";

import { useState } from "react";
import OfferRowActions from "./OfferRowActions";
import { bulkDeleteOffers, deleteAllOffers } from "./actions";
import { useRouter } from "next/navigation";
import Pagination from "../Pagination";

const PAGE_SIZE = 20;

type StoreLite = { id: number; n: string; name: string; area?: string };

export default function OffersTableClient({ offers, stores = [] }: { offers: any[]; stores?: StoreLite[] }) {
  const [selected, setSelected] = useState<number[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [bulkDeleteConfirming, setBulkDeleteConfirming] = useState(false);
  const [deleteAllConfirming, setDeleteAllConfirming] = useState(false);
  const [storeFilter, setStoreFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const router = useRouter();

  const storeMap = new Map(stores.map((s) => [s.id, s]));
  const visibleOffers =
    storeFilter === "all" ? offers : offers.filter((o) => String(o.store_id) === storeFilter);

  const pageCount = Math.max(1, Math.ceil(visibleOffers.length / PAGE_SIZE));
  const pagedOffers = visibleOffers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSelectAll(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      setSelected(pagedOffers.map((o) => o.id));
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
    await bulkDeleteOffers(selected);
    setSelected([]);
    setIsDeleting(false);
    router.refresh();
  }

  async function executeDeleteAll() {
    setIsDeleting(true);
    await deleteAllOffers(storeFilter === "all" ? null : parseInt(storeFilter));
    setSelected([]);
    setPage(1);
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

      {stores.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <label className="text-sm font-bold text-stone-600">Filter by store:</label>
          <select
            value={storeFilter}
            onChange={(e) => { setStoreFilter(e.target.value); setSelected([]); setPage(1); }}
            className="px-3 py-2 border border-line rounded-lg text-sm bg-white"
          >
            <option value="all">All stores ({offers.length})</option>
            {stores.map((s) => (
              <option key={s.id} value={String(s.id)}>
                {s.name} ({s.n})
              </option>
            ))}
          </select>
          <span className="text-sm text-stone-500">{visibleOffers.length} shown</span>
          {visibleOffers.length > 0 && (
            <button
              onClick={() => setDeleteAllConfirming(true)}
              disabled={isDeleting}
              className="ml-auto bg-red-50 text-red-700 border border-red-200 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              🗑️ Delete All ({visibleOffers.length})
            </button>
          )}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-line overflow-y-auto overflow-x-auto max-h-[calc(100vh-200px)]">
        <table className="min-w-full divide-y divide-line">
          <thead className="bg-stone-50">
            <tr>
              <th className="sticky top-0 bg-stone-50 shadow-sm z-20 px-6 py-4 w-12 text-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-brand rounded border-stone-300"
                  onChange={handleSelectAll}
                  checked={pagedOffers.length > 0 && pagedOffers.every((o) => selected.includes(o.id))}
                />
              </th>
              <th className="sticky top-0 bg-stone-50 shadow-sm z-20 px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider w-16">S.No</th>
              <th className="sticky top-0 bg-stone-50 shadow-sm z-20 px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Offer</th>
              <th className="sticky top-0 bg-stone-50 shadow-sm z-20 px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Store</th>
              <th className="sticky top-0 bg-stone-50 shadow-sm z-20 px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Price</th>
              <th className="sticky top-0 bg-stone-50 shadow-sm z-20 px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Stock</th>
              <th colSpan={2} className="sticky top-0 bg-stone-50 shadow-sm z-20 px-6 py-4 text-right text-xs font-bold text-stone-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-line">
            {pagedOffers?.map((offer, index) => (
              <tr key={offer.id} className={`transition-colors ${(offer.closing_stock ?? 0) > 10 ? 'hover:bg-stone-50' : 'bg-stone-50 opacity-60 hover:opacity-100'} ${selected.includes(offer.id) ? 'bg-red-50/50' : ''}`}>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-brand rounded border-stone-300"
                    checked={selected.includes(offer.id)}
                    onChange={(e) => handleSelect(offer.id, e.target.checked)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-brand">{(page - 1) * PAGE_SIZE + index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-ink">{offer.name}</div>
                  <div className="text-xs text-stone-500 mt-0.5">
                    {offer.brand ? `${offer.brand} · ` : ""}{offer.cat}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-xs font-semibold text-stone-600">
                    {storeMap.get(offer.store_id)?.name ?? (offer.store_id ? `#${offer.store_id}` : "—")}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-bold text-ink">{offer.sale_price != null ? `₹${offer.sale_price}` : "—"}</span>
                  {offer.mrp != null && (
                    <span className="text-xs text-stone-400 line-through ml-1.5">₹{offer.mrp}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {(offer.closing_stock ?? 0) > 10 ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-green-100 text-green-700">
                      {offer.closing_stock} in stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-stone-200 text-stone-600">
                      {offer.closing_stock ?? 0} · low
                    </span>
                  )}
                </td>
                <td colSpan={2} className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <OfferRowActions offer={offer} />
                </td>
              </tr>
            ))}
            {visibleOffers.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-sm text-stone-500">
                  No offers found{storeFilter !== "all" ? " for this store" : " in database"}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />

      {deleteAllConfirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setDeleteAllConfirming(false)} />
          <div className="relative w-full max-w-sm rounded-2xl border border-line bg-white shadow-2xl p-6 text-left whitespace-normal font-normal animate-modal-pop">
            <h3 className="text-lg font-bold text-red-600 mb-2">Delete All {visibleOffers.length} Offers</h3>
            <p className="text-stone-600 text-sm mb-6">
              {storeFilter === "all"
                ? `Sabhi stores ke ${visibleOffers.length} offers permanently delete ho jayenge.`
                : `Is store ke sabhi ${visibleOffers.length} offers permanently delete ho jayenge.`} Ye action undo nahi ho sakta. Kya aap sure hain?
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteAllConfirming(false)} className="px-4 py-2 text-sm font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors">Cancel</button>
              <button onClick={async () => { setDeleteAllConfirming(false); await executeDeleteAll(); }} className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors">Delete All</button>
            </div>
          </div>
        </div>
      )}

      {bulkDeleteConfirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setBulkDeleteConfirming(false)} />
          <div className="relative w-full max-w-sm rounded-2xl border border-line bg-white shadow-2xl p-6 text-left whitespace-normal font-normal animate-modal-pop">
            <h3 className="text-lg font-bold text-red-600 mb-2">Delete {selected.length} Offers</h3>
            <p className="text-stone-600 text-sm mb-6">In sabhi selected offers ko permanently delete kar diya jayega. Kya aap sure hain?</p>
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
