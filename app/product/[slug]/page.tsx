import Footer from "@/app/components/footer";
import ImageGallery from "@/app/components/ImageGallery";
import { client } from "@/app/lib/sanity";
import { Truck, MessageCircle, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

const BASE_URL = "https://riyasgems.com";
const WHATSAPP_NUMBER = "94775621554";
const EMAIL_ADDRESS = "info@riyasgems.com";

type ProductData = {
  _id: string;
  name: string | null;
  description: string | null;
  price: number | null;
  compareAtPrice: number | null;
  available: boolean | null;
  images: any;
  imageUrls: string[] | null;
  imageUrl: string | null;
  slug: string | null;
  categoryId: string | null;
  categoryName: string | null;
  categorySlug: string | null;
  caratWeight: number | null;
  gemColour: string | null;
  clarity: string | null;
  shapeCut: string | null;
  dimensions: string | null;
  treatment: string | null;
  originCountry: string | null;
  certification: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
};

type RelatedProduct = {
  _id: string;
  name: string | null;
  price: number | null;
  slug: string;
  imageUrl: string | null;
  categoryName: string | null;
};

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

// Parameterised: the old "${slug}" interpolation was an injection risk and
// broke on any slug containing a quote.
const PRODUCT_QUERY = `*[_type == "product" && slug.current == $slug][0] {
  _id,
  name,
  description,
  price,
  compareAtPrice,
  available,
  images,
  "imageUrls": images[].asset->url,
  "imageUrl": images[0].asset->url,
  "slug": slug.current,
  "categoryId": category->_id,
  "categoryName": category->name,
  "categorySlug": category->slug.current,
  caratWeight,
  gemColour,
  clarity,
  shapeCut,
  dimensions,
  treatment,
  originCountry,
  certification,
  seoTitle,
  seoDescription
}`;

// order() now runs BEFORE the slice. The old query sliced four arbitrary
// products and then sorted those four.
const RELATED_QUERY = `*[_type == "product"
  && category->_id == $categoryId
  && _id != $currentId
  && defined(slug.current)
  && slug.current != ""
] | order(_createdAt desc) [0...4] {
  _id,
  name,
  price,
  "slug": slug.current,
  "categoryName": category->name,
  "imageUrl": images[0].asset->url
}`;

async function getData(slug: string): Promise<ProductData | null> {
  let decoded = slug;
  try {
    decoded = decodeURIComponent(slug);
  } catch (e) {
    decoded = slug;
  }
  return client.fetch(PRODUCT_QUERY, { slug: decoded });
}

async function getRelatedProducts(
  categoryId: string,
  currentId: string,
): Promise<RelatedProduct[]> {
  try {
    return await client.fetch(RELATED_QUERY, { categoryId, currentId });
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function isValidPrice(value: number | null): boolean {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

// "Blue-sapphire" -> "blue-sapphire", matching the canonical category route
// so internal links stop paying a 308 hop through middleware.
function toSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// "Blue-sapphire" -> "Blue Sapphire"
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

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function priceValidUntil(): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().split("T")[0];
}

export const dynamic = "force-dynamic";

/* ------------------------------------------------------------------ */
/* Metadata                                                            */
/* ------------------------------------------------------------------ */

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const data = await getData(params.slug);

  if (!data || !data.slug) {
    return {
      title: "Product Not Found | Riyas Gems",
      description:
        "This gemstone is no longer available. Browse our full collection of natural, certified gemstones at Riyas Gems.",
      robots: { index: false, follow: true },
    };
  }

  const productUrl = BASE_URL + "/product/" + data.slug;
  const name = data.name || "Natural Gemstone";

  // Editor override wins. Auto-generated fallback is ~45 chars and no longer
  // leaks the raw "Blue-sapphire" slug into the SERP.
  const title = data.seoTitle || name + " | Riyas Gems";

  const autoParts: string[] = [];
  if (data.gemColour) autoParts.push(data.gemColour);
  if (data.caratWeight) autoParts.push(data.caratWeight + "ct");
  autoParts.push(
    data.categoryName
      ? toDisplayName(data.categoryName).toLowerCase()
      : "gemstone",
  );

  const clarityBit = data.clarity ? data.clarity.toLowerCase() + ", " : "";
  const autoDescription =
    autoParts.join(" ") +
    ", " +
    clarityBit +
    "from Riyas Gems in Galle. Enquire for certification, pricing and worldwide shipping.";

  const description = data.seoDescription || autoDescription;

  const images = (data.imageUrls || []).filter(Boolean);
  const ogImage = images[0] || data.imageUrl || BASE_URL + "/og-gemstone.jpg";

  const isSold = data.available === false;

  const otherTags: Record<string, string> = { "og:type": "product" };
  if (isValidPrice(data.price)) {
    otherTags["product:price:amount"] = String(data.price);
    otherTags["product:price:currency"] = "USD";
  }

  return {
    title,
    description,
    alternates: { canonical: productUrl },
    // Sold stones keep their URL and links but leave the index.
    robots: isSold
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: productUrl,
      siteName: "Riyas Gems",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 1200, alt: name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    other: otherTags,
  };
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const data = await getData(params.slug);

  if (!data || !data.slug) {
    notFound();
  }

  const related =
    data.categoryId && data._id
      ? await getRelatedProducts(data.categoryId, data._id)
      : [];

  const name = data.name || "Natural Gemstone";
  const productUrl = BASE_URL + "/product/" + data.slug;
  const images = (data.imageUrls || []).filter(Boolean);

  const price = isValidPrice(data.price) ? (data.price as number) : null;
  const compareAt = isValidPrice(data.compareAtPrice)
    ? (data.compareAtPrice as number)
    : null;

  // Renders only when a genuine prior price exists in Sanity.
  const showCompareAt =
    price !== null && compareAt !== null && compareAt > price;

  const isSold = data.available === false;

  const categoryDisplay = data.categoryName
    ? toDisplayName(data.categoryName)
    : "Gems";

  let categoryHref = "/gems";
  if (data.categorySlug) {
    categoryHref = "/" + toSlug(data.categorySlug);
  } else if (data.categoryName) {
    categoryHref = "/" + toSlug(data.categoryName);
  }

  const whatsappUrl =
    "https://wa.me/" +
    WHATSAPP_NUMBER +
    "?text=" +
    encodeURIComponent(
      "Hi, I'm interested in " +
        name +
        ". Could you please provide more details?",
    );

  const emailBody =
    "Hi,\n\nI'm interested in the " +
    name +
    " from your " +
    categoryDisplay +
    " collection.\n\nCould you please provide more details about pricing, availability, and certification?\n\nThank you!";

  const emailUrl =
    "mailto:" +
    EMAIL_ADDRESS +
    "?subject=" +
    encodeURIComponent("Inquiry about " + name) +
    "&body=" +
    encodeURIComponent(emailBody);

  /* ---------------- Specs ---------------- */

  const specPairs: Array<[string, string]> = [];
  if (data.caratWeight)
    specPairs.push(["Carat weight", data.caratWeight + " ct"]);
  if (data.gemColour) specPairs.push(["Colour", data.gemColour]);
  if (data.clarity) specPairs.push(["Clarity", data.clarity]);
  if (data.shapeCut) specPairs.push(["Shape and cut", data.shapeCut]);
  if (data.dimensions) specPairs.push(["Dimensions", data.dimensions]);
  if (data.treatment) specPairs.push(["Treatment", data.treatment]);
  if (data.originCountry) specPairs.push(["Origin", data.originCountry]);
  if (data.certification) specPairs.push(["Certification", data.certification]);

  /* ---------------- Structured data ---------------- */

  const productSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": productUrl + "#product",
    name: name,
    url: productUrl,
    sku: data._id,
    brand: { "@type": "Brand", name: "Riyas Gems" },
    image: images.length > 0 ? images : data.imageUrl ? [data.imageUrl] : [],
  };

  if (data.description) {
    productSchema.description = data.description.replace(/\s+/g, " ").trim();
  }
  if (data.categoryName) {
    productSchema.category = categoryDisplay;
  }
  if (specPairs.length > 0) {
    productSchema.additionalProperty = specPairs.map((pair) => ({
      "@type": "PropertyValue",
      name: pair[0],
      value: pair[1],
    }));
  }

  // Omit the Offer entirely rather than emit price: null.
  if (price !== null) {
    productSchema.offers = {
      "@type": "Offer",
      "@id": productUrl + "#offer",
      url: productUrl,
      priceCurrency: "USD",
      price: price,
      priceValidUntil: priceValidUntil(),
      availability: isSold
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: "Riyas Gems", url: BASE_URL },
    };
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryDisplay,
        item: BASE_URL + categoryHref,
      },
      { "@type": "ListItem", position: 3, name: name, item: productUrl },
    ],
  };

  function jsonLd(schema: unknown) {
    return { __html: JSON.stringify(schema).replace(/</g, "\\u003c") };
  }

  const ctaBase =
    "flex-1 text-white font-semibold py-3.5 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(productSchema)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(breadcrumbSchema)}
      />

      <div className="bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <nav
            className="pt-4 text-sm text-gray-500 max-w-7xl mx-auto"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-gray-700">
              Home
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <Link href={categoryHref} className="hover:text-gray-700">
              {categoryDisplay}
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <span className="text-gray-800 font-medium">{name}</span>
          </nav>

          <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto mt-6">
            <ImageGallery images={data.images} productName={name} />

            <div className="w-full py-4 space-y-6">
              <div className="mb-2">
                <span className="mb-0.5 inline-block text-sm font-medium text-amber-600 uppercase tracking-wide">
                  {categoryDisplay}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {name}
                </h1>
              </div>

              <div className="flex flex-wrap items-end gap-3 border-b border-gray-100 pb-6">
                {price !== null ? (
                  <span className="text-3xl font-bold text-gray-900">
                    {priceFormatter.format(price)}
                  </span>
                ) : (
                  <span className="text-2xl font-semibold text-gray-900">
                    Price on request
                  </span>
                )}

                {showCompareAt ? (
                  <span className="text-lg text-gray-400 line-through mb-1">
                    {priceFormatter.format(compareAt as number)}
                  </span>
                ) : null}

                {isSold ? (
                  <span className="mb-1 rounded bg-gray-100 px-2 py-1 text-sm font-medium text-gray-600">
                    Sold
                  </span>
                ) : null}

                <span className="ml-auto text-sm text-gray-500">
                  Plus shipping
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Truck className="w-5 h-5 text-amber-600" />
                <span className="text-sm font-medium">2-4 Day Shipping</span>
              </div>

              {specPairs.length > 0 ? (
                <div className="border border-gray-100 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody>
                      {specPairs.map((pair) => (
                        <tr
                          key={pair[0]}
                          className="border-b border-gray-100 last:border-0"
                        >
                          <th
                            scope="row"
                            className="text-left font-medium text-gray-600 py-2.5 px-4 w-40 align-top"
                          >
                            {pair[0]}
                          </th>
                          <td className="py-2.5 px-4 text-gray-900">
                            {pair[1]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}

              {data.description ? (
                <div className="prose prose-gray max-w-none w-full">
                  <p className="text-base md:text-lg leading-relaxed text-gray-700 whitespace-pre-line">
                    {data.description}
                  </p>
                </div>
              ) : null}

              <div className="border-t border-gray-200 pt-8 mt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Interested in this gemstone?
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Get in touch for detailed information, certification, and
                  personalized assistance.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={emailUrl}
                    className={ctaBase + " bg-amber-600 hover:bg-amber-700"}
                  >
                    <Mail size={20} aria-hidden="true" />
                    INQUIRY BY EMAIL
                  </a>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={ctaBase + " bg-green-600 hover:bg-green-700"}
                  >
                    <MessageCircle size={20} aria-hidden="true" />
                    WhatsApp us
                  </a>
                </div>

                <div className="mt-4 text-sm text-gray-500 text-center">
                  <p>Response within 24 hours | Free consultation</p>
                </div>
              </div>
            </div>
          </div>

          {related.length > 0 ? (
            <section className="mt-16 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                YOU MAY ALSO LIKE
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map((product) => (
                  <div key={product._id} className="group relative">
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 mb-4">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={(product.name || "Gemstone") + " at Riyas Gems"}
                          fill
                          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                          Image coming soon
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors">
                        <Link href={"/product/" + product.slug}>
                          <span
                            aria-hidden="true"
                            className="absolute inset-0"
                          />
                          {product.name || "Untitled gemstone"}
                        </Link>
                      </h3>
                      <p className="text-sm text-gray-600">
                        {product.categoryName
                          ? toDisplayName(product.categoryName)
                          : categoryDisplay}
                      </p>
                      <p className="font-bold text-gray-900">
                        {isValidPrice(product.price)
                          ? priceFormatter.format(product.price as number)
                          : "Price on request"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <Footer />
      </div>
    </>
  );
}
