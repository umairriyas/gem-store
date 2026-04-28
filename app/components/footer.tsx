"use client";

import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Send,
  ChevronUp,
} from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-300">
      {/* Newsletter Section */}
      <div className="border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">
                Stay Updated with RiyasGems
              </h3>
              <p className="text-gray-400">
                Get exclusive offers and latest gemstone collections
              </p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 md:w-80 px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <button
                onClick={handleSubscribe}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center gap-2"
              >
                <Send size={18} />
                Subscribe
              </button>
            </div>
          </div>
          {subscribed && (
            <div className="mt-4 text-center md:text-right text-green-400 font-semibold animate-pulse">
              ✓ Thank you for subscribing!
            </div>
          )}
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">            <h3 className="text-2xl font-bold text-white mb-4">RiyasGems</h3>
=======
            <h3 className="text-2xl font-bold text-white mb-4">RawGems</h3>

            <p className="text-gray-400 leading-relaxed">
              Authentic Sri Lankan gemstones with international certification.
              Your trusted source for premium quality precious stones.
            </p>
            <div className="flex gap-4 pt-4">
              <a
                href="#"
                className="p-2 bg-slate-700 rounded-full hover:bg-blue-600 transition-all transform hover:scale-110"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="p-2 bg-slate-700 rounded-full hover:bg-pink-600 transition-all transform hover:scale-110"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="p-2 bg-slate-700 rounded-full hover:bg-blue-400 transition-all transform hover:scale-110"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="p-2 bg-slate-700 rounded-full hover:bg-red-600 transition-all transform hover:scale-110"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                "Home",
                "Collections",
                "About Us",
                "Certifications",
                "Blog",
                "Contact",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 hover:pl-2 transition-all duration-300 inline-block"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Gemstone Categories */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Our Gems</h4>
            <ul className="space-y-3">
              {[
                "Blue Sapphire",
                "Yellow Sapphire",
                "Pink Sapphire",
                "Ruby",
                "Emerald",
                "Alexandrite",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 hover:pl-2 transition-all duration-300 inline-block"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400 hover:text-white transition-colors">
                <MapPin size={20} className="mt-1 flex-shrink-0" />
                <span>
                  Galle, Sri Lanka
                  <br />
                  Coastal gem side of the Island
                </span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <Phone size={20} className="flex-shrink-0" />
                <a href="tel:+94123456789">+94 12 345 6789</a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <Mail size={20} className="flex-shrink-0" />
                <a href="mailto:info@rawgems.lk">info@rawgems.lk</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">

              © 2026 RiyasGems. All rights reserved. | Certified Gemstone Dealer
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Shipping Policy
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Scroll to top"
      >
        <ChevronUp size={24} />
      </button>
    </footer>
  );
}
