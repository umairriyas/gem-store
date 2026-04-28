import Image from "next/image";
import { client, urlFor } from "../lib/sanity";
import Link from "next/link";

async function getData() {
  const query = "*[_type == 'heroSection'][0]";

  const data = await client.fetch(query);

  return data;
}

export default async function Hero() {
  const data = await getData();

  return (
    <section className="mx-auto max-w-2xl px-4 sm:pb-6 lg:max-w-7xl lg:px-8">
      <div className="mb-8 flex flex-wrap justify-between md:mb-16">
        <div className="mb-6 flex w-full flex-col justify-center sm:mb-12 lg:mb-0 lg:w-1/3 lg:pb-24 lg:pt-48">
          <h1 className="mb-4 text-4xl font-bold text-black sm:text-5xl md:mb-8 md:text-6xl">
            {data?.headline || "Premium Natural Gemstones"}
          </h1>
          <p className="max-w-md leading-relaxed text-gray-500 xl:text-lg">
            {data?.subheadline ||
              "Authentic Sri Lankan gems with international certification. Discover emeralds, sapphires, rubies, pearls and opals sourced directly from trusted mines."}
          </p>

          {/* Call to Action Button */}
          <div className="mt-8">
            <Link
              href={data?.ctaLink || "/emerald"}
              className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              {data?.ctaText || "Explore Collection"}
            </Link>
          </div>
        </div>

        <div className="mb-12 flex w-full md:mb-16 lg:w-2/3">
          <div className="relative left-12 top-12 z-10 -ml-12 overflow-hidden rounded-lg bg-gray-100 shadow-lg md:left-16 md:top-16 lg:ml-0">
            {data?.heroImages?.[0] && (
              <Image
                src={urlFor(data.heroImages[0]).url()}
                alt={data.heroImages[0].alt || "Premium Gemstone Collection"}
                className="h-full w-full object-cover object-center"
                priority
                width={500}
                height={500}
              />
            )}
          </div>

          <div className="overflow-hidden rounded-lg bg-gray-100 shadow-lg">
            {data?.heroImages?.[1] && (
              <Image
                src={urlFor(data.heroImages[1]).url()}
                alt={data.heroImages[1].alt || "Natural Certified Gemstones"}
                className="h-full w-full object-cover object-center"
                width={500}
                height={500}
                priority
              />
            )}
          </div>
        </div>
      </div>

      {/* Gemstone Category Navigation */}
      <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 w-full max-w-4xl">
          <Link
            href="/emerald"
            className="flex items-center justify-center px-4 py-3 text-gray-600 font-medium transition duration-200 hover:bg-emerald-50 hover:text-emerald-700 border border-gray-200 rounded-lg group"
          >
            <span className="text-2xl mr-2">💎</span>
            <span className="text-sm">Emerald</span>
          </Link>
          <Link
            href="/Blue-sapphire"
            className="flex items-center justify-center px-4 py-3 text-gray-600 font-medium transition duration-200 hover:bg-blue-50 hover:text-blue-700 border border-gray-200 rounded-lg group"
          >
            <span className="text-2xl mr-2">🔵</span>
            <span className="text-sm">Blue Sapphire</span>
          </Link>
          <Link
            href="/Yellow-sapphire"
            className="flex items-center justify-center px-4 py-3 text-gray-600 font-medium transition duration-200 hover:bg-yellow-50 hover:text-yellow-700 border border-gray-200 rounded-lg group"
          >
            <span className="text-2xl mr-2">🟡</span>
            <span className="text-sm">Yellow Sapphire</span>
          </Link>
          <Link
            href="/ruby"
            className="flex items-center justify-center px-4 py-3 text-gray-600 font-medium transition duration-200 hover:bg-red-50 hover:text-red-700 border border-gray-200 rounded-lg group"
          >
            <span className="text-2xl mr-2">🔴</span>
            <span className="text-sm">Ruby</span>
          </Link>
          <Link
            href="/White-sapphire"
            className="flex items-center justify-center px-4 py-3 text-gray-600 font-medium transition duration-200 hover:bg-gray-50 hover:text-gray-700 border border-gray-200 rounded-lg group"
          >
            <span className="text-2xl mr-2">🤍</span>
            <span className="text-sm">White Sapphire</span>
          </Link>
          <Link
            href="/opal"
            className="flex items-center justify-center px-4 py-3 text-gray-600 font-medium transition duration-200 hover:bg-purple-50 hover:text-purple-700 border border-gray-200 rounded-lg group"
          >
            <span className="text-2xl mr-2">🌈</span>
            <span className="text-sm">Opal</span>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="flex items-center gap-6 text-sm text-gray-500 mt-4 lg:mt-0">
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Certified Authentic</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>International Standards</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Direct from Source</span>
          </div>
        </div>
      </div>
    </section>
  );
}
