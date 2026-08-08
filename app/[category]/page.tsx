import Link from "next/link";
import { simplifiedProduct } from "../interface";
import { client } from "../lib/sanity";
import Image from "next/image";
import Footer from "../components/footer";
import { Metadata } from "next";

// Explicit props type
type CategoryPageProps = {
  params: {
    category: string;
  };
};

async function getData(category: string) {
  const query = `*[_type == "product" && category->name == "${category}" && defined(slug.current) && slug.current != ""] {
    _id,
    "imageUrl": images[0].asset->url,
    price,
    name,
    "slug": slug.current,
    "categoryName": category->name
  }`;

  return await client.fetch(query);
}

// Turns "Blue-sapphire" / "Yellow-sapphire" into "Blue Sapphire" for display + SEO copy
function formatCategoryName(raw: string) {
  return decodeURIComponent(raw)
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(
      /\w\S*/g,
      (word) => word[0].toUpperCase() + word.slice(1).toLowerCase(),
    );
}

export const dynamic = "force-dynamic";

// --- SEO: per-category metadata ---
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const displayName = formatCategoryName(params.category);
  const categoryUrl = `https://riyasgems.com/${params.category}`;

  const title = `${displayName} Gemstones, Sri Lanka | Riyas Gems`;
  const description = `Shop natural ${displayName} gemstones from Riyas Gems in Galle, Sri Lanka. Certified authentic, sourced direct, with international-standard quality.`;

  return {
    title,
    description,
    alternates: {
      canonical: categoryUrl,
    },
    openGraph: {
      title,
      description,
      url: categoryUrl,
      siteName: "Riyas Gems",
      type: "website",
      images: [
        {
          url: "https://riyasgems.com/og-gemstone.jpg",
          width: 1200,
          height: 630,
          alt: `${displayName} gemstone collection`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://riyasgems.com/twitter-gemstone.jpg"],
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const rawData: simplifiedProduct[] = await getData(params.category);

  // Belt-and-braces: never render a product with no usable slug
  const data = rawData.filter((product) => product.slug);

  const displayName = formatCategoryName(params.category);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="pt-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {displayName} Gemstones
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600">
            Browse our natural {displayName.toLowerCase()} collection, sourced
            in Sri Lanka and offered with certification and personalized support
            from Riyas Gems.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {data.map((product) => (
            <div key={product._id} className="group relative">
              <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-80">
                <Image
                  src={product.imageUrl}
                  alt={`${product.name} - natural ${displayName.toLowerCase()} gemstone from Sri Lanka`}
                  className="w-full h-full object-cover object-center lg:h-full lg:w-full"
                  width={300}
                  height={300}
                />
              </div>

              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <Link href={`/product/${product.slug}`}>
                      {product.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {product.categoryName}
                  </p>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  ${product.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        {data.length === 0 && (
          <p className="mt-10 text-center text-gray-500">
            No gemstones currently available in this category.
          </p>
        )}
      </div>
      <br />
      <br />
      <Footer />
    </div>
  );
}
