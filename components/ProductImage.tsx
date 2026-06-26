"use client";

import { useState } from "react";
import { categoryIcons } from "@/lib/data";

/**
 * Product image with a graceful fallback: shows the photo when available,
 * otherwise (or if the photo fails to load) renders a branded SVG placeholder
 * with the product name inside it.
 */
export default function ProductImage({
  photo,
  name,
  cat,
}: {
  photo: string | null;
  name: string;
  cat: string;
}) {
  const [failed, setFailed] = useState(false);
  const showPhoto = photo && !failed;

  if (showPhoto) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photo!}
        alt={name}
        loading="lazy"
        onError={() => setFailed(true)}
        className="absolute inset-0 w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
      />
    );
  }

  return <ProductPlaceholder name={name} cat={cat} />;
}

/** Inline SVG placeholder showing the product name (used when no photo). */
function ProductPlaceholder({ name, cat }: { name: string; cat: string }) {
  const icon = categoryIcons[cat] || "🛒";
  return (
    <svg
      viewBox="0 0 300 200"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full"
      role="img"
      aria-label={name}
    >
      <rect width="300" height="200" fill="#fbf1ec" />
      {/* faint diagonal stripes */}
      <g opacity="0.5">
        {Array.from({ length: 14 }).map((_, i) => (
          <line
            key={i}
            x1={i * 28 - 60}
            y1={0}
            x2={i * 28 - 60 + 200}
            y2={200}
            stroke="#f8e6df"
            strokeWidth="14"
          />
        ))}
      </g>
      {/* category icon (centered) */}
      <text x="150" y="118" textAnchor="middle" fontSize="68" opacity="0.6">
        {icon}
      </text>
    </svg>
  );
}
