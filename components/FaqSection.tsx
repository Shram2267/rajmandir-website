"use client";

import { useState } from "react";
import Link from "next/link";
import { faqCategories } from "@/lib/data";
import JsonLd from "@/components/JsonLd";

export default function FaqSection() {
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState<number | null>(0);

  const active = faqCategories[tab];

  const selectTab = (i: number) => {
    setTab(i);
    setOpen(0); // open the first question of the newly selected tab
  };

  // FAQPage structured data (all questions) for SEO / rich results.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqCategories.flatMap((c) =>
      c.items.map((it) => ({
        "@type": "Question",
        name: it.q,
        acceptedAnswer: { "@type": "Answer", text: it.a },
      })),
    ),
  };

  return (
    <section className="border-b border-line bg-white">
      <JsonLd data={[faqJsonLd]} />
      <div className="mx-auto w-full max-w-[900px] px-4 lg:px-6 py-10 lg:py-16">
        <h2 className="text-center text-[26px] lg:text-[38px] font-extrabold text-ink tracking-[-.5px]">
          Frequently asked questions
        </h2>

        {/* category tabs */}
        <div className="mt-6 flex gap-2.5 overflow-x-auto justify-start lg:justify-center pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {faqCategories.map((c, i) => {
            const activeTab = i === tab;
            return (
              <button
                key={c.category}
                type="button"
                onClick={() => selectTab(i)}
                className={`whitespace-nowrap text-[13px] lg:text-[14px] font-bold px-4 py-2.5 rounded-[14px] border transition-colors ${
                  activeTab
                    ? "bg-blush border-brand text-brand"
                    : "bg-white border-line text-stone-600 hover:text-ink hover:border-stone-400"
                }`}
              >
                {c.category}
              </button>
            );
          })}
        </div>

        {/* accordion */}
        <div className="mt-7 space-y-3">
          {active.items.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={it.q} className="rounded-[16px] border border-line bg-white shadow-[0_2px_10px_rgba(33,27,23,.04)]">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 p-4 lg:p-5 text-left"
                >
                  <span className="font-bold text-[14px] lg:text-[16px] text-ink">{it.q}</span>
                  <svg
                    className={`w-5 h-5 shrink-0 text-stone-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-4 lg:px-5 pb-4 lg:pb-5 text-[13.5px] lg:text-[15px] text-stone-600 leading-[1.65]">
                      {it.a}
                      {it.link && (
                        <div className="mt-2.5">
                          <Link href={it.link.href} className="text-brand font-bold text-[13.5px] lg:text-[14px]">
                            {it.link.label} →
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
