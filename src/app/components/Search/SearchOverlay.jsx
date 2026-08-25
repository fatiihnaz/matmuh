"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";

import { useKeyboardInset } from "@/app/lib/useKeyboardInset";
import SearchResults from "./SearchResults";
import { MIN_CHARS, useSiteSearch } from "./useSiteSearch";

export default function SearchOverlay({ open, onClose, fullScreen = false, layoutId }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const listId = useId();
  const keyboardInset = useKeyboardInset(open);

  const { term, groups, hasResults } = useSiteSearch(query);

  useEffect(() => {
    if (!open) return undefined;

    const { body } = document;
    const previous = body.style.overflow;
    body.style.overflow = "hidden";
    inputRef.current?.focus();

    function onKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const close = () => {
    setQuery("");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={close}
          className={`fixed inset-0 z-70 bg-primary-700/85 backdrop-blur-sm ${
            fullScreen ? "" : "top-(--header-h)"
          }`}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Site araması"
            onClick={(event) => {
              event.stopPropagation();
              if (event.target === event.currentTarget) close();
            }}
            className={`mx-auto flex h-full w-full max-w-3xl px-4 ${
              fullScreen ? "flex-col pt-6 pb-6" : "flex-col pt-6 sm:pt-8"
            }`}
          >
            <motion.div
              layoutId={layoutId}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex shrink-0 items-center gap-2 rounded-xl border border-white/15 bg-white px-4 shadow-2xl shadow-primary-700/40 transition-[background-color,border-color] duration-300 focus-within:border-secondary-500/70"
            >
              <Search size={18} className="shrink-0 text-primary-500/70" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Ara..."
                role="combobox"
                aria-label="Sitede ara"
                aria-autocomplete="list"
                aria-expanded={hasResults}
                aria-controls={listId}
                autoComplete="off"
                className="w-full bg-transparent py-2.5 text-sm text-primary-600 outline-none! placeholder:text-primary-500/70"
              />
              <button
                type="button"
                onClick={close}
                aria-label="Aramayı kapat"
                className="shrink-0 rounded-lg p-1.5 text-primary-500/70 transition-colors hover:bg-primary-500/6 hover:text-primary-500"
              >
                <X size={18} />
              </button>
            </motion.div>

            {hasResults && (
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-xl border border-primary-500/10 bg-white shadow-2xl shadow-primary-700/30 sm:flex-none sm:max-h-[65svh]"
                style={{ marginTop: 8, marginBottom: keyboardInset || undefined }}>
                <SearchResults id={listId} groups={groups} term={term} onNavigate={close} />
              </div>
            )}

            {term.length >= MIN_CHARS && !hasResults && (
              <p className="mt-3 text-center text-[13px] text-white/60">Sonuç bulunamadı.</p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
