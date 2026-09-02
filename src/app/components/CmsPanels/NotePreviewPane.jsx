"use client";

/**
 * @file The document preview the drawer's note panel opens: the same surface
 * `DocumentPreview` draws — dark ground, the document on a rounded white sheet
 * with room around it, actions underneath — but starting where the drawer ends,
 * so a note is read at full size with the review list still beside it.
 *
 * Deliberately not `DocumentPreview` itself: that renders through `Modal` at
 * z-index 100, far under the drawer's 9998, so a preview opened from inside a
 * panel would sit behind the panel that opened it.
 */

import { useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Download, ExternalLink, FileText, X } from "lucide-react";

import { useMediaQuery, useWideViewport } from "@/app/lib/useWideViewport";
import { useDrawerVisible } from "./useDrawerVisible";

// inscribed's PANEL_WIDTH. The pane butts against the drawer instead of
// overlapping it, which is the point of reading side by side.
const DRAWER_WIDTH = 460;
// The drawer sits at 9998: beside it the pane stays just under, so drawer
// chrome always wins. With no room to sit beside, it covers the drawer instead.
const Z_BESIDE = 9997;
const Z_OVER = 9999;

const IMAGE_KINDS = ["jpg", "jpeg", "png", "webp", "gif"];

const neverChanges = () => () => {};

export default function NotePreviewPane({ note, onClose, anchorRef }) {
  const mounted = useSyncExternalStore(neverChanges, () => true, () => false);
  const wide = useWideViewport();
  const drawerVisible = useDrawerVisible(anchorRef);
  // Same threshold `DocumentPreview` uses: below it a document reads better in
  // the phone's own viewer than in an iframe.
  const inlineDoc = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    if (!note) return undefined;
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      // The drawer closes on Escape too, and reading a note is the inner
      // surface: it should be what the key reaches.
      event.stopPropagation();
      onClose();
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [note, onClose]);

  if (!mounted || !note) return null;

  const kind = String(note.extension ?? "").toLowerCase();
  const source = note.previewHref ?? note.href;
  const isImage = !note.previewHref && IMAGE_KINDS.includes(kind);

  const beside = wide && drawerVisible;

  const closeOnBackdrop = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${note.title} önizleme`}
      className="fixed top-0 bottom-0 right-0 bg-primary-700/92 backdrop-blur-xs"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18 }}
      style={{
        left: beside ? DRAWER_WIDTH : 0,
        zIndex: beside ? Z_BESIDE : Z_OVER,
        transition: "left 260ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      onClick={closeOnBackdrop}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Önizlemeyi kapat"
        className="absolute top-4 right-4 z-10 rounded-lg p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
      >
        <X className="size-5" />
      </button>

      <div
        onClick={closeOnBackdrop}
        className="flex h-full flex-col px-3 pt-14 pb-3 sm:px-6"
      >
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg bg-white">
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={source} alt={note.title} className="h-full w-full object-contain" />
          ) : inlineDoc ? (
            <iframe src={source} title={note.title} className="h-full w-full border-0" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
              <FileText size={30} strokeWidth={1.25} className="text-primary-500/70" />
              <p className="text-[13px] text-primary-500/70">
                Belge telefonda kendi görüntüleyicisinde daha iyi açılıyor.
              </p>
              <a
                href={source}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-secondary-500 px-4 py-2 text-[13px] font-medium text-primary-500 transition-opacity hover:opacity-90"
              >
                Belgeyi aç
                <ExternalLink className="size-3.5" />
              </a>
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-center gap-x-3 gap-y-2 pt-3">
          <span className="w-full min-w-0 truncate text-center text-[11px] text-white/60 sm:w-auto sm:flex-1 sm:text-left">
            {note.title}
          </span>

          <a href={note.href} download={note.title} className={ACTION}>
            <Download className="size-3.5" />
            {note.previewHref
              ? `Orijinali indir${note.extension ? ` (${note.extension})` : ""}`
              : "İndir"}
          </a>

          {note.previewHref && (
            <a href={note.previewHref} download={`${note.title}.pdf`} className={ACTION}>
              <Download className="size-3.5" />
              PDF indir
            </a>
          )}

          <a href={source} target="_blank" rel="noopener noreferrer" className={ACTION}>
            Yeni sekmede aç
            <ExternalLink className="size-3" />
          </a>
        </div>
      </div>
    </motion.div>,
    document.body,
  );
}

const ACTION =
  "inline-flex items-center gap-1.5 shrink-0 rounded-md border border-white/15 px-3 py-1.5 text-[11px] text-white/70 transition-colors hover:border-white/35 hover:text-white";
