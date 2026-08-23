"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";

import SearchResults from "@/app/components/Search/SearchResults";
import { MIN_CHARS, useSiteSearch } from "@/app/components/Search/useSiteSearch";

export default function NavSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const listId = useId();

  const { term, groups, hasResults } = useSiteSearch(query);

  useEffect(() => {
    if (!open) return undefined;

    const { body } = document;
    const previous = body.style.overflow;
    body.style.overflow = "hidden";
    inputRef.current?.focus();

    function onKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Sitede ara"
        title="Sitede ara"
        aria-expanded={open}
        className="hidden lg:block pl-2 text-neutral-400 hover:text-white transition-colors"
      >
        <Search size={14} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 top-[var(--header-h)] z-40 bg-primary-700/80 backdrop-blur-sm"
            onClick={close}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Site araması"
              onClick={(event) => event.stopPropagation()}
              className="mx-auto w-full max-w-3xl px-4 pt-8"
            >
              <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white px-4 shadow-2xl shadow-primary-700/40">
                <Search size={18} className="shrink-0 text-primary-500/35" />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Duyuru, haber, ders veya personel ara..."
                  role="combobox"
                  aria-label="Sitede ara"
                  aria-autocomplete="list"
                  aria-expanded={hasResults}
                  aria-controls={listId}
                  autoComplete="off"
                  className="w-full bg-transparent py-3 text-[15px] text-primary-600 outline-none placeholder:text-primary-500/35"
                />
                <button
                  type="button"
                  onClick={close}
                  aria-label="Aramayı kapat"
                  className="shrink-0 rounded-lg p-1.5 text-primary-500/35 transition-colors hover:bg-primary-500/6 hover:text-primary-500"
                >
                  <X size={18} />
                </button>
              </div>

              {hasResults && (
                <div className="mt-2 max-h-[65svh] overflow-y-auto overscroll-contain rounded-xl border border-primary-500/10 bg-white shadow-2xl shadow-primary-700/30">
                  <SearchResults id={listId} groups={groups} term={term} onNavigate={close} />
                </div>
              )}

              {term.length >= MIN_CHARS && !hasResults && (
                <p className="mt-3 text-center text-[13px] text-white/60">
                  Sonuç bulunamadı.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
