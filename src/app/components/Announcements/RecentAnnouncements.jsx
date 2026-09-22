import Link from "@/app/components/LocaleLink";
import MainCard from "@/app/components/MainCard";
import { announcementHref } from "@/data/content";
import { formatDate } from "@/lib/date";
import { translate } from "@/i18n";

export default function RecentAnnouncements({ items, locale }) {
  if (!items.length) return null;
  return (
    <MainCard
      title={translate(locale, "Son Duyurular")}
      buttonTitle={translate(locale, "Tümü")}
      href={locale && locale !== "tr" ? `/${locale}/duyurular` : "/duyurular"}
      prefetch={false}
    >
      <nav aria-label={translate(locale, "Son duyurular")} className="flex flex-col divide-y divide-primary-500/6">
        {items.map((item) => (
          <Link
            key={item.id}
            href={announcementHref(item, locale)}
            className="group flex flex-col gap-0.5 py-2.5 px-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {item.publishedAt && (
              <time dateTime={item.publishedAt} className="text-[10px] font-medium text-secondary-700">
                {formatDate(item.publishedAt, locale)}
              </time>
            )}
            <span className="text-[13px] text-primary-500 leading-snug line-clamp-2 group-hover:text-secondary-700 transition-colors">
              {item.title}
            </span>
          </Link>
        ))}
      </nav>
    </MainCard>
  );
}
