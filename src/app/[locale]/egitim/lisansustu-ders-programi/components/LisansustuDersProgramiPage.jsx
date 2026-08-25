"use client";
import { useState, useMemo } from "react";
import { CalendarDays } from "lucide-react";
import SubHeader from "@/app/components/Header/SubHeader";
import PageLayout from "@/app/components/PageLayout";
import ScheduleViews from "@/app/[locale]/egitim/components/ScheduleViews";
import ScheduleLegend from "@/app/[locale]/egitim/components/ScheduleLegend";

const LEVELS = [
  { id: "all", label: "Tümü" },
  { id: "MASTERS", label: "Yüksek Lisans" },
  { id: "DOCTORATE", label: "Doktora" },
];

const isDoctorate = (entry) => entry.degreeLevels.includes("DOCTORATE");

export default function LisansustuDersProgramiPage({ entries: all = [], term }) {
  const [level, setLevel] = useState("all");

  const entries = useMemo(
    () =>
      all
        .filter((entry) => level === "all" || entry.degreeLevels.includes(level))
        .map((entry) => ({
          ...entry,
          type: isDoctorate(entry) ? "Seçmeli" : "Zorunlu",
          note: isDoctorate(entry) ? "Doktora" : entry.note,
        })),
    [all, level],
  );

  return (
    <>
      <SubHeader
        title="Ders Programı"
        subTitle={term ? `Lisansüstü · ${term}` : "Lisansüstü"}
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

          <ScheduleViews
            entries={entries}
            legend={
              <ScheduleLegend
                items={[
                  { color: "rgba(29,36,69,0.15)", label: "Yüksek Lisans" },
                  { color: "rgba(173,151,111,0.4)", label: "Doktora" },
                ]}
              />
            }
          />
        </div>
      </PageLayout>
    </>
  );
}
