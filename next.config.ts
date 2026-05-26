import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/signup',
        destination: '/login',
      },
    ];
  },
};

export default nextConfig;
