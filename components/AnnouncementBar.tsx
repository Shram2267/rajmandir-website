"use client";

import { usePathname } from "next/navigation";

const MESSAGE =
  "प्रिय ग्राहक आपको यह जानकर हैरानी होगी कि सभी दुकान एवं बाजार पर कुछ ही आईटम पर ऑफर एवं डिस्काउन्ट मिलता है। मगर वो वादा करते है कि आपके घर के बजट को कम करने का लेकिन ऐसा होता बिल्कुल भी नहीं है। जबकि राजमंदिर हाईपर मार्किट एक मात्र ऐसा स्टोर है, जहां दिये गये सभी वादों को पूरा करता है और जहां मिलता है आपको प्रत्येक आईटम पर ज्यादा से ज्यादा ऑफर एवं डिस्काउन्ट ! तो देर किस बात की जल्दी आईये जल्दी पाईये। जिसका सबूत आपके हाथ में है। धन्यवाद !";

export default function AnnouncementBar() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <div className="bg-brand text-white overflow-hidden border-b border-brand-deep/30" role="region" aria-label="Announcement">
      <div className="flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused]">
        <span className="text-[13px] lg:text-[14px] font-semibold py-[7px] px-4">
          ✦ {MESSAGE}
        </span>
        <span aria-hidden="true" className="text-[13px] lg:text-[14px] font-semibold py-[7px] px-4">
          ✦ {MESSAGE}
        </span>
      </div>
    </div>
  );
}
