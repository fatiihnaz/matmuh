import { AlertTriangle, Briefcase, BookOpen, FileStack } from "lucide-react";
import PageLayout from "@/app/components/PageLayout";
import SubHeader from "@/app/components/Header/SubHeader";
import Panel from "@/app/components/Panel";
import PageSection from "@/app/components/PageSection";
import RelatedPages from "@/app/components/RelatedPages";
import QuickLinks from "@/app/components/QuickLinks";
import DocumentLink from "@/app/components/DocumentLink";
import {
  APPROVAL_PATHS,
  CREDIT_LIMIT,
  EQUIVALENCE_EXAMPLES,
  EQUIVALENCE_NOTE,
  PARTNER_UNIVERSITIES,
  SUMMER_DOCUMENTS,
  SUMMER_TERM,
} from "@/data/summerSchool";

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
        title="Yaz Okulu"
        subTitle={`Başka üniversiteden ve başka bölümden ders alma · ${SUMMER_TERM}`}
      />
      <PageLayout sidebar={<Sidebar />}>
        <div className="flex flex-col gap-8">
          <div className="flex gap-4 p-5 rounded-xl border border-secondary-500/25 bg-secondary-500/6">
            <AlertTriangle className="size-5 shrink-0 text-secondary-600" />
            <div className="flex flex-col gap-1">
              <span className="text-[14px] font-semibold text-primary-600">
                Yaz okulunda alınan derslerin toplam kredisi {CREDIT_LIMIT}’u
                geçemez
              </span>
              <span className="text-[13px] text-primary-500/70 leading-relaxed">
                {CREDIT_LIMIT} krediyi geçmesi durumunda diğer üniversitelerden
                veya diğer bölümlerden alınan dersler hiçbir şekilde kabul
                edilmez.
              </span>
            </div>
          </div>

          <PageSection
            title="Ders Alınabilecek Üniversiteler"
            count={PARTNER_UNIVERSITIES.length}
          >
            <Panel>
              <div className="flex flex-wrap gap-2">
                {PARTNER_UNIVERSITIES.map((name) => (
                  <span
                    key={name}
                    className="px-3 py-1.5 rounded-lg bg-primary-500/2 border border-primary-500/5 text-[13px] text-primary-500"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </Panel>
          </PageSection>

          <PageSection title="Hangi Yolu İzleyeceksin">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {APPROVAL_PATHS.map((path) => (
                <div
                  key={path.id}
                  className="flex flex-col gap-3 p-5 rounded-xl border border-primary-500/10 shadow-xs bg-white"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-[14px] font-semibold text-primary-500">
                      {path.label}
                    </span>
                    <span className="text-[12px] text-secondary-600 font-medium">
                      {path.summary}
                    </span>
                  </div>
                  <ol className="flex flex-col gap-2">
                    {path.steps.map((step, index) => (
                      <li key={step} className="flex gap-3">
                        <span className="shrink-0 flex items-center justify-center size-5 rounded bg-secondary-500/15 text-[10px] font-semibold text-secondary-600">
                          {index + 1}
                        </span>
                        <span className="text-[13px] text-primary-500/60 leading-relaxed">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </PageSection>

          <PageSection title="Ders İçerik Uygunluğu">
            <Panel>
              <div className="flex flex-col gap-4">
                <p className="text-[13px] text-primary-500/60 leading-relaxed">
                  {EQUIVALENCE_NOTE}
                </p>

                <div className="flex flex-col gap-3">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-primary-500/45">
                    Örnek ifadeler
                  </span>
                  {EQUIVALENCE_EXAMPLES.map((example) => (
                    <div
                      key={example.context}
                      className="flex flex-col gap-1.5 p-3 rounded-lg bg-primary-500/2 border-l-2 border-secondary-500/40"
                    >
                      <span className="text-[11px] font-medium text-primary-500/45">
                        {example.context}
                      </span>
                      <span className="text-[13px] text-primary-500/70 leading-relaxed italic">
                        “{example.text}”
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>
          </PageSection>

          <PageSection title="Belgeler" count={SUMMER_DOCUMENTS.length}>
            <Panel>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                {SUMMER_DOCUMENTS.map((item) => (
                  <DocumentLink key={item.href} {...item} />
                ))}
              </div>
            </Panel>
          </PageSection>
        </div>
      </PageLayout>
    </>
  );
}
