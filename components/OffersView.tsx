"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "./StoreProvider";
import { useOffers } from "./OffersProvider";
import { useSearch } from "./SearchProvider";
import StoreMenu from "./StoreMenu";
import OfferCard from "./OfferCard";
import { categories } from "@/lib/data";

type Sort = "none" | "discount" | "price";

export default function OffersView() {
  const { store, storeIndex } = useStore();
  const { offers, loading } = useOffers();
  const { query: rawQuery, setQuery, clear } = useSearch();
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("cat") ?? "All";
  const catParam = searchParams.get("cat");
  const qParam = searchParams.get("q");
  const query = rawQuery.trim();

  const [cat, setCat] = useState<string>(initialCat);
  const [sort, setSort] = useState<Sort>("none");
  const [onlyAvail, setOnlyAvail] = useState(false);
  const [dealFilter, setDealFilter] = useState<string | null>(null);

  // Sort buttons toggle: click an active one again to return to default order.
  const toggleSort = (s: Sort) => setSort((cur) => (cur === s ? "none" : s));
  const toggleDeal = (d: string) => setDealFilter((cur) => (cur === d ? null : d));

  // Deal labels (B1G1, B2G1 …) present among in-stock offers at this store.
  const deals = useMemo(() => {
    const set = new Set<string>();
    offers.forEach((o) => {
      if (o.deal && o.available) set.add(o.deal);
    });
    return Array.from(set).sort();
  }, [offers]);

  // Arriving via a category tile/deep-link drops any stale text search.
  useEffect(() => {
    if (catParam) clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catParam]);

  // Support shareable/linkable searches and the sitelinks searchbox:
  // /offers?q=<term> seeds the shared search query on arrival.
  useEffect(() => {
    if (qParam) setQuery(qParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qParam]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    let list = offers;
    // A text search spans every category; otherwise the chip selection applies.
    if (q) {
      list = list.filter(
        (o) => o.name.toLowerCase().includes(q) || o.cat.toLowerCase().includes(q),
      );
    } else {
      list = list.filter((o) => cat === "All" || o.cat === cat);
    }
    if (onlyAvail) list = list.filter((o) => o.available);
    if (dealFilter) list = list.filter((o) => o.deal === dealFilter);
    // Default order: products with a photo first (stable within each group).
    if (sort === "none") return list.slice().sort((a, b) => (b.photo ? 1 : 0) - (a.photo ? 1 : 0));
    return list
      .slice()
      .sort((a, b) => (sort === "price" ? a.priceNum - b.priceNum : b.offNum - a.offNum));
  }, [offers, storeIndex, cat, onlyAvail, dealFilter, sort, query]);

  const clearSearch = () => clear();

  const showAll = () => {
    setCat("All");
    setOnlyAvail(false);
    setSort("none");
    setDealFilter(null);
    clear();
  };

  const chips = ["All", ...categories];

  return (
    <div>
      <h1 className="sr-only">Today&apos;s Offers at {store.name}</h1>
      {/* store bar */}
      <div className="bg-ink text-white">
        <div className="mx-auto w-full max-w-[1180px] px-4 lg:px-6 py-[14px] lg:py-[18px] flex items-center justify-between gap-3">
          <div className="flex items-center gap-[11px]">
            <span className="text-[17px] lg:text-[19px]">📍</span>
            <div className="leading-[1.15]">
              <div className="text-[9px] lg:text-[11px] tracking-[.5px] text-stone-300 uppercase font-bold">
                Showing offers at
              </div>
              <div className="text-[16px] lg:text-[19px] font-extrabold">
                {store.name}
                <span className="hidden lg:inline text-[13px] text-stone-350 font-semibold">
                  {" "}
                  · {store.area}
                </span>
              </div>
            </div>
          </div>
          <StoreMenu variant="switch" />
        </div>
      </div>

      {/* search results banner */}
      {query && (
        <div className="mx-auto w-full max-w-[1180px] px-4 lg:px-6 pt-[14px] lg:pt-[18px]">
          <div className="flex items-center justify-between gap-3 bg-blush border border-line rounded-[14px] px-4 py-[11px]">
            <div className="text-[13px] lg:text-[14px] text-ink">
              Showing results for{" "}
              <span className="font-bold text-brand-deep">“{query}”</span>
              <span className="text-stone-400"> · {filtered.length} found</span>
            </div>
            <button
              type="button"
              onClick={clearSearch}
              className="flex-none text-[12px] lg:text-[13px] font-bold text-stone-600 border border-line rounded-[20px] px-[12px] py-[6px] cursor-pointer hover:text-ink"
            >
              Clear ✕
            </button>
          </div>
        </div>
      )}

      {/* chips */}
      <div className="mx-auto w-full max-w-[1180px] px-4 lg:px-6 pt-[14px] lg:pt-[18px]">
        <div className="flex gap-[9px] overflow-x-auto no-scrollbar lg:flex-wrap">
          {chips.map((c) => {
            const active = !query && cat === c;
            return (
              <button
                type="button"
                key={c}
                onClick={() => {
                  setCat(c);
                  clear(); // a category click clears any active text search
                }}
                className={`whitespace-nowrap cursor-pointer rounded-[30px] px-[16px] py-[8px] text-[12px] lg:text-[13px] font-bold border-[1.5px] ${
                  active
                    ? "bg-brand text-white border-brand"
                    : "bg-white text-stone-600 border-line"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* controls */}
      <div className="mx-auto w-full max-w-[1180px] px-4 lg:px-6">
        <div className="py-4 lg:py-[22px] mt-[2px] flex items-center gap-4 flex-wrap border-b border-line">
          {/* sort — label + segmented control */}
          <span className="text-[13px] text-stone-400 font-bold">Sort:</span>
          <div className="flex border-[1.5px] border-line rounded-[30px] overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSort("discount")}
              aria-pressed={sort === "discount"}
              className={`px-4 py-2 text-[12px] lg:text-[13px] font-bold transition-colors cursor-pointer ${
                sort === "discount" ? "bg-ink text-white" : "bg-white text-stone-600 hover:bg-stone-100"
              }`}
            >
              Highest discount
            </button>
            <button
              type="button"
              onClick={() => toggleSort("price")}
              aria-pressed={sort === "price"}
              className={`px-4 py-2 text-[12px] lg:text-[13px] font-bold border-l-[1.5px] border-line transition-colors cursor-pointer ${
                sort === "price" ? "bg-ink text-white" : "bg-white text-stone-600 hover:bg-stone-100"
              }`}
            >
              Lowest price
            </button>
          </div>

          {/* deal filters (B1G1, B2G1 …) present in stock */}
          {deals.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[13px] text-stone-400 font-bold">Deals:</span>
              {deals.map((d) => {
                const active = dealFilter === d;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDeal(d)}
                    aria-pressed={active}
                    className={`px-[13px] py-[7px] rounded-[30px] text-[12px] lg:text-[13px] font-extrabold border-[1.5px] transition-colors cursor-pointer ${
                      active
                        ? "bg-brand text-white border-brand"
                        : "bg-brand-wash text-brand-deep border-brand-wash hover:border-brand"
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex-1" />

          {/* only-available toggle */}
          <button
            type="button"
            onClick={() => setOnlyAvail((v) => !v)}
            className="flex items-center gap-[10px] text-[13px] lg:text-[14px] font-bold text-ink"
          >
            <span className="lg:hidden">Only available</span>
            <span className="hidden lg:inline">Show only available</span>
            <span
              className={`w-[44px] h-[25px] rounded-[30px] relative inline-block ${
                onlyAvail ? "bg-leaf" : "bg-line-mute"
              }`}
            >
              <span
                className={`absolute top-[3px] w-[19px] h-[19px] rounded-full bg-white transition-[left] ${
                  onlyAvail ? "left-[22px]" : "left-[3px]"
                }`}
              />
            </span>
          </button>

          <span className="hidden lg:flex text-[12px] text-stone-400 items-center gap-[6px]">
            <span className="w-[6px] h-[6px] rounded-full bg-leaf" />
            Updated today
          </span>
        </div>
      </div>

      {/* grid / empty */}
      {loading ? (
        <div className="mx-auto w-full max-w-[1180px] px-4 lg:px-6 py-6 lg:pt-6 lg:pb-9">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-[12px] lg:gap-[18px]">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-[230px] rounded-[16px] border-[1.5px] border-line bg-white animate-pulse" />
            ))}
          </div>
        </div>
      ) : filtered.length > 0 ? (
        <div className="mx-auto w-full max-w-[1180px] px-4 lg:px-6 py-6 lg:pt-6 lg:pb-9">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-[12px] lg:gap-[18px]">
            {filtered.map((o) => (
              <OfferCard key={o.id} offer={o} />
            ))}
          </div>
        </div>
      ) : (
        <div className="px-6 py-[70px] lg:py-[90px] text-center">
          <div className="text-[40px] lg:text-[46px] mb-[10px]">🧺</div>
          <div className="font-hand text-[24px] lg:text-[30px] text-ink font-bold">
            {query ? `No offers match “${query}”` : "No offers in this category right now"}
          </div>
          <div className="text-[14px] text-stone-600 mt-[6px] max-w-[460px] mx-auto">
            {query
              ? "Is store par is search ke offers abhi nahi hain. Doosra naam ya category try karein."
              : "Iss store par is category ke offers abhi nahi hain. Doosri category try karein."}
          </div>
          <button
            type="button"
            onClick={showAll}
            className="inline-block mt-[18px] bg-brand text-white font-bold text-[14px] px-6 py-3 rounded-[30px]"
          >
            Show all offers
          </button>
        </div>
      )}
    </div>
  );
}
