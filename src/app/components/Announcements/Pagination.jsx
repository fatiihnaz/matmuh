import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

function pageHref(basePath, params, page) {
  const next = new URLSearchParams(params);
  if (page > 1) next.set("sayfa", String(page));
  else next.delete("sayfa");
  const query = next.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export default function Pagination({ basePath, params, page, pageCount }) {
  if (pageCount <= 1) return null;

  const pages = [];
  for (let i = 1; i <= pageCount; i++) {
    if (i === 1 || i === pageCount || Math.abs(i - page) <= 1) pages.push(i);
    else if (pages.at(-1) !== "…") pages.push("…");
  }

  const arrow = "flex items-center justify-center size-8 rounded-lg border border-primary-500/8 text-primary-500/50 hover:border-secondary-500/30 hover:text-secondary-600 transition-colors";

  return (
    <nav className="flex items-center justify-center gap-1 pt-6" aria-label="Sayfalar">
      {page > 1 && (
        <Link href={pageHref(basePath, params, page - 1)} className={arrow} aria-label="Önceki sayfa">
          <ChevronLeft size={14} />
        </Link>
      )}

      {pages.map((entry, index) =>
        entry === "…" ? (
          <span key={`gap-${index}`} className="px-1 text-xs text-primary-500/30">
            …
          </span>
        ) : (
          <Link
            key={entry}
            href={pageHref(basePath, params, entry)}
            aria-current={entry === page ? "page" : undefined}
            className={`flex items-center justify-center size-8 rounded-lg text-xs font-medium border transition-colors ${
              entry === page
                ? "bg-secondary-500/12 border-secondary-500/20 text-secondary-600"
                : "border-primary-500/8 text-primary-500/50 hover:border-secondary-500/30 hover:text-secondary-600"
            }`}
          >
            {entry}
          </Link>
        ),
      )}

      {page < pageCount && (
        <Link href={pageHref(basePath, params, page + 1)} className={arrow} aria-label="Sonraki sayfa">
          <ChevronRight size={14} />
        </Link>
      )}
    </nav>
  );
}
