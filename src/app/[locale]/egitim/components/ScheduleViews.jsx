"use client";

import { useMemo, useState } from "react";
import Link from "@/app/components/LocaleLink";
import { CalendarRange, List, MapPin, User, Wifi } from "lucide-react";

import { DAYS, TIME_SLOTS } from "@/data/schedule-grid";
import { MyScheduleProvider } from "@/data/useMySchedule";
import { colorOf, courseColors, tintOf } from "@/data/schedule-colors";
import WeeklySchedule from "./WeeklySchedule";
import { useT } from "@/i18n/useT";

const VIEWS = [
  { id: "grid", label: "Izgara", icon: CalendarRange },
  { id: "list", label: "Liste", icon: List },
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

function dayBlocks(entries) {
  return DAYS.map((label, index) => {
    const blocks = new Map();
    for (const entry of entries) {
      if (entry.day !== index) continue;
      const key = `${entry.slot}|${entry.span}|${entry.code}`;
      if (!blocks.has(key)) blocks.set(key, { ...entry, groups: [] });
      blocks.get(key).groups.push(entry);
    }
    const list = [...blocks.values()]
      .map((block) => ({
        ...block,
        english: block.groups.every((group) => group.english),
        groups: block.groups.sort((a, b) => (a.group || 0) - (b.group || 0)),
      }))
      .sort((a, b) => a.slot - b.slot || a.code.localeCompare(b.code, "tr"));
    return { label, blocks: list };
  }).filter((day) => day.blocks.length > 0);
}

function Empty() {
  const t = useT();
  return (
    <div className="rounded-xl border border-primary-500/8 bg-white py-12 text-center">
      <span className="text-[13px] text-primary-500/70">
        {t("Bu dönem için ders bulunamadı.")}
      </span>
    </div>
  );
}

function Note({ note }) {
  const t = useT();
  if (!note) return null;
  return (
    <div className="border-t border-primary-500/6 px-4 py-2.5 text-center">
      <span className="text-[11px] text-primary-500/70">{t(note)}</span>
    </div>
  );
}

function GroupLine({ group, showEnglish }) {
  const t = useT();
  return (
    <span className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-primary-500/70">
      <span className="font-mono text-[10px] text-primary-500/70">
        Gr.{group.group}
        {showEnglish && group.english && (
          <span className="ml-1 font-semibold tracking-wide text-secondary-700">EN</span>
        )}
      </span>
      {group.instructor && group.instructor !== "-" && (
        <span className="inline-flex min-w-0 items-center gap-1">
          <User size={11} strokeWidth={1.5} className="shrink-0" />
          <span className="wrap-break-word">{group.instructor}</span>
        </span>
      )}
      {group.online ? (
        <span className="inline-flex items-center gap-1">
          <Wifi size={11} strokeWidth={1.5} /> {t("Çevrimiçi")}
        </span>
      ) : (
        group.room &&
        group.room !== "-" && (
          <span className="inline-flex items-center gap-1 font-mono">
            <MapPin size={11} strokeWidth={1.5} className="shrink-0" />
            {group.room}
          </span>
        )
      )}
    </span>
  );
}

function ListRow({ block, accent, courseHref }) {
  const isElective = block.type === "Seçmeli";
  const href = courseHref?.(block.code) || null;
  const mixed = !block.english && block.groups.some((group) => group.english);

  const body = (
    <div
      className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-[filter] hover:brightness-95"
      style={{
        backgroundColor: tintOf(isElective),
        borderLeft: `2.5px solid ${accent}`,
      }}
    >
      <span className="w-22 shrink-0 font-mono text-[11px] leading-snug text-primary-500/70">
        {rangeOf(block)}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-baseline gap-x-1.5">
          <span className="font-mono text-[11px] font-semibold" style={{ color: accent }}>
            {block.code}
          </span>
          <span className="text-[13px] font-medium text-primary-600">{block.name}</span>
          {block.english && (
            <span className="font-mono text-[9.5px] font-semibold tracking-wide text-secondary-700">
              EN
            </span>
          )}
        </span>

        <span className="mt-1 flex flex-col gap-0.5">
          {block.groups.map((group) => (
            <GroupLine key={`${group.group}-${group.offeringId ?? ""}`} group={group} showEnglish={mixed} />
          ))}
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
  const days = useMemo(() => dayBlocks(entries), [entries]);

  if (days.length === 0) return <Empty />;

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
              {day.blocks.map((block) => (
                <ListRow
                  key={`${block.code}-${block.slot}-${block.span}`}
                  block={block}
                  accent={colorOf(palette, block.code)}
                  courseHref={courseHref}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>
      <Note note={note} />
    </div>
  );
}

const TH =
  "px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-primary-500/40";
const TD = "px-3 py-2 align-top";

function ScheduleTable({ entries, courseHref, note }) {
  const t = useT();
  const palette = useMemo(() => courseColors(entries), [entries]);
  const days = useMemo(() => dayBlocks(entries), [entries]);

  if (days.length === 0) return <Empty />;

  return (
    <div className="overflow-hidden rounded-xl border border-primary-500/10 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full min-w-176 table-fixed border-collapse">
          <colgroup>
            <col className="w-30" />
            <col />
            <col className="w-20" />
            <col className="w-28" />
            <col className="w-[30%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-primary-500/6">
              <th scope="col" className={TH}>{t("Saat")}</th>
              <th scope="col" className={TH}>{t("Ders")}</th>
              <th scope="col" className={TH}>{t("Grup")}</th>
              <th scope="col" className={TH}>{t("Derslik")}</th>
              <th scope="col" className={TH}>{t("Öğretim Elemanı")}</th>
            </tr>
          </thead>
          {days.map((day) => (
            <tbody key={day.label}>
              <tr>
                <th
                  scope="colgroup"
                  colSpan={5}
                  className="border-y border-primary-500/6 bg-primary-500/2 px-3 py-1.5 text-left"
                >
                  <span className="flex items-center gap-2">
                    <span className="h-3.5 w-1 rounded-full bg-secondary-500" />
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-primary-700">
                      {t(day.label)}
                    </span>
                  </span>
                </th>
              </tr>
              {day.blocks.flatMap((block) => {
                const href = courseHref?.(block.code) || null;
                const accent = colorOf(palette, block.code);
                return block.groups.map((group, index) => {
                  const first = index === 0;
                  const last = index === block.groups.length - 1;
                  return (
                    <tr
                      key={`${block.code}-${block.slot}-${group.group}-${group.offeringId ?? ""}`}
                      className={last ? "border-b border-primary-500/5" : ""}
                    >
                      <td
                        className={`${TD} font-mono text-[11.5px] whitespace-nowrap text-primary-500/70`}
                        style={{ boxShadow: `inset 2.5px 0 0 ${accent}` }}
                      >
                        {first ? rangeOf(block) : ""}
                      </td>
                      <td className={TD}>
                        {first && (
                          <span className="flex flex-wrap items-baseline gap-x-2">
                            {href ? (
                              <Link
                                href={href}
                                className="font-mono text-[12px] font-medium tracking-wide text-secondary-600 hover:underline"
                              >
                                {block.code}
                              </Link>
                            ) : (
                              <span className="font-mono text-[12px] font-medium tracking-wide text-secondary-600">
                                {block.code}
                              </span>
                            )}
                            <span className="text-[13px] text-primary-600">{block.name}</span>
                          </span>
                        )}
                      </td>
                      <td className={`${TD} font-mono text-[11.5px] whitespace-nowrap text-primary-500/70`}>
                        {group.group}
                        {group.english && (
                          <span className="ml-1.5 font-semibold tracking-wide text-secondary-700">EN</span>
                        )}
                      </td>
                      <td className={`${TD} font-mono text-[11.5px] text-primary-500/70`}>
                        {group.online ? t("Çevrimiçi") : group.room !== "-" ? group.room : ""}
                      </td>
                      <td className={`${TD} text-[12.5px] text-primary-600`}>
                        {group.instructor !== "-" ? group.instructor : ""}
                      </td>
                    </tr>
                  );
                });
              })}
            </tbody>
          ))}
        </table>
      </div>
      <Note note={note} />
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
        <div className="flex w-full flex-wrap items-center gap-1.5 sm:w-auto sm:justify-end">
          <div role="group" aria-label={t("Eğitim dili")} className="flex items-center gap-1.5">
            {LANGUAGES.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setLanguage(option.id)}
                aria-pressed={language === option.id}
                className={`rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-colors ${
                  language === option.id
                    ? "bg-secondary-500/12 text-secondary-700"
                    : "text-primary-500/70 hover:bg-primary-500/4 hover:text-primary-500"
                }`}
              >
                {t(option.label)}
              </button>
            ))}
          </div>
          <span aria-hidden className="mx-1 h-4 w-px bg-primary-500/10" />
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
      ) : (
        <>
          <div className="hidden md:block">
            <ScheduleTable entries={shown} courseHref={courseHref} note={note} />
          </div>
          <div className="md:hidden">
            <ScheduleList entries={shown} courseHref={courseHref} note={note} />
          </div>
        </>
      )}
    </div>
  );
}
