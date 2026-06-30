"use client";

import { useEffect, useMemo, useState } from "react";
import { useStore } from "@/components/StoreProvider";
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
  const { store, stores } = useStore();

  const pageMap = useMemo(() => {
    const m: Record<string, PageRow> = {};
    for (const p of pages) m[p.zone] = p;
    return m;
  }, [pages]);

  // All zones (from the stores list), like the Stores tab — but without counts.
  const zoneList = useMemo(
    () =>
      stores.length > 0
        ? Array.from(new Set(stores.map((s) => s.area || "Other"))).sort()
        : zones,
    [stores, zones],
  );

  // Default to the visitor's location (their selected store's zone); follows the
  // store if they change/detect it. "All" shows every zone that has pamphlets.
  const [selectedZone, setSelectedZone] = useState<string>(store?.area || "All");
  useEffect(() => {
    if (store?.area) setSelectedZone(store.area);
  }, [store?.area]);

  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const hasBlocks = (z: string) => (pageMap[z]?.blocks?.length ?? 0) > 0;
  const renderZones =
    selectedZone === "All" ? zoneList.filter(hasBlocks) : [selectedZone];
  const anyContent = renderZones.some(hasBlocks);

  const pill = (active: boolean) =>
    `flex-none text-[13px] lg:text-[14px] font-bold px-4 py-[7px] rounded-full transition-colors border cursor-pointer ${
      active
        ? "bg-brand border-brand text-white shadow-sm"
        : "bg-white border-line text-stone-600 hover:text-brand hover:border-brand shadow-sm"
    }`;

  const renderBlocks = (blocks: Block[], keyPrefix: string) =>
    blocks.map((block) => {
      if (block.type === "text") {
        const Tag = textStyleTag(block.style);
        return (
          <Tag
            key={keyPrefix + block.id}
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
          key={keyPrefix + block.id}
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
    });

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
        {/* zone filter — all zones with store counts, like the Stores tab */}
        <div className="flex flex-wrap gap-[8px] pb-3 border-b border-line">
          <button type="button" onClick={() => setSelectedZone("All")} className={pill(selectedZone === "All")}>
            All Zones
          </button>
          {zoneList.map((z) => (
            <button key={z} type="button" onClick={() => setSelectedZone(z)} className={pill(selectedZone === z)}>
              {z}
              {hasBlocks(z) && (
                <span
                  title="Has offers"
                  className={`ml-1.5 inline-block w-[7px] h-[7px] rounded-full align-middle ${
                    selectedZone === z ? "bg-white" : "bg-leaf"
                  }`}
                />
              )}
            </button>
          ))}
        </div>

        {/* content */}
        <div className="mt-[20px] lg:mt-[30px]">
          {!anyContent ? (
            <div className="text-center py-16 text-stone-500 font-medium">
              No pamphlets available{selectedZone !== "All" ? ` for ${selectedZone}` : ""}.
            </div>
          ) : selectedZone === "All" ? (
            <div className="space-y-10">
              {renderZones.map((z) => (
                <section key={z}>
                  <h2 className="text-[18px] lg:text-[20px] font-extrabold text-ink mb-4 pb-2 border-b border-line">
                    {z}
                  </h2>
                  <div className="space-y-5 lg:space-y-7">{renderBlocks(pageMap[z].blocks, z + "-")}</div>
                </section>
              ))}
            </div>
          ) : (
            <div className="space-y-5 lg:space-y-7">
              {renderBlocks(pageMap[selectedZone]?.blocks ?? [], selectedZone + "-")}
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
