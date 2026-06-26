"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useStore } from "./StoreProvider";

type Variant = "pill" | "compact" | "switch" | "switchMini" | "ghost";

/**
 * A store-picker trigger that opens its OWN dropdown anchored directly beneath
 * the button it belongs to. The panel is rendered through a portal so it can't
 * be clipped by an `overflow:hidden` ancestor or hidden behind other layers.
 *
 * Every place that lets the user change store uses this component, so the
 * selected store updates globally (via context) no matter where you pick it.
 */
export default function StoreMenu({ variant }: { variant: Variant }) {
  const { stores, store, storeIndex, setStoreIndex, useMyLocation } = useStore();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Right-anchored for triggers that sit on the right edge of their row.
  const align: "left" | "right" = variant === "switch" || variant === "switchMini" ? "right" : "left";

  // Position the portal panel relative to the trigger, clamped to the viewport.
  const place = () => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const width = Math.min(300, vw - 16);
    let left = align === "right" ? r.right - width : r.left;
    left = Math.max(8, Math.min(left, vw - width - 8));
    setPos({ top: r.bottom + 8, left, width });
  };

  useLayoutEffect(() => {
    if (!open) return;
    place();
    const onChange = () => place();
    window.addEventListener("scroll", onChange, true);
    window.addEventListener("resize", onChange);
    return () => {
      window.removeEventListener("scroll", onChange, true);
      window.removeEventListener("resize", onChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t)) return;
      if (panelRef.current?.contains(t)) return;
      setOpen(false);
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

  const pick = (i: number) => {
    setStoreIndex(i);
    setOpen(false);
  };
  const locate = () => {
    useMyLocation();
    setOpen(false);
  };

  const triggers: Record<Variant, { cls: string; inner: ReactNode }> = {
    pill: {
      cls: "flex items-center gap-2 bg-white border-[1.5px] border-brand rounded-[30px] px-4 py-[9px] cursor-pointer shadow-[0_4px_14px_rgba(232,73,43,.12)]",
      inner: (
        <>
          <span className="text-[15px]">📍</span>
          <span className="leading-[1.05] text-left">
            <span className="block text-[10px] tracking-[.5px] text-stone-400 font-bold uppercase">
              Your store
            </span>
            <span className="block text-[14px] font-bold text-ink">{store.name}</span>
          </span>
          <span className="text-brand text-[12px] ml-[2px]">▾</span>
        </>
      ),
    },
    compact: {
      cls: "flex items-center gap-[7px] bg-white border-[1.5px] border-brand rounded-[30px] px-3 py-[7px] cursor-pointer",
      inner: (
        <>
          <span className="text-[13px]">📍</span>
          <span className="leading-none text-left">
            <span className="block text-[8px] tracking-[.5px] text-stone-400 font-bold uppercase">
              Store
            </span>
            <span className="block text-[12px] font-bold text-ink">{store.name}</span>
          </span>
          <span className="text-brand text-[10px]">▾</span>
        </>
      ),
    },
    switch: {
      cls: "bg-brand text-white font-bold text-[12px] lg:text-[14px] px-[14px] lg:px-5 py-[9px] lg:py-[11px] rounded-[30px] whitespace-nowrap cursor-pointer",
      inner: <>Switch store ▾</>,
    },
    switchMini: {
      cls: "text-[12px] font-bold text-brand-tint border border-ink-soft px-[11px] py-[6px] rounded-[20px] cursor-pointer",
      inner: <>Switch</>,
    },
    ghost: {
      cls: "bg-white border-[1.5px] border-ink text-ink font-bold text-[15px] lg:text-[16px] px-[26px] py-[15px] rounded-[40px] cursor-pointer",
      inner: <>Choose Your Store</>,
    },
  };

  const t = triggers[variant];

  const panel =
    open && pos && mounted
      ? createPortal(
          <div
            ref={panelRef}
            style={{ position: "fixed", top: pos.top, left: pos.left, width: pos.width }}
            className="bg-white border border-line rounded-[14px] shadow-[0_20px_44px_rgba(33,27,23,.2)] p-2 z-[100]"
          >
            <button
              type="button"
              onClick={locate}
              className="w-full flex items-center gap-[9px] px-3 py-[11px] rounded-[10px] cursor-pointer bg-blush text-brand-deep font-bold text-[13px] mb-[6px] text-left"
            >
              🎯 Use my location · find nearby store
            </button>
            <div className="max-h-[260px] overflow-y-auto">
              {stores.map((s, i) => (
                <button
                  type="button"
                  key={s.n}
                  onClick={() => pick(i)}
                  className="w-full flex items-center gap-[10px] px-3 py-[9px] rounded-[10px] cursor-pointer text-left hover:bg-cream"
                >
                  <span className="w-[22px] h-[22px] flex-none rounded-full border-[1.5px] border-brand text-brand text-[11px] font-extrabold flex items-center justify-center">
                    {s.n}
                  </span>
                  <span className="flex-1">
                    <span className="block text-[13px] font-bold">{s.name}</span>
                    <span className="block text-[11px] text-stone-400">{s.area}</span>
                  </span>
                  {storeIndex === i && <span className="text-leaf text-[14px]">✓</span>}
                </button>
              ))}
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((o) => !o)}
        className={t.cls}
      >
        {t.inner}
      </button>
      {panel}
    </>
  );
}
