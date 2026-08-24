"use client";

import { useEffect, useState } from "react";

// Ekran klavyesi acilinca duzen viewport'u kucuklmedigi icin `inset-0` bir katman
// klavyenin arkasina uzuyor ve sonuclarin alt kismi erisilemez oluyor. Chrome'da
// `interactiveWidget: "resizes-content"` bunu tek basina cozuyor; iOS Safari o
// ipucunu desteklemedigi icin gorsel viewport'u burada elle okuyoruz.
export function useVisualViewport(active) {
  const [box, setBox] = useState(null);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!active || !viewport) return undefined;

    let frame = 0;
    const sync = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setBox({ top: viewport.offsetTop, height: viewport.height });
      });
    };

    sync();
    viewport.addEventListener("resize", sync);
    viewport.addEventListener("scroll", sync);
    return () => {
      viewport.removeEventListener("resize", sync);
      viewport.removeEventListener("scroll", sync);
      if (frame) cancelAnimationFrame(frame);
      setBox(null);
    };
  }, [active]);

  return box;
}
