import Landing from "@/app/components/Landing/Landing";
import PageLayout from "@/app/components/PageLayout";
import QuickLinks from "@/app/components/QuickLinks";
import MainCard from "@/app/components/MainCard";
import AnnouncementList from "@/app/components/Announcements/AnnouncementList";
import CategoryChips from "@/app/components/Announcements/CategoryChips";
import NewsList from "@/app/components/Announcements/NewsList";
import NewRecordLink from "@/app/components/Announcements/NewRecordLink";
import {
  CONTENT_CATEGORIES,
  HOME_CATEGORY_IDS,
  announcementHref,
  getAnnouncements,
  getNews,
  newsHref,
} from "@/data/content";
import { Bell, Newspaper } from "lucide-react";
import { formatTrDate } from "@/lib/date";
import { EditableRegion } from "inscribed";

export const revalidate = 3600;

export default async function LandingPage() {
  const [{ items: announcements }, { items: news }] = await Promise.all([
    getAnnouncements({ limit: 8 }),
    getNews({ limit: 3 }),
  ]);

  const homeCategories = CONTENT_CATEGORIES.filter((c) => HOME_CATEGORY_IDS.includes(c.id));

  const highlights = [
    announcements[0] && {
      label: "Son duyuru",
      title: announcements[0].title,
      href: announcementHref(announcements[0]),
      date: formatTrDate(announcements[0].publishedAt),
    },
    news[0] && {
      label: "Son haber",
      title: news[0].title,
      href: newsHref(news[0]),
      date: formatTrDate(news[0].publishedAt),
    },
  ].filter(Boolean);

  return (
    <>
      <Landing highlights={highlights} />

      <PageLayout sidebar={<QuickLinks />} sidebarFirst overlapSidebar>
        <div className="space-y-8">
          <MainCard
            title={
              <EditableRegion
                blockPath="announcements.title"
                blockType="ShortText"
                defaultValue="Duyurular"
              />
            }
            icon={Bell}
            buttonTitle="Tümünü Gör"
            href="/duyurular"
            action={<NewRecordLink href="/duyurular/yeni" label="Yeni" />}
          >
            <div className="pb-3 mb-1 border-b border-primary-500/6">
              <CategoryChips categories={homeCategories} />
            </div>
            <AnnouncementList items={announcements} />
          </MainCard>

          <MainCard
            title={
              <EditableRegion
                blockPath="news.title"
                blockType="ShortText"
                defaultValue="Haberler ve Etkinlikler"
              />
            }
            icon={Newspaper}
            buttonTitle="Tümünü Gör"
            href="/haberler"
            action={<NewRecordLink href="/haberler/yeni" label="Yeni" />}
          >
            <NewsList items={news} />
          </MainCard>
        </div>
      </PageLayout>
    </>
  );
}
