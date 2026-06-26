export default function AdminDashboard() {
  return (
    <div className="max-w-4xl p-8">
      <h2 className="text-2xl font-extrabold text-ink mb-6">Welcome to the Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-line">
          <h3 className="text-lg font-bold text-ink mb-2">🏪 Manage Stores</h3>
          <p className="text-stone-500 mb-4 text-sm">Add, edit, or remove store locations from the map and directory.</p>
          <a href="/admin/stores" className="text-brand font-bold hover:underline text-sm">Go to Stores →</a>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-line">
          <h3 className="text-lg font-bold text-ink mb-2">🏷️ Manage Offers</h3>
          <p className="text-stone-500 mb-4 text-sm">Update the daily offers, prices, and stock availability across categories.</p>
          <a href="/admin/offers" className="text-brand font-bold hover:underline text-sm">Go to Offers →</a>
        </div>
      </div>
    </div>
  );
}
