import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";
import NewsletterForm from "./NewsletterForm";

// Set these to the real profiles, or leave the array empty.
// An icon linking to "#" is worse than no icon.
const SOCIAL_LINKS: Array<{
  label: string;
  href: string;
  Icon: any;
  hover: string;
}> = [
  // { label: "Facebook", href: "https://facebook.com/...", Icon: Facebook, hover: "hover:bg-blue-600" },
  // { label: "Instagram", href: "https://instagram.com/...", Icon: Instagram, hover: "hover:bg-pink-600" },
  // { label: "YouTube", href: "https://youtube.com/...", Icon: Youtube, hover: "hover:bg-red-600" },
];

// Comment out any entry whose page does not exist yet.
// Linking to a 404 is worse than linking to "#".
const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Collections", href: "/gems" },
  { label: "About Us", href: "/about-us" },
  { label: "Blog", href: "/blog" },
  // { label: "Contact", href: "/contact" },
];

// Lowercase to match the canonical category routes.
// Pink Sapphire and Alexandrite removed: no such category exists in Sanity.
const GEM_LINKS = [
  { label: "Blue Sapphire", href: "/blue-sapphire" },
  { label: "Yellow Sapphire", href: "/yellow-sapphire" },
  { label: "White Sapphire", href: "/white-sapphire" },
  { label: "Ruby", href: "/ruby" },
  { label: "Emerald", href: "/emerald" },
  { label: "Moonstone", href: "/moonstone" },
];

const POLICY_LINKS: Array<{ label: string; href: string }> = [
  // { label: "Privacy Policy", href: "/privacy-policy" },
  // { label: "Terms of Service", href: "/terms-of-service" },
  // { label: "Shipping Policy", href: "/shipping-policy" },
];

const linkClass =
  "text-gray-400 hover:text-blue-400 hover:pl-2 transition-all duration-300 inline-block";
const socialClass =
  "p-2 bg-slate-700 rounded-full transition-all transform hover:scale-110";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-300">
      <div className="border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-white mb-2">
                Stay Updated with RiyasGems
              </h2>
              <p className="text-gray-400">
                Get exclusive offers and latest gemstone collections
              </p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4">RiyasGems</h2>
            <p className="text-gray-400 leading-relaxed">
              Natural gemstones with international certification. Your trusted
              source for premium quality precious stones.
            </p>

            {SOCIAL_LINKS.length > 0 ? (
              <div className="flex gap-4 pt-4">
                {SOCIAL_LINKS.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={socialClass + " " + social.hover}
                  >
                    <social.Icon size={20} aria-hidden="true" />
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h2>
            <ul className="space-y-3">
              {QUICK_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Our Gems</h2>
            <ul className="space-y-3">
              {GEM_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-4">
              Contact Us
            </h2>
            <address className="not-italic">
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-gray-400">
                  <MapPin
                    size={20}
                    className="mt-1 flex-shrink-0"
                    aria-hidden="true"
                  />
                  {/* Replace with the full Gintota street address. The meta
                      description already claims Gintota; the site never shows it. */}
                  <span>
                    Galle, Sri Lanka
                    <br />
                    Coastal gem side of the Island
                  </span>
                </li>
                <li className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                  <Phone
                    size={20}
                    className="flex-shrink-0"
                    aria-hidden="true"
                  />
                  <Link href="tel:+94775621554">+94 77 562 1554</Link>
                </li>
                <li className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                  <Mail
                    size={20}
                    className="flex-shrink-0"
                    aria-hidden="true"
                  />
                  {/* Was info@rawgems.lk, a different domain from the rest of the site. */}
                  <Link href="mailto:info@riyasgems.com">
                    info@riyasgems.com
                  </Link>
                </li>
              </ul>
            </address>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {year} Riyas Gems. All rights reserved.
            </p>
            {POLICY_LINKS.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                {POLICY_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
