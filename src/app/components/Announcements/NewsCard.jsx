import Link from "next/link";
import { newsHref } from "@/data/content";
import { formatTrDate } from "@/lib/date";
import CategoryTags from "./CategoryTags";
import NewsThumb from "./NewsThumb";

export default function NewsCard({ item, priority = false }) {
  return (
    <Link
      href={newsHref(item)}
      className="group flex flex-col rounded-xl bg-white border border-primary-500/10 shadow-xs overflow-hidden hover:border-secondary-500/30 transition-colors"
    >
      <NewsThumb
        cover={item.gallery[0] ?? null}
        priority={priority}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      />

      <div className="flex flex-col gap-1.5 p-5 pt-4">
        <time dateTime={item.publishedAt} className="text-xs font-medium text-secondary-700">
          {formatTrDate(item.publishedAt)}
        </time>
        <h3 className="text-sm font-semibold text-primary-700 group-hover:text-secondary-700 transition-colors line-clamp-2">
          {item.title}
        </h3>
        {item.summary && (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{item.summary}</p>
        )}
        <div className="flex items-center gap-1.5 flex-wrap mt-auto pt-2">
          <CategoryTags ids={item.categories} />
        </div>
      </div>
    </Link>
  );
}
