"use client";

import Image from "next/image";
import { Download, ExternalLink, FileText } from "lucide-react";
import Modal from "./Modal";
import OfficeDocument from "./OfficeDocument";
import { useAuthedFile } from "@/app/lib/useAuthedFile";
import { useMediaQuery } from "@/app/lib/useWideViewport";

const IMAGE_KINDS = ["jpg", "jpeg", "png", "webp", "gif"];

// Tarayicida cozdugumuz turler. Eski .doc/.xls ve .ppt/.pptx disarida: onlar icin
// olgun bir istemci tarafi cozucu yok, indirmede kaliyorlar.
const OFFICE_KINDS = ["docx", "xlsx"];

export const PREVIEWABLE_KINDS = new Set(["pdf", ...IMAGE_KINDS, ...OFFICE_KINDS]);

// Backend Gotenberg ile ofis belgelerini yuklemede PDF'e ceviriyor ve `previewUrl`
// donuyor. O varsa her ofis turu acilir, cunku artik PDF gosteriyoruz ve dosya bizim
// kokenimizde duruyor. Yoksa istemci tarafi cozucuye dusuyoruz; o da baytlari okudugu
// icin CORS'a tabi, yani yalnizca ayni kokendeki dosyalarda calisir. PDF ve gorseller
// hicbir durumda etkilenmez: onlari iframe/img dogrudan gosteriyor.
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

function Notice({ children }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
      <FileText size={26} strokeWidth={1.25} className="text-primary-500/25" />
      <p className="text-[13px] text-primary-500/55">{children}</p>
    </div>
  );
}

// iOS Safari gomulu PDF'in yalnizca ilk sayfasini ciziyor ve kaydirmiyor. Dar
// ekranda iframe yerine cihazin kendi goruntuleyicisine yolluyoruz.
function PdfBody({ href, label }) {
  const { url, status } = useAuthedFile(href, true);
  const inline = useMediaQuery("(min-width: 768px)");

  if (status === "loading" || status === "idle") return <Notice>Belge açılıyor…</Notice>;
  if (status === "error" || !url) {
    return <Notice>Bu belge açılamadı. İndirip görüntüleyebilirsiniz.</Notice>;
  }

  if (!inline) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
        <FileText size={30} strokeWidth={1.25} className="text-primary-500/25" />
        <p className="text-[13px] text-primary-500/55">
          Belge telefonda kendi görüntüleyicisinde daha iyi açılıyor.
        </p>
        <a
          href={url}
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

  return <iframe src={url} title={label} className="h-full w-full border-0" />;
}

export default function DocumentPreview({ open, onClose, label, href, kind, previewHref = null }) {
  if (!open) return null;

  const isImage = !previewHref && IMAGE_KINDS.includes(kind);
  const isOffice = !previewHref && OFFICE_KINDS.includes(kind);

  return (
    <Modal open={open} onClose={onClose} label={label}>
      <div
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
        className="flex flex-col h-full pt-14 pb-3 px-3 sm:px-6"
      >
        <div className="relative flex-1 min-h-0 rounded-lg overflow-hidden bg-white">
          {isImage ? (
            <Image src={href} alt={label} fill sizes="95vw" className="object-contain" />
          ) : isOffice ? (
            <OfficeDocument href={href} kind={kind} />
          ) : (
            <PdfBody href={previewHref ?? href} label={label} />
          )}
        </div>

        <div className="shrink-0 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 pt-3">
          <span className="w-full sm:w-auto sm:flex-1 min-w-0 truncate text-center sm:text-left text-[11px] text-white/45">
            {label}
          </span>

          <a href={href} download className={ACTION}>
            <Download className="size-3.5" />
            İndir
          </a>

          <a href={href} target="_blank" rel="noopener noreferrer" className={ACTION}>
            Yeni sekmede aç
            <ExternalLink className="size-3" />
          </a>
        </div>
      </div>
    </Modal>
  );
}
