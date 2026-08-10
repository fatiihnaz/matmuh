import { ExternalLink, FolderOpen } from "lucide-react";
import PageLayout from "@/app/components/PageLayout";
import SubHeader from "@/app/components/Header/SubHeader";
import MainCard from "@/app/components/MainCard";
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
        <div className="space-y-6">
          <MainCard title="Araştırma Projeleri" icon={FolderOpen}>
            <div className="flex flex-col gap-4 pt-1">
              <PendingContent>
                Devam eden proje listesi güncellenmektedir. Bölüm öğretim
                üyelerinin yürüttüğü güncel projelere aşağıdaki kaynaklardan
                ulaşabilirsiniz.
              </PendingContent>

              <div className="flex flex-col gap-2">
                {RESEARCH_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 p-3 rounded-lg bg-primary-500/2 border border-primary-500/5 hover:border-secondary-500/30 transition-colors"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] text-primary-500">
                        {link.label}
                      </span>
                      <span className="block text-[11px] text-primary-500/45">
                        {link.description}
                      </span>
                    </span>
                    <ExternalLink className="size-3.5 shrink-0 text-primary-500/30 group-hover:text-secondary-500 transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </MainCard>
        </div>
      </PageLayout>
    </>
  );
}
