import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  FileText,
  Quote,
} from "lucide-react";
import PageLayout from "@/app/components/PageLayout";
import SubHeader from "@/app/components/Header/SubHeader";
import MainCard from "@/app/components/MainCard";
import DocumentLink from "@/app/egitim/components/DocumentLink";
import {
  APPROVAL_PATHS,
  CREDIT_LIMIT,
  EQUIVALENCE_EXAMPLES,
  EQUIVALENCE_NOTE,
  PARTNER_UNIVERSITIES,
  SUMMER_DOCUMENTS,
  SUMMER_TERM,
} from "@/data/summerSchool";

export default function SummerSchoolPage() {
  return (
    <>
      <SubHeader
        title="Yaz Okulu"
        subTitle={`Başka üniversiteden ve başka bölümden ders alma · ${SUMMER_TERM}`}
      />
      <PageLayout>
        <div className="space-y-6">
          <div className="flex gap-4 p-4 rounded-xl border border-secondary-500/25 bg-secondary-500/6">
            <AlertTriangle className="size-5 shrink-0 text-secondary-600" />
            <div className="flex flex-col gap-1">
              <span className="text-[14px] font-semibold text-primary-600">
                Yaz okulunda alınan derslerin toplam kredisi {CREDIT_LIMIT}’u
                geçemez
              </span>
              <span className="text-[13px] text-primary-500/70 leading-relaxed">
                {CREDIT_LIMIT} krediyi geçmesi durumunda diğer
                üniversitelerden veya diğer bölümlerden alınan dersler hiçbir
                şekilde kabul edilmez.
              </span>
            </div>
          </div>

          <MainCard title="Ders Alınabilecek Üniversiteler" icon={Building2}>
            <div className="flex flex-wrap gap-2 pt-1">
              {PARTNER_UNIVERSITIES.map((name) => (
                <span
                  key={name}
                  className="px-3 py-1.5 rounded-lg bg-primary-500/2 border border-primary-500/5 text-[13px] text-primary-500"
                >
                  {name}
                </span>
              ))}
            </div>
          </MainCard>

          <MainCard title="Hangi Yolu İzleyeceksin" icon={CheckCircle2}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {APPROVAL_PATHS.map((path) => (
                <div
                  key={path.id}
                  className="flex flex-col gap-3 p-4 rounded-lg bg-primary-500/2 border border-primary-500/5"
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
          </MainCard>

          <MainCard title="Ders İçerik Uygunluğu" icon={Quote}>
            <div className="flex flex-col gap-4 pt-1">
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
          </MainCard>

          <MainCard title="Belgeler" icon={FileText}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 pt-1">
              {SUMMER_DOCUMENTS.map((item) => (
                <DocumentLink key={item.href} {...item} />
              ))}
            </div>
          </MainCard>
        </div>
      </PageLayout>
    </>
  );
}
