"use client";
import { useState } from "react";
import { CalendarDays } from "lucide-react";
import SubHeader from "@/app/components/Header/SubHeader";
import PageLayout from "@/app/components/PageLayout";
import WeeklySchedule from "@/app/egitim/components/WeeklySchedule";
import ScheduleLegend from "@/app/egitim/components/ScheduleLegend";
import {
  LISANS_CLASSES,
  LISANS_SCHEDULE,
  SCHEDULE_TERM,
} from "@/data/scheduleData";

export default function DersProgramiPage() {
  const [activeClass, setActiveClass] = useState(LISANS_CLASSES[0].id);
  const entries = LISANS_SCHEDULE[activeClass] || [];

  return (
    <>
      <SubHeader title="Ders Programı" subTitle={`Lisans · ${SCHEDULE_TERM}`} />
      <PageLayout>
        <div className="space-y-4">
          <div className="rounded-xl border border-primary-500/10 shadow-xs bg-white overflow-hidden">
            <div className="flex items-center justify-between gap-4 px-4 py-3 flex-wrap">
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar -mx-1 px-1 max-w-full">
                {LISANS_CLASSES.map((cls) => (
                  <button
                    key={cls.id}
                    onClick={() => setActiveClass(cls.id)}
                    className="px-4 py-2 rounded-lg transition-colors shrink-0 whitespace-nowrap"
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: activeClass === cls.id ? 600 : 450,
                      color:
                        activeClass === cls.id
                          ? "#fff"
                          : "rgba(29,36,69,0.5)",
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

          <ScheduleLegend
            items={[
              { color: "rgba(29,36,69,0.15)", label: "Zorunlu" },
              { color: "rgba(173,151,111,0.4)", label: "Seçmeli" },
            ]}
            showOnline
          />

          <WeeklySchedule
            entries={entries}
            courseHref={(code) => `/egitim/mufredat/${code}`}
          />
        </div>
      </PageLayout>
    </>
  );
}
