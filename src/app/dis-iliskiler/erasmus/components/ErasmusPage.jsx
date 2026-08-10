import { Briefcase, ExternalLink, FileText, Globe, Mail, Users } from "lucide-react";
import PageLayout from "@/app/components/PageLayout";
import SubHeader from "@/app/components/Header/SubHeader";
import MainCard from "@/app/components/MainCard";
import PersonRow from "@/app/components/PersonRow";
import DocumentLink from "@/app/egitim/components/DocumentLink";
import {
  ERASMUS_CONTACT,
  ERASMUS_COORDINATORS,
  ERASMUS_DOCUMENTS,
  ERASMUS_INTERNSHIP_NOTE,
  ERASMUS_LINKS,
} from "@/data/erasmus";

export default function ErasmusPage() {
  return (
    <>
      <SubHeader
        title="Erasmus+"
        subTitle="Değişim programları, bölüm koordinatörleri ve ikili anlaşmalar"
      />
      <PageLayout>
        <div className="space-y-6">
          <MainCard title="Bölüm Koordinatörleri" icon={Users}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
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

            <a
              href={`mailto:${ERASMUS_CONTACT}`}
              className="mt-4 group flex items-center gap-2 text-[13px] text-primary-500 hover:text-secondary-600 transition-colors w-fit"
            >
              <Mail className="size-4 text-secondary-500" />
              {ERASMUS_CONTACT}
            </a>
          </MainCard>

          <MainCard title="İkili Anlaşmalar" icon={Globe}>
            <div className="flex flex-col gap-3 pt-1">
              <p className="text-[13px] text-primary-500/60 leading-relaxed">
                Bölümün Erasmus+ ikili anlaşmaları aşağıdaki listede yer alır.
                Güncel anlaşmalar ve başvuru duyuruları için YTÜ Erasmus+
                Koordinatörlüğü sayfası takip edilmelidir.
              </p>
              {ERASMUS_DOCUMENTS.map((item) => (
                <DocumentLink key={item.href} {...item} />
              ))}
            </div>
          </MainCard>

          <MainCard title="Erasmus+ ile Staj" icon={Briefcase}>
            <p className="text-[13px] text-primary-500/60 leading-relaxed pt-1">
              {ERASMUS_INTERNSHIP_NOTE}
            </p>
          </MainCard>

          <MainCard title="Bağlantılar" icon={FileText}>
            <div className="flex flex-col gap-2 pt-1">
              {ERASMUS_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 p-2.5 rounded-lg bg-primary-500/2 border border-primary-500/5 hover:border-secondary-500/30 transition-colors"
                >
                  <Globe className="size-4 shrink-0 text-secondary-500" />
                  <span className="flex-1 text-[13px] text-primary-500">
                    {link.label}
                  </span>
                  <ExternalLink className="size-3.5 shrink-0 text-primary-500/30 group-hover:text-secondary-500 transition-colors" />
                </a>
              ))}
            </div>
          </MainCard>
        </div>
      </PageLayout>
    </>
  );
}
