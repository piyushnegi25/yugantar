"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

interface ProductImageGalleryProps {
  images: string[];
  alt: string;
}

export function ProductImageGallery({ images, alt }: ProductImageGalleryProps) {
  const validImages = useMemo(
    () =>
      (Array.isArray(images) ? images : []).filter(
        (img) => typeof img === "string" && img.trim().length > 0
      ),
    [images]
  );

  const fallbackImage = "/placeholder.svg";
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = validImages[activeIndex] || validImages[0] || fallbackImage;

  return (
    <div className="grid gap-3">
      <div className="relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-white">
        <Image
          src={activeImage}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {validImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {validImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-square overflow-hidden rounded-md border transition-colors ${
                activeIndex === index
                  ? "border-gray-900"
                  : "border-gray-200 hover:border-gray-400"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${alt} image ${index + 1}`}
                fill
                className="object-cover"
                sizes="120px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
