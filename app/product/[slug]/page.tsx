import Footer from "@/app/components/footer";
import ImageGallery from "@/app/components/ImageGallery";
import { fullProduct } from "@/app/interface";
import { client } from "@/app/lib/sanity";
import { Truck, MessageCircle, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

async function getData(slug: string) {
  const query = `*[_type == "product" && slug.current == "${slug}"][0] {
    _id,
    images,
    price,
    name,
    description,
    "slug": slug.current,
    "categoryName": category->name,
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

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const data: fullProduct & { imageUrl?: string } = await getData(params.slug);

  if (!data) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The product you're looking for doesn't exist.
          </p>
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  let relatedProducts: any[] = [];
  try {
    if (data.categoryName && data._id) {
      relatedProducts = await getRelatedProducts(data.categoryName, data._id);
    }
  } catch (error) {
    console.error("Error fetching related products:", error);
    relatedProducts = [];
  }

  const productUrl = `https://riyasgems.com/product/${data.slug}`;

  const whatsappNumber = "94775621554";
  const whatsappMessage = `Hi, I'm interested in ${data.name}. Could you please provide more details?`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const emailAddress = "info@riyasgems.com";
  const emailSubject = `Inquiry about ${data.name}`;
  const emailBody = `Hi,\n\nI'm interested in the ${data.name} from your ${data.categoryName} collection.\n\nCould you please provide more details about pricing, availability, and certification?\n\nThank you!`;
  const emailUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

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
      price: data.price,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema).replace(/</g, "\\u003c"),
        }}
      />

      <div className="bg-white">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            <ImageGallery images={data.images} productName={data.name} />

            <div className="md:py-8">
              <div className="mb-2 md:mb-3">
                <span className="mb-0.5 inline-block text-gray-500">
                  {data.categoryName}
                </span>
                <h1 className="text-2xl font-bold text-gray-800 lg:text-3xl">
                  {data.name}
                </h1>
              </div>

              <div className="mb-4">
                <div className="flex items-end gap-2">
                  <span className="text-xl font-bold text-gray-800 md:text-2xl">
                    ${data.price}
                  </span>
                  <span className="mb-0.5 text-red-500 line-through">
                    ${data.price + 30}
                  </span>
                </div>

                <span className="text-sm text-gray-500">
                  Incl. VAT plus shipping
                </span>
              </div>

              <div className="mb-6 flex items-center gap-2 text-gray-500">
                <Truck className="w-6 h-6" />
                <span className="text-sm">2-4 Day Shipping</span>
              </div>

              <p className="mb-8 text-base text-gray-500 tracking-wide">
                {data.description}
              </p>

              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Interested in this gemstone?
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Get in touch for detailed information, certification, and
                  personalized assistance.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={emailUrl}
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Mail size={20} />
                    INQUIRY BY EMAIL
                  </a>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
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
                          <h4 className="font-semibold text-gray-800 group-hover:text-primary transition-colors">
                            {product.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {product.categoryName}
                          </p>
                          <p className="font-bold text-gray-900">
                            $ {product.price.toLocaleString()}
                          </p>
                        </div>
                      </Link>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        <br />
        <br />
        <Footer />
      </div>
    </>
  );
}
