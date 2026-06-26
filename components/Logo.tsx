import Link from "next/link";
import Image from "next/image";

type Props = {
  /** Visual size variant. */
  size?: "sm" | "md";
  /** Footer variant uses a muted sub-label color on dark. */
  variant?: "header" | "footer";
  href?: string;
};

export default function Logo({ size = "md", variant = "header", href = "/" }: Props) {
  let sizeClasses = "w-[45px] h-[45px]";
  if (variant === "header") {
     sizeClasses = "w-[50px] h-[50px] lg:w-[75px] lg:h-[75px]";
  }

  const inner = (
    <div className={`relative ${sizeClasses}`}>
      <Image 
        src="/logo.png" 
        alt="Rajmandir Hypermarket" 
        fill
        sizes="(max-width: 1024px) 50px, 75px"
        className={`object-contain ${variant === "footer" ? "opacity-90" : ""}`}
        priority
      />
    </div>
  );

  if (!href) return inner;
  return (
    <Link href={href} aria-label="Rajmandir Hypermarket — home" className="inline-block">
      {inner}
    </Link>
  );
}
