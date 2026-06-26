"use client";

import { useState } from "react";

type Pamphlet = {
  id: number;
  zone: string;
  image_url: string;
  file_name: string;
};

export default function PamphletOffersView({
  pamphlets,
  zones,
}: {
  pamphlets: Pamphlet[];
  zones: string[];
}) {
  const [selectedZone, setSelectedZone] = useState<string>("All");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const filtered = selectedZone === "All" 
    ? pamphlets 
    : pamphlets.filter((p) => p.zone === selectedZone);

  const chips = ["All", ...zones];

  return (
    <div>
      <h1 className="sr-only">Pamphlet Offers — Rajmandir Hypermarket</h1>
      <div className="bg-ink text-white">
        <div className="mx-auto w-full max-w-[1180px] px-4 lg:px-6 py-[14px] lg:py-[18px] flex items-center justify-between gap-3">
          <div className="flex items-center gap-[11px]">
            <span className="text-[17px] lg:text-[19px]">📄</span>
            <div className="leading-[1.15]">
              <div className="text-[9px] lg:text-[11px] tracking-[.5px] text-stone-300 uppercase font-bold">
                Browse latest
              </div>
              <div className="text-[16px] lg:text-[19px] font-extrabold">
                Pamphlet Offers
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1180px] px-4 lg:px-6 py-[14px] lg:py-[22px]">
        {/* filter pills */}
        <div className="flex overflow-x-auto gap-[8px] pb-3 no-scrollbar border-b border-line">
          {chips.map((z) => {
            const active = selectedZone === z;
            return (
              <button
                key={z}
                type="button"
                onClick={() => setSelectedZone(z)}
                className={`flex-none text-[13px] lg:text-[14px] font-bold px-[18px] py-[8px] rounded-[24px] transition-colors border cursor-pointer ${
                  active
                    ? "bg-brand border-brand text-white"
                    : "bg-white border-line text-stone-600 hover:text-ink hover:border-stone-400 shadow-sm"
                }`}
              >
                {z}
              </button>
            );
          })}
        </div>

        {/* image grid */}
        <div className="mt-[20px] lg:mt-[30px]">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-stone-500 font-medium">
              No pamphlets available for {selectedZone}.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {filtered.map((p) => (
                <div 
                  key={p.id} 
                  className="cursor-pointer group relative rounded-[14px] overflow-hidden border border-line shadow-sm hover:shadow-md transition-shadow aspect-[3/4] bg-stone-100"
                  onClick={() => setLightboxImage(p.image_url)}
                >
                  <img 
                    src={p.image_url} 
                    alt={`Offer in ${p.zone}`} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors pointer-events-none" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-[100] bg-ink/90 flex items-center justify-center p-4 lg:p-10"
          onClick={() => setLightboxImage(null)}
        >
          <button 
            className="absolute top-4 right-4 lg:top-6 lg:right-6 text-white text-3xl opacity-70 hover:opacity-100"
            onClick={() => setLightboxImage(null)}
          >
            ✕
          </button>
          <img 
            src={lightboxImage} 
            alt="Expanded pamphlet" 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
