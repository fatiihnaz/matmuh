"use client";

import Panel from "@/app/components/Panel";
import PageSection from "@/app/components/PageSection";
import AnnouncementMeta from "./AnnouncementMeta";
import AttachmentList from "./AttachmentList";
import GalleryGrid from "./GalleryGrid";
import { announcementFromData } from "@/data/content-shape";

export default function RecordPreview({ values, collection }) {
  const noun = collection === "news" ? "haberin" : "duyurunun";
  const shape = announcementFromData(values ?? {});
  const item = {
    ...shape,
    publishedAt: shape.publishedAt || new Date().toISOString(),
    updatedAt: null,
  };
  const heading = item.title || "Başlıksız";

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl bg-primary-500 px-5 py-4">
        <h1 className="wrap-break-word text-[21px] font-light leading-snug text-white">{heading}</h1>
      </div>

      <Panel>
        <AnnouncementMeta item={item} />
        {item.body ? (
          <div
            className="announcement-body text-[13px] leading-relaxed text-primary-500/70"
            dangerouslySetInnerHTML={{ __html: item.body }}
          />
        ) : (
          <p className="text-[13px] text-primary-500/70">
            Bu {noun} ayrıntıları ekli belgede yer alıyor.
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
  );
}
