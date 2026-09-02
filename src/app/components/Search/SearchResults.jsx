"use client";

import Link from "next/link";
import { SearchX, WifiOff } from "lucide-react";

import { hrefForHit } from "./useSiteSearch";
import { useLocaleNav } from "@/i18n/useLocaleNav";

export function SearchEmpty({ status, term }) {
  const failed = status === "error";
  const Icon = failed ? WifiOff : SearchX;

  return (
    <div className="flex flex-col items-center gap-1.5 px-4 py-7 text-center">
      <Icon size={18} strokeWidth={1.5} className="text-primary-500/70" />
      <p className="text-[13px] text-primary-600">
        {failed ? (
          "Arama şu an yapılamıyor."
        ) : (
          <>
            <span className="font-medium">“{term}”</span> için sonuç bulunamadı.
          </>
        )}
      </p>
      <p className="text-[11px] text-primary-500/70">
        {failed
          ? "Bağlantınızı kontrol edip tekrar deneyin."
          : "Yazımı kontrol edin ya da daha kısa bir anahtar kelime deneyin."}
      </p>
    </div>
  );
}

export default function SearchResults({ groups, term, onNavigate, id }) {
  const { href } = useLocaleNav();
  return (
    <div id={id} className="overflow-hidden text-left">
      {groups.map((group) => (
        <div key={group.type} className="border-b border-primary-500/6 last:border-0">
          <div className="flex items-baseline justify-between px-4 pt-3 pb-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-primary-500/70">
              {group.label}
            </span>
            {group.total > group.items.length && (
              <span className="text-[10px] text-primary-500/70">{group.total} sonuç</span>
            )}
          </div>
          {group.items.map((hit) => (
            <Link
              key={`${hit.type}-${hit.id}`}
              href={href(hrefForHit(hit))}
              onClick={onNavigate}
              className="block px-4 py-2 transition-colors hover:bg-primary-500/4"
            >
              <span className="block truncate text-[13px] font-medium text-primary-600">
                {hit.title}
              </span>
              {hit.subtitle && (
                <span className="block truncate text-[11px] text-primary-500/70">
                  {hit.subtitle}
                </span>
              )}
            </Link>
          ))}
        </div>
      ))}

      <Link
        href={href(`/duyurular?q=${encodeURIComponent(term)}`)}
        onClick={onNavigate}
        className="block bg-primary-500/3 px-4 py-2.5 text-center text-[11px] font-medium text-secondary-700 transition-colors hover:bg-primary-500/6"
      >
        Duyurularda tümünü ara
      </Link>
    </div>
  );
}
