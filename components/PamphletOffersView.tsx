"use client";

import { useMemo, useState } from "react";
import { textStyleClass, textStyleTag, type TextStyle } from "@/lib/pamphletText";

type ImageItem = { url: string; fileName?: string };
type Block =
  | { id: string; type: "text"; text: string; style?: TextStyle }
  | { id: string; type: "images"; cols: number; items: (ImageItem | null)[] };

type PageRow = { zone: string; blocks: Block[] };

export default function PamphletOffersView({
  pages,
  zones,
}: {
  pages: PageRow[];
  zones: string[];
}) {
  const pageMap = useMemo(() => {
    const m: Record<string, PageRow> = {};
    for (const p of pages) m[p.zone] = p;
    return m;
  }, [pages]);

  const zonesWithContent = zones.filter((z) => (pageMap[z]?.blocks?.length ?? 0) > 0);

  const [selectedZone, setSelectedZone] = useState<string>(
    zonesWithContent[0] || zones[0] || "",
  );
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const blocks = pageMap[selectedZone]?.blocks ?? [];
  const chips = zonesWithContent.length > 0 ? zonesWithContent : zones;

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
              <div className="text-[16px] lg:text-[19px] font-extrabold">Pamphlet Offers</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1180px] px-4 lg:px-6 py-[14px] lg:py-[22px]">
        {/* filter pills */}
        {chips.length > 0 && (
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
        )}

        {/* blocks */}
        <div className="mt-[20px] lg:mt-[30px] space-y-5 lg:space-y-7">
          {blocks.length === 0 ? (
            <div className="text-center py-16 text-stone-500 font-medium">
              No pamphlets available for {selectedZone}.
            </div>
          ) : (
            blocks.map((block) => {
              if (block.type === "text") {
                const Tag = textStyleTag(block.style);
                return (
                  <Tag
                    key={block.id}
                    className={`whitespace-pre-wrap ${textStyleClass(block.style)}`}
                  >
                    {block.text}
                  </Tag>
                );
              }
              const images = block.items.filter((it): it is ImageItem => !!it);
              if (images.length === 0) return null;
              return (
                <div
                  key={block.id}
                  className="pamphlet-grid"
                  style={{ ["--cols" as string]: String(block.cols) }}
                >
                  {block.items.map((item, idx) =>
                    item ? (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setLightboxImage(item.url)}
                        className="block w-full rounded-[14px] overflow-hidden border border-line shadow-sm hover:shadow-md transition-shadow bg-white cursor-pointer"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.url}
                          alt={`Offer in ${selectedZone}`}
                          className="w-full h-auto object-contain"
                        />
                      </button>
                    ) : (
                      <div key={idx} aria-hidden />
                    ),
                  )}
                </div>
              );
            })
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
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
