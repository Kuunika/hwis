const withSvgr = require("@svgr/webpack");
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  reactStrictMode: false,
});

/** @type {import('next').NextConfig} */

// const nextConfig = withPWA({
//   output: 'standalone',
// })
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true, // Disable the image optimization API
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

module.exports = nextConfig;
