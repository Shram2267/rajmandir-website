import Link from "next/link";
import { logout } from "./login/actions";
import AdminNav from "./AdminNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden bg-stone-50 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-ink text-white flex flex-col shrink-0">
        <div className="h-14 flex items-center px-4 justify-between border-b border-stone-800">
          <Link href="/admin" className="font-serif italic font-bold text-brand text-lg">
            Rajmandir <span className="not-italic text-xs text-stone-400">ADMIN</span>
          </Link>
          <form action={logout}>
            <button className="text-xs text-stone-300">Logout ↪</button>
          </form>
        </div>
        {/* Mobile horizontal nav */}
        <AdminNav variant="mobile" />
      </div>

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex w-64 bg-ink text-white flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-stone-700">
          <Link href="/admin" className="font-serif italic font-bold text-brand text-xl">
            Rajmandir <span className="not-italic text-sm text-stone-400">ADMIN</span>
          </Link>
        </div>
        
        <AdminNav />

        <div className="p-4 border-t border-stone-700">
          <form action={logout}>
            <button className="w-full px-4 py-2 bg-stone-800 text-stone-300 rounded-lg hover:bg-stone-700 hover:text-white transition-colors text-left text-sm font-semibold flex items-center justify-between">
              Sign Out
              <span>↪</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header (Desktop only) */}
        <header className="hidden md:flex h-16 bg-white border-b border-line items-center px-8 justify-between shrink-0">
          <h1 className="font-bold text-lg text-ink">Admin Control Panel</h1>
          <a href="/" target="_blank" className="text-sm text-brand font-semibold hover:underline">
            View Live Site ↗
          </a>
        </header>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
