"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Wifi, MapPin, User } from "lucide-react";
import { DAYS, TIME_SLOTS } from "@/data/scheduleData";

function EntryCard({ entry, fill, href }) {
  const isElective = entry.type === "Seçmeli";
  const accent = isElective
    ? "var(--color-secondary-500)"
    : "var(--color-primary-500)";

  const label = [
    `${DAYS[entry.day]} ${TIME_SLOTS[entry.slot]}`,
    `${entry.code} ${entry.name}`,
    entry.instructor && entry.instructor !== "-" ? entry.instructor : null,
    entry.room && entry.room !== "-" ? entry.room : null,
    entry.online ? "Online" : null,
  ]
    .filter(Boolean)
    .join(", ");

  const card = (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`rounded-lg px-2.5 py-2 flex flex-col gap-1 transition-shadow ${
        fill ? "h-full" : ""
      } ${href ? "hover:shadow-md" : "cursor-default"}`}
      style={{
        backgroundColor: isElective
          ? "rgba(173,151,111,0.08)"
          : "rgba(29,36,69,0.045)",
        borderLeft: `2.5px solid ${accent}`,
      }}
    >
      <div className="flex items-center gap-1.5 flex-wrap">
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.6875rem",
            fontWeight: 600,
            color: accent,
            letterSpacing: "0.02em",
          }}
        >
          {entry.code}
        </span>
        {entry.online && (
          <span
            className="inline-flex items-center gap-0.5 px-1 py-px rounded"
            style={{
              fontSize: "0.5625rem",
              fontWeight: 500,
              color: "var(--color-secondary-600)",
              backgroundColor: "rgba(173,151,111,0.14)",
            }}
          >
            <Wifi size={8} strokeWidth={2} />
            Online
          </span>
        )}
        {entry.note && (
          <span
            className="px-1 py-px rounded"
            style={{
              fontSize: "0.5625rem",
              fontWeight: 500,
              color: "rgba(29,36,69,0.5)",
              backgroundColor: "rgba(29,36,69,0.05)",
            }}
          >
            {entry.note}
          </span>
        )}
      </div>

      <span
        className="leading-snug"
        style={{
          fontSize: "0.75rem",
          fontWeight: 500,
          color: "var(--color-primary-500)",
        }}
      >
        {entry.name}
      </span>

      <div className={`flex flex-col gap-0.5 ${fill ? "mt-auto pt-0.5" : ""}`}>
        {entry.instructor && entry.instructor !== "-" && (
          <span
            className="inline-flex items-center gap-1"
            style={{ fontSize: "0.625rem", color: "rgba(29,36,69,0.5)" }}
          >
            <User size={9} strokeWidth={1.5} className="shrink-0" />
            <span className="truncate">{entry.instructor}</span>
          </span>
        )}
        {entry.room && entry.room !== "-" && (
          <span
            className="inline-flex items-center gap-1"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.625rem",
              color: "rgba(29,36,69,0.4)",
            }}
          >
            <MapPin size={9} strokeWidth={1.5} className="shrink-0" />
            {entry.room}
          </span>
        )}
      </div>
    </motion.div>
  );

  if (!href) {
    return (
      <div className={fill ? "h-full" : ""} aria-label={label} role="group">
        {card}
      </div>
    );
  }

  return (
    <Link
      href={href}
      aria-label={`${label} - ders detayına git`}
      className={`block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-500 ${
        fill ? "h-full" : ""
      }`}
    >
      {card}
    </Link>
  );
}

function groupEntries(entries) {
  const map = new Map();
  for (const e of entries) {
    const key = `${e.day}-${e.slot}`;
    if (!map.has(key)) {
      map.set(key, { day: e.day, slot: e.slot, span: e.span || 1, items: [] });
    }
    const g = map.get(key);
    g.span = Math.max(g.span, e.span || 1);
    g.items.push(e);
  }
  return [...map.values()];
}

function buildRows(entries) {
  const used = new Set();
  for (const e of entries) {
    for (let k = 0; k < (e.span || 1); k++) used.add(e.slot + k);
  }
  if (used.size === 0) {
    return TIME_SLOTS.map((_, si) => ({ type: "slot", slot: si }));
  }

  const first = Math.min(...used);
  const last = Math.max(...used);

  const rows = [];
  let gap = [];
  for (let si = first; si <= last; si++) {
    if (used.has(si)) {
      if (gap.length) {
        rows.push({ type: "gap", slots: gap });
        gap = [];
      }
      rows.push({ type: "slot", slot: si });
    } else {
      gap.push(si);
    }
  }
  return rows;
}

export default function WeeklySchedule({ entries = [], courseHref }) {
  const groups = groupEntries(entries);
  const rows = buildRows(entries);
  const rowIndexOfSlot = new Map();
  rows.forEach((row, ri) => {
    if (row.type === "slot") rowIndexOfSlot.set(row.slot, ri);
  });
  const hiddenCount = TIME_SLOTS.length - rows.filter((r) => r.type === "slot").length;

  return (
    <div className="rounded-xl border border-primary-500/10 shadow-xs bg-white overflow-hidden">
      <div className="sm:hidden px-4 py-2 text-center border-b border-primary-500/6">
        <span style={{ fontSize: "0.6875rem", color: "rgba(29,36,69,0.4)" }}>
          ← Programı görmek için yatay kaydırın →
        </span>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <div style={{ minWidth: 820 }}>
          <div
            className="grid"
            style={{
              gridTemplateColumns: "76px repeat(5, minmax(150px, 1fr))",
              gridTemplateRows: `44px ${rows
                .map((r) => (r.type === "gap" ? "26px" : "minmax(74px, auto)"))
                .join(" ")}`,
            }}
          >
            <div
              className="sticky left-0 z-20 bg-white flex items-center justify-center"
              style={{
                gridColumn: 1,
                gridRow: 1,
                borderBottom: "1px solid rgba(29,36,69,0.08)",
                borderRight: "1px solid rgba(29,36,69,0.06)",
              }}
            >
              <span
                style={{
                  fontSize: "0.625rem",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "rgba(29,36,69,0.3)",
                }}
              >
                Saat
              </span>
            </div>

            {DAYS.map((day, di) => (
              <div
                key={day}
                className="flex items-center justify-center"
                style={{
                  gridColumn: di + 2,
                  gridRow: 1,
                  borderBottom: "1px solid rgba(29,36,69,0.08)",
                  borderRight:
                    di < DAYS.length - 1
                      ? "1px solid rgba(29,36,69,0.05)"
                      : "none",
                }}
              >
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "var(--color-primary-500)",
                  }}
                >
                  {day}
                </span>
              </div>
            ))}

            {rows.map((row, ri) =>
              row.type === "gap" ? (
                <div
                  key={`gaplabel-${ri}`}
                  className="sticky left-0 z-20 bg-white flex items-center justify-center"
                  style={{
                    gridColumn: 1,
                    gridRow: ri + 2,
                    borderBottom: "1px solid rgba(29,36,69,0.04)",
                    borderRight: "1px solid rgba(29,36,69,0.06)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.5625rem",
                      color: "rgba(29,36,69,0.25)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {TIME_SLOTS[row.slots[0]].split(" - ")[0]}
                  </span>
                </div>
              ) : (
                <div
                  key={`slotlabel-${ri}`}
                  className="sticky left-0 z-20 bg-white flex items-start justify-center pt-2"
                  style={{
                    gridColumn: 1,
                    gridRow: ri + 2,
                    borderBottom: "1px solid rgba(29,36,69,0.04)",
                    borderRight: "1px solid rgba(29,36,69,0.06)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.625rem",
                      color: "rgba(29,36,69,0.4)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {TIME_SLOTS[row.slot].split(" - ")[0]}
                  </span>
                </div>
              )
            )}

            {rows.map((row, ri) =>
              row.type === "gap" ? (
                <div
                  key={`gapband-${ri}`}
                  className="flex items-center justify-center"
                  style={{
                    gridColumn: "2 / -1",
                    gridRow: ri + 2,
                    backgroundColor: "rgba(29,36,69,0.02)",
                    borderBottom: "1px solid rgba(29,36,69,0.04)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.5625rem",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "rgba(29,36,69,0.25)",
                    }}
                  >
                    {row.slots.length > 1
                      ? `${row.slots.length} saat ara`
                      : "Ara"}
                  </span>
                </div>
              ) : (
                DAYS.map((__, di) => (
                  <div
                    key={`cell-${ri}-${di}`}
                    style={{
                      gridColumn: di + 2,
                      gridRow: ri + 2,
                      borderBottom: "1px solid rgba(29,36,69,0.04)",
                      borderRight:
                        di < DAYS.length - 1
                          ? "1px solid rgba(29,36,69,0.04)"
                          : "none",
                    }}
                  />
                ))
              )
            )}

            {groups.map((group) => {
              const multiple = group.items.length > 1;
              return (
                <div
                  key={`${group.day}-${group.slot}`}
                  className="p-1 flex flex-col gap-1"
                  style={{
                    gridColumn: group.day + 2,
                    gridRowStart: rowIndexOfSlot.get(group.slot) + 2,
                    gridRowEnd: `span ${group.span}`,
                    zIndex: 10,
                  }}
                >
                  {group.items.map((entry, k) => (
                    <EntryCard
                      key={`${entry.code}-${k}`}
                      entry={entry}
                      fill={!multiple}
                      href={courseHref?.(entry.code) || null}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {entries.length > 0 && hiddenCount > 0 && (
        <div className="px-4 py-2 text-center border-t border-primary-500/6">
          <span style={{ fontSize: "0.625rem", color: "rgba(29,36,69,0.35)" }}>
            Ders bulunmayan {hiddenCount} saat gizlendi
          </span>
        </div>
      )}

      {entries.length === 0 && (
        <div className="py-12 text-center border-t border-primary-500/6">
          <span style={{ fontSize: "0.8125rem", color: "rgba(29,36,69,0.3)" }}>
            Bu program için ders bulunmuyor.
          </span>
        </div>
      )}
    </div>
  );
}
