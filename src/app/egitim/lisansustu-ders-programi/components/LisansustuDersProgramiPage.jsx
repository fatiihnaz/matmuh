"use client";
import { useState, useMemo } from "react";
import { CalendarDays } from "lucide-react";
import SubHeader from "@/app/components/Header/SubHeader";
import PageLayout from "@/app/components/PageLayout";
import WeeklySchedule from "@/app/egitim/components/WeeklySchedule";
import ScheduleLegend from "@/app/egitim/components/ScheduleLegend";
import { LISANSUSTU_SCHEDULE, SCHEDULE_TERM } from "@/data/scheduleData";

const LEVELS = [
  { id: "all", label: "Tümü" },
  { id: "Yüksek Lisans", label: "Yüksek Lisans" },
  { id: "Doktora", label: "Doktora" },
];

export default function LisansustuDersProgramiPage() {
  const [level, setLevel] = useState("all");

  const entries = useMemo(() => {
    return LISANSUSTU_SCHEDULE.filter(
      (e) => level === "all" || e.level === level
    ).map((e) => ({
      ...e,
      type: e.level === "Doktora" ? "Seçmeli" : "Zorunlu",
      note: e.level === "Doktora" ? "Doktora" : e.note,
    }));
  }, [level]);

  return (
    <>
      <SubHeader
        title="Ders Programı"
        subTitle={`Lisansüstü · ${SCHEDULE_TERM}`}
      />
      <PageLayout>
        <div className="space-y-4">
          <div className="rounded-xl border border-primary-500/10 shadow-xs bg-white overflow-hidden">
            <div className="flex items-center justify-between gap-4 px-4 py-3 flex-wrap">
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar -mx-1 px-1 max-w-full">
                {LEVELS.map((lv) => (
                  <button
                    key={lv.id}
                    onClick={() => setLevel(lv.id)}
                    className="px-4 py-2 rounded-lg transition-colors shrink-0 whitespace-nowrap"
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: level === lv.id ? 600 : 450,
                      color: level === lv.id ? "#fff" : "rgba(29,36,69,0.5)",
                      backgroundColor:
                        level === lv.id
                          ? "var(--color-primary-500)"
                          : "transparent",
                    }}
                  >
                    {lv.label}
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
              { color: "rgba(29,36,69,0.15)", label: "Yüksek Lisans" },
              { color: "rgba(173,151,111,0.4)", label: "Doktora" },
            ]}
          />

          <WeeklySchedule entries={entries} />
        </div>
      </PageLayout>
    </>
  );
}
