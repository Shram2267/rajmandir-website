"use client";

import { useEffect, useRef, useState } from "react";
import { createPublicClient } from "@/lib/supabase/public";

type Slide = { id: number; image_url: string; file_name: string | null };

type Cta = { label: string; onClick: () => void; disabled?: boolean };

const AUTOPLAY_MS = 4500;

// Shared hero height — used by the skeleton, the empty-state fallback, and the
// carousel itself so the top of the page never shifts as slides load.
const HERO_H = "h-[300px] sm:h-[380px] lg:h-[520px]";

export default function HomeSlideshow({
  slides: slidesProp,
  cta,
}: { slides?: Slide[]; cta?: Cta } = {}) {
  const [slides, setSlides] = useState<Slide[]>(slidesProp ?? []);
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(!!slidesProp);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch the global slideshow images once on mount (unless preloaded via props).
  useEffect(() => {
    if (slidesProp) return;
    let active = true;
    (async () => {
      const supabase = createPublicClient();
      const { data } = await supabase
        .from("slideshow_images")
        .select("id, image_url, file_name")
        .order("sort_order", { ascending: true });
      if (active) {
        setSlides(data || []);
        setLoaded(true);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Autoplay.
  useEffect(() => {
    if (slides.length <= 1) return;
    timer.current = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      AUTOPLAY_MS,
    );
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [slides.length]);

  const go = (i: number) => setIndex((i + slides.length) % slides.length);

  // Loading — reserve the hero space so the page below doesn't jump.
  if (!loaded) {
    return (
      <section
        className={`w-full ${HERO_H} bg-stone-200 animate-pulse border-b border-line`}
        aria-hidden="true"
      />
    );
  }

  // No banners configured yet — branded fallback hero so the top is never empty.
  if (slides.length === 0) {
    return (
      <section
        className={`rm-hero-food w-full ${HERO_H} border-b border-line flex items-center justify-center px-6`}
      >
        {cta && (
          <button
            type="button"
            onClick={cta.onClick}
            disabled={cta.disabled}
            className="bg-white text-brand font-extrabold text-[15px] lg:text-[16px] px-7 py-[15px] rounded-[40px] shadow-[0_12px_30px_rgba(0,0,0,.25)] disabled:opacity-70"
          >
            {cta.label}
          </button>
        )}
      </section>
    );
  }

  return (
    <section className="relative w-full border-b border-line bg-stone-900">
      <div className={`relative w-full ${HERO_H} overflow-hidden`}>
        {/* slides track */}
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((s) => (
            <div key={s.id} className="flex-none w-full h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.image_url}
                alt={s.file_name || "Promotional banner"}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Geolocation CTA overlay */}
        {cta && (
          <button
            type="button"
            onClick={cta.onClick}
            disabled={cta.disabled}
            className="absolute bottom-5 left-4 lg:left-8 z-10 bg-brand text-white font-extrabold text-[14px] lg:text-[15px] px-6 py-[13px] rounded-[40px] shadow-[0_12px_30px_rgba(0,0,0,.35)] disabled:opacity-70"
          >
            {cta.label}
          </button>
        )}

        {slides.length > 1 && (
          <>
            {/* arrows */}
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous slide"
              className="absolute left-3 lg:left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/90 hover:bg-white text-ink shadow-[0_6px_18px_rgba(0,0,0,.25)] flex items-center justify-center text-2xl font-bold leading-none"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next slide"
              className="absolute right-3 lg:right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/90 hover:bg-white text-ink shadow-[0_6px_18px_rgba(0,0,0,.25)] flex items-center justify-center text-2xl font-bold leading-none"
            >
              ›
            </button>

            {/* dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? "w-6 bg-white" : "w-2 bg-white/60 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
