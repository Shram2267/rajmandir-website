// ---------------------------------------------------------------------------
// Central site-wide constants (canonical URL, brand info, contact details).
// Used by metadata, sitemap, robots, manifest and JSON-LD structured data.
// ---------------------------------------------------------------------------

/** Public origin. Override per-environment via NEXT_PUBLIC_SITE_URL. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.rajmandirhypermarket.com"
).replace(/\/$/, "");

export const SITE_NAME = "Rajmandir Hypermarket";

export const SITE_TAGLINE = "Wholesale Rate ka Hypermarket";

export const SITE_DESCRIPTION =
  "Delhi's leading food & grocery store. Browse today's offers at your nearest Rajmandir Hypermarket — 18,000+ products, sab ek chhat ke neeche.";

export const BRAND_COLOR = "#e8492b";
export const BACKGROUND_COLOR = "#fbf6ee";

export const CONTACT = {
  phone: "+919311239211",
  email: "rajmandir.care@gmail.com",
  street: "M-113 Guru Harkishan Nagar, Paschim Vihar",
  city: "New Delhi",
  region: "DL",
  postalCode: "110087",
  country: "IN",
};

export const SOCIAL_LINKS = [
  "https://www.instagram.com/rajmandir.hypermarket",
  "https://www.facebook.com/rajmandirhm/",
  "https://www.youtube.com/@rajmandir_vlogs",
];
