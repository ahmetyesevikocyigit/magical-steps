import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
const config: NextConfig = {
  poweredByHeader: false,
  skipTrailingSlashRedirect: true,
  experimental: {
    // The compact page stylesheet arrives with HTML on a first visit.
    inlineCss: true,
  },
  images: {
    formats: ["image/webp"],
    qualities: [75, 80, 90],
    deviceSizes: [360, 640, 768, 1024, 1440, 1920, 2560],
  },
  async headers() {
    return [
      {
        source: "/fonts/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400" }],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};
export default createNextIntlPlugin("./src/i18n/request.ts")(config);
