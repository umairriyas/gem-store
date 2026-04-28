import Footer from "@/app/components/footer";
import ImageGallery from "@/app/components/ImageGallery";
import { fullProduct } from "@/app/interface";
import { client } from "@/app/lib/sanity";
import { Button } from "@/components/ui/button";
import { Star, Truck, MessageCircle, Mail } from "lucide-react";
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
          price_id
      }`;

  const data = await client.fetch(query);
  return data;
}

// Function to get related products from same category
async function getRelatedProducts(
  categoryName: string,
  currentProductId: string
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
  const data: fullProduct = await getData(params.slug);

  // ✅ CRITICAL FIX: Check if data exists BEFORE accessing properties
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

  // ✅ ONLY fetch related products if data exists
  let relatedProducts: any[] = [];
  try {
    if (data.categoryName && data._id) {
      relatedProducts = await getRelatedProducts(data.categoryName, data._id);
    }
  } catch (error) {
    console.error("Error fetching related products:", error);
    relatedProducts = [];
  }

  // WhatsApp and Email handlers
  const whatsappNumber = "+94771234567"; // Replace with your actual number
  const whatsappMessage = `Hi, I'm interested in ${data.name}. Could you please provide more details?`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const emailAddress = "info@rawgems.com"; // Replace with your actual email
  const emailSubject = `Inquiry about ${data.name}`;
  const emailBody = `Hi,\n\nI'm interested in the ${data.name} from your ${data.categoryName} collection.\n\nCould you please provide more details about pricing, availability, and certification?\n\nThank you!`;
  const emailUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          <ImageGallery images={data.images} />

          <div className="md:py-8">
            <div className="mb-2 md:mb-3">
              <span className="mb-0.5 inline-block text-gray-500">
                {data.categoryName}
              </span>
              <h2 className="text-2xl font-bold text-gray-800 lg:text-3xl">
                {data.name}
              </h2>
            </div>

            <div className="mb-6 flex items-center gap-3 md:mb-10">
              <Button className="rounded-full gap-x-2">
                <span className="text-sm">4.2</span>
                <Star className="h-5 w-5" />
              </Button>

              <span className="text-sm text-gray-500 transition duration-100">
                56 Ratings
              </span>
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
                Incl. Vat plus shipping
              </span>
            </div>

            <div className="mb-6 flex items-center gap-2 text-gray-500">
              <Truck className="w-6 h-6" />
              <span className="text-sm">2-4 Day Shipping</span>
            </div>

            <p className="mb-8 text-base text-gray-500 tracking-wide">
              {data.description}
            </p>

            {/* Contact Section - Matching your image */}
            <div className="border-t pt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Interested in this gemstone?
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Get in touch for detailed information, certification, and
                personalized assistance.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Email Button */}
                <a
                  href={emailUrl}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Mail size={20} />
                  INQUIRY BY EMAIL
                </a>

                {/* WhatsApp Button */}
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

        {/* You May Also Like Section */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-16 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
              YOU MAY ALSO LIKE
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product: any) => (
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
  );
}
