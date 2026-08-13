import SubHeader from "@/app/components/Header/SubHeader";
import PageLayout from "@/app/components/PageLayout";
import NewsCard from "@/app/components/Announcements/NewsCard";
import Pagination from "@/app/components/Announcements/Pagination";
import { getNews } from "@/data/content";

const PER_PAGE = 12;

export const revalidate = 3600;

export const metadata = {
  title: "Haberler | YTÜ Matematik Mühendisliği",
  description:
    "Bölümümüzden mezuniyet törenleri, kariyer etkinlikleri ve duyurulan programlara ilişkin haberler.",
};

export default async function NewsPage({ searchParams }) {
  const params = await searchParams;
  const page = Math.max(1, Number(params?.sayfa) || 1);

  const { items, total } = await getNews({ limit: PER_PAGE, offset: (page - 1) * PER_PAGE });

  return (
    <>
      <SubHeader
        title="Haberler"
        subTitle="Mezuniyet törenleri, kariyer etkinlikleri ve bölüm haberleri"
      />
      <PageLayout>
        <div className="flex flex-col gap-5">
          <span className="text-xs text-primary-500/40 px-1">{total} haber</span>

          {items.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((item, index) => (
                <NewsCard key={item.id} item={item} priority={index < 3} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-sm text-primary-500/40 font-medium border border-dashed border-primary-500/10 rounded-xl">
              Henüz haber yayımlanmadı.
            </div>
          )}

          <Pagination
            basePath="/haberler"
            params={{}}
            page={page}
            pageCount={Math.ceil(total / PER_PAGE)}
          />
        </div>
      </PageLayout>
    </>
  );
}
