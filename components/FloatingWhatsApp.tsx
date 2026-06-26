"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { whatsappLink } from "@/lib/stores";

const WA_NUMBER = "9311239211";
const WA_LINK = whatsappLink(WA_NUMBER, null, "Hi") ?? `https://wa.me/91${WA_NUMBER}`;

function WhatsAppIcon({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

export default function FloatingWhatsApp() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Hide on the admin panel.
  if (pathname.startsWith("/admin")) return null;

  return (
    <div ref={ref} className="fixed right-4 bottom-[88px] lg:bottom-6 z-50 flex flex-col items-end gap-3">
      {/* Expanded quick-actions card */}
      {open && (
        <div className="w-[244px] bg-white rounded-[16px] border border-line shadow-[0_18px_44px_rgba(33,27,23,.22)] overflow-hidden animate-fade-in">
          <div className="bg-[#075E54] text-white px-4 py-3">
            <div className="text-[14px] font-extrabold leading-tight">Rajmandir Hypermarket</div>
            <div className="text-[11px] text-white/80 mt-[2px]">Hum aapki madad ke liye haazir hain 👋</div>
          </div>
          <div className="p-2">
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-[10px] rounded-[10px] hover:bg-cream transition-colors"
            >
              <span className="w-[34px] h-[34px] flex-none rounded-full bg-[#25D366] text-white flex items-center justify-center">
                <WhatsAppIcon className="w-[18px] h-[18px]" />
              </span>
              <span className="text-[13px] font-bold text-ink">Chat on WhatsApp</span>
            </a>
            <Link
              href="/offers"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-[10px] rounded-[10px] hover:bg-cream transition-colors"
            >
              <span className="w-[34px] h-[34px] flex-none rounded-full bg-blush flex items-center justify-center text-[17px]">🏷️</span>
              <span className="text-[13px] font-bold text-ink">View latest offers</span>
            </Link>
            <Link
              href="/stores"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-[10px] rounded-[10px] hover:bg-cream transition-colors"
            >
              <span className="w-[34px] h-[34px] flex-none rounded-full bg-blush flex items-center justify-center text-[17px]">📍</span>
              <span className="text-[13px] font-bold text-ink">Store locations</span>
            </Link>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Chat on WhatsApp"
        aria-expanded={open}
        className="relative w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_10px_28px_rgba(37,211,102,.5)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
      >
        {!open && (
          <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 animate-ping" style={{ animationDuration: "2.5s" }} />
        )}
        <span className="relative">
          {open ? <span className="text-[24px] leading-none font-bold">×</span> : <WhatsAppIcon />}
        </span>
      </button>
    </div>
  );
}
