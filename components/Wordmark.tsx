import Link from "next/link";

/** The Rajmandir text wordmark used in the header and footer. */
export default function Wordmark({
  size = "md",
  asLink = true,
}: {
  size?: "sm" | "md";
  asLink?: boolean;
}) {
  const name = size === "sm" ? "text-[21px]" : "text-[26px]";
  const tag = size === "sm" ? "text-[7px] tracking-[3px]" : "text-[9px] tracking-[4px]";
  const inner = (
    <span className="block leading-[.85]">
      <span className={`block font-serif italic font-bold text-brand ${name}`}>Rajmandir</span>
      <span className={`block font-bold text-stone-500 ${tag} mt-[2px]`}>HYPERMARKET</span>
    </span>
  );
  if (!asLink) return inner;
  return (
    <Link href="/" aria-label="Rajmandir Hypermarket — home" className="block">
      {inner}
    </Link>
  );
}
