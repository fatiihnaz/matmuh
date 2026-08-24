"use client";

import { useEffect, useState } from "react";

// Klavye acilinca duzen viewport'u kucuklmedigi icin tam ekran bir katmanin alti
// klavyenin arkasinda kaliyor. Chrome bunu `interactiveWidget` ile kendi cozuyor;
// iOS Safari ve Firefox desteklemedigi icin ortulen yuksekligi burada oluyoruz.
//
// Yalnizca `resize` olayina baglaniyoruz, mount aninda olcmuyoruz: paylasimli
// layout gecisi ucusttayken bir olcum yayinlamak framer'in projeksiyonunu
// bozuyor ve katman iceriden yayiliyor.
const THRESHOLD = 120;

export function useKeyboardInset(active) {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!active || !viewport) return undefined;

    let frame = 0;
    const sync = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const covered = window.innerHeight - viewport.height - viewport.offsetTop;
        setInset(covered > THRESHOLD ? Math.round(covered) : 0);
      });
    };

    viewport.addEventListener("resize", sync);
    return () => {
      viewport.removeEventListener("resize", sync);
      if (frame) cancelAnimationFrame(frame);
      setInset(0);
    };
  }, [active]);

  return inset;
}
