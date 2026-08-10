import Landing from "./components/Landing/Landing";
import PageLayout from "./components/PageLayout";
import QuickLinks from "./components/QuickLinks";
import MainCard from "./components/MainCard";
import AnnouncementList from "./components/Announcements/AnnouncementList";
import CategoryChips from "./components/Announcements/CategoryChips";
import NewsList from "./components/Announcements/NewsList";
import {
  CONTENT_CATEGORIES,
  HOME_CATEGORY_IDS,
  getAnnouncements,
  getNews,
} from "@/data/content";
import { Bell, Newspaper } from "lucide-react";

export const revalidate = 3600;

export default async function LandingPage() {
  const [{ items: announcements }, { items: news }] = await Promise.all([
    getAnnouncements({ limit: 8 }),
    getNews({ limit: 3 }),
  ]);

  const homeCategories = CONTENT_CATEGORIES.filter((c) => HOME_CATEGORY_IDS.includes(c.id));

  return (
    <>
      <Landing />

      <PageLayout sidebar={<QuickLinks />}>
        <div className="space-y-8">
          <MainCard title="Duyurular" icon={Bell} buttonTitle="Tümünü Gör" href="/duyurular">
            <div className="pb-3 mb-1 border-b border-primary-500/6">
              <CategoryChips categories={homeCategories} />
            </div>
            <AnnouncementList items={announcements} />
          </MainCard>

          <MainCard title="Haberler ve Etkinlikler" icon={Newspaper} buttonTitle="Tümünü Gör" href="/haberler">
            <NewsList items={news} />
          </MainCard>
        </div>
      </PageLayout>
    </>
  );
}
