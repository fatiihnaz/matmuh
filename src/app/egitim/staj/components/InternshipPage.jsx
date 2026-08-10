import Link from "next/link";
import {
  ArrowUpRight,
  CalendarClock,
  ClipboardList,
  FileText,
  Info,
  Mail,
  Users,
} from "lucide-react";
import PageLayout from "@/app/components/PageLayout";
import SubHeader from "@/app/components/Header/SubHeader";
import MainCard from "@/app/components/MainCard";
import PersonRow from "@/app/components/PersonRow";
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

export default function InternshipPage() {
  return (
    <>
      <SubHeader
        title="Staj İşlemleri"
        subTitle={`Zorunlu staj esasları, süreç ve belgeler · toplam ${totalDays} iş günü`}
      />
      <PageLayout>
        <div className="space-y-6">
          <MainCard title="Zorunlu Stajlar">
            <div className="flex flex-col gap-4 pt-1">
              <p className="text-[13px] text-primary-500/60 leading-relaxed">
                Bölümde iki ayrı zorunlu staj türü vardır. Öğrenciler her bir
                türde {MANDATORY_INTERNSHIPS[0].days} iş günü olmak üzere
                toplamda <strong className="font-semibold text-primary-500">{totalDays} iş günü</strong>{" "}
                zorunlu staj yapmadan mezun olamaz. İki türün günleri
                birleştirilemez.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {MANDATORY_INTERNSHIPS.map((item) => (
                  <Link
                    key={item.code}
                    href={`/egitim/mufredat/${item.code}`}
                    className="group flex flex-col gap-2 p-4 rounded-lg bg-primary-500/2 border border-primary-500/5 hover:border-secondary-500/30 transition-colors"
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
            </div>
          </MainCard>

          <MainCard title="Staj Ne Zaman Yapılır" icon={CalendarClock}>
            <ul className="flex flex-col gap-2 pt-1">
              {TIMING_RULES.map((rule) => (
                <li key={rule} className="flex gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-secondary-500" />
                  <span className="text-[13px] text-primary-500/60 leading-relaxed">
                    {rule}
                  </span>
                </li>
              ))}
            </ul>
          </MainCard>

          <MainCard title="Bölüm Staj Komisyonu" icon={Users}>
            <div className="flex flex-col gap-6 pt-1">
              <div className="flex flex-col gap-4">
                <PersonRow id={STAJ_COMMISSION.chairId} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </MainCard>

          <MainCard title="Süreç" icon={ClipboardList}>
            <ol className="flex flex-col gap-4 pt-1">
              {PROCESS_STEPS.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span className="shrink-0 flex items-center justify-center size-6 rounded-lg bg-secondary-500/15 text-[11px] font-semibold text-secondary-600">
                    {index + 1}
                  </span>
                  <div className="flex flex-col gap-1 min-w-0">
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
          </MainCard>

          <MainCard title="Belgeler" icon={FileText}>
            <div className="flex flex-col gap-6 pt-1">
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
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    {group.items.map((item) => (
                      <DocumentLink key={item.href} {...item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </MainCard>

          <MainCard title="Özel Durumlar" icon={Info}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {SPECIAL_CASES.map((item) => (
                <div key={item.title} className="flex flex-col gap-1">
                  <span className="text-[13px] font-semibold text-primary-500">
                    {item.title}
                  </span>
                  <span className="text-[13px] text-primary-500/60 leading-relaxed">
                    {item.detail}
                  </span>
                </div>
              ))}
            </div>
          </MainCard>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
            <a
              href={`mailto:${INTERNSHIP_CONTACT}`}
              className="group flex items-center gap-2 text-[13px] text-primary-500 hover:text-secondary-600 transition-colors"
            >
              <Mail className="size-4 text-secondary-500" />
              {INTERNSHIP_CONTACT}
            </a>
            <p className="text-[11px] text-primary-500/40 leading-relaxed">
              Kaynak: {INTERNSHIP_SOURCE.label} · {INTERNSHIP_SOURCE.senate}
            </p>
          </div>
        </div>
      </PageLayout>
    </>
  );
}
