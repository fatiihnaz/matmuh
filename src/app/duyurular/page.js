import { Suspense } from "react";
import SubHeader from "../components/Header/SubHeader";
import PageLayout from "../components/PageLayout";
import QuickLinks from "../components/QuickLinks";
import Panel from "../components/Panel";
import AnnouncementList from "../components/Announcements/AnnouncementList";
import AnnouncementFilters from "../components/Announcements/AnnouncementFilters";
import CategoryChips from "../components/Announcements/CategoryChips";
import Pagination from "../components/Announcements/Pagination";
import { PAGE_SIZE, getAnnouncements, getCategoriesWithCounts } from "@/data/content";

export const metadata = {
  title: "Duyurular",
  description:
    "Sınav programları, staj, mezuniyet ve ders kayıtlarına ilişkin bölüm duyuruları.",
};

export default async function AnnouncementsPage({ searchParams }) {
  const params = await searchParams;
  const category = params?.kategori ?? null;
  const q = params?.q ?? "";
  const page = Math.max(1, Number(params?.sayfa) || 1);

  const [{ items, total }, categories] = await Promise.all([
    getAnnouncements({ category, q, limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE }),
    getCategoriesWithCounts(),
  ]);

  const activeParams = {};
  if (category) activeParams.kategori = category;
  if (q) activeParams.q = q;

  return (
    <>
      <SubHeader
        title="Duyurular"
        subTitle="Sınav programları, staj, mezuniyet ve bölüm duyuruları"
      />
      <PageLayout sidebar={<QuickLinks />}>
        <div className="flex flex-col gap-5">
          <Panel className="flex flex-col lg:flex-row lg:items-center gap-4">
            <Suspense fallback={<div className="h-9 w-full sm:max-w-xs rounded-lg bg-primary-500/3" />}>
              <AnnouncementFilters />
            </Suspense>
            <div className="lg:ml-auto">
              <CategoryChips categories={categories} active={category} showCounts />
            </div>
          </Panel>

          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-primary-500/40">
              {total} duyuru{q ? ` · "${q}" için sonuçlar` : ""}
            </span>
          </div>

          <Panel padding="p-2">
            <AnnouncementList items={items} variant="full" />
          </Panel>

          <Pagination
            basePath="/duyurular"
            params={activeParams}
            page={page}
            pageCount={Math.ceil(total / PAGE_SIZE)}
          />
        </div>
      </PageLayout>
    </>
  );
}
