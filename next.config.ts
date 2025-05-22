import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["localhost", "69.62.92.66", "api.majorssolutions.com.br"],
  },
};

export default nextConfig;
