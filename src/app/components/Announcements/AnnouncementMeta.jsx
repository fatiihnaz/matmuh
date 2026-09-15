import { CalendarDays, RefreshCw } from "lucide-react";
import { formatTrDate } from "@/lib/date";
import CategoryTags from "./CategoryTags";
import { getCmsRoute } from "@/app/lib/cms.jsx";
import { translate } from "@/i18n";

export default async function AnnouncementMeta({ item }) {
  const { locale } = await getCmsRoute();
  return (
    <div className="flex items-center gap-3 flex-wrap pb-4 mb-4 border-b border-primary-500/6">
      <span className="inline-flex items-center gap-1.5 text-[12px] text-primary-500/70">
        <CalendarDays className="size-3.5 text-secondary-700" />
        <time dateTime={item.publishedAt}>{formatTrDate(item.publishedAt)}</time>
      </span>

      {item.updatedAt && (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-secondary-500/10 text-[10px] font-semibold uppercase tracking-wider text-secondary-700">
          <RefreshCw className="size-3" />
          {translate(locale, "Güncellendi")}
        </span>
      )}

      <div className="flex items-center gap-1.5 flex-wrap">
        <CategoryTags ids={item.categories} />
      </div>
    </div>
  );
}
