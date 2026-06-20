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

export const metadata: Metadata = {
  metadataBase: new URL("https://riyasgems.com"),
  title:
    "Riyas Gems | Best Place to Buy Gems in Galle, Sri Lanka – Certified Blue Sapphire & Rare Gemstones",
  description:
    "Looking for the best place to buy gems in Galle? Visit Riyas Gems in Gintota, Galle for natural gemstones and trusted customer support.",
  keywords: [
    "Riyas Gems",
    "best place to buy gems in Galle",
    "buy gems Galle Sri Lanka",
    "blue sapphire Galle",
    "natural gemstones Sri Lanka",
    "gem shop Galle",
    "certified gemstones Galle",
    "rare gems Sri Lanka",
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
    canonical: "./",
  },
  openGraph: {
    title: "Riyas Gems | Natural Gemstones in Galle, Sri Lanka",
    description:
      "Discover natural gemstones from Riyas Gems in Galle, Sri Lanka. Explore sapphires, rubies, alexandrite, and more.",
    url: "https://riyasgems.com",
    siteName: "Riyas Gems",
    images: [
      {
        url: "https://riyasgems.com/og-gemstone.jpg",
        width: 1200,
        height: 630,
        alt: "Riyas Gems gemstone collection",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Riyas Gems | Natural Gemstones in Galle, Sri Lanka",
    description:
      "Explore natural gemstones from Riyas Gems in Galle, Sri Lanka.",
    images: ["https://riyasgems.com/twitter-gemstone.jpg"],
  },
  verification: {
    google: "AXsTQoDpJzdw-QDSQi65S_wYUbP0Xap7G7aeIZ2XeS8",
  },
  category: "jewelry",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    "@id": "https://riyasgems.com/#business",
    name: "Riyas Gems",
    url: "https://riyasgems.com",
    image: "https://riyasgems.com/logo.png",
    description:
      "Riyas Gems is a gemstone business in Galle, Sri Lanka, offering natural gemstones and personalized customer support.",
    telephone: "+94771234567",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Main Street, Gintota",
      addressLocality: "Galle",
      addressRegion: "Southern Province",
      postalCode: "80000",
      addressCountry: "LK",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 6.0535,
      longitude: 80.221,
    },
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
    sameAs: [
      "https://www.facebook.com/riyasgems",
      "https://www.instagram.com/riyasgems",
    ],
  };

  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta charSet="UTF-8" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(businessSchema).replace(/</g, "\\u003c"),
          }}
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <link rel="alternate" hrefLang="en" href="https://riyasgems.com" />
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
