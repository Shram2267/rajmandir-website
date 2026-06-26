import type { Metadata } from "next";
import ContactMap from "./ContactMap";

export const metadata: Metadata = {
  title: "Contact Us | Rajmandir Hypermarket",
  description: "Contact Rajmandir Hypermarket for inquiries, customer support, and store information.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="bg-white">
      {/* hero */}
      <section className="rm-hero-food border-b border-line text-center px-5 lg:px-[44px] py-9 lg:py-[60px]">
        <div className="font-hand text-[20px] lg:text-[24px] text-white font-bold">Hamse Judein</div>
        <h1 className="text-[27px] lg:text-[46px] font-extrabold leading-[1.1] max-w-[760px] mx-auto mt-2 tracking-[-.5px] text-balance text-white">
          Aapke har sawaal aur sujhaav ke liye, hum hamesha haazir hain.
        </h1>
      </section>

      {/* Intro Text */}
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-[800px] text-center px-5 lg:px-10 py-7 lg:py-10">
          <p className="text-[16px] lg:text-[18px] text-ink-soft leading-[1.65] m-0">
            We value your opinions, suggestions, even your complaints! Because we’d be more than
            happy to help make every shopping experience of yours a truly world-class one.
          </p>
          <div className="mt-8">
            <a
              href="https://forms.gle/8w8kgti2DugA8ZZx6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-bold text-[15px] lg:text-[16px] px-8 py-3 lg:py-4 rounded-[12px] transition-colors"
            >
              <span>📝</span> FILL FEEDBACK FORM
            </a>
          </div>
        </div>
      </section>

      {/* Details & Map */}
      <section className="border-b border-line bg-sand/30">
        <div className="mx-auto w-full max-w-[1180px] lg:flex">
          <div className="flex-1 px-5 lg:px-10 py-9 lg:py-[60px]">
            <div className="font-hand text-[24px] lg:text-[30px] font-bold text-brand mb-6">
              Get in Touch
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="w-[40px] h-[40px] rounded-full bg-white border border-line flex items-center justify-center text-[20px] shrink-0">
                  📍
                </div>
                <div>
                  <div className="font-bold text-[16px] lg:text-[18px] text-ink mb-1">Address</div>
                  <div className="text-[14px] lg:text-[15px] text-ink-soft leading-[1.5]">
                    M-113 Guru Harkishan Nagar<br />Paschim Vihar, New Delhi - 87
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-[40px] h-[40px] rounded-full bg-white border border-line flex items-center justify-center text-[20px] shrink-0">
                  📞
                </div>
                <div>
                  <div className="font-bold text-[16px] lg:text-[18px] text-ink mb-1">Phone</div>
                  <div className="text-[14px] lg:text-[15px] text-ink-soft leading-[1.5]">
                    (+91) 9311239211
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-[40px] h-[40px] rounded-full bg-white border border-line flex items-center justify-center text-[20px] shrink-0">
                  ✉️
                </div>
                <div>
                  <div className="font-bold text-[16px] lg:text-[18px] text-ink mb-1">Email</div>
                  <div className="text-[14px] lg:text-[15px] text-ink-soft leading-[1.5]">
                    <a href="mailto:rajmandir.care@gmail.com" className="hover:text-brand transition-colors">
                      rajmandir.care@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 lg:border-l border-line relative min-h-[300px] lg:min-h-[400px]">
            <ContactMap />
          </div>
        </div>
      </section>
    </div>
  );
}
