import { createClient } from "@/lib/supabase/server";
import { addStore } from "./actions";
import AdminModal from "../AdminModal";
import BulkUpload from "./BulkUpload";
import StoresTableClient from "./StoresTableClient";

export default async function StoresAdminPage() {
  const supabase = await createClient();
  const { data: stores } = await supabase.from("stores").select("*").order("id", { ascending: true });

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-ink">Manage Stores</h2>
          <p className="text-stone-500 text-sm mt-1">
            {stores?.length || 0} stores in database
          </p>
        </div>
        <div className="flex gap-2">
          <AdminModal
            trigger={
              <button className="bg-stone-100 text-stone-700 font-bold px-4 py-2.5 rounded-xl hover:bg-stone-200 transition-colors text-sm flex items-center gap-2 border border-line">
                📁 Bulk Upload
              </button>
            }
            title="Bulk Upload Stores"
          >
            <BulkUpload />
          </AdminModal>
          <AdminModal
            trigger={
              <button className="bg-brand text-white font-bold px-5 py-2.5 rounded-xl hover:bg-brand-deep transition-colors text-sm flex items-center gap-2 shadow-sm">
                <span className="text-lg leading-none">+</span> Add Store
              </button>
            }
            title="Add New Store"
          >
            <form action={addStore} className="space-y-4">
              <div className="mb-4">
                <label className="block text-xs font-bold text-stone-600 mb-1">Short Name</label>
                <input required name="short_name" type="text" className="w-full px-3 py-2 border border-line rounded-lg text-sm focus:ring-brand focus:border-brand" placeholder="AV" />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">Location / Area</label>
                <input required name="name" type="text" className="w-full px-3 py-2 border border-line rounded-lg text-sm focus:ring-brand focus:border-brand" placeholder="ASHOK VIHAR" />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">Zone</label>
                <input required name="area" type="text" className="w-full px-3 py-2 border border-line rounded-lg text-sm focus:ring-brand focus:border-brand" placeholder="North West Delhi" />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">Full Address</label>
                <textarea required name="addr" rows={2} className="w-full px-3 py-2 border border-line rounded-lg text-sm focus:ring-brand focus:border-brand" placeholder="C-3/7 Phase II Ashok Vihar, New Delhi" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Pin Code</label>
                  <input required name="pin_code" type="text" className="w-full px-3 py-2 border border-line rounded-lg text-sm focus:ring-brand focus:border-brand" placeholder="110052" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Contact No.</label>
                  <input name="phone" type="text" className="w-full px-3 py-2 border border-line rounded-lg text-sm focus:ring-brand focus:border-brand" placeholder="9968323818" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Store Manager</label>
                  <input name="manager" type="text" className="w-full px-3 py-2 border border-line rounded-lg text-sm focus:ring-brand focus:border-brand" placeholder="Manager name (optional)" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">WhatsApp No.</label>
                  <input name="whatsapp" type="text" className="w-full px-3 py-2 border border-line rounded-lg text-sm focus:ring-brand focus:border-brand" placeholder="9311239211 (optional)" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">Hours</label>
                <input name="hours" type="text" defaultValue="Open 10 AM to 10 PM Daily" className="w-full px-3 py-2 border border-line rounded-lg text-sm focus:ring-brand focus:border-brand" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Latitude (optional)</label>
                  <input name="lat" step="any" type="number" className="w-full px-3 py-2 border border-line rounded-lg text-sm focus:ring-brand focus:border-brand" placeholder="28.6692" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Longitude (optional)</label>
                  <input name="lng" step="any" type="number" className="w-full px-3 py-2 border border-line rounded-lg text-sm focus:ring-brand focus:border-brand" placeholder="77.0927" />
                </div>
              </div>

              <button type="submit" className="w-full bg-brand text-white font-bold py-2.5 rounded-lg hover:bg-brand-deep transition-colors mt-2">
                Add Store
              </button>
            </form>
          </AdminModal>
        </div>
      </div>

      <StoresTableClient stores={stores || []} />
    </div>
  );
}
