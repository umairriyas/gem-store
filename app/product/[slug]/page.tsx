import Footer from "@/app/components/footer";
import ImageGallery from "@/app/components/ImageGallery";
import { fullProduct } from "@/app/interface";
import { client } from "@/app/lib/sanity";
import { Truck, MessageCircle, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

async function getData(slug: string) {
  const query = `*[_type == "product" && slug.current == "${slug}"][0] {
    _id,
    images,
    price,
    name,
    description,
    "slug": slug.current,
    "categoryName": category->name,
    "categorySlug": category->slug.current,
    price_id,
    "imageUrl": images[0].asset->url
  }`;

  const data = await client.fetch(query);
  return data;
}

async function getRelatedProducts(
  categoryName: string,
  currentProductId: string,
) {
  const query = `*[_type == "product" && category->name == "${categoryName}" && _id != "${currentProductId}"][0...4] | order(_createdAt desc) {
    _id,
    price,
    name,
    "slug": slug.current,
    "categoryName": category->name,
    "imageUrl": images[0].asset->url
  }`;

  const data = await client.fetch(query);
  return data;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const data: fullProduct & { imageUrl?: string } = await getData(params.slug);

  if (!data) {
    return {
      title: "Product Not Found | Riyas Gems",
      description:
        "This gemstone is no longer available. Browse our full collection of natural, certified Sri Lankan gemstones at Riyas Gems.",
      robots: { index: false, follow: true },
    };
  }

  const productUrl = `https://riyasgems.com/product/${data.slug}`;
  const categoryLabel = data.categoryName ? `${data.categoryName} ` : "";
  const title = `${data.name} | ${categoryLabel}Gemstone, Sri Lanka | Riyas Gems`;

  const description = data.description
    ? data.description.slice(0, 155)
    : `${data.name} — natural ${data.categoryName || "gemstone"} from Sri Lanka, $${data.price}. Certified authentic, sourced direct from Galle. Enquire for certification and pricing.`;

  const ogImage = data.imageUrl || "https://riyasgems.com/og-gemstone.jpg";

  return {
    title,
    description,
    alternates: { canonical: productUrl },
    openGraph: {
      title,
      description,
      url: productUrl,
      siteName: "Riyas Gems",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 1200, alt: data.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const data: fullProduct & { imageUrl?: string; categorySlug?: string } =
    await getData(params.slug);

  if (!data) {
    notFound();
  }

  let relatedProducts: any[] = [];
  try {
    if (data.categoryName && data._id) {
      relatedProducts = await getRelatedProducts(data.categoryName, data._id);
    }
  } catch (error) {
    console.error("Error fetching related products:", error);
  }

  const productUrl = `https://riyasgems.com/product/${data.slug}`;

  // Safely convert price to number to prevent string concatenation bugs
  const numericPrice = Number(data.price);

  const whatsappNumber = "94775621554";
  const whatsappMessage = `Hi, I'm interested in ${data.name}. Could you please provide more details?`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const emailAddress = "info@riyasgems.com";
  const emailSubject = `Inquiry about ${data.name}`;
  const emailBody = `Hi,\n\nI'm interested in the ${data.name} from your ${data.categoryName} collection.\n\nCould you please provide more details about pricing, availability, and certification?\n\nThank you!`;
  const emailUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  const categoryHref = data.categorySlug ? `/${data.categorySlug}` : "/gems";

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name: data.name,
    description: data.description || "",
    image: data.imageUrl ? [data.imageUrl] : [],
    category: data.categoryName || "",
    url: productUrl,
    offers: {
      "@type": "Offer",
      "@id": `${productUrl}#offer`,
      url: productUrl,
      priceCurrency: "USD",
      price: numericPrice,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://riyasgems.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: data.categoryName || "Gems",
        item: `https://riyasgems.com${categoryHref}`,
      },
      { "@type": "ListItem", position: 3, name: data.name, item: productUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c"),
        }}
      />

      <div className="bg-white">
        {/* 
          FIX FOR RIGHT GAP: 
          Removed max-w-screen-xl. Now uses w-full with comfortable edge padding.
        */}
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {/* Visible breadcrumb */}
          <nav
            className="pt-4 text-sm text-gray-500 max-w-7xl mx-auto"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-gray-700">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href={categoryHref} className="hover:text-gray-700">
              {data.categoryName || "Gems"}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800 font-medium">{data.name}</span>
          </nav>

          {/* 
            FIX FOR RIGHT GAP & 100% WIDTH: 
            Changed max-w-4xl to max-w-7xl. This stretches the layout to fill 
            the desktop screen, eliminating the empty right-side gap.
          */}
          <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto mt-6">
            {/* 1. Image Gallery (100% Width of the max-w-7xl container) */}
            <ImageGallery images={data.images} productName={data.name} />

            {/* 2. Product Details & Description (100% Width, under the image) */}
            <div className="w-full py-4 space-y-6">
              <div className="mb-2">
                <span className="mb-0.5 inline-block text-sm font-medium text-amber-600 uppercase tracking-wide">
                  {data.categoryName}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {data.name}
                </h1>
              </div>

              <div className="flex flex-wrap items-end gap-3 border-b border-gray-100 pb-6">
                <span className="text-3xl font-bold text-gray-900">
                  ${numericPrice.toLocaleString()}
                </span>
                <span className="text-lg text-red-500 line-through mb-1">
                  ${(numericPrice + 30).toLocaleString()}
                </span>
                <span className="ml-auto text-sm text-gray-500">
                  Incl. VAT plus shipping
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Truck className="w-5 h-5 text-amber-600" />
                <span className="text-sm font-medium">2-4 Day Shipping</span>
              </div>

              {/* Description Text - 100% Width */}
              <div className="prose prose-gray max-w-none w-full">
                <p className="text-base md:text-lg leading-relaxed text-gray-700 whitespace-pre-line">
                  {data.description}
                </p>
              </div>

              <div className="border-t border-gray-200 pt-8 mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Interested in this gemstone?
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Get in touch for detailed information, certification, and
                  personalized assistance.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={emailUrl}
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3.5 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Mail size={20} />
                    INQUIRY BY EMAIL
                  </a>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm"
                  >
                    <MessageCircle size={20} />
                    WhatsApp us
                  </a>
                </div>

                <div className="mt-4 text-sm text-gray-500 text-center">
                  <p>Response within 24 hours | Free consultation</p>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          {relatedProducts && relatedProducts.length > 0 && (
            <div className="mt-16 mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                YOU MAY ALSO LIKE
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts
                  .filter((product: any) => product.slug)
                  .map((product: any) => (
                    <div key={product._id} className="group">
                      <Link href={`/product/${product.slug}`}>
                        <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 mb-4">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            width={300}
                            height={300}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors">
                            {product.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {product.categoryName}
                          </p>
                          <p className="font-bold text-gray-900">
                            $ {Number(product.price).toLocaleString()}
                          </p>
                        </div>
                      </Link>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}
