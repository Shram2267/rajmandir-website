import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Playfair_Display, Caveat } from "next/font/google";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, BRAND_COLOR } from "@/lib/site";
import "./globals.css";
import { StoreProvider } from "@/components/StoreProvider";
import { OffersProvider } from "@/components/OffersProvider";
import { SearchProvider } from "@/components/SearchProvider";
import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-hanken",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Wholesale Rate ka Hypermarket`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "hypermarket Delhi",
    "grocery store Delhi NCR",
    "Rajmandir Hypermarket",
    "wholesale rate grocery",
    "supermarket near me",
    "today's offers grocery Delhi",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Wholesale Rate ka Hypermarket`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Wholesale Rate ka Hypermarket`,
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: BRAND_COLOR,
};

import { createClient } from "@/lib/supabase/server";
import { CONTACT, SOCIAL_LINKS } from "@/lib/site";
import JsonLd from "@/components/JsonLd";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: stores } = await supabase.from("stores").select("*").order("id", { ascending: true });

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: SITE_DESCRIPTION,
    email: CONTACT.email,
    telephone: CONTACT.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT.street,
      addressLocality: CONTACT.city,
      addressRegion: CONTACT.region,
      postalCode: CONTACT.postalCode,
      addressCountry: CONTACT.country,
    },
    sameAs: SOCIAL_LINKS,
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
  };

  return (
    <html lang="en" className={`${hanken.variable} ${playfair.variable} ${caveat.variable}`}>
      <body>
        <JsonLd data={[orgJsonLd, websiteJsonLd]} />
        <StoreProvider stores={stores || []}>
          <OffersProvider>
            <SearchProvider>
              <div className="min-h-screen flex flex-col">
                <div className="sticky top-0 z-40">
                  <Header />
                  <AnnouncementBar />
                </div>
                <main className="flex-1 pb-20 lg:pb-0">{children}</main>
                <Footer />
                <BottomNav />
                <FloatingWhatsApp />
              </div>
            </SearchProvider>
          </OffersProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
