"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNav({ variant = "sidebar" }: { variant?: "sidebar" | "mobile" }) {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Dashboard", exact: true },
    { href: "/admin/stores", label: "🏪 Stores" },
    { href: "/admin/offers", label: "🏷️ Offers" },
    { href: "/admin/pamphlets", label: "📄 Pamphlets" },
    { href: "/admin/slideshow", label: "🖼️ Slideshow" },
    { href: "/admin/blog", label: "📝 Blog" },
  ];

  if (variant === "mobile") {
    return (
      <nav className="flex w-full overflow-x-auto border-b border-stone-700 bg-stone-900">
        {links.map((link) => {
          const isActive = link.exact 
            ? pathname === link.href 
            : pathname.startsWith(link.href);
            
          return (
            <Link 
              key={link.href} 
              href={link.href} 
              className={`whitespace-nowrap px-4 py-3 text-sm font-semibold transition-colors ${
                isActive 
                  ? "border-b-2 border-brand text-white" 
                  : "text-stone-400 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="flex-1 px-4 py-6 space-y-2">
      {links.map((link) => {
        const isActive = link.exact 
          ? pathname === link.href 
          : pathname.startsWith(link.href);
          
        return (
          <Link 
            key={link.href} 
            href={link.href} 
            className={`block px-4 py-2 rounded-lg transition-colors font-semibold ${
              isActive 
                ? "bg-brand text-white" 
                : "text-stone-300 hover:bg-stone-800"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
