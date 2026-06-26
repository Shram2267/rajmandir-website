import type { Metadata } from "next";
import Link from "next/link";
import { brandValues } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "About Us | Rajmandir Hypermarket",
  description: "Delhi's leading food & grocery store. Wholesale rate ka hypermarket — sab kuch, ek chhat ke neeche.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const supabase = await createClient();
  const { count } = await supabase.from("stores").select("*", { count: "exact", head: true });
  const storeCount = count || 8;

  const STATS = [
    { v: String(storeCount), l: "Stores in Delhi" },
    { v: "18,000+", l: "Products" },
    { v: "1,000+", l: "Brands" },
    { v: "85K+", l: "Happy Followers" },
  ];

  return (
    <div>
      {/* hero */}
      <section className="rm-hero-food border-b border-line text-center px-5 lg:px-[44px] py-9 lg:py-[60px]">
        <div className="font-hand text-[20px] lg:text-[24px] text-white font-bold">Hamari Kahani</div>
        <h1 className="text-[27px] lg:text-[46px] font-extrabold leading-[1.1] max-w-[760px] mx-auto mt-2 tracking-[-.5px] text-balance text-white">
          Har Indian ko mile high-quality saaman, affordable daam pe.
        </h1>
      </section>

      {/* overview & founders */}
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-[1180px] lg:flex">
          <div className="flex-1 px-5 lg:px-10 py-7 lg:py-10">
            <div className="font-hand text-[20px] lg:text-[22px] text-brand font-bold mb-2">
              Overview
            </div>
            <p className="text-[14px] lg:text-[16px] text-ink-soft leading-[1.65] m-0 mb-6">
              Rajmandir Hypermarket is a fast-growing retail chain based in Delhi NCR, offering a wide range of high-quality home and personal care products under one roof. From groceries and kitchen essentials to garments, electronics, and home décor, Rajmandir brings affordability and variety to every Indian household. With {storeCount} stores and decades of retail experience, we are committed to value-driven shopping for all.
            </p>

            <div className="font-hand text-[20px] lg:text-[22px] text-brand font-bold mb-2">
              Our Heritage & Founders
            </div>
            <p className="text-[14px] lg:text-[16px] text-ink-soft leading-[1.65] m-0">
              Rajmandir Hypermarket was founded in 1986 by Mr. Suresh Mittal, a visionary entrepreneur with a passion for providing accessible, reliable, and affordable retail services to Indian families. Under his leadership, the brand has become a household name in Delhi NCR.
            </p>
          </div>
          <div className="flex-1 lg:border-l border-line relative min-h-[240px] lg:min-h-auto overflow-hidden">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img 
               src="/Suresh Mittal.jpg" 
               alt="Founder Mr. Suresh Mittal in Rajmandir Hypermarket"
               className="absolute inset-0 w-full h-full object-cover object-top"
             />
          </div>
        </div>
      </section>

      {/* stats */}
      <section className="bg-blush border-b border-line">
        <div className="mx-auto w-full max-w-[1180px] grid grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={s.l}
              className={`px-[18px] py-[22px] lg:py-[30px] text-center ${
                i % 2 === 0 ? "border-r border-line-blush" : ""
              } lg:border-r ${i < 2 ? "border-b border-line-blush lg:border-b-0" : ""} ${
                i === 3 ? "lg:border-r-0" : ""
              } ${i === 1 ? "lg:border-r" : ""}`}
            >
              <div className="font-hand text-[34px] lg:text-[40px] font-bold text-brand leading-none">
                {s.v}
              </div>
              <div className="text-[12px] lg:text-[13px] text-stone-500 mt-[6px]">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* values */}
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-[1180px] px-4 lg:px-6 py-7 lg:py-9">
          <div className="font-hand text-[20px] lg:text-[24px] font-bold mb-[12px] lg:mb-[18px]">
            Our Customer Service Pledge
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[11px] lg:gap-4">
            {brandValues.map((v) => (
              <div
                key={v.t}
                className="border-[1.5px] border-line rounded-[16px] p-[16px] lg:p-[22px] bg-white flex lg:block gap-[13px]"
              >
                <div className="w-[42px] h-[42px] lg:w-[46px] lg:h-[46px] flex-none rounded-[11px] lg:rounded-[12px] bg-blush flex items-center justify-center text-[22px] lg:text-[24px] lg:mb-3">
                  {v.icon}
                </div>
                <div>
                  <div className="text-[16px] lg:text-[18px] font-extrabold">{v.t}</div>
                  <div className="text-[13px] lg:text-[14px] text-stone-600 leading-[1.5] mt-[3px] lg:mt-[5px]">
                    {v.d}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* timeline */}
      <section className="border-b border-line bg-blush/30">
        <div className="mx-auto w-full max-w-[800px] px-5 lg:px-10 py-9 lg:py-[60px]">
          <div className="text-center mb-8 lg:mb-12">
            <div className="font-hand text-[24px] lg:text-[30px] font-bold text-brand mb-2">Our Journey</div>
            <h2 className="text-[28px] lg:text-[36px] font-extrabold tracking-[-.5px] leading-[1.1]">Decades of Trust & Growth</h2>
          </div>

          <div className="relative border-l-[3px] border-line-blush ml-[14px] lg:ml-[20px] pl-[30px] lg:pl-[44px] pb-6">
            
            <div className="mb-10 relative">
              <div className="absolute w-[18px] h-[18px] bg-brand rounded-full -left-[40px] lg:-left-[55px] top-[6px] border-[4px] border-white shadow-sm"></div>
              <div className="font-hand text-[20px] font-bold text-brand">1986</div>
              <h3 className="text-[18px] font-extrabold mb-1 mt-1">Foundation Laid</h3>
              <p className="text-[14px] lg:text-[15px] text-stone-600 leading-[1.6] m-0">
                Founded by Mr. Suresh Mittal, a visionary entrepreneur with a passion for providing accessible and affordable retail services to Indian families.
              </p>
            </div>

            <div className="mb-10 relative">
              <div className="absolute w-[18px] h-[18px] bg-brand rounded-full -left-[40px] lg:-left-[55px] top-[6px] border-[4px] border-white shadow-sm"></div>
              <div className="font-hand text-[20px] font-bold text-brand">1996</div>
              <h3 className="text-[18px] font-extrabold mb-1 mt-1">First Modern Store</h3>
              <p className="text-[14px] lg:text-[15px] text-stone-600 leading-[1.6] m-0">
                Rajmandir opened its first modern trade retail branch in Dwarka when the region started attracting development.
              </p>
            </div>

            <div className="mb-10 relative">
              <div className="absolute w-[18px] h-[18px] bg-brand rounded-full -left-[40px] lg:-left-[55px] top-[6px] border-[4px] border-white shadow-sm"></div>
              <div className="font-hand text-[20px] font-bold text-brand">2010</div>
              <h3 className="text-[18px] font-extrabold mb-1 mt-1">Expanding Footprint</h3>
              <p className="text-[14px] lg:text-[15px] text-stone-600 leading-[1.6] m-0">
                Opened the third store in Rohini, setting the stage for aggressive expansion and business growth across the city.
              </p>
            </div>

            <div className="relative">
              <div className="absolute w-[18px] h-[18px] bg-brand rounded-full -left-[40px] lg:-left-[55px] top-[6px] border-[4px] border-white shadow-sm"></div>
              <div className="font-hand text-[20px] font-bold text-brand">Today</div>
              <h3 className="text-[18px] font-extrabold mb-1 mt-1">A Household Name</h3>
              <p className="text-[14px] lg:text-[15px] text-stone-600 leading-[1.6] m-0">
                Operating {storeCount} stores across Delhi NCR. Rajmandir continues to grow and build trust, with a vision to operate 100 stores across India in the near future.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-9 lg:py-[44px] text-center">
        <div className="font-hand text-[26px] lg:text-[30px] font-bold text-ink">
          Visit us this weekend
        </div>
        <div className="text-[14px] lg:text-[15px] text-stone-600 mt-[6px] mb-4">
          Wholesale Rate ka Hypermarket — ab aapke nazdeek.
        </div>
        <Link
          href="/stores"
          className="inline-block bg-brand text-white font-bold text-[15px] px-7 py-[14px] rounded-[40px]"
        >
          📍 Find a Store →
        </Link>
      </section>
    </div>
  );
}
