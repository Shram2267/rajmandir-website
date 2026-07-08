"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createPublicClient } from "@/lib/supabase/public";
import type { BlogPost } from "@/lib/blog";

// Home-page "From our blog" band — a green rounded panel with a heading on the
// left and a horizontal, arrow-navigable carousel of post cards on the right
// (modelled on Hyperpure's sustainability section). Renders nothing until at
// least one published post exists, so the home page is never broken.
export default function BlogCarousel() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loaded, setLoaded] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const supabase = createPublicClient();
      const { data } = await supabase
        .from("blog_posts")
        .select("id, slug, title, excerpt, cover_url, published, sort_order, created_at")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (active) {
        setPosts((data as BlogPost[]) || []);
        setLoaded(true);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (!loaded || posts.length === 0) return null;

  const scroll = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <section className="border-b border-line bg-sand">
      <div className="mx-auto w-full max-w-[1180px] px-4 lg:px-6 py-8 lg:py-12">
        <div className="rounded-[28px] bg-leaf overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8 p-6 lg:p-10">
            {/* heading */}
            <div className="lg:w-[300px] lg:shrink-0 text-white">
              <h2 className="text-[26px] lg:text-[34px] font-extrabold leading-[1.1] tracking-[-.5px]">
                Straight from our blog
              </h2>
              <p className="text-[14px] lg:text-[15px] text-white/90 mt-3 leading-[1.55]">
                Recipes, savings tips and store news — a little something for every kitchen.
              </p>
              <Link
                href="/blog"
                className="inline-block mt-5 bg-white text-leaf-deep font-extrabold text-[14px] px-5 py-2.5 rounded-full"
              >
                View all posts →
              </Link>
            </div>

            {/* carousel */}
            <div className="relative flex-1 min-w-0">
              <div
                ref={trackRef}
                className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {posts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/blog/${p.slug}`}
                    className="group relative shrink-0 snap-start w-[230px] lg:w-[260px] aspect-[3/4] rounded-[18px] overflow-hidden bg-stone-800"
                  >
                    {p.cover_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.cover_url}
                        alt={p.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        draggable={false}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-5xl">📝</div>
                    )}
                    {/* top-down gradient for legible overlaid text */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/10 to-transparent" />
                    <div className="absolute top-0 left-0 right-0 p-4 text-white">
                      <h3 className="text-[17px] lg:text-[19px] font-extrabold leading-[1.15] drop-shadow-sm">
                        {p.title}
                      </h3>
                      {p.excerpt && (
                        <p className="text-[12px] lg:text-[13px] text-white/85 mt-1.5 leading-[1.4] line-clamp-2">
                          {p.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              {posts.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => scroll(-1)}
                    aria-label="Previous posts"
                    className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white text-ink shadow-[0_6px_18px_rgba(0,0,0,.25)] items-center justify-center text-2xl font-bold leading-none"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => scroll(1)}
                    aria-label="Next posts"
                    className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white text-ink shadow-[0_6px_18px_rgba(0,0,0,.25)] items-center justify-center text-2xl font-bold leading-none"
                  >
                    ›
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
