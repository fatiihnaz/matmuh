"use client";

import Image from "next/image";
import { Download, ExternalLink } from "lucide-react";
import Modal from "./Modal";
import OfficeDocument from "./OfficeDocument";

const IMAGE_KINDS = ["jpg", "jpeg", "png", "webp", "gif"];

// Tarayicida cozdugumuz turler. Eski .doc/.xls ve .ppt/.pptx disarida: onlar icin
// olgun bir istemci tarafi cozucu yok, indirmede kaliyorlar.
const OFFICE_KINDS = ["docx", "xlsx"];

export const PREVIEWABLE_KINDS = new Set(["pdf", ...IMAGE_KINDS, ...OFFICE_KINDS]);

const ACTION =
  "inline-flex items-center gap-1.5 shrink-0 rounded-lg border border-white/15 px-3 py-1.5 text-[11px] text-white/70 hover:border-white/35 hover:text-white transition-colors";

export default function DocumentPreview({ open, onClose, label, href, kind }) {
  if (!open) return null;

  const isImage = IMAGE_KINDS.includes(kind);
  const isOffice = OFFICE_KINDS.includes(kind);

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
            <iframe src={href} title={label} className="w-full h-full border-0" />
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
