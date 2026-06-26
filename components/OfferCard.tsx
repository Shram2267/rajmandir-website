import ProductImage from "./ProductImage";
import { type FormattedOffer } from "@/lib/offers";

/**
 * A single product offer card.
 *
 * Layout: product photo (or a generated name placeholder) on top, then brand,
 * product name, sale price vs MRP, and the deal/remarks line (e.g. "B1G1").
 */
export default function OfferCard({ offer: o }: { offer: FormattedOffer }) {
  const out = !o.available;
  const sale = o.sale_price ?? null;
  const mrp = o.mrp ?? null;
  const deal = o.deal;
  const showMrp = mrp != null && sale != null && mrp > sale;

  return (
    <div className="group relative bg-white border-[1.5px] border-line rounded-[16px] overflow-hidden cursor-pointer transition-[transform,box-shadow,border-color] duration-[250ms] ease-[cubic-bezier(.2,.7,.2,1)] hover:-translate-y-[6px] hover:shadow-[0_18px_38px_rgba(33,27,23,.14)] hover:border-brand">
      {/* image area */}
      <div className="relative h-[150px] bg-white border-b-[1.5px] border-line overflow-hidden">
        <ProductImage photo={o.photo} name={o.name} cat={o.cat} />

        {o.off ? (
          <span className="absolute top-[10px] left-[10px] bg-brand text-white font-extrabold text-[12px] px-[9px] py-[4px] rounded-[8px] shadow-[0_4px_12px_rgba(232,73,43,.35)]">
            {o.off} OFF
          </span>
        ) : (
          <span className="absolute top-[10px] left-[10px] bg-ink text-white font-extrabold text-[10px] tracking-[.5px] uppercase px-[9px] py-[5px] rounded-[8px] shadow-[0_4px_12px_rgba(33,27,23,.3)]">
            Offer
          </span>
        )}

        {o.available ? (
          <span className="absolute top-[10px] right-[10px] flex items-center gap-[5px] bg-leaf-wash text-leaf-deep font-bold text-[11px] px-[9px] py-[4px] rounded-[20px]">
            <span className="w-[7px] h-[7px] rounded-full bg-leaf" />
            In Stock
          </span>
        ) : (
          <span className="absolute top-[10px] right-[10px] flex items-center gap-[5px] bg-[#ECE5DC] text-stone-500 font-bold text-[11px] px-[9px] py-[4px] rounded-[20px]">
            <span className="w-[7px] h-[7px] rounded-full bg-leaf-mute" />
            Out of Stock
          </span>
        )}
      </div>

      {/* body */}
      <div className="px-[15px] pt-[12px] pb-[15px]">
        {o.brand ? (
          <div className="text-[11px] tracking-[.6px] uppercase text-brand font-bold truncate">{o.brand}</div>
        ) : (
          <div className="text-[11px] tracking-[.6px] uppercase text-stone-400 font-bold truncate">{o.cat}</div>
        )}
        <div className="text-[14px] font-semibold text-ink leading-[1.25] mt-[3px] min-h-[36px] line-clamp-2">
          {o.name}
        </div>

        {sale != null && (
          <div className="flex items-baseline gap-2 mt-[6px]">
            <div className="font-hand text-[31px] font-bold text-brand leading-none">₹{sale}</div>
            {showMrp && (
              <div className="text-[13px] text-stone-400 line-through font-semibold">₹{mrp}</div>
            )}
          </div>
        )}

        {deal && (
          <div className="inline-block mt-[8px] text-[12px] font-extrabold text-brand-deep bg-brand-wash px-[9px] py-[4px] rounded-[7px] leading-[1.1]">
            {deal}
          </div>
        )}
      </div>

      {out && <div className="absolute inset-0 bg-[rgba(251,246,238,.55)] pointer-events-none" />}
    </div>
  );
}
