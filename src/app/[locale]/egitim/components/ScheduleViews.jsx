"use client";

import { useMemo, useState } from "react";
import Link from "@/app/components/LocaleLink";
import { CalendarRange, List, MapPin, Table2, User, Wifi } from "lucide-react";

import { DAYS, TIME_SLOTS } from "@/data/schedule-grid";
import { MyScheduleProvider } from "@/data/useMySchedule";
import { colorOf, courseColors, tintOf } from "@/data/schedule-colors";
import WeeklySchedule from "./WeeklySchedule";
import { useT } from "@/i18n/useT";

const VIEWS = [
  { id: "grid", label: "Izgara", icon: CalendarRange },
  { id: "list", label: "Liste", icon: List },
  { id: "table", label: "Tablo", icon: Table2 },
];

const LANGUAGES = [
  { id: "all", label: "Tümü" },
  { id: "tr", label: "Türkçe" },
  { id: "en", label: "İngilizce" },
];

const byLanguage = (language) => (entry) =>
  language === "all" || (language === "en" ? entry.english : !entry.english);

const rangeOf = (entry) => {
  const start = TIME_SLOTS[entry.slot]?.split(" - ")[0] ?? "";
  const end = TIME_SLOTS[entry.slot + entry.span - 1]?.split(" - ")[1] ?? "";
  return `${start} – ${end}`;
};

function ListRow({ entry, accent, courseHref }) {
  const t = useT();
  const isElective = entry.type === "Seçmeli";
  const href = courseHref?.(entry.code) || null;

  const body = (
    <div
      className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-[filter] hover:brightness-95"
      style={{
        backgroundColor: tintOf(isElective),
        borderLeft: `2.5px solid ${accent}`,
      }}
    >
      <span className="w-22 shrink-0 font-mono text-[11px] leading-snug text-primary-500/70">
        {rangeOf(entry)}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-baseline gap-x-1.5">
          <span
            className="font-mono text-[11px] font-semibold"
            style={{ color: accent }}
          >
            {entry.code}
          </span>
          <span className="text-[13px] font-medium text-primary-600">
            {entry.name}
          </span>
          {entry.group != null && (
            <span className="font-mono text-[10px] text-primary-500/70">
              Gr.{entry.group}
            </span>
          )}
          {entry.english && (
            <span className="font-mono text-[9.5px] font-semibold tracking-wide text-secondary-700">
              EN
            </span>
          )}
        </span>

        <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-primary-500/70">
          {entry.instructor && entry.instructor !== "-" && (
            <span className="inline-flex min-w-0 items-center gap-1">
              <User size={11} strokeWidth={1.5} className="shrink-0" />
              <span className="wrap-break-word">{entry.instructor}</span>
            </span>
          )}
          {entry.online ? (
            <span className="inline-flex items-center gap-1">
              <Wifi size={11} strokeWidth={1.5} /> {t("Çevrimiçi")}
            </span>
          ) : (
            entry.room &&
            entry.room !== "-" && (
              <span className="inline-flex items-center gap-1 font-mono">
                <MapPin size={11} strokeWidth={1.5} className="shrink-0" />
                {entry.room}
              </span>
            )
          )}
        </span>
      </span>
    </div>
  );

  if (!href) return <li>{body}</li>;
  return (
    <li>
      <Link
        href={href}
        className="block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-500"
      >
        {body}
      </Link>
    </li>
  );
}

function ScheduleList({ entries, courseHref, note }) {
  const t = useT();
  const palette = useMemo(() => courseColors(entries), [entries]);
  const days = DAYS.map((label, index) => ({
    label,
    items: entries
      .filter((entry) => entry.day === index)
      .sort((a, b) => a.slot - b.slot || a.code.localeCompare(b.code, "tr")),
  })).filter((day) => day.items.length > 0);

  if (days.length === 0) {
    return (
      <div className="rounded-xl border border-primary-500/8 bg-white py-12 text-center">
        <span className="text-[13px] text-primary-500/70">
          {t("Bu dönem için ders bulunamadı.")}
        </span>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-primary-500/8 bg-white">
      <div className="divide-y divide-primary-500/6">
        {days.map((day) => (
          <div key={day.label}>
            <div className="bg-primary-500/2 px-4 py-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-primary-500/70">
                {t(day.label)}
              </span>
            </div>
            <ul className="flex flex-col gap-1 p-1">
              {day.items.map((entry) => (
                <ListRow
                  key={`${entry.code}-${entry.group}-${entry.slot}`}
                  entry={entry}
                  accent={colorOf(palette, entry.code)}
                  courseHref={courseHref}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>

      {note && (
        <div className="border-t border-primary-500/6 px-4 py-2.5 text-center">
          <span className="text-[11px] text-primary-500/70">{note}</span>
        </div>
      )}
    </div>
  );
}

function ScheduleTable({ entries, courseHref, note }) {
  const t = useT();
  const days = DAYS.map((label, index) => ({
    label,
    items: entries
      .filter((entry) => entry.day === index)
      .sort(
        (a, b) =>
          a.slot - b.slot ||
          a.code.localeCompare(b.code, "tr") ||
          (a.group || 0) - (b.group || 0),
      ),
  })).filter((day) => day.items.length > 0);

  if (days.length === 0) {
    return (
      <div className="rounded-xl border border-primary-500/8 bg-white py-12 text-center">
        <span className="text-[13px] text-primary-500/70">
          {t("Bu dönem için ders bulunamadı.")}
        </span>
      </div>
    );
  }

  const HEAD = "px-2.5 py-1.5 text-left text-[10px] font-semibold uppercase tracking-wider text-primary-500/70";
  const CELL = "px-2.5 py-1.5 align-top text-[12px] text-primary-600";

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        {days.map((day) => (
          <div
            key={day.label}
            className="overflow-hidden rounded-xl border border-primary-500/8 bg-white"
          >
            <div className="bg-primary-500 px-3 py-1.5">
              <span className="text-[12px] font-semibold text-white">{t(day.label)}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-136 table-fixed border-collapse">
                <thead>
                  <tr className="border-b border-primary-500/8">
                    <th className={`${HEAD} w-26`}>{t("Saat")}</th>
                    <th className={`${HEAD} w-26`}>{t("Ders Kodu")}</th>
                    <th className={HEAD}>{t("Ders Adı")}</th>
                    <th className={`${HEAD} w-22`}>{t("Derslik")}</th>
                    <th className={`${HEAD} w-[30%]`}>{t("Öğretim Elemanı")}</th>
                  </tr>
                </thead>
                <tbody>
                  {day.items.map((entry) => {
                    const href = courseHref?.(entry.code) || null;
                    return (
                      <tr
                        key={`${entry.code}-${entry.group}-${entry.slot}`}
                        className="border-b border-primary-500/5 last:border-b-0 odd:bg-primary-500/2"
                      >
                        <td className={`${CELL} font-mono text-[11px] whitespace-nowrap`}>
                          {rangeOf(entry)}
                        </td>
                        <td className={`${CELL} font-mono text-[11px] whitespace-nowrap`}>
                          {href ? (
                            <Link href={href} className="hover:text-secondary-700 hover:underline">
                              {entry.code}
                            </Link>
                          ) : (
                            entry.code
                          )}
                          <span className="text-primary-500/70">({entry.group})</span>
                        </td>
                        <td className={CELL}>
                          {entry.name}
                          {entry.english && (
                            <span className="ml-1.5 inline-block rounded-sm bg-secondary-500/12 px-1 py-px font-mono text-[9px] font-semibold whitespace-nowrap text-secondary-700">
                              EN
                            </span>
                          )}
                        </td>
                        <td className={`${CELL} font-mono text-[11px]`}>
                          {entry.online ? t("Çevrimiçi") : entry.room !== "-" ? entry.room : ""}
                        </td>
                        <td className={CELL}>
                          {entry.instructor !== "-" ? entry.instructor : ""}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {note && (
        <div className="px-4 text-center">
          <span className="text-[11px] text-primary-500/70">{t(note)}</span>
        </div>
      )}
    </div>
  );
}

export default function ScheduleViews(props) {
  return (
    <MyScheduleProvider>
      <ScheduleBody {...props} />
    </MyScheduleProvider>
  );
}

function ScheduleBody({ entries = [], courseHref, note = null, legend = null }) {
  const t = useT();
  const [view, setView] = useState("grid");
  const [language, setLanguage] = useState("all");
  const shown = useMemo(() => entries.filter(byLanguage(language)), [entries, language]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        {legend ? <div className="min-w-0">{legend}</div> : <span />}
        <div className="flex shrink-0 flex-wrap items-center gap-1.5">
          <div
            role="group"
            aria-label={t("Eğitim dili")}
            className="flex items-center gap-0.5 rounded-md border border-primary-500/8 p-0.5"
          >
            {LANGUAGES.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setLanguage(option.id)}
                aria-pressed={language === option.id}
                className={`rounded px-2 py-1 text-[11px] font-medium transition-colors ${
                  language === option.id
                    ? "bg-primary-500 text-white"
                    : "text-primary-500/70 hover:bg-primary-500/4 hover:text-primary-500"
                }`}
              >
                {t(option.label)}
              </button>
            ))}
          </div>
          {VIEWS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setView(id)}
              aria-pressed={view === id}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-colors ${
                view === id
                  ? "bg-secondary-500/12 text-secondary-700"
                  : "text-primary-500/70 hover:bg-primary-500/4 hover:text-primary-500"
              }`}
            >
              <Icon size={13} strokeWidth={2} />
              {t(label)}
            </button>
          ))}
        </div>
      </div>

      {view === "grid" ? (
        <WeeklySchedule entries={shown} courseHref={courseHref} note={note} />
      ) : view === "table" ? (
        <ScheduleTable entries={shown} courseHref={courseHref} note={note} />
      ) : (
        <ScheduleList entries={shown} courseHref={courseHref} note={note} />
      )}
    </div>
  );
}
