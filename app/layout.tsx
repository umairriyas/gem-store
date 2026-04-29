import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ EXPERT SEO: "Riyas Gems" first in title, optimized for "best place to buy gems in Galle, Sri Lanka"
// Targets high-intent gem buyer keywords, local search (Galle, Gintota), and rare gems like Blue Sapphire.
export const metadata: Metadata = {
  title:
    "Riyas Gems | Best Place to Buy Gems in Galle, Sri Lanka – Certified Blue Sapphire & Rare Gemstones",
  description:
    "Looking for the best place to buy gems in Galle? Visit Riyas Gems in Gintota, Galle – trusted for certified natural Blue Sapphire, Padparadscha, Alexandrite, and other rare gemstones. Authenticity guaranteed. Best gem buying experience in Sri Lanka.",
  keywords: [
    "Riyas Gems",
    "best place to buy gems in Galle",
    "where to buy gems in Galle",
    "best place to buy blue sapphire in Galle",
    "buy gems Galle Sri Lanka",
    "blue sapphire buying guide Galle",
    "Riyas Gems Gintota",
    "certified gemstones Galle",
    "rare gems Galle",
    "Padparadscha sapphire Galle",
    "alexandrite Sri Lanka",
    "natural gemstones Galle",
    "gems shopping Galle",
    "trusted gem dealer Galle",
    "buy sapphire in Gintota",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://riyasgems.com", // Replace with your actual domain
  },
  openGraph: {
    title:
      "Riyas Gems | Best Place to Buy Gems in Galle, Sri Lanka – Certified Blue Sapphire & Rare Gemstones",
    description:
      "Discover the best place to buy gems in Galle. Riyas Gems in Gintota offers certified natural Blue Sapphire, Padparadscha, Alexandrite, and other rare gemstones. Trusted by locals and tourists.",
    url: "https://riyasgems.com",
    siteName: "Riyas Gems",
    images: [
      {
        url: "https://riyasgems.com/og-gemstone.jpg", // Replace with your actual OG image URL
        width: 1200,
        height: 630,
        alt: "Riyas Gems - Best place to buy gems in Galle showcasing natural Blue Sapphire and rare gemstones",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Riyas Gems | Best Place to Buy Gems in Galle, Sri Lanka",
    description:
      "Shop certified Blue Sapphire, Padparadscha, Alexandrite & more. Best place to buy rare gems in Galle. Located in Gintota, Galle.",
    images: ["https://riyasgems.com/twitter-gemstone.jpg"], // Replace with your actual Twitter image URL
  },
  verification: {
    google: "your-google-site-verification-code", // 🔁 Add your actual Google Search Console code
  },
  category: "jewelry",
  // ✅ Local SEO: Business location & hours for better local ranking
  other: {
    "geo.region": "LK-3", // Galle region code
    "geo.placename": "Galle",
    "geo.position": "6.0535;80.2210", // Approx coordinates for Gintota, Galle
    ICBM: "6.0535, 80.2210",
    "business:hours": "Mon-Sat 09:00-18:00",
    "contact:country": "Sri Lanka",
    "contact:city": "Galle",
    "contact:district": "Gintota",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Essential meta tags for responsive design */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta charSet="UTF-8" />

        {/* ✅ Structured Data (JSON-LD) for Local Business + Best Place to Buy Gems */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "JewelryStore",
              name: "Riyas Gems",
              alternateName: "Best Place to Buy Gems in Galle",
              image: "https://riyasgems.com/logo.png",
              description:
                "Riyas Gems is the best place to buy certified natural Blue Sapphire, Padparadscha, Alexandrite, and other rare gemstones in Galle, Sri Lanka. Located in Gintota, trusted by locals and tourists for authentic gemstone purchases.",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Main Street, Gintota",
                addressLocality: "Galle",
                addressRegion: "Southern Province",
                addressCountry: "LK",
                postalCode: "80000",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 6.0535,
                longitude: 80.221,
              },
              url: "https://riyasgems.com",
              telephone: "+94771234567",
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ],
                  opens: "09:00",
                  closes: "18:00",
                },
              ],
              priceRange: "$$",
              sameAs: [
                "https://www.facebook.com/riyasgems",
                "https://www.instagram.com/riyasgems",
              ],
              makesOffer: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Product",
                    name: "Natural Blue Sapphire",
                    description:
                      "Certified unheated natural blue sapphires from Sri Lanka. Best place to buy blue sapphire in Galle.",
                    category: "Gemstone",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Product",
                    name: "Padparadscha Sapphire",
                    description:
                      "Rare lotus-colored sapphire, highly sought after. Available exclusively at the best gem shop in Galle.",
                    category: "Gemstone",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Product",
                    name: "Alexandrite",
                    description:
                      "Color-changing alexandrite, genuine and rare. One of the most unique gems you can buy in Galle.",
                    category: "Gemstone",
                  },
                },
              ],
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                reviewCount: "156",
                bestRating: "5",
                worstRating: "1",
              },
            }),
          }}
        />

        {/* ✅ BreadcrumbList Schema for better navigation & SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Riyas Gems Home",
                  item: "https://riyasgems.com",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Best Place to Buy Gems in Galle",
                  item: "https://riyasgems.com/best-place-to-buy-gems-galle",
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: "Blue Sapphire",
                  item: "https://riyasgems.com/blue-sapphire-galle",
                },
              ],
            }),
          }}
        />

        {/* ✅ LocalBusiness Schema with additional specificity for gem buying */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Riyas Gems",
              alternateName: "Best Place to Buy Gems in Galle",
              description:
                "Trusted gem shop in Gintota, Galle offering certified natural gemstones including Blue Sapphire, Padparadscha, Alexandrite, and more.",
              image: "https://riyasgems.com/shop-front.jpg",
              priceRange: "$$",
              telephone: "+94771234567",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Main Street, Gintota",
                addressLocality: "Galle",
                addressRegion: "Southern Province",
                addressCountry: "LK",
              },
              openingHours: "Mo-Sa 09:00-18:00",
              paymentAccepted: ["Cash", "Credit Card", "Bank Transfer"],
              currenciesAccepted: "LKR, USD, EUR, GBP",
            }),
          }}
        />

        {/* ✅ Preconnect for performance & better Core Web Vitals */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* ✅ Hreflang for international visitors (optional but good for SEO) */}
        <link rel="alternate" hrefLang="en" href="https://riyasgems.com" />
        <link rel="alternate" hrefLang="si" href="https://riyasgems.com/si" />
        <link rel="alternate" hrefLang="ta" href="https://riyasgems.com/ta" />
        <link
          rel="alternate"
          hrefLang="x-default"
          href="https://riyasgems.com"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
