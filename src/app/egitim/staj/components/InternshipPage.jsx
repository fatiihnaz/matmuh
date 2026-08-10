import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  FileStack,
  Mail,
  Sun,
} from "lucide-react";
import PageLayout from "@/app/components/PageLayout";
import SubHeader from "@/app/components/Header/SubHeader";
import MainCard from "@/app/components/MainCard";
import PageSection from "@/app/components/PageSection";
import StatStrip from "@/app/components/StatStrip";
import PersonRow from "@/app/components/PersonRow";
import RelatedPages from "@/app/components/RelatedPages";
import QuickLinks from "@/app/components/QuickLinks";
import DocumentLink from "@/app/egitim/components/DocumentLink";
import {
  INTERNSHIP_CONTACT,
  INTERNSHIP_DOCUMENTS,
  INTERNSHIP_SOURCE,
  MANDATORY_INTERNSHIPS,
  PROCESS_STEPS,
  SPECIAL_CASES,
  STAJ_COMMISSION,
  TIMING_RULES,
} from "@/data/internship";

const totalDays = MANDATORY_INTERNSHIPS.reduce((sum, i) => sum + i.days, 0);

const RELATED = [
  { label: "Yaz Okulu", href: "/egitim/yaz-okulu", icon: Sun },
  { label: "Formlar / Belgeler", href: "/egitim/formlar", icon: FileStack },
  { label: "Müfredat", href: "/egitim/mufredat", icon: BookOpen },
];

const STATS = [
  { value: MANDATORY_INTERNSHIPS.length, label: "Zorunlu staj", hint: "1. ve 2. staj" },
  { value: `${MANDATORY_INTERNSHIPS[0].days}`, label: "Tür başına", hint: "iş günü" },
  { value: `${totalDays}`, label: "Toplam", hint: "iş günü" },
];

function Sidebar() {
  return (
    <div className="flex flex-col gap-6">
      <MainCard title="İletişim">
        <div className="flex flex-col gap-3">
          <a
            href={`mailto:${INTERNSHIP_CONTACT}`}
            className="group flex items-center gap-2 text-[13px] text-primary-500 hover:text-secondary-600 transition-colors"
          >
            <Mail className="size-4 shrink-0 text-secondary-500" />
            <span className="min-w-0 truncate">{INTERNSHIP_CONTACT}</span>
          </a>
          <p className="text-[11px] text-primary-500/40 leading-relaxed">
            {INTERNSHIP_SOURCE.label}
            <br />
            {INTERNSHIP_SOURCE.senate}
          </p>
        </div>
      </MainCard>

      <RelatedPages items={RELATED} />
      <QuickLinks />
    </div>
  );
}

export default function InternshipPage() {
  return (
    <>
      <SubHeader
        title="Staj İşlemleri"
        subTitle="Zorunlu staj esasları, süreç ve belgeler"
      />
      <PageLayout sidebar={<Sidebar />}>
        <div className="flex flex-col gap-10">
          <StatStrip items={STATS} />

          <PageSection title="Zorunlu Stajlar">
            <p className="text-[13px] text-primary-500/60 leading-relaxed">
              Öğrenciler her bir staj türünde{" "}
              {MANDATORY_INTERNSHIPS[0].days} iş günü olmak üzere toplamda{" "}
              <strong className="font-semibold text-primary-500">
                {totalDays} iş günü
              </strong>{" "}
              zorunlu staj yapmadan mezun olamaz. İki türün günleri
              birleştirilemez.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MANDATORY_INTERNSHIPS.map((item) => (
                <Link
                  key={item.code}
                  href={`/egitim/mufredat/${item.code}`}
                  className="group flex flex-col gap-2 p-4 rounded-xl bg-white border border-primary-500/10 shadow-xs hover:border-secondary-500/30 hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-secondary-500">
                      {item.order}
                    </span>
                    <ArrowUpRight className="size-3.5 text-primary-500/25 group-hover:text-secondary-500 transition-colors" />
                  </div>
                  <span className="text-[14px] font-semibold text-primary-500 leading-snug">
                    {item.title}
                  </span>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-primary-500/50">
                    <span className="font-mono">{item.code}</span>
                    <span>{item.days} iş günü</span>
                    <span>{item.ects} AKTS</span>
                    <span>{item.term}</span>
                  </div>
                </Link>
              ))}
            </div>
          </PageSection>

          <PageSection title="Süreç" count={PROCESS_STEPS.length}>
            <ol className="relative flex flex-col gap-5 pl-1">
              {PROCESS_STEPS.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <div className="flex flex-col items-center shrink-0">
                    <span className="flex items-center justify-center size-7 rounded-full bg-secondary-500/15 text-[11px] font-bold text-secondary-600">
                      {index + 1}
                    </span>
                    {index < PROCESS_STEPS.length - 1 && (
                      <span className="w-px flex-1 mt-1 bg-primary-500/10" />
                    )}
                  </div>
                  <div className="flex flex-col gap-1 min-w-0 pb-1">
                    <span className="text-[13px] font-semibold text-primary-500">
                      {step.title}
                    </span>
                    <span className="text-[13px] text-primary-500/60 leading-relaxed">
                      {step.detail}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </PageSection>

          <PageSection title="Ne Zaman Yapılır">
            <ul className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-2">
              {TIMING_RULES.map((rule) => (
                <li key={rule} className="flex gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-secondary-500" />
                  <span className="text-[13px] text-primary-500/60 leading-relaxed">
                    {rule}
                  </span>
                </li>
              ))}
            </ul>
          </PageSection>

          <PageSection title="Belgeler">
            <div className="flex flex-col gap-5">
              {INTERNSHIP_DOCUMENTS.map((group) => (
                <div key={group.category} className="flex flex-col gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-primary-500/45">
                    {group.category}
                  </span>
                  {group.note && (
                    <p className="text-[12px] text-primary-500/50 leading-relaxed">
                      {group.note}
                    </p>
                  )}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                    {group.items.map((item) => (
                      <DocumentLink key={item.href} {...item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </PageSection>

          <PageSection title="Staj Komisyonu">
            <div className="flex flex-col gap-4">
              <PersonRow id={STAJ_COMMISSION.chairId} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {STAJ_COMMISSION.groups.map((group) => (
                  <div key={group.code} className="flex flex-col gap-2">
                    <div className="flex flex-col">
                      <span className="text-[13px] font-semibold text-primary-500">
                        {group.label}
                      </span>
                      <span className="text-[11px] text-primary-500/45">
                        {group.subtitle}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {group.memberIds.map((id, idx) => (
                        <PersonRow key={id} id={id} idx={idx} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-1">
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-primary-500/45">
                    Oluşumu
                  </span>
                  <ul className="flex flex-col gap-2">
                    {STAJ_COMMISSION.composition.map((rule) => (
                      <li key={rule} className="flex gap-3">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-secondary-500" />
                        <span className="text-[13px] text-primary-500/60 leading-relaxed">
                          {rule}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-primary-500/45">
                    Görevleri
                  </span>
                  <ul className="flex flex-col gap-2">
                    {STAJ_COMMISSION.duties.map((duty) => (
                      <li key={duty} className="flex gap-3">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-secondary-500" />
                        <span className="text-[13px] text-primary-500/60 leading-relaxed">
                          {duty}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </PageSection>

          <PageSection title="Özel Durumlar">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {SPECIAL_CASES.map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col gap-1 p-4 rounded-xl bg-white border border-primary-500/10 shadow-xs"
                >
                  <span className="text-[13px] font-semibold text-primary-500">
                    {item.title}
                  </span>
                  <span className="text-[13px] text-primary-500/60 leading-relaxed">
                    {item.detail}
                  </span>
                </div>
              ))}
            </div>
          </PageSection>
        </div>
      </PageLayout>
    </>
  );
}
