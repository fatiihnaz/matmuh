import { ExternalLink } from "lucide-react";
import PageLayout from "@/app/components/PageLayout";
import SubHeader from "@/app/components/Header/SubHeader";
import PageSection from "@/app/components/PageSection";
import PendingContent from "@/app/components/PendingContent";
import { RESEARCH_LINKS } from "@/data/research";

export default function ProjectsPage() {
  return (
    <>
      <SubHeader
        title="Devam Eden Projeler"
        subTitle="Bölümde yürütülen araştırma projeleri"
      />
      <PageLayout>
        <div className="flex flex-col gap-8">
          <PendingContent>
            Devam eden proje listesi güncellenmektedir. Bölüm öğretim
            üyelerinin yürüttüğü güncel projelere aşağıdaki kaynaklardan
            ulaşabilirsiniz.
          </PendingContent>

          <PageSection title="Proje Kaynakları">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {RESEARCH_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 p-5 rounded-xl border border-primary-500/10 shadow-xs bg-white hover:border-secondary-500/30 hover:-translate-y-0.5 transition-all"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-semibold text-primary-500">
                      {link.label}
                    </span>
                    <span className="block text-[11px] text-primary-500/45 mt-0.5">
                      {link.description}
                    </span>
                  </span>
                  <ExternalLink className="size-3.5 shrink-0 text-primary-500/30 group-hover:text-secondary-500 transition-colors" />
                </a>
              ))}
            </div>
          </PageSection>
        </div>
      </PageLayout>
    </>
  );
}
