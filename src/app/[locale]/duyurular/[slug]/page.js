import { notFound } from "next/navigation";
import { CollectionField } from "inscribed/collections";

import SubHeader from "@/app/components/Header/SubHeader";
import PageLayout from "@/app/components/PageLayout";
import Panel from "@/app/components/Panel";
import AnnouncementMeta from "@/app/components/Announcements/AnnouncementMeta";
import AttachmentList from "@/app/components/Announcements/AttachmentList";
import AdjacentNav from "@/app/components/Announcements/AdjacentNav";
import GalleryGrid from "@/app/components/Announcements/GalleryGrid";
import PageSection from "@/app/components/PageSection";
import RecentAnnouncements from "@/app/components/Announcements/RecentAnnouncements";
import QuickLinks from "@/app/components/QuickLinks";
import { CollectionItem } from "@/app/lib/cms.jsx";
import { getAdjacent, getAnnouncementBySlug, getAnnouncements } from "@/data/content";
import { alternateLanguages } from "@/app/lib/hreflang.js";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = await getAnnouncementBySlug(slug);
  if (!item) return { title: "Duyuru bulunamadı | YTÜ Matematik Mühendisliği" };

  return {
    title: `${item.title} | YTÜ Matematik Mühendisliği`,
    description: item.summary ?? undefined,
    alternates: {
      canonical: `/duyurular/${item.slug}`,
      languages: alternateLanguages(item, "/duyurular"),
    },
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

  const sidebar = (
    <div className="flex flex-col gap-6">
      <RecentAnnouncements items={recent.filter((entry) => entry.id !== item.id).slice(0, 5)} />
      <QuickLinks external title="Kurumsal Sistemler" />
    </div>
  );

  return (
    <CollectionItem collection="announcements" slug={slug} label={item.title}>
      <SubHeader
        title={<CollectionField name="title" />}
        lastLabel={item.title}
      />
      <PageLayout sidebar={sidebar}>
        <div className="flex flex-col gap-6">
          <Panel>
            <AnnouncementMeta item={item} />
            <div className="announcement-body text-[13px] text-primary-500/70 leading-relaxed">
              <CollectionField
                name="body"
                as="div"
                html
                placeholder="İçerik eklemek için buraya yazın"
              />
            </div>
            {!item.body && (
              <p className="text-[13px] text-primary-500/70">
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
    </CollectionItem>
  );
}
