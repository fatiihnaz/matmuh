"use client";

import Link from "next/link";

import { hrefForHit } from "./useSiteSearch";

export default function SearchResults({ groups, term, onNavigate, id }) {
  return (
    <div id={id} className="overflow-hidden text-left">
      {groups.map((group) => (
        <div key={group.type} className="border-b border-primary-500/6 last:border-0">
          <div className="flex items-baseline justify-between px-4 pt-3 pb-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-primary-500/40">
              {group.label}
            </span>
            {group.total > group.items.length && (
              <span className="text-[10px] text-primary-500/30">{group.total} sonuç</span>
            )}
          </div>
          {group.items.map((hit) => (
            <Link
              key={`${hit.type}-${hit.id}`}
              href={hrefForHit(hit)}
              onClick={onNavigate}
              className="block px-4 py-2 transition-colors hover:bg-primary-500/4"
            >
              <span className="block truncate text-[13px] font-medium text-primary-600">
                {hit.title}
              </span>
              {hit.subtitle && (
                <span className="block truncate text-[11px] text-primary-500/45">
                  {hit.subtitle}
                </span>
              )}
            </Link>
          ))}
        </div>
      ))}

      <Link
        href={`/duyurular?q=${encodeURIComponent(term)}`}
        onClick={onNavigate}
        className="block bg-primary-500/3 px-4 py-2.5 text-center text-[11px] font-medium text-secondary-600 transition-colors hover:bg-primary-500/6"
      >
        Duyurularda tümünü ara
      </Link>
    </div>
  );
}
