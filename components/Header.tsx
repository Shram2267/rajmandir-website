"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import StoreMenu from "./StoreMenu";
import SearchBar from "./SearchBar";

const NAVIGATION = [
  { href: "/", label: "Home" },
  { href: "/offers", label: "Today's Offers" },
  { href: "/pamphlets", label: "Pamphlet Offers" },
  { href: "/stores", label: "Stores" },
  { href: "/blog", label: "Blogs" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact Us" },
];

export default function Header() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="bg-cream border-b border-line">
      <div className="mx-auto w-full max-w-[1180px] px-4 lg:px-6">
        {/* Desktop row */}
        <div className="hidden lg:flex items-center gap-[18px] py-4">
          <Logo />
          <StoreMenu variant="pill" />
          <SearchBar variant="desktop" />
          <nav className="flex gap-[22px] text-[14px] font-bold">
            {NAVIGATION.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={
                  isActive(n.href)
                    ? "text-brand border-b-2 border-brand pb-[3px]"
                    : "text-stone-600 pb-[3px] hover:text-ink"
                }
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile row */}
        <div className="lg:hidden py-[14px]">
          <div className="flex items-center justify-between gap-3">
            <Logo />
            <StoreMenu variant="compact" />
          </div>
          <SearchBar variant="mobile" />
        </div>
      </div>
    </header>
  );
}
