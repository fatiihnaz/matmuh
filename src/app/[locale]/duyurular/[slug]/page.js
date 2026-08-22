import { notFound } from "next/navigation";
import SubHeader from "@/app/components/Header/SubHeader";
import PageLayout from "@/app/components/PageLayout";
import Panel from "@/app/components/Panel";
import AnnouncementMeta from "@/app/components/Announcements/AnnouncementMeta";
import AnnouncementBody from "@/app/components/Announcements/AnnouncementBody";
import AttachmentList from "@/app/components/Announcements/AttachmentList";
import AdjacentNav from "@/app/components/Announcements/AdjacentNav";
import GalleryGrid from "@/app/components/Announcements/GalleryGrid";
import PageSection from "@/app/components/PageSection";
import RecentAnnouncements from "@/app/components/Announcements/RecentAnnouncements";
import QuickLinks from "@/app/components/QuickLinks";
import {
  getAdjacent,
  getAllSlugs,
  getAnnouncementBySlug,
  getAnnouncements,
} from "@/data/content";

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = await getAnnouncementBySlug(slug);
  if (!item) return { title: "Duyuru bulunamadı | YTÜ Matematik Mühendisliği" };

  return {
    title: `${item.title} | YTÜ Matematik Mühendisliği`,
    description: item.summary ?? undefined,
    alternates: { canonical: `/duyurular/${item.slug}` },
    openGraph: {
      type: "article",
      title: item.title,
      description: item.summary ?? undefined,
      publishedTime: item.publishedAt,
      images: item.gallery.length ? [item.gallery[0].src] : undefined,
    },
  };
}

export default async function AnnouncementDetailPage({ params }) {
  const { slug } = await params;
  const item = await getAnnouncementBySlug(slug);
  if (!item) notFound();

  const [{ older, newer }, { items: recent }] = await Promise.all([
    getAdjacent(slug),
    getAnnouncements({ limit: 6 }),
  ]);
  const hasBody = Boolean(item.body);

  const sidebar = (
    <div className="flex flex-col gap-6">
      <RecentAnnouncements items={recent.filter((entry) => entry.id !== item.id).slice(0, 5)} />
      <QuickLinks external title="Kurumsal Sistemler" />
    </div>
  );

  return (
    <>
      <SubHeader title={item.title} lastLabel={item.title} />
      <PageLayout sidebar={sidebar}>
        <div className="flex flex-col gap-6">
          <Panel>
            <AnnouncementMeta item={item} />
            {hasBody ? (
              <AnnouncementBody html={item.body} />
            ) : (
              <p className="text-[13px] text-primary-500/45">
                Bu duyurunun ayrıntıları ekli belgede yer alıyor.
              </p>
            )}
            {item.attachments.length > 0 && (
              <div className="mt-6">
                <AttachmentList items={item.attachments} />
              </div>
            )}
          </Panel>

          {item.gallery.length > 0 && (
            <PageSection title="Fotoğraflar" count={item.gallery.length}>
              <GalleryGrid images={item.gallery} title={item.title} />
            </PageSection>
          )}

          <AdjacentNav older={older} newer={newer} />
        </div>
      </PageLayout>
    </>
  );
}
