"use client";
import { useMemo, useState } from "react";
import { CalendarDays } from "lucide-react";
import SubHeader from "@/app/components/Header/SubHeader";
import PageLayout from "@/app/components/PageLayout";
import ScheduleViews from "@/app/[locale]/egitim/components/ScheduleViews";
import ScheduleLegend from "@/app/[locale]/egitim/components/ScheduleLegend";

const CLASSES = [1, 2, 3, 4].map((id) => ({ id, label: `${id}. Sınıf` }));

const classOf = (entry) => (entry.term ? Math.ceil(entry.term / 2) : null);

export default function DersProgramiPage({ entries: all = [], term }) {
  const [activeClass, setActiveClass] = useState(CLASSES[0].id);

  const entries = useMemo(
    () => all.filter((entry) => classOf(entry) === activeClass),
    [all, activeClass],
  );

  return (
    <>
      <SubHeader
        title="Ders Programı"
        subTitle={term ? `Lisans · ${term}` : "Lisans"}
      />
      <PageLayout>
        <div className="space-y-4">
          <div className="rounded-xl border border-primary-500/10 shadow-xs bg-white overflow-hidden">
            <div className="flex items-center justify-between gap-4 px-4 py-3 flex-wrap">
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar -mx-1 px-1 max-w-full">
                {CLASSES.map((cls) => (
                  <button
                    key={cls.id}
                    onClick={() => setActiveClass(cls.id)}
                    className="px-4 py-2 rounded-lg transition-colors shrink-0 whitespace-nowrap"
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: activeClass === cls.id ? 600 : 450,
                      color:
                        activeClass === cls.id ? "#fff" : "rgba(29,36,69,0.5)",
                      backgroundColor:
                        activeClass === cls.id
                          ? "var(--color-primary-500)"
                          : "transparent",
                    }}
                  >
                    {cls.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 text-primary-500/40">
                <CalendarDays size={14} strokeWidth={1.5} />
                <span style={{ fontSize: "0.75rem" }}>
                  {entries.length} ders bloğu
                </span>
              </div>
            </div>
          </div>

          <ScheduleViews
            entries={entries}
            courseHref={(code) => `/egitim/mufredat/${code}`}
            legend={
              <ScheduleLegend
                items={[
                  { color: "rgba(29,36,69,0.15)", label: "Zorunlu" },
                  { color: "rgba(173,151,111,0.4)", label: "Seçmeli" },
                ]}
                showOnline
              />
            }
            note="Üniversite havuzundan seçilen yabancı dil ve sosyal seçmeli dersleri bu programda yer almaz."
          />
        </div>
      </PageLayout>
    </>
  );
}
