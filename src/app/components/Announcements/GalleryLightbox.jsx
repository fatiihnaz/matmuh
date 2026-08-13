"use client";

import { useCallback, useEffect, useRef } from "react";
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

  const touchRef = useRef(null);

  const onTouchStart = (event) => {
    const t = event.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (event) => {
    const start = touchRef.current;
    touchRef.current = null;
    if (!start) return;
    const t = event.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    step(dx < 0 ? 1 : -1);
  };

  if (!open) return null;
  const image = images[index];
  const arrow =
    "absolute top-1/2 -translate-y-1/2 p-3 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors";

  return (
    <Modal open={open} onClose={onClose} label={title ? `${title} - fotoğraf galerisi` : "Fotoğraf galerisi"}>
      <div className="flex flex-col h-full py-14 px-4 sm:px-16">
        <div
          className="relative flex-1 min-h-0 touch-pan-y"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="90vw"
            priority
            className="object-contain"
            draggable={false}
          />
        </div>

        <div className="shrink-0 pt-4 text-center">
          {image.caption && <p className="text-[13px] text-white/70">{image.caption}</p>}

          <p className="mt-1 text-[11px] font-mono text-white/40">
            {index + 1} / {images.length}
          </p>

          {images.length > 1 && images.length <= 12 && (
            <div className="mt-2 flex items-center justify-center gap-1.5">
              {images.map((img, i) => (
                <button
                  key={img.src}
                  type="button"
                  onClick={() => onIndexChange(i)}
                  aria-label={`${i + 1}. fotoğrafa git`}
                  aria-current={i === index}
                  className={`size-1.5 rounded-full transition-colors ${
                    i === index ? "bg-white" : "bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
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
