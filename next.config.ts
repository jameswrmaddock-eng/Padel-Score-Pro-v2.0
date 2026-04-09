import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allow optimised images from Amazon CDN (product images — Day 2)
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'm.media-amazon.com' },
      { protocol: 'https', hostname: 'images-na.ssl-images-amazon.com' },
    ],
  },
};

export default nextConfig;
