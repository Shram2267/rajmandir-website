"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/components/StoreProvider";
import { useOffers } from "@/components/OffersProvider";
import StoreMenu from "@/components/StoreMenu";
import OfferCard from "@/components/OfferCard";
import {
  categories,
  categoryIcons,
  categoryCounts,
} from "@/lib/data";

const MAP_PINS = [
  { top: "15%", left: "55%", icon: "🍕", halo: "bg-yellow-400" },
  { top: "40%", left: "25%", icon: "🛍️", halo: "bg-purple-500" },
  { top: "50%", left: "65%", icon: "☕", halo: "bg-green-500" },
  { top: "70%", left: "20%", icon: "📦", halo: "bg-orange-500" },
  { top: "25%", left: "85%", icon: "🛒", halo: "bg-blue-500" },
  { top: "80%", left: "75%", icon: "🍎", halo: "bg-red-500" },
];

export default function HomeView() {
  const router = useRouter();
  const { store, stores, useMyLocation, locating } = useStore();
  const { offers, loading } = useOffers();
  // Homepage features up to 8 in-stock products that have a real photo.
  const topOffers = offers.filter((o) => o.photo && o.available).slice(0, 8);

  const findOffersNearMe = () => {
    useMyLocation();
    router.push("/offers");
  };

  return (
    <div>
      {/* ---------------- Hero ---------------- */}
      <section className="rm-stripe border-b border-line">
        <div className="mx-auto w-full max-w-[1180px] px-4 lg:px-6 flex flex-col lg:flex-row gap-8 lg:gap-0 py-8 lg:py-0">
          <div className="lg:flex-[1.25] lg:py-[54px] lg:pr-[44px] flex flex-col justify-center gap-4">
            <div className="font-hand text-[20px] lg:text-[24px] text-brand font-bold">
              Is hafte ki mega bachat ✦
            </div>
            <h1 className="text-[31px] lg:text-[52px] leading-[1.04] lg:leading-[1.02] font-extrabold m-0 tracking-[-.5px] lg:tracking-[-1px] max-w-[560px] text-balance">
              Mahine ka saara saaman, <span className="text-brand">ek chhat</span> ke neeche.
            </h1>
            <p className="text-[14px] lg:text-[17px] text-stone-600 max-w-[440px] m-0 leading-[1.5]">
              Browse aaj ke offers at your nearest Rajmandir store. Wholesale rate ka hypermarket —
              sab fresh, sab ek jagah.
            </p>
            <div className="flex flex-col sm:flex-row gap-[13px] mt-2 flex-wrap">
              <button
                type="button"
                onClick={findOffersNearMe}
                disabled={locating}
                className="bg-brand text-white font-extrabold text-[15px] lg:text-[16px] px-7 py-[15px] rounded-[40px] text-center shadow-[0_12px_30px_rgba(232,73,43,.32)] disabled:opacity-70"
              >
                {locating ? "📍 Locating…" : "See Offers Near Me →"}
              </button>
              <StoreMenu variant="ghost" />
            </div>
          </div>

          {/* offers summary card */}
          <div className="lg:flex-[.85] lg:py-10 flex items-center">
            <div className="w-full bg-white border border-line rounded-[20px] shadow-[0_18px_40px_rgba(33,27,23,.12)] overflow-hidden">
              <div className="bg-ink text-white px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-[9px]">
                  <span className="text-[17px]">📍</span>
                  <span className="leading-[1.1]">
                    <span className="block text-[10px] tracking-[.5px] text-stone-300 uppercase font-bold">
                      Showing offers for
                    </span>
                    <span className="block text-[16px] font-extrabold">{store.name}</span>
                  </span>
                </div>
                <StoreMenu variant="switchMini" />
              </div>
              <div className="px-5 py-[18px]">
                <div className="flex items-center gap-[7px] text-[12px] text-leaf font-bold mb-[14px]">
                  <span className="w-[7px] h-[7px] rounded-full bg-leaf" />
                  Refreshed daily · Updated today
                </div>
                <div className="flex gap-[10px]">
                  <div className="flex-1 bg-cream rounded-[13px] p-[14px] text-center">
                    <div className="font-hand text-[34px] font-bold text-brand leading-none">{offers.length > 0 ? offers.length : "120+"}</div>
                    <div className="text-[12px] text-stone-500 mt-[3px]">live offers</div>
                  </div>
                  <div className="flex-1 bg-cream rounded-[13px] p-[14px] text-center">
                    <div className="font-hand text-[34px] font-bold text-brand leading-none">10–10</div>
                    <div className="text-[12px] text-stone-500 mt-[3px]">open daily</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Top offers ---------------- */}
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-[1180px] px-4 lg:px-6 py-9">
          <div className="flex justify-between items-end mb-[18px]">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-hand text-[20px] lg:text-[22px] text-brand font-bold">
                  Top Offers at {store.name}
                </h2>
                <span className="inline-flex items-center gap-1 bg-brand text-white text-[10px] lg:text-[11px] font-extrabold uppercase tracking-[.5px] px-[8px] py-[3px] rounded-full">
                  ✦ Featured
                </span>
              </div>
              <div className="text-[12px] lg:text-[13px] text-stone-400 flex items-center gap-[6px] mt-[2px]">
                <span className="w-[6px] h-[6px] rounded-full bg-leaf" />
                Updated today · prices may vary by store
              </div>
            </div>
            <Link href="/offers" className="text-brand font-bold text-[14px] whitespace-nowrap">
              View all offers →
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-[12px] lg:gap-[18px]">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-[230px] rounded-[16px] border-[1.5px] border-line bg-white animate-pulse" />
              ))}
            </div>
          ) : topOffers.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-[12px] lg:gap-[18px]">
              {topOffers.map((o) => (
                <OfferCard key={o.id} offer={o} />
              ))}
            </div>
          ) : (
            <div className="text-[14px] text-stone-500 py-8 text-center">
              No featured products at {store.name} yet —{" "}
              <Link href="/offers" className="text-brand font-bold">see all offers →</Link>
            </div>
          )}
        </div>
      </section>

      {/* ---------------- Categories ---------------- */}
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-[1180px] px-4 lg:px-6 py-9">
          <h2 className="font-hand text-[22px] lg:text-[24px] text-ink font-bold mb-1">
            Shop by Category
          </h2>
          <div className="text-[14px] text-stone-600 mb-5">
            Tap a category to see its offers at your store.
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-[11px] lg:gap-4">
            {categories.map((c) => (
              <Link
                key={c}
                href={`/offers?cat=${encodeURIComponent(c)}`}
                className="flex items-center gap-[14px] bg-white border-[1.5px] border-line rounded-[16px] p-4 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-[5px] hover:shadow-[0_16px_30px_rgba(33,27,23,.1)] hover:border-brand"
              >
                <div className="w-[50px] h-[50px] flex-none rounded-[13px] bg-blush flex items-center justify-center text-[25px]">
                  {categoryIcons[c]}
                </div>
                <div>
                  <div className="text-[15px] font-bold leading-[1.15]">{c}</div>
                  <div className="text-[12px] text-stone-400 mt-[2px]">{categoryCounts[c]} items</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Map preview ---------------- */}
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-[1180px] px-4 lg:px-6 flex flex-col lg:flex-row">
          <div className="lg:flex-1 py-9 lg:py-10 lg:pr-[44px] flex flex-col justify-center">
            <div className="font-hand text-[22px] text-brand font-bold">Apne Nazdeeki Store</div>
            <h2 className="text-[28px] lg:text-[34px] font-extrabold mt-[6px] mb-3 tracking-[-.5px] leading-[1.15]">
              Delhi-NCR mein {stores.length > 0 ? stores.length : 8} stores. Wholesale bachat ab aapke ghar ke paas!
            </h2>
            <div className="text-[14px] text-stone-600 leading-[1.7] max-w-[380px] capitalize">
              {stores.length > 0
                ? `${Array.from(new Set(stores.map((s) => s.area.toLowerCase())))
                    .slice(0, 10)
                    .join(" · ")}${stores.length > 10 ? "..." : ""}`
                : "Rohini · Pitampura · Burari · Rani Bagh · Lok Vihar · DC Chowk · Prashant Vihar · Budh Vihar"}
            </div>
            <Link
              href="/stores"
              className="bg-ink text-white font-bold text-[15px] px-[26px] py-[14px] rounded-[40px] w-fit mt-5"
            >
              📍 Find a Store →
            </Link>
          </div>
          <div aria-hidden="true" className="lg:flex-1 relative min-h-[220px] lg:min-h-[300px] bg-[#EAE0D3] lg:border-l border-line overflow-hidden">
            {/* Abstract Vector Map (Roads and Water) — purely decorative */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" fill="none">
              {/* Water Bodies */}
              <path d="M 700,100 C 750,50 800,150 780,200 C 740,250 680,180 700,100 Z" fill="#D3DDE5" opacity="0.8" />
              <path d="M -20,250 C 30,220 80,300 40,350 C -10,380 -50,300 -20,250 Z" fill="#D3DDE5" opacity="0.8" />
              <path d="M 350,380 C 400,350 450,420 400,450 C 350,480 300,420 350,380 Z" fill="#D3DDE5" opacity="0.8" />
              
              {/* Thick Main Highways */}
              <path d="M -50,150 Q 200,200 400,100 T 850,250" stroke="#ffffff" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 200,-50 Q 250,200 150,450" stroke="#ffffff" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
              
              {/* Arterial roads */}
              <path d="M 100,50 L 300,300 L 600,200 L 700,450" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M -50,300 L 250,250 L 500,450" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 400,-50 L 450,150 L 850,100" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 550,-50 L 500,250 L 750,350" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              
              {/* Local roads */}
              <path d="M 50,100 L 150,150 L 100,250 L 200,300" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 300,50 L 400,100 L 350,200 L 450,250 L 400,350" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 600,50 L 550,150 L 650,200 L 600,300 L 700,350" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            {/* Pins */}
            {MAP_PINS.map((pin, i) => (
              <div 
                key={i} 
                className="absolute transform -translate-x-1/2 -translate-y-[120%] z-10 hover:scale-110 transition-transform"
                style={{ top: pin.top, left: pin.left }}
              >
                {/* Pulsing Halo */}
                <div 
                  className={`absolute inset-[-6px] rounded-full animate-ping opacity-40 ${pin.halo}`} 
                  style={{ animationDelay: `${i * 0.4}s`, animationDuration: '2.5s' }} 
                />
                
                {/* Main Circle */}
                <div className="relative w-10 h-10 bg-white rounded-full flex items-center justify-center text-[20px] shadow-md z-10 border-[3px] border-white">
                  {pin.icon}
                </div>
                {/* Pointer */}
                <div className="absolute -bottom-[5px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-white z-20" />
              </div>
            ))}

            <div className="absolute bottom-[14px] left-[16px] font-mono text-[11px] text-stone-500 z-20 bg-white/80 px-2 py-1 rounded">
              [ Delhi map · store pins ]
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
