// app/components/navbar.tsx
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";

// Make this STATIC - no dynamic changes
const links = [
  { name: "Home", href: "/" },
  { name: "Emerald", href: "/Emerald" },
  { name: "Blue Sapphire", href: "/Blue-sapphire" },
  { name: "Yellow Sapphire", href: "/Yellow-sapphire" },
  { name: "Ruby", href: "/Ruby" },
  { name: "White Sapphire", href: "/White-sapphire" },
  { name: "Opal", href: "/Opal" },
] as const; // Add 'as const' to make it truly static

export default function Navbar() {
  const pathname = usePathname();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleCartClick = () => {
    setIsCartOpen(!isCartOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="mb-8 border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl py-4">
        <Link href="/" className="flex items-center">
          <h1 className="text-2xl md:text-4xl font-bold">
            Riyas<span className="text-primary">Gems</span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden gap-6 lg:flex xl:gap-8 2xl:ml-16">
          {links.map((link, idx) => (
            <div key={link.href}>
              {" "}
              {/* Use href as key instead of idx */}
              {pathname === link.href ? (
                <Link
                  className="text-base xl:text-lg font-semibold text-primary border-b-2 border-primary pb-1"
                  href={link.href}
                >
                  {link.name}
                </Link>
              ) : (
                <Link
                  href={link.href}
                  className="text-base xl:text-lg font-semibold text-gray-600 transition duration-200 hover:text-primary hover:border-b-2 hover:border-primary pb-1"
                >
                  {link.name}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Rest of your component... */}
      </div>
    </header>
  );
}
