"use client";

import { useState } from "react";
import { Download, Eye, FileText } from "lucide-react";
import { formatBytes } from "@/lib/format";
import DocumentPreview, { PREVIEWABLE_KINDS } from "./DocumentPreview";

const ROW =
  "group flex items-center gap-3 p-3 rounded-lg bg-primary-500/2 border border-primary-500/5 hover:border-secondary-500/30 hover:bg-secondary-500/4 transition-colors";

function Label({ label, term }) {
  return (
    <span className="flex-1 min-w-0 text-[13px] text-primary-500 leading-snug text-left">
      {label}
      {term && (
        <span className="ml-2 inline-block px-1.5 py-0.5 rounded bg-primary-500/6 text-[10px] font-medium text-primary-500/50 align-middle">
          {term}
        </span>
      )}
    </span>
  );
}

function Meta({ size, kind }) {
  return (
    <>
      {size > 0 && (
        <span className="shrink-0 hidden sm:block text-[10px] font-mono text-primary-500/30">
          {formatBytes(size)}
        </span>
      )}
      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-primary-500/40">
        {kind}
      </span>
    </>
  );
}

export default function DocumentLink({ label, href, kind, term, size }) {
  const [open, setOpen] = useState(false);

  if (!PREVIEWABLE_KINDS.has(kind)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={ROW}>
        <FileText className="size-4 shrink-0 text-secondary-500" />
        <Label label={label} term={term} />
        <Meta size={size} kind={kind} />
        <Download className="size-3.5 shrink-0 text-primary-500/30 group-hover:text-secondary-500 transition-colors" />
      </a>
    );
  }

  return (
    <div className={ROW}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
        title="Sitede görüntüle"
      >
        <FileText className="size-4 shrink-0 text-secondary-500" />
        <Label label={label} term={term} />
      </button>

      <Meta size={size} kind={kind} />

      <Eye className="size-3.5 shrink-0 text-primary-500/25 group-hover:text-secondary-500 transition-colors" />
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        title="İndir"
        className="shrink-0 text-primary-500/30 hover:text-secondary-500 transition-colors"
      >
        <Download className="size-3.5" />
      </a>

      <DocumentPreview
        open={open}
        onClose={() => setOpen(false)}
        label={label}
        href={href}
        kind={kind}
      />
    </div>
  );
}
