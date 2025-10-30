import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "makerworld.bblmw.com",
        port: "",
        pathname: "/**",
        search: "",
      },
    ],
    minimumCacheTTL: 60 * 60 * 24, // 24 hours
  },
};

export default nextConfig;
