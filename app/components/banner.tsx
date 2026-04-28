import Image from "next/image";
import Link from "next/link";
import { client, urlFor } from "../lib/sanity";

async function getBannerData() {
  const query = `*[_type == 'banner' && isActive == true] | order(displayOrder asc)[0]`;
  const data = await client.fetch(query);
  return data;
}

export default async function Banner() {
  const data = await getBannerData();

  if (!data) return null;

  return (
    <section
      className={`relative overflow-hidden ${data.backgroundColor || "bg-emerald-800"} ${data.textColor || "text-white"}`}
    >
      {/* Background Image */}
      {data.backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={urlFor(data.backgroundImage).url()}
            alt="Banner background"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between py-12 lg:py-20 gap-8">
          {/* Left Content */}
          <div className="flex-1 space-y-6 text-center lg:text-left max-w-xl">
            {data.subtitle && (
              <div className="text-sm font-medium tracking-wide uppercase opacity-90">
                {data.subtitle}
              </div>
            )}

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              {data.title || "Discover Premium Gemstones"}
            </h2>

            {data.description && (
              <p className="text-lg sm:text-xl leading-relaxed opacity-90 max-w-lg">
                {data.description}
              </p>
            )}

            {data.buttonText && (
              <div className="pt-4">
                <Link
                  href={data.buttonLink || "/emerald"}
                  className="inline-block bg-white text-emerald-800 font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg"
                >
                  {data.buttonText}
                </Link>
              </div>
            )}
          </div>

          {/* Right Content - Images */}
          <div className="flex-1 relative flex justify-center lg:justify-end">
            {/* Main Product/Person Image */}
            {data.productImage && (
              <div className="relative z-20">
                <Image
                  src={urlFor(data.productImage).width(300).height(300).url()}
                  alt="Featured content"
                  width={300}
                  height={300}
                  className="object-cover rounded-lg"
                  priority
                />
              </div>
            )}

            {/* Decorative Element (Positioned absolutely) */}
            {data.decorativeImage && (
              <div className="absolute top-4 right-4 lg:top-8 lg:right-8 z-30 w-32 h-32 lg:w-40 lg:h-40">
                <Image
                  src={urlFor(data.decorativeImage)
                    .width(200)
                    .height(200)
                    .url()}
                  alt="Decorative element"
                  fill
                  className="object-contain drop-shadow-lg"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white bg-opacity-5 rounded-full -translate-y-32 translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white bg-opacity-5 rounded-full translate-y-16 -translate-x-16"></div>
    </section>
  );
}
