"use client";

import { useRouter } from "next/navigation";
import { CollectionComposer } from "inscribed/collections";

import SubHeader from "@/app/components/Header/SubHeader";
import PageLayout from "@/app/components/PageLayout";
import Panel from "@/app/components/Panel";

export default function NewAnnouncementPage() {
  const router = useRouter();

  return (
    <>
      <SubHeader title="Yeni Duyuru" subTitle="Duyuru oluştur" lastLabel="Yeni Duyuru" />
      <PageLayout>
        <Panel>
          <CollectionComposer
            collection="announcements"
            submitLabel="Yayımla"
            onCreated={(item) => router.push(`/duyurular/${item.slug}`)}
          />
        </Panel>
      </PageLayout>
    </>
  );
}
