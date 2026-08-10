import { Download, FileText } from "lucide-react";

export default function DocumentLink({ label, href, kind, term }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 p-3 rounded-lg bg-primary-500/2 border border-primary-500/5 hover:border-secondary-500/30 hover:bg-secondary-500/4 transition-colors"
    >
      <FileText className="size-4 shrink-0 text-secondary-500" />
      <span className="flex-1 min-w-0 text-[13px] text-primary-500 leading-snug">
        {label}
        {term && (
          <span className="ml-2 inline-block px-1.5 py-0.5 rounded bg-primary-500/6 text-[10px] font-medium text-primary-500/50 align-middle">
            {term}
          </span>
        )}
      </span>
      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-primary-500/40">
        {kind}
      </span>
      <Download className="size-3.5 shrink-0 text-primary-500/30 group-hover:text-secondary-500 transition-colors" />
    </a>
  );
}
