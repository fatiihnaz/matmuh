"use client";

import { useRouter } from "next/navigation";
import { CollectionComposer } from "inscribed/compose";

import SubHeader from "@/app/components/Header/SubHeader";
import PageLayout from "@/app/components/PageLayout";
import Panel from "@/app/components/Panel";
import { useT } from "@/i18n/useT";
import { useLocaleNav } from "@/i18n/useLocaleNav";

export default function NewNewsPage() {
  const router = useRouter();
  const t = useT();
  const { href } = useLocaleNav();

  return (
    <>
      <SubHeader title={t("Yeni Haber")} subTitle={t("Haber oluştur")} lastLabel={t("Yeni Haber")} />
      <PageLayout>
        <Panel>
          <CollectionComposer
            collection="news"
            submitLabel={t("Yayımla")}
            onCreated={(item) => router.push(href(`/haberler/${item.slug}`))}
          />
        </Panel>
      </PageLayout>
    </>
  );
}
