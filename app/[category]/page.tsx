import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { client } from "../lib/sanity";
import Footer from "../components/footer";

const BASE_URL = "https://riyasgems.com";

// ISR: pages are statically served and refreshed hourly.
// Replaces `dynamic = "force-dynamic"`, which forced a Sanity round trip on every request.
export const revalidate = 3600;

// Allow categories added in Sanity after the last build to still resolve.
export const dynamicParams = true;

type CategoryPageProps = {
  // Next.js 15: params is a Promise. On Next.js 14, change this to
  // `{ category: string }` and drop the `await` in the three places below.
  params: Promise<{ category: string }>;
};

type CategoryProduct = {
  _id: string;
  name: string | null;
  slug: string | null;
  price: number | null;
  imageUrl: string | null;
  categoryName: string | null;
};

/* ------------------------------------------------------------------ */
/* Queries                                                             */
/* ------------------------------------------------------------------ */

// Pulled from products rather than the category document type, so this
// works regardless of what that document type is called in your schema.
const CATEGORY_NAMES_QUERY = `
  *[_type == "product"
    && defined(category->name)
    && defined(slug.current)
    && slug.current != ""
  ]{ "name": category->name }
`;

const CATEGORY_PRODUCTS_QUERY = `
  *[_type == "product"
    && category->name == $categoryName
    && defined(slug.current)
    && slug.current != ""
  ] | order(_createdAt desc) {
    _id,
    name,
    price,
    "slug": slug.current,
    "imageUrl": images[0].asset->url,
    "categoryName": category->name
  }
`;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** "Blue-sapphire" | "Orange sapphire" -> "blue-sapphire" | "orange-sapphire" */
function toSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** "Blue-sapphire" -> "Blue Sapphire" */
function toDisplayName(value: string): string {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(
      /\w\S*/g,
      (word) => word[0].toUpperCase() + word.slice(1).toLowerCase(),
    );
}

async function getCategoryNames(): Promise<string[]> {
  const rows =
    await client.fetch<{ name: string | null }[]>(CATEGORY_NAMES_QUERY);

  const unique = new Set<string>();
  for (const row of rows) {
    if (row.name) unique.add(row.name);
  }
  return Array.from(unique);
}

/**
 * Maps an incoming URL segment to the exact category name stored in Sanity,
 * comparing on normalised slugs so casing and spacing no longer matter.
 * Returns null when nothing matches, which the page turns into a real 404.
 */
async function resolveCategoryName(segment: string): Promise<string | null> {
  let decoded: string;
  try {
    decoded = decodeURIComponent(segment);
  } catch {
    decoded = segment;
  }

  const requested = toSlug(decoded);
  if (!requested) return null;

  const names = await getCategoryNames();
  return names.find((name) => toSlug(name) === requested) ?? null;
}

function getProducts(categoryName: string): Promise<CategoryProduct[]> {
  return client.fetch<CategoryProduct[]>(CATEGORY_PRODUCTS_QUERY, {
    categoryName,
  });
}

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/* ------------------------------------------------------------------ */
/* Static params                                                       */
/* ------------------------------------------------------------------ */

export async function generateStaticParams() {
  const names = await getCategoryNames();
  return names.map((name) => ({ category: toSlug(name) }));
}

/* ------------------------------------------------------------------ */
/* Metadata                                                            */
/* ------------------------------------------------------------------ */

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryName = await resolveCategoryName(category);

  if (!categoryName) {
    return {
      title: "Category Not Found | Riyas Gems",
      robots: { index: false, follow: true },
    };
  }

  const displayName = toDisplayName(categoryName);
  // Always the lowercase form, never the raw segment.
  const canonical = `${BASE_URL}/${toSlug(categoryName)}`;

  const products = await getProducts(categoryName);
  const isEmpty = products.length === 0;

  const title = `${displayName} Gemstones, Sri Lanka | Riyas Gems`;
  const description = `Shop natural ${displayName.toLowerCase()} gemstones from Riyas Gems in Galle, Sri Lanka. Certified authentic, sourced direct, with international-standard quality.`;

  return {
    title,
    description,
    alternates: { canonical },
    // An in-stock category with zero products is thin content. Keep it out of
    // the index until stock returns, but let Google follow the links.
    robots: isEmpty
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Riyas Gems",
      type: "website",
      images: [
        {
          url: products[0]?.imageUrl ?? `${BASE_URL}/og-gemstone.jpg`,
          width: 1200,
          height: 630,
          alt: `${displayName} gemstone collection at Riyas Gems`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [products[0]?.imageUrl ?? `${BASE_URL}/twitter-gemstone.jpg`],
    },
  };
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const categoryName = await resolveCategoryName(category);

  // Unknown category -> real 404 instead of a 200 with an empty grid.
  if (!categoryName) {
    notFound();
  }

  const products = (await getProducts(categoryName)).filter((p) => p.slug);
  const displayName = toDisplayName(categoryName);
  const canonicalPath = `/${toSlug(categoryName)}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Gems",
        item: `${BASE_URL}/gems`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${displayName} Gemstones`,
        item: `${BASE_URL}${canonicalPath}`,
      },
    ],
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${displayName} Gemstones`,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${BASE_URL}/product/${product.slug}`,
      name: product.name ?? undefined,
    })),
  };

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {products.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      )}

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <nav aria-label="Breadcrumb" className="pt-6">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-gray-900">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/gems" className="hover:text-gray-900">
                Gems
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-gray-900">
              {displayName}
            </li>
          </ol>
        </nav>

        <div className="pt-4">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {displayName} Gemstones
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600">
            Browse our natural {displayName.toLowerCase()} collection, offered
            with certification and personalised support from Riyas Gems in
            Galle, Sri Lanka.
          </p>
        </div>

        {products.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {products.map((product, index) => (
              <div key={product._id} className="group relative">
                <div className="relative aspect-square w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      // No origin claim: several stones are from Australia,
                      // Mozambique, Ethiopia and Madagascar.
                      alt={`${product.name ?? displayName} — ${displayName.toLowerCase()} gemstone at Riyas Gems`}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover object-center"
                      priority={index < 4}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                      Image coming soon
                    </div>
                  )}
                </div>

                <div className="mt-4 flex justify-between gap-3">
                  <div>
                    <h2 className="text-sm text-gray-700">
                      <Link href={`/product/${product.slug}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name ?? "Untitled gemstone"}
                      </Link>
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {product.categoryName
                        ? toDisplayName(product.categoryName)
                        : displayName}
                    </p>
                  </div>
                  <p className="whitespace-nowrap text-sm font-medium text-gray-900">
                    {typeof product.price === "number"
                      ? priceFormatter.format(product.price)
                      : "Price on request"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 text-center">
            <p className="text-gray-500">
              No {displayName.toLowerCase()} gemstones are available right now.
            </p>
            <Link
              href="/gems"
              className="mt-4 inline-block text-sm font-medium text-gray-900 underline"
            >
              Browse the full collection
            </Link>
          </div>
        )}
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
}
