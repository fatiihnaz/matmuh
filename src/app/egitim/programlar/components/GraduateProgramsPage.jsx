import { Archive, BookOpen, CalendarDays, ExternalLink, Info } from "lucide-react";
import PageLayout from "@/app/components/PageLayout";
import SubHeader from "@/app/components/Header/SubHeader";
import Panel from "@/app/components/Panel";
import PageSection from "@/app/components/PageSection";
import StatStrip from "@/app/components/StatStrip";
import RelatedPages from "@/app/components/RelatedPages";
import QuickLinks from "@/app/components/QuickLinks";
import { institutionalLinks } from "@/data/landing";
import { FBE_LINKS, GRADUATE_PROGRAMS } from "@/data/graduatePrograms";

const RELATED = [
  {
    label: "Lisansüstü Ders Programı",
    href: "/egitim/lisansustu-ders-programi",
    icon: CalendarDays,
  },
  { label: "Müfredat", href: "/egitim/mufredat", icon: BookOpen },
  { label: "Formlar / Belgeler", href: "/egitim/formlar", icon: Archive },
];

const STATS = GRADUATE_PROGRAMS.map((program) => ({
  value: program.akts.replace(" AKTS", ""),
  label: program.title.split(" (")[0],
  hint: program.duration,
}));

function Sidebar() {
  return (
    <div className="flex flex-col gap-6">
      <RelatedPages items={RELATED} />
      <QuickLinks items={institutionalLinks} title="Kurumsal Sistemler" />
    </div>
  );
}

function ProgramCard({ program }) {
  return (
    <div className="flex flex-col gap-3 p-5 rounded-xl border border-primary-500/10 shadow-xs bg-white">
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
        <div className="flex flex-col gap-1 p-3 rounded-lg bg-primary-500/2 text-[12px] text-primary-500/60">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-primary-500/40">
            Başvuru Koşulları
          </span>
          <span>
            ALES (sayısal) en az {program.admission.minAlesQuantitative} ·
            Yabancı dil en az {program.admission.minLanguageScore}
          </span>
          <span>İlgili alan: {program.admission.relatedFields.join(", ")}</span>
        </div>
      )}

      <div className="flex items-center gap-2">
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
      <PageLayout sidebar={<Sidebar />}>
        <div className="flex flex-col gap-8">
          <StatStrip items={STATS} />

          <PageSection
            title="Lisansüstü Programlar"
            count={GRADUATE_PROGRAMS.length}
          >
            <div className="flex flex-col gap-3">
              {GRADUATE_PROGRAMS.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          </PageSection>

          <PageSection title="Fen Bilimleri Enstitüsü">
            <Panel>
              <div className="flex flex-col gap-3">
                <p className="text-[13px] text-primary-500/60 leading-relaxed">
                  Lisansüstü programlar Fen Bilimleri Enstitüsü bünyesinde
                  yürütülür. Başvuru, kayıt ve akademik takvim bilgileri
                  enstitünün kendi sayfasından takip edilir.
                </p>
                <div className="flex flex-col gap-2">
                  {FBE_LINKS.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 p-2.5 rounded-lg bg-primary-500/2 border border-primary-500/5 hover:border-secondary-500/30 transition-colors"
                    >
                      <Info className="size-3.5 shrink-0 text-secondary-500" />
                      <span className="flex-1 text-[13px] text-primary-500">
                        {link.label}
                      </span>
                      <ExternalLink className="size-3 shrink-0 text-primary-500/30 group-hover:text-secondary-500 transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            </Panel>
          </PageSection>
        </div>
      </PageLayout>
    </>
  );
}
