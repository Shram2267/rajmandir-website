// ---------------------------------------------------------------------------
// "Building a wide network of Brands & Neighbourhoods"
// Two continuously-scrolling rows of trusted-brand logos with the RAJMANDIR
// chip in the centre. Same layout on every screen size.
//
// Real logos live in /public/brands/*.png. To add or swap a brand, drop a PNG
// there and add its filename (without extension) to LOGOS below.
// ---------------------------------------------------------------------------

const logo = (n: string) => `/brands/${n}.png`;

const LOGOS = [
  "amul",
  "tata",
  "parle",
  "maggi",
  "patanjali",
  "dabur",
  "kelloggs",
  "coca",
  "pepsi",
  "colgate",
  "dettol",
  "haldiram",
];

function Marquee({ logos, reverse = false }: { logos: string[]; reverse?: boolean }) {
  const loop = [...logos, ...logos]; // 2 copies → seamless -50% loop
  return (
    <div className="overflow-hidden">
      <div
        className="flex gap-3 lg:gap-6 w-max animate-marquee"
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        {loop.map((n, i) => (
          <div
            key={i}
            className="w-16 h-16 lg:w-[76px] lg:h-[76px] shrink-0 rounded-full bg-white border border-line shadow-[0_4px_14px_rgba(33,27,23,.06)] flex items-center justify-center p-2.5 lg:p-3"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo(n)} alt={n} className="w-full h-full object-contain" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NetworkSection() {
  return (
    <section className="border-b border-line bg-[#fdf2f0] overflow-hidden">
      <div className="mx-auto w-full max-w-[1180px] px-4 lg:px-6 py-10 lg:py-14">
        {/* Heading */}
        <div className="text-center mb-8 lg:mb-10">
          <h2 className="text-brand font-extrabold text-[26px] lg:text-[40px] tracking-[-.5px] leading-tight">
            Building a wide network of
          </h2>
          <div className="flex items-center justify-center gap-3 mt-1">
            <span className="h-px w-8 bg-ink/40" />
            <span className="font-extrabold text-[18px] lg:text-[24px] text-ink">Brands &amp; Neighbourhoods</span>
            <span className="h-px w-8 bg-ink/40" />
          </div>
        </div>

        {/* Two scrolling logo rows with the brand chip in the centre */}
        <Marquee logos={LOGOS} />

        <div className="my-5 lg:my-6 flex justify-center">
          <div className="rounded-2xl border-2 border-brand bg-white px-7 py-3.5 lg:px-9 lg:py-4 text-center shadow-[0_8px_24px_rgba(232,73,43,.12)]">
            <div className="font-extrabold text-[20px] lg:text-[24px] text-ink leading-none">RAJMANDIR</div>
            <div className="text-[11px] lg:text-[12px] font-extrabold tracking-[3px] text-brand mt-1.5">
              HYPERMARKET
            </div>
          </div>
        </div>

        <Marquee logos={[...LOGOS].reverse()} reverse />
      </div>
    </section>
  );
}
