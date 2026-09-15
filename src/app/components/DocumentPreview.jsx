"use client";

import { Download, ExternalLink, FileText } from "lucide-react";
import Modal from "./Modal";
import { useMediaQuery } from "@/app/lib/useWideViewport";
import { useT } from "@/i18n/useT";

const IMAGE_KINDS = ["jpg", "jpeg", "png", "webp", "gif"];

export const PREVIEWABLE_KINDS = new Set(["pdf", ...IMAGE_KINDS]);

export function useEmbedsInline(kind, previewHref = null) {
  const inline = useMediaQuery("(min-width: 768px)");
  return (!previewHref && IMAGE_KINDS.includes(kind)) || inline;
}

export function canPreview(href, kind, previewHref = null) {
  if (previewHref) return true;
  return Boolean(href) && PREVIEWABLE_KINDS.has(kind);
}

const ACTION =
  "inline-flex items-center gap-1.5 shrink-0 rounded-md border border-white/15 px-3 py-1.5 text-[11px] text-white/70 hover:border-white/35 hover:text-white transition-colors";

function PdfBody({ href, label, inline }) {
  const t = useT();
  if (inline) return <iframe src={href} title={label} className="h-full w-full border-0" />;

  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-10 text-center">
      <FileText size={30} strokeWidth={1.25} className="text-primary-500/70" />
      <p className="text-[13px] text-primary-500/70">
        {t("Belge telefonda kendi görüntüleyicisinde daha iyi açılıyor.")}
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-lg bg-secondary-500 px-4 py-2 text-[13px] font-medium text-primary-500 transition-opacity hover:opacity-90"
      >
        {t("Belgeyi aç")}
        <ExternalLink className="size-3.5" />
      </a>
    </div>
  );
}

export default function DocumentPreview({ open, onClose, label, href, kind, previewHref = null }) {
  const t = useT();
  const inline = useMediaQuery("(min-width: 768px)");
  if (!open) return null;

  const isImage = !previewHref && IMAGE_KINDS.includes(kind);
  const source = previewHref ?? href;
  const embeds = isImage || inline;

  return (
    <Modal open={open} onClose={onClose} label={label}>
      <div
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
        className={`flex flex-col h-full pt-14 pb-3 px-3 sm:px-6 ${
          embeds ? "" : "justify-center"
        }`}
      >
        <div
          className={`relative rounded-lg overflow-hidden bg-white ${
            embeds ? "flex-1 min-h-0" : "shrink-0"
          }`}
        >
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={source} alt={label} className="h-full w-full object-contain" />
          ) : (
            <PdfBody href={source} label={label} inline={inline} />
          )}
        </div>

        <div className="shrink-0 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 pt-3">
          <span className="w-full sm:w-auto sm:flex-1 min-w-0 truncate text-center sm:text-left text-[11px] text-white/60">
            {label}
          </span>

          <a href={href} download={label} className={ACTION}>
            <Download className="size-3.5" />
            {previewHref ? `Orijinali indir${kind ? ` (${kind.toUpperCase()})` : ""}` : "İndir"}
          </a>

          {previewHref && (
            <a href={previewHref} download={`${label}.pdf`} className={ACTION}>
              <Download className="size-3.5" />
              PDF indir
            </a>
          )}

          <a href={source} target="_blank" rel="noopener noreferrer" className={ACTION}>
            {t("Yeni sekmede aç")}
            <ExternalLink className="size-3" />
          </a>
        </div>
      </div>
    </Modal>
  );
}
