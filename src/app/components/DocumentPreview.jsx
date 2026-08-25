"use client";

import { Download, ExternalLink, FileText } from "lucide-react";
import Modal from "./Modal";
import OfficeDocument from "./OfficeDocument";
import { useMediaQuery } from "@/app/lib/useWideViewport";

const IMAGE_KINDS = ["jpg", "jpeg", "png", "webp", "gif"];

// Tarayicida cozdugumuz turler. Eski .doc/.xls ve .ppt/.pptx disarida: onlar icin
// olgun bir istemci tarafi cozucu yok, indirmede kaliyorlar.
const OFFICE_KINDS = ["docx", "xlsx"];

export const PREVIEWABLE_KINDS = new Set(["pdf", ...IMAGE_KINDS, ...OFFICE_KINDS]);

// Backend Gotenberg ile ofis belgelerini yuklemede PDF'e ceviriyor ve `previewUrl`
// donuyor. O varsa her ofis turu acilir. Yoksa istemci tarafi cozucuye dusuyoruz; o
// baytlari okudugu icin CORS'a tabi, yani yalnizca ayni kokenden dogrudan servis
// edilen dosyalarda calisir.
export function canPreview(href, kind, previewHref = null) {
  if (previewHref) return true;
  if (!href || !PREVIEWABLE_KINDS.has(kind)) return false;
  if (!OFFICE_KINDS.includes(kind)) return true;
  if (href.startsWith("/")) return true;
  if (typeof window === "undefined") return false;
  try {
    return new URL(href, window.location.origin).origin === window.location.origin;
  } catch {
    return false;
  }
}

const ACTION =
  "inline-flex items-center gap-1.5 shrink-0 rounded-lg border border-white/15 px-3 py-1.5 text-[11px] text-white/70 hover:border-white/35 hover:text-white transition-colors";

// iOS Safari gomulu PDF'in yalnizca ilk sayfasini ciziyor ve kaydirmiyor. Dar
// ekranda iframe yerine cihazin kendi goruntuleyicisine yolluyoruz.
function PdfBody({ href, label }) {
  const inline = useMediaQuery("(min-width: 768px)");

  if (inline) return <iframe src={href} title={label} className="h-full w-full border-0" />;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
      <FileText size={30} strokeWidth={1.25} className="text-primary-500/25" />
      <p className="text-[13px] text-primary-500/55">
        Belge telefonda kendi görüntüleyicisinde daha iyi açılıyor.
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-lg bg-secondary-500 px-4 py-2 text-[13px] font-medium text-primary-500 transition-opacity hover:opacity-90"
      >
        Belgeyi aç
        <ExternalLink className="size-3.5" />
      </a>
    </div>
  );
}

export default function DocumentPreview({ open, onClose, label, href, kind, previewHref = null }) {
  if (!open) return null;

  const isImage = !previewHref && IMAGE_KINDS.includes(kind);
  const isOffice = !previewHref && OFFICE_KINDS.includes(kind);
  const source = previewHref ?? href;

  return (
    <Modal open={open} onClose={onClose} label={label}>
      <div
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
        className="flex flex-col h-full pt-14 pb-3 px-3 sm:px-6"
      >
        <div className="relative flex-1 min-h-0 rounded-lg overflow-hidden bg-white">
          {isOffice ? (
            <OfficeDocument href={href} kind={kind} />
          ) : isImage ? (
            // `next/image` burada calismaz: istegi `/_next/image` uzerinden Next
            // sunucusu yapar ve onun ne kullanicinin cerezi ne token'i vardir.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={source} alt={label} className="h-full w-full object-contain" />
          ) : (
            <PdfBody href={source} label={label} />
          )}
        </div>

        <div className="shrink-0 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 pt-3">
          <span className="w-full sm:w-auto sm:flex-1 min-w-0 truncate text-center sm:text-left text-[11px] text-white/45">
            {label}
          </span>

          {/* Donusturulmus PDF de orijinal de sunucuda duruyor. Ek satirindan
              dogrudan indirmeye tiklayan orijinali alir; burada ikisi de acikca
              sunuluyor, cunku okumak icin PDF, doldurmak icin orijinal gerekiyor. */}
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
            Yeni sekmede aç
            <ExternalLink className="size-3" />
          </a>
        </div>
      </div>
    </Modal>
  );
}
