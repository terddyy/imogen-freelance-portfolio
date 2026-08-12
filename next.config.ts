import type { NextConfig } from "next";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const isDev = process.env.NODE_ENV === "development";

// Incremental CSP: allow self + Turnstile; keep unsafe-inline for Next/runtime styles.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data: https://res.cloudinary.com",
  "font-src 'self'",
  "connect-src 'self' https://challenges.cloudflare.com",
  "frame-src 'self' https://challenges.cloudflare.com",
  "worker-src 'self' blob:",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dqojscxhd/**",
      },
    ],
  },
  experimental: {
    proxyClientMaxBodySize: "16kb",
  },
  async headers() {
    const headers = [
      { key: "Content-Security-Policy", value: contentSecurityPolicy },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-DNS-Prefetch-Control", value: "off" },
    ];

    if (process.env.NODE_ENV === "production") {
      headers.push({ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" });
    }

    return [{ source: "/:path*", headers }];
  },
};

export default withBundleAnalyzer(nextConfig);
