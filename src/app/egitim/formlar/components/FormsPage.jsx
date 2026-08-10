"use client";
import { useState } from "react";
import { Briefcase, BookOpen, Sun } from "lucide-react";
import PageLayout from "@/app/components/PageLayout";
import SubHeader from "@/app/components/Header/SubHeader";
import Panel from "@/app/components/Panel";
import PageSection from "@/app/components/PageSection";
import RelatedPages from "@/app/components/RelatedPages";
import QuickLinks from "@/app/components/QuickLinks";
import DocumentLink from "@/app/egitim/components/DocumentLink";
import { STUDENT_FORM_GROUPS, STAFF_FORM_GROUPS } from "@/data/forms";

const TABS = [
  { id: "ogrenci", label: "Öğrenci", groups: STUDENT_FORM_GROUPS },
  { id: "personel", label: "Personel", groups: STAFF_FORM_GROUPS },
];

const RELATED = [
  { label: "Staj İşlemleri", href: "/egitim/staj", icon: Briefcase },
  { label: "Yaz Okulu", href: "/egitim/yaz-okulu", icon: Sun },
  { label: "Müfredat", href: "/egitim/mufredat", icon: BookOpen },
];

function Sidebar() {
  return (
    <div className="flex flex-col gap-6">
      <RelatedPages items={RELATED} />
      <QuickLinks />
    </div>
  );
}

export default function FormsPage() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const active = TABS.find((tab) => tab.id === activeTab);
  const total = active.groups.reduce((sum, g) => sum + g.items.length, 0);

  return (
    <>
      <SubHeader
        title="Formlar / Belgeler"
        subTitle="Öğrenci dilekçeleri ve personel formları"
      />
      <PageLayout sidebar={<Sidebar />}>
        <div className="flex flex-col gap-8">
          <PageSection
            title="Formlar"
            count={total}
            action={
              <div className="flex items-center gap-1 shrink-0">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="px-3.5 py-1.5 rounded-lg transition-colors"
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: activeTab === tab.id ? 600 : 450,
                      color: activeTab === tab.id ? "#fff" : "rgba(29,36,69,0.5)",
                      backgroundColor:
                        activeTab === tab.id
                          ? "var(--color-primary-500)"
                          : "transparent",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            }
          >
            <Panel>
              <div className="flex flex-col gap-5">
                {active.groups.map((group) => (
                  <div key={group.category} className="flex flex-col gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-primary-500/45">
                      {group.category}
                    </span>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                      {group.items.map((item) => (
                        <DocumentLink key={item.href} {...item} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </PageSection>
        </div>
      </PageLayout>
    </>
  );
}
