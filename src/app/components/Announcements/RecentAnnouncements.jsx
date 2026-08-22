import Link from "next/link";
import MainCard from "@/app/components/MainCard";
import { announcementHref } from "@/data/content";
import { formatTrDate } from "@/lib/date";

export default function RecentAnnouncements({ items }) {
  if (!items.length) return null;
  return (
    <MainCard title="Son Duyurular" buttonTitle="Tümü" href="/duyurular">
      <nav aria-label="Son duyurular" className="flex flex-col divide-y divide-primary-500/6">
        {items.map((item) => (
          <Link
            key={item.id}
            href={announcementHref(item)}
            className="group flex flex-col gap-0.5 py-2.5 px-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <time dateTime={item.publishedAt} className="text-[10px] font-medium text-secondary-500">
              {formatTrDate(item.publishedAt)}
            </time>
            <span className="text-[13px] text-primary-500 leading-snug line-clamp-2 group-hover:text-secondary-600 transition-colors">
              {item.title}
            </span>
          </Link>
        ))}
      </nav>
    </MainCard>
  );
}
