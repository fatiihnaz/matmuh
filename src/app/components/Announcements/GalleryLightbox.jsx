"use client";

import { useCallback, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Modal from "@/app/components/Modal";

export default function GalleryLightbox({ images, index, title, onIndexChange, onClose }) {
  const open = index >= 0 && index < images.length;

  const step = useCallback(
    (delta) => onIndexChange((index + delta + images.length) % images.length),
    [index, images.length, onIndexChange],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (event) => {
      if (event.key === "ArrowRight") step(1);
      else if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  if (!open) return null;
  const image = images[index];
  const arrow =
    "absolute top-1/2 -translate-y-1/2 p-3 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors";

  return (
    <Modal open={open} onClose={onClose} label={title ? `${title} — fotoğraf galerisi` : "Fotoğraf galerisi"}>
      <div className="flex flex-col h-full py-14 px-4 sm:px-16">
        <div className="relative flex-1 min-h-0">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="90vw"
            priority
            className="object-contain"
          />
        </div>

        <div className="shrink-0 pt-4 text-center">
          {image.caption && <p className="text-[13px] text-white/70">{image.caption}</p>}
          <p className="mt-1 text-[11px] font-mono text-white/40">
            {index + 1} / {images.length}
          </p>
        </div>

        {images.length > 1 && (
          <>
            <button type="button" onClick={() => step(-1)} aria-label="Önceki fotoğraf" className={`${arrow} left-1 sm:left-4`}>
              <ChevronLeft className="size-6" />
            </button>
            <button type="button" onClick={() => step(1)} aria-label="Sonraki fotoğraf" className={`${arrow} right-1 sm:right-4`}>
              <ChevronRight className="size-6" />
            </button>
          </>
        )}
      </div>
    </Modal>
  );
}
