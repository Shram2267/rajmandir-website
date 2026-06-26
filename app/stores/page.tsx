import type { Metadata } from "next";
import StoresView from "@/components/StoresView";
import JsonLd from "@/components/JsonLd";
import { createClient } from "@/lib/supabase/server";
import { SITE_URL, SITE_NAME, CONTACT } from "@/lib/site";

export const metadata: Metadata = {
  title: "Store Locator | Rajmandir Hypermarket",
  description: "Find your nearest Rajmandir Hypermarket store across North & West Delhi. We are open 10 AM to 10 PM Daily.",
  alternates: { canonical: "/stores" },
};

export default async function StoresPage() {
  const supabase = await createClient();
  const { data: stores } = await supabase.from("stores").select("*").order("id", { ascending: true });

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE_NAME} Stores`,
    itemListElement: (stores || []).map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "GroceryStore",
        name: `${SITE_NAME} — ${s.name}`,
        address: {
          "@type": "PostalAddress",
          streetAddress: s.addr,
          addressLocality: s.area,
          addressRegion: "DL",
          addressCountry: "IN",
        },
        telephone: s.phone ? `+91${String(s.phone).replace(/^(\+?91)?/, "")}` : CONTACT.phone,
        geo: {
          "@type": "GeoCoordinates",
          latitude: s.lat,
          longitude: s.lng,
        },
        openingHours: "Mo-Su 10:00-22:00",
        url: `${SITE_URL}/stores`,
      },
    })),
  };

  return (
    <>
      <JsonLd data={itemListJsonLd} />
      <StoresView />
    </>
  );
}
