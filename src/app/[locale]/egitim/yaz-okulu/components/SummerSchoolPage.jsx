import { AlertTriangle, Briefcase, BookOpen, FileStack } from "lucide-react";
import { EditableRegion } from "inscribed";

import PageLayout from "@/app/components/PageLayout";
import SubHeader from "@/app/components/Header/SubHeader";
import RelatedPages from "@/app/components/RelatedPages";
import QuickLinks from "@/app/components/QuickLinks";
import {
  ApprovalPaths,
  Equivalence,
  SummerDocuments,
  Universities,
} from "./SummerSections";

const RELATED = [
  { label: "Müfredat", href: "/egitim/mufredat", icon: BookOpen },
  { label: "Staj İşlemleri", href: "/egitim/staj", icon: Briefcase },
  { label: "Formlar / Belgeler", href: "/egitim/formlar", icon: FileStack },
];

function Sidebar() {
  return (
    <div className="flex flex-col gap-6">
      <RelatedPages items={RELATED} />
      <QuickLinks external title="Kurumsal Sistemler" />
    </div>
  );
}

export default function SummerSchoolPage() {
  return (
    <>
      <SubHeader
        title={
          <EditableRegion
            blockPath="page.title"
            blockType="ShortText"
            defaultValue="Yaz Okulu"
          />
        }
        subTitle={
          <EditableRegion
            blockPath="page.subtitle"
            blockType="ShortText"
            defaultValue="Başka üniversiteden ve başka bölümden ders alma · 2025-2026"
          />
        }
      />
      <PageLayout sidebar={<Sidebar />}>
        <div className="flex flex-col gap-8">
          <div className="flex gap-4 p-5 rounded-xl border border-secondary-500/25 bg-secondary-500/6">
            <AlertTriangle className="size-5 shrink-0 text-secondary-600" />
            <div className="flex flex-col gap-1">
              <EditableRegion
                blockPath="warning.title"
                blockType="ShortText"
                defaultValue="Yaz okulunda alınan derslerin toplam kredisi 9’u geçemez"
                as="span"
                className="text-[14px] font-semibold text-primary-600"
              />
              <EditableRegion
                blockPath="warning.body"
                blockType="LongText"
                defaultValue="9 krediyi geçmesi durumunda diğer üniversitelerden veya diğer bölümlerden alınan dersler hiçbir şekilde kabul edilmez."
                as="span"
                className="text-[13px] text-primary-500/70 leading-relaxed"
              />
            </div>
          </div>

          <Universities />
          <ApprovalPaths />
          <Equivalence />
          <SummerDocuments />
        </div>
      </PageLayout>
    </>
  );
}
