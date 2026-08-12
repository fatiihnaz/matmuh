import Link from "next/link";
import { Paperclip, ImageIcon, Pin } from "lucide-react";
import { announcementHref } from "@/data/content";
import { formatTrDayMonth } from "@/lib/date";
import CategoryTags from "./CategoryTags";

export default function AnnouncementItem({ item, variant = "compact" }) {
  const { day, month } = formatTrDayMonth(item.publishedAt);
  const full = variant === "full";

  return (
    <Link
      href={announcementHref(item)}
      className="group flex items-start gap-4 py-3 px-2 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <time
        dateTime={item.publishedAt}
        className="flex flex-col py-2 items-center justify-center w-14 shrink-0 bg-primary-500/3 border border-primary-500/6 rounded-lg"
      >
        <span className="text-xl font-bold text-primary-700 leading-tight">{day}</span>
        <span className="text-xs font-medium text-secondary-500 uppercase">{month}</span>
      </time>

      <div className="min-w-0 flex-1 py-0.5">
        <p className="text-sm text-primary-700 group-hover:text-secondary-600 transition-colors">
          {item.pinned && (
            <Pin className="inline size-3 mr-1.5 -mt-0.5 text-secondary-500" aria-label="Sabitlenmiş" />
          )}
          {item.title}
        </p>

        {full && item.summary && (
          <p className="mt-1 text-xs text-gray-500 leading-relaxed line-clamp-2">
            {item.summary}
          </p>
        )}

        {full && (
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <CategoryTags ids={item.categories} />
            {item.attachments.length > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] text-primary-500/40">
                <Paperclip className="size-3" />
                {item.attachments.length}
              </span>
            )}
            {item.gallery.length > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] text-primary-500/40">
                <ImageIcon className="size-3" />
                {item.gallery.length}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
