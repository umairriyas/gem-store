"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

export default function GemsClient({
  products,
  categories,
}: {
  products: any[];
  categories: string[];
}) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || product.category?.name === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Our Gems Collection</h1>

      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search gems..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* LEFT: Category Filters */}
        <aside className="w-full md:w-48 shrink-0">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-3">
            Categories
          </h2>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setActiveCategory("All")}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                  activeCategory === "All"
                    ? "bg-green-600 text-white font-semibold"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                All
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                    activeCategory === cat
                      ? "bg-green-600 text-white font-semibold"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* RIGHT: Gems Grid */}
        <div className="flex-1">
          {filtered.length === 0 ? (
            <p className="text-gray-500 text-center mt-16">No gems found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product) => (
                <Link
                  href={`/product/${product.slug?.current ?? "#"}`}
                  key={product._id}
                >
                  <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group">
                    {product.images?.[0] ? (
                      <Image
                        src={urlFor(product.images[0])
                          .width(400)
                          .height(400)
                          .url()}
                        alt={product.name}
                        width={400}
                        height={400}
                        className="w-full h-52 object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-52 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                        No image
                      </div>
                    )}

                    <div className="p-4">
                      {product.category?.name && (
                        <span className="text-xs text-green-700 font-medium uppercase tracking-wide">
                          {product.category.name}
                        </span>
                      )}
                      <h3 className="text-base font-semibold text-gray-900 mt-1 truncate">
                        {product.name}
                      </h3>
                      {product.price && (
                        <p className="text-green-700 font-bold mt-2">
                          ${product.price}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
