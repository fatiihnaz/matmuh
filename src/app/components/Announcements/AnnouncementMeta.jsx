"use client";

import { CalendarDays, RefreshCw } from "lucide-react";
import { formatDate } from "@/lib/date";
import CategoryTags from "./CategoryTags";
import { useCmsRoute } from "inscribed";
import { useT } from "@/i18n/useT";

export default function AnnouncementMeta({ item }) {
  const t = useT();
  const { locale } = useCmsRoute();
  return (
    <div className="flex items-center gap-3 flex-wrap pb-4 mb-4 border-b border-primary-500/6">
      {item.publishedAt && (
        <span className="inline-flex items-center gap-1.5 text-[12px] text-primary-500/70">
          <CalendarDays className="size-3.5 text-secondary-700" />
          <time dateTime={item.publishedAt}>{formatDate(item.publishedAt, locale)}</time>
        </span>
      )}

      {item.updatedAt && (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-secondary-500/10 text-[10px] font-semibold uppercase tracking-wider text-secondary-700">
          <RefreshCw className="size-3" />
          {t("Güncellendi")}
        </span>
      )}

      <div className="flex items-center gap-1.5 flex-wrap">
        <CategoryTags ids={item.categories} />
      </div>
    </div>
  );
}
