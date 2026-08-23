import { notFound } from "next/navigation";
import { CollectionField } from "inscribed/collections";

import SubHeader from "@/app/components/Header/SubHeader";
import PageLayout from "@/app/components/PageLayout";
import Panel from "@/app/components/Panel";
import PageSection from "@/app/components/PageSection";
import AnnouncementMeta from "@/app/components/Announcements/AnnouncementMeta";
import AttachmentList from "@/app/components/Announcements/AttachmentList";
import GalleryGrid from "@/app/components/Announcements/GalleryGrid";
import QuickLinks from "@/app/components/QuickLinks";
import { CollectionItem } from "@/app/lib/cms.jsx";
import { getNewsBySlug } from "@/data/content";
import { alternateLanguages } from "@/app/lib/hreflang.js";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) return { title: "Haber bulunamadı | YTÜ Matematik Mühendisliği" };

  return {
    title: `${item.title} | YTÜ Matematik Mühendisliği`,
    description: item.summary ?? undefined,
    alternates: {
      canonical: `/haberler/${item.slug}`,
      languages: alternateLanguages(item, "/haberler"),
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

export default async function NewsDetailPage({ params }) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) notFound();

  const sidebar = (
    <div className="flex flex-col gap-6">
      <QuickLinks external title="Kurumsal Sistemler" />
    </div>
  );

  return (
    <CollectionItem collection="news" slug={slug} label={item.title}>
      <SubHeader title={<CollectionField name="title" />} lastLabel={item.title} />
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
              <p className="text-[13px] text-primary-500/45">
                Bu haberin ayrıntıları ekli belgede yer alıyor.
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
        </div>
      </PageLayout>
    </CollectionItem>
  );
}
