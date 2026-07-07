import Link from "next/link";

// ---------------------------------------------------------------------------
// "Building a wide network of Brands & Neighbourhoods"
// Rajmandir adaptation of the Hyperpure network diagram — matched closely to
// the reference: thin converging dashes on the left (brands -> hub), thick
// coloured ribbons with a flowing dashed centreline on the right (hub ->
// departments), rose pills with dark uppercase labels, and marqueeing logos.
//
// Real logos live in /public/brands/*.png. To add or swap a brand, drop a PNG
// there and reference its filename (without extension) in the rows below.
// ---------------------------------------------------------------------------

const logo = (n: string) => `/brands/${n}.png`;

type Row = { title: string; logos: string[] };

const LEFT_ROWS: Row[] = [
  { title: "NATIONAL", logos: ["amul", "tata", "parle", "maggi"] },
  { title: "STAPLES", logos: ["patanjali", "dabur", "kelloggs", "amul"] },
  { title: "IMPORTED", logos: ["coca", "pepsi", "colgate", "maggi"] },
];

const RIGHT_ROWS: Row[] = [
  { title: "GROCERIES", logos: ["maggi", "parle", "tata", "patanjali"] },
  { title: "HOME & CARE", logos: ["dettol", "colgate", "dabur", "patanjali"] },
  { title: "SNACKS", logos: ["coca", "pepsi", "haldiram", "kelloggs"] },
];

// Geometry (viewBox 0 0 1160 600).
const ROW_Y = [140, 300, 460];
const STEP = 96; // spacing between logo circles (must match CSS unit / 4)
const LEFT_BASE = 30; // cx of first left logo circle
const RIGHT_BASE = 940; // cx of first right logo circle
const HUB = { x: 495, y: 235, w: 170, h: 130 };
const LEFT_PILL = 262; // pill left edge
const RIGHT_PILL = 758;
const PILL_W = 140;

// Ribbon colours: top two rose, bottom tan (as in the reference).
const RIBBON = ["#e7a49c", "#e7a49c", "#d6be8f"];

function MarqueeRow({ row, rowY, baseX, duration }: { row: Row; rowY: number; baseX: number; duration: number }) {
  const loop = [...row.logos, ...row.logos]; // 2 copies -> seamless 1-unit shift
  return (
    <g className="rm-svg-marquee rm-svg-marquee-rev" style={{ animationDuration: `${duration}s` }}>
      {loop.map((n, i) => {
        const cx = baseX + i * STEP;
        return (
          <g key={i}>
            <circle cx={cx} cy={rowY} r={36} fill="#ffffff" stroke="#f0e2dc" strokeWidth={1.5} />
            <image href={logo(n)} x={cx - 27} y={rowY - 27} width={54} height={54} preserveAspectRatio="xMidYMid meet" />
          </g>
        );
      })}
    </g>
  );
}

function NodePill({ title, x, y }: { title: string; x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y - 20} width={PILL_W} height={40} rx={20} fill="#f8d3cd" />
      <text
        x={x + PILL_W / 2}
        y={y + 1}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={14}
        fontWeight={800}
        letterSpacing={0.6}
        fill="#4a332e"
      >
        {title}
      </text>
    </g>
  );
}

const ALL_LOGOS = Array.from(new Set([...LEFT_ROWS, ...RIGHT_ROWS].flatMap((r) => r.logos)));

export default function NetworkSection() {
  return (
    <section className="border-b border-line bg-[#fdf2f0] overflow-hidden">
      <div className="mx-auto w-full max-w-[1180px] px-4 lg:px-6 py-10 lg:py-14">
        {/* Heading */}
        <div className="text-center mb-6 lg:mb-2">
          <h2 className="text-brand font-extrabold text-[26px] lg:text-[40px] tracking-[-.5px] leading-tight">
            Building a wide network of
          </h2>
          <div className="flex items-center justify-center gap-3 mt-1">
            <span className="h-px w-8 bg-ink/40" />
            <span className="font-extrabold text-[18px] lg:text-[24px] text-ink">Brands &amp; Neighbourhoods</span>
            <span className="h-px w-8 bg-ink/40" />
          </div>
        </div>

        {/* ---------- Desktop diagram (SVG) ---------- */}
        <svg
          viewBox="0 0 1160 600"
          className="hidden lg:block w-full h-auto"
          role="img"
          aria-label="Rajmandir brings trusted brands together into everyday shopping departments"
        >
          <defs>
            <clipPath id="rm-left-clip">
              <rect x={0} y={70} width={256} height={470} />
            </clipPath>
            <clipPath id="rm-right-clip">
              <rect x={900} y={70} width={260} height={470} />
            </clipPath>
          </defs>

          {/* LEFT — thin dashes: logos -> pill -> hub (converging) */}
          <g fill="none" stroke="#eeccc7" strokeWidth={3} strokeDasharray="6 8" strokeLinecap="round">
            {ROW_Y.map((y, i) => (
              <g key={`ld${i}`}>
                <path d={`M 256 ${y} L ${LEFT_PILL} ${y}`} />
                <path d={`M ${LEFT_PILL + PILL_W} ${y} C ${LEFT_PILL + PILL_W + 50} ${y}, ${HUB.x - 24} 300, ${HUB.x} 300`} />
              </g>
            ))}
          </g>

          {/* RIGHT — thick coloured ribbons with flowing centreline: hub -> pill */}
          {ROW_Y.map((y, i) => {
            const oy = y === 300 ? 300 : y < 300 ? 296 : 304;
            const d = `M ${HUB.x + HUB.w} ${oy} C ${HUB.x + HUB.w + 68} ${oy}, ${RIGHT_PILL - 62} ${y}, ${RIGHT_PILL} ${y}`;
            return (
              <g key={`rb${i}`}>
                <path d={d} fill="none" stroke={RIBBON[i]} strokeWidth={13} strokeLinecap="round" />
                <path
                  className="rm-flow"
                  d={d}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth={2.5}
                  strokeDasharray="7 11"
                  strokeLinecap="round"
                  opacity={0.9}
                />
              </g>
            );
          })}
          {/* right: thin dashes pill -> logos */}
          <g fill="none" stroke="#eeccc7" strokeWidth={3} strokeDasharray="6 8" strokeLinecap="round">
            {ROW_Y.map((y, i) => (
              <path key={`rd${i}`} d={`M ${RIGHT_PILL + PILL_W} ${y} L 904 ${y}`} />
            ))}
          </g>

          {/* left logo marquees + pills */}
          <g clipPath="url(#rm-left-clip)">
            {LEFT_ROWS.map((row, i) => (
              <MarqueeRow key={`L${i}`} row={row} rowY={ROW_Y[i]} baseX={LEFT_BASE} duration={20 + i * 2} />
            ))}
          </g>
          {LEFT_ROWS.map((row, i) => (
            <NodePill key={`LP${i}`} title={row.title} x={LEFT_PILL} y={ROW_Y[i]} />
          ))}

          {/* right logo marquees + pills */}
          <g clipPath="url(#rm-right-clip)">
            {RIGHT_ROWS.map((row, i) => (
              <MarqueeRow key={`R${i}`} row={row} rowY={ROW_Y[i]} baseX={RIGHT_BASE} duration={21 + i * 2} />
            ))}
          </g>
          {RIGHT_ROWS.map((row, i) => (
            <NodePill key={`RP${i}`} title={row.title} x={RIGHT_PILL} y={ROW_Y[i]} />
          ))}

          {/* centre hub with faint halo */}
          <g>
            <rect
              x={HUB.x - 10}
              y={HUB.y - 10}
              width={HUB.w + 20}
              height={HUB.h + 20}
              rx={28}
              fill="none"
              stroke="#f4d4cd"
              strokeWidth={2}
            />
            <rect
              x={HUB.x}
              y={HUB.y}
              width={HUB.w}
              height={HUB.h}
              rx={22}
              fill="#ffffff"
              stroke="#f0ddd7"
              strokeWidth={1.5}
            />
            <text x={HUB.x + HUB.w / 2} y={292} textAnchor="middle" fontSize={27} fontWeight={900} fill="#211b17">
              RAJMANDIR
            </text>
            <text
              x={HUB.x + HUB.w / 2}
              y={322}
              textAnchor="middle"
              fontSize={14}
              fontWeight={800}
              fill="#e8492b"
              letterSpacing={3}
            >
              HYPERMARKET
            </text>
          </g>
        </svg>

        {/* ---------- Mobile stacked layout (HTML marquees) ---------- */}
        <div className="lg:hidden">
          <MobileMarquee logos={ALL_LOGOS} />
          <div className="my-4 flex justify-center">
            <div className="rounded-2xl border-2 border-brand bg-white px-6 py-3 text-center shadow-sm">
              <div className="font-extrabold text-[18px] text-ink leading-none">RAJMANDIR</div>
              <div className="text-[11px] font-extrabold tracking-[2px] text-brand mt-1">HYPERMARKET</div>
            </div>
          </div>
          <MobileMarquee logos={[...ALL_LOGOS].reverse()} reverse />
        </div>

        {/* ---------- CTA cards ---------- */}
        <div className="mt-9 lg:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[760px] mx-auto">
          <div className="rounded-2xl border border-line bg-white p-5 flex flex-col">
            <div className="text-[11px] font-extrabold uppercase tracking-[.5px] text-stone-500">For your kitchen</div>
            <div className="text-[19px] font-extrabold text-ink mt-1 leading-snug">Fresh deals, every day</div>
            <Link
              href="/offers"
              className="mt-4 inline-flex items-center justify-center bg-brand text-white font-extrabold text-[14px] px-5 py-3 rounded-full w-fit"
            >
              See Today&apos;s Offers →
            </Link>
          </div>
          <div className="rounded-2xl bg-brand p-5 flex flex-col text-white">
            <div className="text-[11px] font-extrabold uppercase tracking-[.5px] text-white/80">Near you</div>
            <div className="text-[19px] font-extrabold mt-1 leading-snug">60+ stores across Delhi-NCR</div>
            <Link
              href="/stores"
              className="mt-4 inline-flex items-center justify-center bg-white text-brand font-extrabold text-[14px] px-5 py-3 rounded-full w-fit"
            >
              Find a Store Near You →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function MobileMarquee({ logos, reverse = false }: { logos: string[]; reverse?: boolean }) {
  const loop = [...logos, ...logos];
  return (
    <div className="overflow-hidden">
      <div className="flex gap-3 w-max animate-marquee" style={reverse ? { animationDirection: "reverse" } : undefined}>
        {loop.map((n, i) => (
          <div key={i} className="w-14 h-14 shrink-0 rounded-full bg-white border border-line flex items-center justify-center p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo(n)} alt={n} className="w-full h-full object-contain" />
          </div>
        ))}
      </div>
    </div>
  );
}
