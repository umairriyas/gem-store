"use client";

import Image from "next/image";
import { urlFor } from "../lib/sanity";
import { useState } from "react";

interface iAppProps {
  images: any;
  productName?: string;
}

export default function ImageGallery({ images, productName }: iAppProps) {
  const [bigImage, setBigImage] = useState(images?.[0] || null);

  if (!bigImage) return null;

  const handleSmallImageClick = (image: any) => {
    setBigImage(image);
  };

  return (
    <div className="w-full space-y-4">
      {/* Thumbnail Images - Top Row */}
      {images && images.length > 1 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 w-full max-w-none">
          {images.map((image: any, idx: number) => (
            <button
              key={idx}
              onClick={() => handleSmallImageClick(image)}
              className={`relative overflow-hidden rounded-lg bg-gray-50 transition-all duration-200 hover:opacity-90 w-full aspect-square ${
                bigImage === image
                  ? "ring-2 ring-purple-500 ring-offset-2"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={urlFor(image).url()}
                width={300}
                height={300}
                alt={`Thumbnail ${idx + 1} of ${productName || "product"}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image - 100% Width, Natural Height (No empty background box) */}
      <div className="relative w-full overflow-hidden rounded-xl">
        <Image
          src={urlFor(bigImage).url()}
          alt={productName || "Product main image"}
          width={1200}
          height={1200}
          /* 
            w-full: Stretches to 100% width.
            h-auto: Container perfectly hugs the image (no empty gray background).
            max-h-[550px]: Prevents it from getting too tall on huge desktop screens.
          */
          className="w-full h-auto max-h-[550px] object-contain mx-auto"
          priority
        />

        {/* Sale Badge */}
        <span className="absolute left-0 top-0 rounded-br-lg bg-red-500 px-3 py-1.5 text-sm uppercase tracking-wider text-white font-semibold shadow-sm">
          Sale
        </span>
      </div>
    </div>
  );
}
