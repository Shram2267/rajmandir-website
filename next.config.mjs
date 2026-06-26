/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      // Allow larger image uploads (pamphlet + slideshow) through Server Actions.
      // Default is 1 MB, which rejects most photos.
      bodySizeLimit: "15mb",
    },
  },
};

export default nextConfig;
