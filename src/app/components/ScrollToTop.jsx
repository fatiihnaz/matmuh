"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";

const REVEAL_AT = 800;

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setVisible(window.scrollY > REVEAL_AT);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          aria-label="Sayfanın başına dön"
          onClick={() =>
            window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" })
          }
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: reducedMotion ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="fixed right-4 bottom-4 z-50 flex size-10 items-center justify-center rounded-full border border-primary-500/10 bg-white/90 text-primary-500/60 shadow-sm backdrop-blur-sm transition-colors hover:border-secondary-500/40 hover:text-secondary-600 sm:right-6 sm:bottom-6"
        >
          <ArrowUp size={16} strokeWidth={2} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
