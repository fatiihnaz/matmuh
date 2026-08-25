"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarRange, List, MapPin, User, Wifi } from "lucide-react";

import { DAYS, TIME_SLOTS } from "@/data/schedule-grid";
import { colorOf, courseColors, tintOf } from "@/data/schedule-colors";
import WeeklySchedule from "./WeeklySchedule";

const VIEWS = [
  { id: "grid", label: "Izgara", icon: CalendarRange },
  { id: "list", label: "Liste", icon: List },
];

const rangeOf = (entry) => {
  const start = TIME_SLOTS[entry.slot]?.split(" - ")[0] ?? "";
  const end = TIME_SLOTS[entry.slot + entry.span - 1]?.split(" - ")[1] ?? "";
  return `${start} – ${end}`;
};

function ListRow({ entry, accent, courseHref }) {
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
      <span className="w-22 shrink-0 font-mono text-[11px] leading-snug text-primary-500/45">
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
            <span className="font-mono text-[10px] text-primary-500/40">
              Gr.{entry.group}
            </span>
          )}
          {entry.english && (
            <span className="font-mono text-[9.5px] font-semibold tracking-wide text-secondary-600">
              EN
            </span>
          )}
        </span>

        <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-primary-500/45">
          {entry.instructor && entry.instructor !== "-" && (
            <span className="inline-flex items-center gap-1">
              <User size={11} strokeWidth={1.5} className="shrink-0" />
              <span className="truncate">{entry.instructor}</span>
            </span>
          )}
          {entry.online ? (
            <span className="inline-flex items-center gap-1">
              <Wifi size={11} strokeWidth={1.5} /> Çevrimiçi
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
        <span className="text-[13px] text-primary-500/30">
          Bu dönem için ders bulunamadı.
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
              <span className="text-[11px] font-semibold uppercase tracking-widest text-primary-500/45">
                {day.label}
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
          <span className="text-[11px] text-primary-500/45">{note}</span>
        </div>
      )}
    </div>
  );
}

export default function ScheduleViews({
  entries = [],
  courseHref,
  note = null,
  legend = null,
}) {
  const [view, setView] = useState("grid");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        {legend ? <div className="min-w-0">{legend}</div> : <span />}
        <div className="flex shrink-0 gap-1.5">
          {VIEWS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setView(id)}
              aria-pressed={view === id}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-colors ${
                view === id
                  ? "bg-secondary-500/12 text-secondary-600"
                  : "text-primary-500/45 hover:bg-primary-500/4 hover:text-primary-500"
              }`}
            >
              <Icon size={13} strokeWidth={2} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {view === "grid" ? (
        <WeeklySchedule entries={entries} courseHref={courseHref} note={note} />
      ) : (
        <ScheduleList entries={entries} courseHref={courseHref} note={note} />
      )}
    </div>
  );
}
