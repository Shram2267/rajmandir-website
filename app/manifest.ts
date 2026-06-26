import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_TAGLINE, BRAND_COLOR, BACKGROUND_COLOR } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — ${SITE_TAGLINE}`,
    short_name: SITE_NAME,
    description:
      "Delhi's leading food & grocery store. Browse today's offers at your nearest Rajmandir Hypermarket.",
    start_url: "/",
    display: "standalone",
    background_color: BACKGROUND_COLOR,
    theme_color: BRAND_COLOR,
    icons: [
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
