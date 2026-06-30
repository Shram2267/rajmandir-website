/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Emit a self-contained server bundle (.next/standalone) for a small Docker image.
  output: "standalone",
  experimental: {
    serverActions: {
      // Allow larger image uploads (pamphlet + slideshow) through Server Actions.
      // Default is 1 MB, which rejects most photos.
      bodySizeLimit: "15mb",
    },
  },
};

export default nextConfig;
