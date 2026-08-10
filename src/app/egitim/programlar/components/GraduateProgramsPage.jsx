import { ExternalLink, GraduationCap, Info, Library } from "lucide-react";
import PageLayout from "@/app/components/PageLayout";
import SubHeader from "@/app/components/Header/SubHeader";
import MainCard from "@/app/components/MainCard";
import {
  FBE_LINKS,
  GRADUATE_PROGRAMS,
} from "@/data/graduatePrograms";

function ProgramCard({ program }) {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-lg bg-primary-500/2 border border-primary-500/5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[14px] font-semibold text-primary-500">
          {program.title}
        </span>
        <div className="flex items-center gap-x-3 gap-y-1 text-[11px] text-primary-500/50">
          <span>{program.duration}</span>
          <span>{program.akts}</span>
        </div>
      </div>

      <p className="text-[13px] text-primary-500/60 leading-relaxed">
        {program.description}
      </p>

      {program.admission && (
        <div className="flex flex-col gap-1 text-[12px] text-primary-500/60">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-primary-500/40">
            Başvuru Koşulları
          </span>
          <span>
            ALES (sayısal) en az {program.admission.minAlesQuantitative} ·
            Yabancı dil en az {program.admission.minLanguageScore}
          </span>
          <span>
            İlgili alan: {program.admission.relatedFields.join(", ")}
          </span>
        </div>
      )}

      <div className="flex items-center gap-2 pt-1">
        {program.tracks.map((track) => (
          <a
            key={track.label}
            href={track.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-500/4 hover:bg-secondary-500/10 text-[12px] text-primary-500 hover:text-secondary-600 transition-colors"
          >
            {track.label}
            <ExternalLink className="size-3 text-primary-500/30 group-hover:text-secondary-500 transition-colors" />
          </a>
        ))}
      </div>
    </div>
  );
}

export default function GraduateProgramsPage() {
  return (
    <>
      <SubHeader
        title="Programlar"
        subTitle="Yüksek lisans ve doktora programları"
      />
      <PageLayout>
        <div className="space-y-6">
          <MainCard title="Lisansüstü Programlar" icon={GraduationCap}>
            <div className="flex flex-col gap-3 pt-1">
              {GRADUATE_PROGRAMS.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          </MainCard>

          <MainCard title="Fen Bilimleri Enstitüsü" icon={Library}>
            <div className="flex flex-col gap-2 pt-1">
              <p className="text-[13px] text-primary-500/60 leading-relaxed">
                Lisansüstü programlar Fen Bilimleri Enstitüsü bünyesinde
                yürütülür. Başvuru, kayıt ve akademik takvim bilgileri
                enstitünün kendi sayfasından takip edilir.
              </p>
              {FBE_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-[13px] text-primary-500 hover:text-secondary-600 transition-colors"
                >
                  <Info className="size-3.5 text-secondary-500" />
                  {link.label}
                  <ExternalLink className="size-3 text-primary-500/30 group-hover:text-secondary-500 transition-colors" />
                </a>
              ))}
            </div>
          </MainCard>
        </div>
      </PageLayout>
    </>
  );
}
