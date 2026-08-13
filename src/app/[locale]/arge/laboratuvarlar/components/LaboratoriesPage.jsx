import { Monitor, Users } from "lucide-react";
import PageLayout from "@/app/components/PageLayout";
import SubHeader from "@/app/components/Header/SubHeader";
import PageSection from "@/app/components/PageSection";
import PendingContent from "@/app/components/PendingContent";
import { LABORATORIES } from "@/data/research";

export default function LaboratoriesPage() {
  return (
    <>
      <SubHeader
        title="Laboratuvarlar"
        subTitle="Bölüm laboratuvarları ve donanımları"
      />
      <PageLayout>
        <div className="flex flex-col gap-8">
          <PageSection title="Laboratuvarlar" count={LABORATORIES.length}>
            <div className="flex flex-col gap-3">
              {LABORATORIES.map((lab) => (
                <div
                  key={lab.name}
                  className="flex flex-col gap-3 p-5 rounded-xl border border-primary-500/10 shadow-xs bg-white"
                >
                  <div className="flex items-center gap-2">
                    <Monitor className="size-4 text-secondary-500" />
                    <span className="text-[14px] font-semibold text-primary-500">
                      {lab.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[12px] text-primary-500/55">
                    <Users className="size-3.5 text-primary-500/35" />
                    {lab.capacity} kapasiteli
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-primary-500/40">
                      Kurulu Yazılımlar
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {lab.software.map((item) => (
                        <span
                          key={item}
                          className="px-2 py-1 rounded bg-secondary-500/10 text-[11px] font-medium text-secondary-600"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </PageSection>

          <PendingContent>
            Laboratuvar donanım ve yazılım envanteri güncellenmektedir.
            Ayrıntılı bilgi için bölüm sekreterliğine başvurabilirsiniz.
          </PendingContent>
        </div>
      </PageLayout>
    </>
  );
}
