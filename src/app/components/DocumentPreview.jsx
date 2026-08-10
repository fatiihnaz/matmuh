"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";
import Modal from "./Modal";

const OFFICE_KINDS = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"];
const IMAGE_KINDS = ["jpg", "jpeg", "png", "webp", "gif"];

export const PREVIEWABLE_KINDS = new Set(["pdf", ...OFFICE_KINDS, ...IMAGE_KINDS]);

function officeEmbedSrc(href) {
  return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(href)}`;
}

export default function DocumentPreview({ open, onClose, label, href, kind }) {
  if (!open) return null;

  const isImage = IMAGE_KINDS.includes(kind);
  const isOffice = OFFICE_KINDS.includes(kind);
  const src = isOffice ? officeEmbedSrc(href) : href;

  return (
    <Modal open={open} onClose={onClose} label={label}>
      <div className="flex flex-col h-full py-14 px-3 sm:px-10">
        <div className="relative flex-1 min-h-0 rounded-lg overflow-hidden bg-white">
          {isImage ? (
            <Image src={href} alt={label} fill sizes="90vw" className="object-contain" />
          ) : (
            <iframe src={src} title={label} className="w-full h-full border-0" />
          )}
        </div>

        <div className="shrink-0 flex items-center justify-center gap-4 pt-3">
          <span className="text-[11px] text-white/45 truncate max-w-[50ch]">{label}</span>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 shrink-0 text-[11px] text-white/60 hover:text-white transition-colors"
          >
            Yeni sekmede aç
            <ExternalLink className="size-3" />
          </a>
        </div>
      </div>
    </Modal>
  );
}
