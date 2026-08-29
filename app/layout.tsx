import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://riyasgems.com"),
  // Was 103 characters. Google truncates around 60.
  title: "Riyas Gems | Natural Gemstones in Galle, Sri Lanka",
  description:
    "Natural and certified gemstones from Riyas Gems in Gintota, Galle. Sapphires, rubies, emeralds and more, with personal support and worldwide shipping.",
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
  alternates: { canonical: "/" },
  openGraph: {
    title: "Riyas Gems | Natural Gemstones in Galle, Sri Lanka",
    description:
      "Discover natural gemstones from Riyas Gems in Galle, Sri Lanka. Sapphires, rubies, emeralds, moonstone and opal.",
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
  verification: { google: "AXsTQoDpJzdw-QDSQi65S_wYUbP0Xap7G7aeIZ2XeS8" },
  category: "jewelry",
};

// Organization only, sitewide. It is true on every page and carries no
// location claims. The JewelryStore/LocalBusiness entity moves to the
// homepage, where it belongs.
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://riyasgems.com/#organization",
  name: "Riyas Gems",
  url: "https://riyasgems.com",
  logo: "https://riyasgems.com/logo.png",
  description:
    "Riyas Gems is a gemstone business in Galle, Sri Lanka, offering natural gemstones and personalised customer support.",
  telephone: "+94775621554",
  email: "info@riyasgems.com",
  // sameAs removed until the profiles are confirmed to exist. The footer
  // socials currently point to "#", so these URLs are likely dead.
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c"),
          }}
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
