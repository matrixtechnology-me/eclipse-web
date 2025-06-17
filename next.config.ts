import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    useCache: true,
    dynamicIO: true,
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
