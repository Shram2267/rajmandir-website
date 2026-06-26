import type { ReactNode } from "react";

/**
 * Shared shell for static content pages (legal, careers).
 * Renders the brand hero stripe + a centred prose column.
 */
export default function DocPage({
  kicker,
  title,
  updated,
  children,
}: {
  kicker: string;
  title: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <section className="rm-stripe border-b border-line text-center px-5 lg:px-[44px] py-9 lg:py-[60px]">
        <div className="font-hand text-[20px] lg:text-[24px] text-brand font-bold">{kicker}</div>
        <h1 className="text-[27px] lg:text-[44px] font-extrabold leading-[1.1] max-w-[760px] mx-auto mt-2 tracking-[-.5px] text-balance">
          {title}
        </h1>
        {updated && (
          <div className="text-[13px] text-stone-500 mt-3">Last updated: {updated}</div>
        )}
      </section>

      <section>
        <div className="mx-auto w-full max-w-[800px] px-5 lg:px-10 py-9 lg:py-[60px] doc-prose">
          {children}
        </div>
      </section>
    </div>
  );
}
