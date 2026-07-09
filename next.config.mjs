/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Emit a self-contained server bundle (.next/standalone) for a small Docker image.
  output: "standalone",
  images: {
    // Hosts we serve optimized <Image> from. Supabase Storage backs the hero
    // banners and blog covers. (Admin-pasted product photos stay on raw <img>
    // because their host is arbitrary and can't be allow-listed reliably.)
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/**" },
    ],
  },
  experimental: {
    serverActions: {
      // Allow larger image uploads (pamphlet + slideshow) through Server Actions.
      // Default is 1 MB, which rejects most photos.
      bodySizeLimit: "15mb",
    },
  },
};

export default nextConfig;
