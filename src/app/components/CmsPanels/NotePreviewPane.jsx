"use client";

/**
 * @file The document preview the drawer's note panel opens: a fixed surface
 * starting where the drawer ends, so a note is read at full size with the
 * review list still beside it.
 *
 * Deliberately not `DocumentPreview`: that renders through `Modal` at z-index
 * 100, far under the drawer's 9998, so a preview opened from inside a panel
 * would sit behind the panel that opened it.
 */

import { useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Download, ExternalLink, FileText, X } from "lucide-react";

import { useMediaQuery, useWideViewport } from "@/app/lib/useWideViewport";

// inscribed's PANEL_WIDTH. The pane butts against the drawer instead of
// overlapping it, which is the point of reading side by side.
const DRAWER_WIDTH = 460;
// The drawer sits at 9998: beside it the pane stays just under, so drawer
// chrome always wins. With no room to sit beside, it covers the drawer instead.
const Z_BESIDE = 9997;
const Z_OVER = 9999;

const IMAGE_KINDS = ["jpg", "jpeg", "png", "webp", "gif"];

const T = {
  text: "color-mix(in srgb, var(--ins-text, #fff) 82%, transparent)",
  mid: "color-mix(in srgb, var(--ins-text, #fff) 58%, transparent)",
  border: "color-mix(in srgb, var(--ins-surface, #fff) 10%, transparent)",
  surface: "color-mix(in srgb, var(--ins-surface, #fff) 8%, transparent)",
};

const neverChanges = () => () => {};

export default function NotePreviewPane({ note, onClose }) {
  const mounted = useSyncExternalStore(neverChanges, () => true, () => false);
  const wide = useWideViewport();
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

  return createPortal(
    <aside
      aria-label={`${note.title} önizleme`}
      className="fixed top-0 bottom-0 right-0 flex flex-col"
      style={{
        left: wide ? DRAWER_WIDTH : 0,
        zIndex: wide ? Z_BESIDE : Z_OVER,
        backgroundColor: "color-mix(in srgb, var(--ins-bg, #1c1815), #000 35%)",
        backdropFilter: "blur(2px)",
      }}
    >
      <header
        className="flex shrink-0 items-center gap-3 px-4 py-3"
        style={{ borderBottom: `1px solid ${T.border}` }}
      >
        <FileText size={15} strokeWidth={1.5} style={{ color: T.mid }} className="shrink-0" />
        <span className="min-w-0 flex-1 truncate text-[13px]" style={{ color: T.text }}>
          {note.title}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Önizlemeyi kapat"
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors"
          style={{ color: T.mid, backgroundColor: T.surface }}
        >
          <X size={15} strokeWidth={2} />
        </button>
      </header>

      <div className="min-h-0 flex-1 bg-white">
        {isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={source} alt={note.title} className="h-full w-full object-contain" />
        ) : inlineDoc ? (
          <iframe src={source} title={note.title} className="h-full w-full border-0" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
            <FileText size={30} strokeWidth={1.25} className="text-primary-500/25" />
            <p className="text-[13px] text-primary-500/55">
              Belge telefonda kendi görüntüleyicisinde daha iyi açılıyor.
            </p>
            <a
              href={source}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-secondary-500 px-4 py-2 text-[13px] font-medium text-primary-500"
            >
              Belgeyi aç
              <ExternalLink className="size-3.5" />
            </a>
          </div>
        )}
      </div>

      <footer
        className="flex shrink-0 flex-wrap items-center justify-end gap-2 px-4 py-3"
        style={{ borderTop: `1px solid ${T.border}` }}
      >
        <a href={note.href} download={note.title} className={ACTION} style={ACTION_STYLE}>
          <Download size={13} strokeWidth={2} />
          {note.previewHref ? `Orijinali indir (${note.extension})` : "İndir"}
        </a>
        {note.previewHref && (
          <a href={note.previewHref} download={`${note.title}.pdf`} className={ACTION} style={ACTION_STYLE}>
            <Download size={13} strokeWidth={2} />
            PDF indir
          </a>
        )}
        <a
          href={source}
          target="_blank"
          rel="noopener noreferrer"
          className={ACTION}
          style={ACTION_STYLE}
        >
          Yeni sekmede aç
          <ExternalLink size={12} strokeWidth={2} />
        </a>
      </footer>
    </aside>,
    document.body,
  );
}

const ACTION =
  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] transition-colors";

const ACTION_STYLE = { color: T.mid, border: `1px solid ${T.border}` };
