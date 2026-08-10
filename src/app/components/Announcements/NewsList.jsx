import Link from "next/link";
import { announcementHref } from "@/data/content";
import { formatTrDate } from "@/lib/date";
import NewsThumb from "./NewsThumb";

export default function NewsList({ items }) {
  if (!items.length) {
    return (
      <div className="py-16 text-center text-sm text-primary-500/40 font-medium border border-dashed border-primary-500/10 rounded-xl">
        Henüz haber yayımlanmadı.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      {items.map((item) => (
        <Link key={item.id} href={announcementHref(item)} className="group flex flex-col">
          <NewsThumb
            cover={item.gallery[0] ?? null}
            sizes="(min-width: 640px) 30vw, 100vw"
            className="mb-3 rounded-lg"
          />
          <time dateTime={item.publishedAt} className="text-xs text-secondary-500 font-medium mb-1">
            {formatTrDate(item.publishedAt)}
          </time>
          <h3 className="text-sm font-semibold text-primary-700 group-hover:text-secondary-500 transition-colors mb-1 line-clamp-2">
            {item.title}
          </h3>
          {item.summary && (
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{item.summary}</p>
          )}
        </Link>
      ))}
    </div>
  );
}
