"use client";
import { useState } from "react";
import { FileText } from "lucide-react";
import PageLayout from "@/app/components/PageLayout";
import SubHeader from "@/app/components/Header/SubHeader";
import MainCard from "@/app/components/MainCard";
import DocumentLink from "@/app/egitim/components/DocumentLink";
import { STUDENT_FORM_GROUPS, STAFF_FORM_GROUPS } from "@/data/forms";

const TABS = [
  { id: "ogrenci", label: "Öğrenci", groups: STUDENT_FORM_GROUPS },
  { id: "personel", label: "Personel", groups: STAFF_FORM_GROUPS },
];

export default function FormsPage() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const groups = TABS.find((tab) => tab.id === activeTab).groups;

  return (
    <>
      <SubHeader
        title="Formlar / Belgeler"
        subTitle="Öğrenci dilekçeleri ve personel formları"
      />
      <PageLayout>
        <MainCard title="Formlar" icon={FileText}>
          <div className="flex items-center gap-1 pt-1 pb-5">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-4 py-2 rounded-lg transition-colors shrink-0"
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: activeTab === tab.id ? 600 : 450,
                  color:
                    activeTab === tab.id ? "#fff" : "rgba(29,36,69,0.5)",
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

          <div className="flex flex-col gap-6">
            {groups.map((group) => (
              <div key={group.category} className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-primary-500/45">
                  {group.category}
                </span>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  {group.items.map((item) => (
                    <DocumentLink key={item.href} {...item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </MainCard>
      </PageLayout>
    </>
  );
}
