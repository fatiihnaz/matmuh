"use client";

import { useState } from "react";
import { Download, Eye, FileText } from "lucide-react";
import { formatBytes } from "@/lib/format";
import DocumentPreview, { canPreview } from "./DocumentPreview";

const ROW =
  "group flex items-center gap-3 p-3 rounded-lg bg-primary-500/2 border border-primary-500/5 hover:border-secondary-500/30 hover:bg-secondary-500/4 transition-colors";

export default function DocumentLink({ label, href, kind, term, size }) {
  const [open, setOpen] = useState(false);
  const previewable = canPreview(href, kind);

  const handleClick = (event) => {
    if (!previewable) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey) return;
    if (kind === "pdf" && !window.matchMedia("(min-width: 768px)").matches) return;
    event.preventDefault();
    setOpen(true);
  };

  return (
    <div className={ROW}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="flex items-center gap-3 flex-1 min-w-0"
      >
        <FileText className="size-4 shrink-0 text-secondary-500" />
        <span className="min-w-0 text-[13px] text-primary-500 leading-snug wrap-break-word">
          {label}
          {term && (
            <span className="ml-2 inline-block px-1.5 py-0.5 rounded bg-primary-500/6 text-[10px] font-medium text-primary-500/50 align-middle">
              {term}
            </span>
          )}
        </span>
      </a>

      {size > 0 && (
        <span className="shrink-0 hidden sm:block text-[10px] font-mono text-primary-500/30">
          {formatBytes(size)}
        </span>
      )}
      <span className="shrink-0 hidden sm:block text-[10px] font-semibold uppercase tracking-wider text-primary-500/40">
        {kind}
      </span>

      {previewable && (
        <Eye
          className={`size-3.5 shrink-0 text-primary-500/25 group-hover:text-secondary-500 transition-colors ${
            kind === "pdf" ? "hidden md:block" : ""
          }`}
        />
      )}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        title="İndir"
        aria-label="İndir"
        className="shrink-0 -m-2 p-2 text-primary-500/30 hover:text-secondary-500 transition-colors"
      >
        <Download className="size-3.5" />
      </a>

      {previewable && (
        <DocumentPreview
          open={open}
          onClose={() => setOpen(false)}
          label={label}
          href={href}
          kind={kind}
        />
      )}
    </div>
  );
}
