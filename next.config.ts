import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";
import { blogRedirects } from "./lib/redirects";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  turbopack: {
    root: projectRoot,
  },
  output: "standalone",
  async redirects() {
    return [
      // Serve the site on one host only. Only fires when nginx passes the
      // original Host header through; nginx can do the same job (see Phase 2 notes).
      {
        source: "/:path*",
        has: [{ type: "host" as const, value: "www.yogaforcure.in" }],
        destination: "https://yogaforcure.in/:path*",
        statusCode: 301 as const,
      },
      ...blogRedirects.map(({ from, to }) => ({
        source: `/blog/${from}`,
        destination: `/blog/${to}`,
        statusCode: 301 as const,
      })),
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2400],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
