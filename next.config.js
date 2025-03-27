/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["vercel.com", "m.media-amazon.com"],
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
  reactStrictMode: true,
};

module.exports = nextConfig;
