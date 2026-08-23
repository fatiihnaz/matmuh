"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Search } from "lucide-react";

import SearchResults from "@/app/components/Search/SearchResults";
import { useSiteSearch } from "@/app/components/Search/useSiteSearch";

const neverChanges = () => () => {};

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const [dismissed, setDismissed] = useState("");
  const boxRef = useRef(null);
  const listId = useId();

  const [rect, setRect] = useState(null);
  const mounted = useSyncExternalStore(neverChanges, () => true, () => false);

  const { term, groups, hasResults } = useSiteSearch(query);
  const open = hasResults && dismissed !== term;

  useEffect(() => {
    function onPointerDown(event) {
      if (boxRef.current && !boxRef.current.contains(event.target)) setDismissed(term);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [term]);

  useLayoutEffect(() => {
    if (!open) return undefined;

    const measure = () => {
      const node = boxRef.current;
      if (node) setRect(node.getBoundingClientRect());
    };

    measure();
    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("scroll", measure, { passive: true });
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
    };
  }, [open]);

  return (
    <div ref={boxRef} className="relative w-full">
      <form action="/duyurular" className="relative w-full">
        <div className="relative flex items-center bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 overflow-hidden transition-all duration-300 focus-within:shadow-xl w-full">
          <input
            type="search"
            name="q"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setDismissed("")}
            onKeyDown={(event) => event.key === "Escape" && setDismissed(term)}
            placeholder="Duyuru, haber, ders veya personel ara..."
            role="combobox"
            aria-label="Sitede ara"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls={listId}
            autoComplete="off"
            className="w-full py-3 px-6 text-base text-slate-700 placeholder-slate-400 outline-none bg-transparent font-medium"
          />
          <button
            type="submit"
            aria-label="Ara"
            className="px-6 py-3 text-slate-400 hover:text-primary-500 transition-colors flex items-center justify-center"
          >
            <Search size={22} />
          </button>
        </div>
      </form>

      {open &&
        mounted &&
        rect &&
        createPortal(
          <div
            style={{ left: rect.left, top: rect.bottom + 8, width: rect.width }}
            className="fixed z-60 max-h-[70svh] overflow-y-auto overscroll-contain rounded-xl border border-primary-500/10 bg-white shadow-2xl shadow-primary-700/25"
          >
            <SearchResults
              id={listId}
              groups={groups}
              term={term}
              onNavigate={() => setDismissed(term)}
            />
          </div>,
          document.body,
        )}
    </div>
  );
}
