import { createClient } from "@/lib/supabase/server";
import { addOffer } from "./actions";
import { categories } from "@/lib/data";
import AdminModal from "../AdminModal";
import OffersTableClient from "./OffersTableClient";
import OffersBulkUpload from "./OffersBulkUpload";
import SheetSyncPanel from "./SheetSyncPanel";

export default async function OffersAdminPage() {
  const supabase = await createClient();
  const { data: offers } = await supabase.from("offers").select("*").order("id", { ascending: false });
  const { data: stores } = await supabase.from("stores").select("id, n, name, area").order("name", { ascending: true });
  const storeList = stores || [];

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-ink">Manage Offers</h2>
          <p className="text-stone-500 text-sm mt-1">Add new deals and toggle their availability.</p>
        </div>
        <div className="flex gap-2">
        <AdminModal
          trigger={
            <button className="bg-stone-100 text-stone-700 font-bold px-4 py-2.5 rounded-xl hover:bg-stone-200 transition-colors text-sm flex items-center gap-2 border border-line">
              📁 Bulk Upload
            </button>
          }
          title="Bulk Upload Offers"
        >
          <OffersBulkUpload />
        </AdminModal>
        <AdminModal
          trigger={
            <button className="bg-stone-100 text-stone-700 font-bold px-4 py-2.5 rounded-xl hover:bg-stone-200 transition-colors text-sm flex items-center gap-2 border border-line">
              🔄 Sheet Sync
            </button>
          }
          title="Google Sheet Auto-Sync"
        >
          <SheetSyncPanel />
        </AdminModal>
        <AdminModal
          trigger={
            <button className="bg-brand text-white font-bold px-5 py-2.5 rounded-xl hover:bg-brand-deep transition-colors text-sm flex items-center gap-2 shadow-sm">
              <span className="text-lg leading-none">+</span> Add Offer
            </button>
          }
          title="Add New Offer"
        >
          <form action={addOffer} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Store</label>
              <select required name="store_id" defaultValue="all" className="w-full px-3 py-2 border border-line rounded-lg text-sm focus:ring-brand focus:border-brand">
                <option value="all">🏬 All stores (apply to every store)</option>
                {storeList.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.n}) · {s.area}</option>
                ))}
              </select>
              <p className="text-[11px] text-stone-400 mt-1">Choose &quot;All stores&quot; to add this deal everywhere, or pick one branch.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Product Name (ITM_NAME)</label>
              <input required name="name" type="text" className="w-full px-3 py-2 border border-line rounded-lg text-sm focus:ring-brand focus:border-brand" placeholder="DABUR MUSTARD OIL 1LTR" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">Brand</label>
                <input name="brand" type="text" className="w-full px-3 py-2 border border-line rounded-lg text-sm focus:ring-brand focus:border-brand" placeholder="DABUR" />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">Item Code</label>
                <input name="itm_code" type="text" className="w-full px-3 py-2 border border-line rounded-lg text-sm focus:ring-brand focus:border-brand" placeholder="RM076227" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Category</label>
              <select required name="cat" className="w-full px-3 py-2 border border-line rounded-lg text-sm focus:ring-brand focus:border-brand">
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">MRP (₹)</label>
                <input name="mrp" type="number" step="any" className="w-full px-3 py-2 border border-line rounded-lg text-sm focus:ring-brand focus:border-brand" placeholder="360" />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">Sale Price (₹)</label>
                <input name="sale_price" type="number" step="any" className="w-full px-3 py-2 border border-line rounded-lg text-sm focus:ring-brand focus:border-brand" placeholder="180" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Remarks / Offer Text</label>
              <input name="remarks" type="text" className="w-full px-3 py-2 border border-line rounded-lg text-sm focus:ring-brand focus:border-brand" placeholder="B 3.00 G 1.00 Free" />
              <p className="text-[11px] text-stone-400 mt-1">Shown as the headline deal. Discount % is auto-calculated from MRP &amp; Sale Price.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Closing Stock</label>
              <input name="closing_stock" type="number" className="w-full px-3 py-2 border border-line rounded-lg text-sm focus:ring-brand focus:border-brand" placeholder="110" />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Photo 1 URL</label>
              <input name="photo1" type="url" className="w-full px-3 py-2 border border-line rounded-lg text-sm focus:ring-brand focus:border-brand" placeholder="https://drive.google.com/file/d/.../view" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Photo 2 URL</label>
              <input name="photo2" type="url" className="w-full px-3 py-2 border border-line rounded-lg text-sm focus:ring-brand focus:border-brand" placeholder="https://drive.google.com/file/d/.../view" />
            </div>

            <p className="text-[11px] text-stone-400">Availability is automatic: in stock when Closing Stock is above {`${10}`}.</p>

            <button type="submit" className="w-full bg-brand text-white font-bold py-2.5 rounded-lg hover:bg-brand-deep transition-colors mt-2">
              Add Offer
            </button>
          </form>
        </AdminModal>
        </div>
      </div>

      <OffersTableClient offers={offers || []} stores={storeList} />
    </div>
  );
}
