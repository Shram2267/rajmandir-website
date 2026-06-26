"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useOffers } from "./OffersProvider";
import { useSearch } from "./SearchProvider";
import { categoryIcons } from "@/lib/data";

/**
 * Header search box with a live, clickable suggestions dropdown.
 *
 * Typing updates the shared search query, so the suggestions here AND the
 * offers grid update together in real time. Suggestions are scoped to the
 * currently selected store and list in-stock items first.
 */
export default function SearchBar({ variant }: { variant: "desktop" | "mobile" }) {
  const router = useRouter();
  const { offers } = useOffers();
  const { query, setQuery, clear } = useSearch();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const desktop = variant === "desktop";

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return offers
      .filter((o) => o.name.toLowerCase().includes(q) || o.cat.toLowerCase().includes(q))
      .sort((a, b) => (a.available === b.available ? 0 : a.available ? -1 : 1))
      .slice(0, 7);
  }, [query, offers]);

  // Close the dropdown on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    if (query.trim()) router.push("/offers");
  };

  const pick = (name: string) => {
    setQuery(name);
    setOpen(false);
    router.push("/offers");
  };

  const formCls = desktop
    ? "flex w-full items-center gap-[10px] bg-white border-[1.5px] border-line rounded-[30px] px-[18px] py-[10px] focus-within:border-brand transition-colors"
    : "flex w-full items-center gap-2 bg-white border-[1.5px] border-line rounded-[30px] px-[14px] py-[9px] focus-within:border-brand transition-colors";

  return (
    <div ref={ref} className={desktop ? "relative flex-1" : "relative mt-[11px]"}>
      <form onSubmit={submit} role="search" className={formCls}>
        <button type="submit" aria-label="Search" className="leading-none">
          🔍
        </button>
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          enterKeyHint="search"
          placeholder={
            desktop ? "Search offers, brands & categories…" : "Search offers & categories…"
          }
          className={`flex-1 bg-transparent outline-none text-ink placeholder:text-stone-400 [&::-webkit-search-cancel-button]:hidden ${
            desktop ? "text-[14px]" : "text-[13px]"
          }`}
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              clear();
              setOpen(false);
            }}
            className="leading-none text-stone-400 hover:text-ink text-[15px]"
          >
            ✕
          </button>
        )}
      </form>

      {open && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] bg-white border border-line rounded-[14px] shadow-[0_20px_44px_rgba(33,27,23,.2)] p-2 z-[60] max-h-[60vh] lg:max-h-[380px] overflow-y-auto">
          {suggestions.map((s) => (
            <button
              type="button"
              key={s.id}
              onClick={() => pick(s.name)}
              className="w-full flex items-center gap-3 px-[10px] py-[9px] rounded-[10px] text-left hover:bg-cream"
            >
              <span className="w-[34px] h-[34px] flex-none rounded-[10px] bg-blush flex items-center justify-center text-[17px]">
                {categoryIcons[s.cat] ?? "🛒"}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-[13px] font-bold text-ink truncate">{s.name}</span>
                <span className="block text-[11px] text-stone-400 truncate">
                  {s.cat} · {s.offer}
                </span>
              </span>
              {s.available ? (
                <span className="flex-none flex items-center gap-[5px] text-[10px] font-bold text-leaf-deep bg-leaf-wash px-[8px] py-[3px] rounded-[20px]">
                  <span className="w-[6px] h-[6px] rounded-full bg-leaf" />
                  In stock
                </span>
              ) : (
                <span className="flex-none text-[10px] font-bold text-stone-500 bg-[#ECE5DC] px-[8px] py-[3px] rounded-[20px]">
                  Out of stock
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
