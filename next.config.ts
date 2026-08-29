import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    // Matches the `sizes` breakpoints used on the category grid.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },

  async redirects() {
    return [
      // --- Duplicate about page -------------------------------------
      // /about and /about-us are both live, both self-canonical, near
      // identical content. /about-us wins (better metadata + breadcrumb).
      {
        source: "/about",
        destination: "/about-us",
        permanent: true,
      },

      // --- Dead collection route ------------------------------------
      // "See All" on the homepage points at /all, which no category matches.
      {
        source: "/all",
        destination: "/gems",
        permanent: true,
      },

      // --- Product slug corrections ---------------------------------
      // Rename these in Sanity FIRST, then deploy. Deploying before the new
      // slugs exist creates redirects that land on 404s.
      {
        source: "/product/nike-sportswear-phoenix-fleece",
        destination: "/product/2-00ct-natural-white-sapphire",
        permanent: true,
      },
      {
        source: "/product/emerald-ligh",
        destination: "/product/3-30ct-natural-opal",
        permanent: true,
      },
      {
        source: "/product/buy-moonstone-in-galle-sri-lanka-5.24ct-madagascar-gem-riyas-gems",
        destination:
          "/product/buy-moonstone-in-galle-sri-lanka-5-24ct-madagascar-gem-riyas-gems",
        permanent: true,
      },

      // --- Legacy junk ----------------------------------------------
      {
        source: "/product/null",
        destination: "/gems",
        permanent: false, // 302: this is a data bug, not a permanent move
      },
    ];
  },
};

export default nextConfig;