import { Briefcase, ExternalLink, Globe, Mail } from "lucide-react";
import PageLayout from "@/app/components/PageLayout";
import SubHeader from "@/app/components/Header/SubHeader";
import MainCard from "@/app/components/MainCard";
import Panel from "@/app/components/Panel";
import PageSection from "@/app/components/PageSection";
import PersonRow from "@/app/components/PersonRow";
import RelatedPages from "@/app/components/RelatedPages";
import QuickLinks from "@/app/components/QuickLinks";
import DocumentLink from "@/app/egitim/components/DocumentLink";
import {
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
      <QuickLinks />
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

          <PageSection title="İkili Anlaşmalar">
            <Panel>
              <div className="flex flex-col gap-3">
                <p className="text-[13px] text-primary-500/60 leading-relaxed">
                  Bölümün Erasmus+ ikili anlaşmaları aşağıdaki listede yer alır.
                  Güncel anlaşmalar ve başvuru duyuruları için YTÜ Erasmus+
                  Koordinatörlüğü sayfası takip edilmelidir.
                </p>
                {ERASMUS_DOCUMENTS.map((item) => (
                  <DocumentLink key={item.href} {...item} />
                ))}
              </div>
            </Panel>
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
