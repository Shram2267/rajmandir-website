import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createPublicClient } from "@/lib/supabase/public";
import { storeSlug, findStoreBySlug, whatsappLink } from "@/lib/stores";
import { formatOffer, offerProductJsonLd, type RawOffer } from "@/lib/offers";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import OfferCard from "@/components/OfferCard";
import JsonLd from "@/components/JsonLd";
import StoreMap from "@/components/StoreMap";

export const revalidate = 300; // refresh store pages every 5 min

type StoreRow = {
  id: number;
  n: string;
  name: string;
  area: string;
  addr: string;
  hours: string;
  lat: number;
  lng: number;
  phone: string | null;
  whatsapp?: string | null;
  store_manager?: string | null;
};

async function getStores(): Promise<StoreRow[]> {
  const supabase = createPublicClient();
  const { data } = await supabase.from("stores").select("*").order("id", { ascending: true });
  return (data as StoreRow[]) || [];
}

export async function generateStaticParams() {
  const stores = await getStores();
  return stores.map((s) => ({ slug: storeSlug(s) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const stores = await getStores();
  const match = findStoreBySlug(stores, slug);
  if (!match) return { title: "Store not found | Rajmandir Hypermarket" };

  const s = match.store;
  const title = `${SITE_NAME} — ${s.name}, ${s.area}`;
  const description = `Visit ${SITE_NAME} ${s.name} at ${s.addr}. Open 10 AM–10 PM daily. See today's offers, get directions, or call the store.`;
  return {
    title,
    description,
    alternates: { canonical: `/stores/${slug}` },
    openGraph: { title, description, url: `${SITE_URL}/stores/${slug}`, type: "website" },
  };
}

export default async function StoreDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const stores = await getStores();
  const match = findStoreBySlug(stores, slug);
  if (!match) notFound();

  const s = match.store;
  const supabase = createPublicClient();
  const { data: rawOffers } = await supabase
    .from("offers")
    .select("*")
    .eq("store_id", s.id)
    .order("id", { ascending: false });
  const offers = ((rawOffers as RawOffer[]) || []).map(formatOffer);
  const visibleOffers = offers.slice(0, 12);

  const wa = whatsappLink(s.whatsapp, s.phone, `Hi! I have a question about the ${s.name} store.`);
  const tel = s.phone ? `tel:${s.phone}` : null;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`;

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "GroceryStore",
    name: `${SITE_NAME} — ${s.name}`,
    image: `${SITE_URL}/logo.png`,
    url: `${SITE_URL}/stores/${slug}`,
    telephone: s.phone || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: s.addr,
      addressLocality: s.area,
      addressRegion: "DL",
      addressCountry: "IN",
    },
    geo: { "@type": "GeoCoordinates", latitude: s.lat, longitude: s.lng },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "10:00",
      closes: "22:00",
    },
    parentOrganization: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Stores", item: `${SITE_URL}/stores` },
      { "@type": "ListItem", position: 3, name: s.name, item: `${SITE_URL}/stores/${slug}` },
    ],
  };

  // Mark up the offers actually shown on this page as an ItemList of Products.
  // Entries without a valid price are skipped so we never emit invalid data.
  const pageUrl = `${SITE_URL}/stores/${slug}`;
  const productItems = visibleOffers
    .map((o) => offerProductJsonLd(o, pageUrl, SITE_NAME))
    .filter((p): p is Record<string, unknown> => p !== null);

  const offersItemListJsonLd =
    productItems.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `Offers at ${SITE_NAME} — ${s.name}`,
          itemListElement: productItems.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: p,
          })),
        }
      : null;

  const jsonLd: Record<string, unknown>[] = [localBusinessJsonLd, breadcrumbJsonLd];
  if (offersItemListJsonLd) jsonLd.push(offersItemListJsonLd);

  return (
    <div>
      <JsonLd data={jsonLd} />

      {/* hero */}
      <section className="rm-stripe border-b border-line">
        <div className="mx-auto w-full max-w-[1180px] px-4 lg:px-6 py-7 lg:py-10">
          <nav className="text-[12px] text-stone-500 mb-3" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-brand">Home</Link>
            <span className="mx-1.5">/</span>
            <Link href="/stores" className="hover:text-brand">Stores</Link>
            <span className="mx-1.5">/</span>
            <span className="text-ink font-semibold">{s.name}</span>
          </nav>

          <div className="font-hand text-[20px] lg:text-[22px] text-brand font-bold">
            Rajmandir Hypermarket
          </div>
          <h1 className="text-[26px] lg:text-[40px] font-extrabold tracking-[-.5px] leading-[1.1] mt-1">
            {s.name}
            <span className="text-stone-400 font-bold text-[18px] lg:text-[24px]"> · {s.area}</span>
          </h1>
          <p className="text-[14px] lg:text-[15px] text-ink-soft mt-2 max-w-[640px] leading-[1.6]">
            {s.addr}
          </p>
          <div className="text-[13px] text-leaf font-bold mt-2">🕘 Open 10 AM – 10 PM Daily</div>

          <div className="flex flex-wrap gap-2.5 mt-5">
            <Link
              href="/offers"
              className="bg-brand text-white font-bold text-[14px] px-5 py-3 rounded-[30px] shadow-[0_8px_20px_rgba(232,73,43,.28)]"
            >
              See this store&apos;s offers →
            </Link>
            <a
              href={directions}
              target="_blank"
              rel="noopener noreferrer"
              className="border-[1.5px] border-line bg-white rounded-[30px] px-5 py-3 text-[14px] font-bold hover:bg-cream"
            >
              🧭 Directions
            </a>
            {tel && (
              <a
                href={tel}
                className="border-[1.5px] border-line bg-white rounded-[30px] px-5 py-3 text-[14px] font-bold hover:bg-cream"
              >
                📞 Call
              </a>
            )}
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white rounded-[30px] px-5 py-3 text-[14px] font-bold hover:brightness-95"
              >
                💬 WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>

      {/* map */}
      <section className="border-b border-line">
        <div className="relative h-[260px] lg:h-[340px] w-full overflow-hidden">
          <StoreMap visibleStores={[s]} selectedLat={s.lat} selectedLng={s.lng} />
        </div>
      </section>

      {/* offers */}
      <section>
        <div className="mx-auto w-full max-w-[1180px] px-4 lg:px-6 py-8 lg:py-10">
          <h2 className="font-hand text-[22px] lg:text-[26px] text-brand font-bold mb-1">
            Offers at {s.name}
          </h2>
          <div className="text-[13px] text-stone-500 mb-5">
            Updated regularly · prices and availability are specific to this store.
          </div>

          {offers.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-[12px] lg:gap-[18px]">
              {visibleOffers.map((o) => (
                <OfferCard key={o.id} offer={o} />
              ))}
            </div>
          ) : (
            <div className="text-[14px] text-stone-500 py-6">
              No offers listed for this store yet — please check back soon or{" "}
              <Link href="/offers" className="text-brand font-bold">browse all offers</Link>.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
