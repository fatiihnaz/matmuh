"use client";

import { useState } from "react";
import Image from "next/image";
import GalleryLightbox from "./GalleryLightbox";

export default function GalleryGrid({ images, title }) {
  const [openIndex, setOpenIndex] = useState(-1);

  if (!images.length) return null;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setOpenIndex(index)}
            aria-label={`${index + 1}. fotoğrafı büyüt`}
            className="group relative aspect-4/3 rounded-lg overflow-hidden bg-primary-500/4 cursor-pointer"
          >
            <Image
              src={image.src}
              alt={image.alt || title || ""}
              fill
              loading={index < 4 ? undefined : "lazy"}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          </button>
        ))}
      </div>

      <GalleryLightbox
        images={images}
        index={openIndex}
        title={title}
        onIndexChange={setOpenIndex}
        onClose={() => setOpenIndex(-1)}
      />
    </>
  );
}
