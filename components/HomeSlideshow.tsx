"use client";

import { useEffect, useRef, useState } from "react";
import { createPublicClient } from "@/lib/supabase/public";

type Slide = { id: number; image_url: string; file_name: string | null };

const AUTOPLAY_MS = 4500;

export default function HomeSlideshow({ slides: slidesProp }: { slides?: Slide[] } = {}) {
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

  // Nothing to show — render nothing (no empty gap).
  if (!loaded || slides.length === 0) return null;

  const go = (i: number) => setIndex((i + slides.length) % slides.length);

  return (
    <section className="border-b border-line bg-sand">
      <div className="mx-auto w-full max-w-[1180px] px-4 lg:px-6 py-6 lg:py-8">
        <div className="relative overflow-hidden rounded-[18px] border border-line shadow-[0_14px_34px_rgba(33,27,23,.10)] bg-stone-100">
          {/* slides track */}
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map((s) => (
              <div key={s.id} className="flex-none w-full aspect-[16/9] sm:aspect-[16/6]">
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

          {slides.length > 1 && (
            <>
              {/* arrows */}
              <button
                type="button"
                onClick={() => go(index - 1)}
                aria-label="Previous slide"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 hover:bg-white text-ink shadow flex items-center justify-center text-lg font-bold"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                aria-label="Next slide"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 hover:bg-white text-ink shadow flex items-center justify-center text-lg font-bold"
              >
                ›
              </button>

              {/* dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
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
      </div>
    </section>
  );
}
