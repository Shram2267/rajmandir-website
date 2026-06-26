"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/offers", label: "Offers", icon: "🏷️" },
  { href: "/pamphlets", label: "Pamphlets", icon: "📄" },
  { href: "/stores", label: "Stores", icon: "📍" },
  { href: "/offers", label: "Search", icon: "🔍", key: "search" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const isActive = (href: string, key?: string) => {
    if (key === "search") return false; // search is a shortcut, never "active"
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  };

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-cream border-t border-line flex px-[6px] pt-[9px] pb-[11px] shadow-[0_-6px_18px_rgba(33,27,23,.06)]">
      {ITEMS.map((it) => {
        const active = isActive(it.href, it.key);
        return (
          <Link
            key={it.key ?? it.href}
            href={it.href}
            className={`flex-1 text-center ${active ? "text-brand" : "text-stone-400"}`}
          >
            <span className="block text-[21px] leading-none">{it.icon}</span>
            <span className={`block text-[11px] mt-[3px] ${active ? "font-extrabold" : "font-bold"}`}>
              {it.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
