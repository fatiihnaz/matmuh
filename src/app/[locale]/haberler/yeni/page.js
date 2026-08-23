"use client";

import { useRouter } from "next/navigation";
import { CollectionComposer } from "inscribed/collections";

import SubHeader from "@/app/components/Header/SubHeader";
import PageLayout from "@/app/components/PageLayout";
import Panel from "@/app/components/Panel";

export default function NewNewsPage() {
  const router = useRouter();

  return (
    <>
      <SubHeader title="Yeni Haber" subTitle="Haber oluştur" lastLabel="Yeni Haber" />
      <PageLayout>
        <Panel>
          <CollectionComposer
            collection="news"
            submitLabel="Yayımla"
            onCreated={(item) => router.push(`/haberler/${item.slug}`)}
          />
        </Panel>
      </PageLayout>
    </>
  );
}
