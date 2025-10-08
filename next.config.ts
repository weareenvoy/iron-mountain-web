import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  images: {
    // Strapi images
    domains: [`${process.env.NEXT_PUBLIC_ASSET_DOMAIN}`, '10.70.2.5'],
  },
};

export default nextConfig;
