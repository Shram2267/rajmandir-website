"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore, LOCATE_MESSAGES } from "@/components/StoreProvider";
import { storeSlug, whatsappLink } from "@/lib/stores";
import StoreMap from "./StoreMap";

export default function StoresView() {
  const router = useRouter();
  const { stores, storeIndex, setStoreIndex, useMyLocation, locating, locateError, clearLocateError } =
    useStore();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<string>("All");
  const [focusedStoreIndex, setFocusedStoreIndex] = useState<number | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const zones = Array.from(new Set(stores.map(s => s.area || "Other")));
  const zoneCounts = stores.reduce((acc, s) => {
    const area = s.area || "Other";
    acc[area] = (acc[area] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const viewOffers = (i: number) => {
    setStoreIndex(i);
    router.push("/offers");
  };

  // Filter by name, area or pincode/address; keep the original index so the
  // per-store offer availability stays correct.
  const q = query.trim().toLowerCase();
  const matches = stores
    .map((s, i) => ({ s, i }))
    .filter(
      ({ s }) =>
        (!q ||
          s.name.toLowerCase().includes(q) ||
          s.area.toLowerCase().includes(q) ||
          s.addr.toLowerCase().includes(q)) &&
        (selectedZone === "All" || (s.area || "Other") === selectedZone)
    );

  // Picking a suggestion selects that store and scrolls its card into view.
  const pickStore = (i: number) => {
    setStoreIndex(i);
    setFocusedStoreIndex(i);
    setOpen(false);
    document.getElementById(`store-${i}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // If the user searches or changes zones, clear the focused store so the map zooms out to show all pins
  useEffect(() => {
    setFocusedStoreIndex(null);
  }, [query, selectedZone]);

  // Close the suggestions dropdown on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setOpen(false);
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

  return (
    <div>
      {/* heading + search */}
      <div className="border-b border-line relative z-30 bg-cream">
        <div className="mx-auto w-full max-w-[1180px] px-4 lg:px-6 pt-7 lg:pt-[34px] pb-6">
          <div className="font-hand text-[20px] lg:text-[22px] text-brand font-bold">
            Apne Nazdeeki Store
          </div>
          <h1 className="text-[25px] lg:text-[36px] font-extrabold mt-1 lg:mt-[6px] mb-1 tracking-[-.5px]">
            Find a Store Near You
          </h1>
          <div className="text-[14px] lg:text-[15px] text-stone-600 mb-[18px]">
            {stores.length > 0 ? stores.length : 8} stores across Delhi · open 10 AM to 10 PM Daily.
          </div>

          {/* Zones Filter */}
          {stores.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setSelectedZone("All")}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${
                  selectedZone === "All"
                    ? "bg-brand text-white shadow-sm"
                    : "bg-white border border-line text-stone-600 hover:border-brand hover:text-brand"
                }`}
              >
                All Zones ({stores.length})
              </button>
              {zones.map(zone => (
                <button
                  key={zone}
                  onClick={() => setSelectedZone(zone)}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${
                    selectedZone === zone
                      ? "bg-brand text-white shadow-sm"
                      : "bg-white border border-line text-stone-600 hover:border-brand hover:text-brand"
                  }`}
                >
                  {zone} ({zoneCounts[zone]})
                </button>
              ))}
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-[9px] lg:gap-[11px] max-w-[560px]">
            <div ref={searchRef} className="relative flex-1">
              <form
                onSubmit={(e) => e.preventDefault()}
                role="search"
                className="flex w-full items-center gap-[9px] bg-white border-[1.5px] border-line rounded-[12px] px-4 py-[12px] lg:py-[13px] focus-within:border-brand transition-colors"
              >
                <span className="leading-none">📍</span>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setOpen(true);
                  }}
                  onFocus={() => setOpen(true)}
                  placeholder="Enter pincode or area…"
                  className="flex-1 bg-transparent outline-none text-ink placeholder:text-stone-400 text-[14px] lg:text-[15px] [&::-webkit-search-cancel-button]:hidden"
                />
                {query && (
                  <button
                    type="button"
                    aria-label="Clear"
                    onClick={() => {
                      setQuery("");
                      setOpen(false);
                    }}
                    className="leading-none text-stone-400 hover:text-ink text-[15px]"
                  >
                    ✕
                  </button>
                )}
              </form>

              {open && q && matches.length > 0 && (
                <div className="absolute left-0 right-0 top-[calc(100%+8px)] bg-white border border-line rounded-[14px] shadow-[0_20px_44px_rgba(33,27,23,.2)] p-2 z-[60] max-h-[320px] overflow-y-auto">
                  {matches.map(({ s, i }) => (
                    <button
                      type="button"
                      key={s.n}
                      onClick={() => pickStore(i)}
                      className="w-full flex items-center gap-[10px] px-[10px] py-[9px] rounded-[10px] text-left hover:bg-cream"
                    >
                      <span className="w-[24px] h-[24px] flex-none rounded-full border-[1.5px] border-brand text-brand text-[11px] font-extrabold flex items-center justify-center">
                        {s.n}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-[13px] font-bold truncate">{s.name}</span>
                        <span className="block text-[11px] text-stone-400 truncate">{s.addr}</span>
                      </span>
                      {storeIndex === i && <span className="text-leaf text-[13px]">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={useMyLocation}
              disabled={locating}
              className="bg-ink text-white font-bold text-[14px] lg:text-[15px] px-[22px] py-[12px] lg:py-[13px] rounded-[12px] whitespace-nowrap disabled:opacity-70"
            >
              {locating ? "🎯 Locating…" : "🎯 Use my location"}
            </button>
          </div>
          {locateError && (
            <div
              role="alert"
              className="mt-3 max-w-[640px] flex items-start gap-3 bg-brand-wash border border-brand/40 text-brand-deep rounded-[12px] px-4 py-3"
            >
              <span className="text-[18px] leading-none">⚠️</span>
              <div className="flex-1 text-[13px] lg:text-[14px] leading-[1.45]">
                {LOCATE_MESSAGES[locateError]}
              </div>
              <button
                type="button"
                onClick={clearLocateError}
                aria-label="Dismiss"
                className="leading-none text-brand-deep/70 hover:text-brand-deep text-[14px]"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>

      {/* map + list */}
      <div className="mx-auto w-full max-w-[1180px] px-4 lg:px-0 lg:flex">
        {/* map */}
        <div className="lg:flex-[1.05] relative z-0 h-[250px] lg:h-auto lg:min-h-[560px] lg:border-r border-line overflow-hidden -mx-4 lg:mx-0">
          <StoreMap
            visibleStores={matches.map(({ s }) => s)}
            selectedLat={focusedStoreIndex !== null ? stores[focusedStoreIndex]?.lat : undefined}
            selectedLng={focusedStoreIndex !== null ? stores[focusedStoreIndex]?.lng : undefined}
            onSelectStore={(idx) => {
              // When user clicks a pin on the map, select the store in the sidebar
              const originalIndex = matches[idx]?.i;
              if (originalIndex !== undefined) {
                setStoreIndex(originalIndex);
                setFocusedStoreIndex(originalIndex);
                document.getElementById(`store-${originalIndex}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
              }
            }}
          />
        </div>

        {/* list */}
        <div className="lg:flex-1 lg:max-h-[560px] lg:overflow-y-auto">
          {matches.length === 0 && (
            <div className="px-4 lg:px-[22px] py-[40px] text-center">
              <div className="text-[34px] mb-2">🔍</div>
              <div className="font-hand text-[22px] font-bold text-ink">
                No stores match “{query}”
              </div>
              <div className="text-[13px] text-stone-600 mt-1">
                Try another area or pincode — we have {stores.length > 0 ? stores.length : 8} stores across Delhi.
              </div>
            </div>
          )}
          {matches.map(({ s, i }) => (
            <div
              key={s.n}
              id={`store-${i}`}
              onClick={() => {
                setStoreIndex(i);
                setFocusedStoreIndex(i);
              }}
              className={`px-1 lg:px-[22px] py-[15px] lg:py-[18px] border-b border-line flex gap-[11px] lg:gap-[14px] scroll-mt-24 cursor-pointer transition-colors ${
                storeIndex === i ? "bg-brand/5 border-l-[3px] border-l-brand" : "hover:bg-stone-50"
              }`}
            >
              <span className="w-[26px] h-[26px] lg:w-[30px] lg:h-[30px] flex-none border-[1.5px] border-brand rounded-full text-brand font-hand text-[15px] lg:text-[18px] font-bold flex items-center justify-center">
                {s.n}
              </span>
              <div className="flex-1">
                <Link
                  href={`/stores/${storeSlug(s)}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-[15px] lg:text-[17px] font-bold hover:text-brand transition-colors"
                >
                  {s.name}
                </Link>
                <div className="text-[12px] lg:text-[13px] text-stone-600 mt-[2px]">{s.addr}</div>
                <div className="text-[11px] lg:text-[12px] text-leaf font-bold mt-[4px] lg:mt-[5px]">
                  🕘 {s.hours}
                </div>
                <div className="flex gap-[7px] lg:gap-2 mt-[9px] lg:mt-[11px] flex-wrap items-center">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="border-[1.5px] border-line rounded-[8px] lg:rounded-[9px] px-[11px] lg:px-[13px] py-[6px] lg:py-[7px] text-[11px] lg:text-[12px] font-bold cursor-pointer hover:bg-cream"
                  >
                    🧭 Directions
                  </a>
                  <a
                    href={`tel:${s.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="border-[1.5px] border-line rounded-[8px] lg:rounded-[9px] px-[11px] lg:px-[13px] py-[6px] lg:py-[7px] text-[11px] lg:text-[12px] font-bold cursor-pointer hover:bg-cream"
                  >
                    📞 Call
                  </a>
                  {whatsappLink(s.whatsapp, s.phone) && (
                    <a
                      href={whatsappLink(s.whatsapp, s.phone)!}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="bg-[#25D366] text-white rounded-[8px] lg:rounded-[9px] px-[11px] lg:px-[13px] py-[6px] lg:py-[7px] text-[11px] lg:text-[12px] font-bold cursor-pointer hover:brightness-95"
                    >
                      💬 WhatsApp
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => viewOffers(i)}
                    className="bg-brand text-white rounded-[8px] lg:rounded-[9px] px-[11px] lg:px-[13px] py-[6px] lg:py-[7px] text-[11px] lg:text-[12px] font-bold cursor-pointer"
                  >
                    View this store&apos;s offers →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
