import { Briefcase, ExternalLink, FileDown, Globe, Mail } from "lucide-react";
import PageLayout from "@/app/components/PageLayout";
import SubHeader from "@/app/components/Header/SubHeader";
import MainCard from "@/app/components/MainCard";
import Panel from "@/app/components/Panel";
import PageSection from "@/app/components/PageSection";
import PersonRow from "@/app/components/PersonRow";
import RelatedPages from "@/app/components/RelatedPages";
import QuickLinks from "@/app/components/QuickLinks";
import DocumentLink from "@/app/components/DocumentLink";
import {
  AGREEMENT_PERIOD,
  BILATERAL_AGREEMENTS,
  ERASMUS_CONTACT,
  ERASMUS_COORDINATORS,
  ERASMUS_DOCUMENTS,
  ERASMUS_INTERNSHIP_NOTE,
  ERASMUS_LINKS,
} from "@/data/erasmus";

const RELATED = [
  { label: "Staj İşlemleri", href: "/egitim/staj", icon: Briefcase },
];

function Sidebar() {
  return (
    <div className="flex flex-col gap-6">
      <MainCard title="İletişim">
        <a
          href={`mailto:${ERASMUS_CONTACT}`}
          className="group flex items-center gap-2 text-[13px] text-primary-500 hover:text-secondary-600 transition-colors"
        >
          <Mail className="size-4 shrink-0 text-secondary-500" />
          <span className="min-w-0 truncate">{ERASMUS_CONTACT}</span>
        </a>
      </MainCard>

      <MainCard title="Bağlantılar">
        <nav className="flex flex-col gap-0.5">
          {ERASMUS_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-3 py-2.5 rounded-lg text-[13px] text-primary-500 hover:bg-gray-50 transition-colors"
            >
              <Globe className="size-4 shrink-0 text-primary-500/60" />
              <span className="flex-1">{link.label}</span>
              <ExternalLink className="size-3 shrink-0 text-primary-500/25 group-hover:text-secondary-500 transition-colors" />
            </a>
          ))}
        </nav>
      </MainCard>

      <RelatedPages items={RELATED} />
      <QuickLinks external title="Kurumsal Sistemler" />
    </div>
  );
}

export default function ErasmusPage() {
  return (
    <>
      <SubHeader
        title="Erasmus+"
        subTitle="Değişim programları, bölüm koordinatörleri ve ikili anlaşmalar"
      />
      <PageLayout sidebar={<Sidebar />}>
        <div className="flex flex-col gap-8">
          <PageSection title="Bölüm Koordinatörleri">
            <Panel>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {ERASMUS_COORDINATORS.map((group) => (
                  <div key={group.role} className="flex flex-col gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-primary-500/45">
                      {group.role}
                    </span>
                    <div className="flex flex-col gap-1.5">
                      {group.memberIds.map((id, idx) => (
                        <PersonRow key={id} id={id} idx={idx} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </PageSection>

          <PageSection
            title="İkili Anlaşmalar"
            count={BILATERAL_AGREEMENTS.length}
            action={
              <span className="shrink-0 text-[10px] font-semibold uppercase tracking-widest text-secondary-600 px-2 py-1 rounded bg-secondary-500/10">
                {AGREEMENT_PERIOD}
              </span>
            }
          >
            <Panel padding="p-0" className="overflow-hidden">
              <table className="w-full text-left table-fixed sm:table-auto">
                <thead>
                  <tr className="border-b border-primary-500/8">
                    <th className="px-4 sm:px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-primary-500/45">
                      Kurum
                    </th>
                    <th className="hidden sm:table-cell px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-primary-500/45">
                      Ülke
                    </th>
                    <th className="hidden sm:table-cell px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-primary-500/45 whitespace-nowrap">
                      Erasmus Kodu
                    </th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {BILATERAL_AGREEMENTS.map((row) => (
                    <tr
                      key={row.code}
                      className={`border-b border-primary-500/5 last:border-0 ${
                        row.href ? "group hover:bg-secondary-500/4 transition-colors" : ""
                      }`}
                    >
                      <td className="px-4 sm:px-5 py-2.5 text-[13px] text-primary-500 wrap-break-word">
                        {row.href ? (
                          <a
                            href={row.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group-hover:text-secondary-600 hover:underline"
                          >
                            {row.institution}
                          </a>
                        ) : (
                          row.institution
                        )}
                        <span className="sm:hidden block mt-0.5 text-[11px] text-primary-500/45">
                          {row.country} · <span className="font-mono">{row.code}</span>
                        </span>
                      </td>
                      <td className="hidden sm:table-cell px-5 py-2.5 text-[12px] text-primary-500/55 whitespace-nowrap">
                        {row.country}
                      </td>
                      <td className="hidden sm:table-cell px-5 py-2.5 text-[11px] font-mono text-primary-500/45 whitespace-nowrap">
                        {row.code}
                      </td>
                      <td className="pr-4 sm:pr-5 py-2.5 w-10">
                        {row.href && (
                          <a
                            href={row.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Anlaşmayı indir"
                          >
                            <FileDown className="size-3.5 text-primary-500/25 group-hover:text-secondary-500 transition-colors" />
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>

            <p className="text-[12px] text-primary-500/45 leading-relaxed">
              Kontenjanlar, dil koşulları ve başvuru tarihleri anlaşma
              dosyasında yer alır. Güncel duyurular için YTÜ Erasmus+
              Koordinatörlüğü sayfası takip edilmelidir.
            </p>

            {ERASMUS_DOCUMENTS.map((item) => (
              <DocumentLink key={item.href} {...item} />
            ))}
          </PageSection>

          <PageSection title="Erasmus+ ile Staj">
            <Panel>
              <div className="flex gap-3">
                <Briefcase className="size-4 shrink-0 mt-0.5 text-secondary-500" />
                <p className="text-[13px] text-primary-500/60 leading-relaxed">
                  {ERASMUS_INTERNSHIP_NOTE}
                </p>
              </div>
            </Panel>
          </PageSection>
        </div>
      </PageLayout>
    </>
  );
}
