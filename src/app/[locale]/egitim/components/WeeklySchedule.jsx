"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  MapPin,
  TriangleAlert,
  User,
  Wifi,
} from "lucide-react";
import { DAYS, TIME_SLOTS } from "@/data/schedule-grid";
import {
  GOLD_RGB as GOLD,
  NAVY_RGB as NAVY,
  colorOf,
  courseColors,
  tintOf,
} from "@/data/schedule-colors";

const VISIBLE = 3;

const startOf = (slot) => TIME_SLOTS[slot]?.split(" - ")[0] ?? "";
const endOf = (slot) => TIME_SLOTS[slot]?.split(" - ")[1] ?? "";
const spanOf = (entry) => Math.max(1, entry.span || 1);
const rangeOf = (entry) =>
  `${startOf(entry.slot)} – ${endOf(entry.slot + spanOf(entry) - 1)}`;

function metaOf(entry) {
  return [
    entry.instructor && entry.instructor !== "-" ? entry.instructor : null,
    !entry.online && entry.room && entry.room !== "-" ? entry.room : null,
  ].filter(Boolean);
}

function buildCells(entries) {
  const cells = new Map();

  for (const entry of entries) {
    const span = spanOf(entry);
    for (let k = 0; k < span; k++) {
      const key = `${entry.day}-${entry.slot + k}`;
      if (!cells.has(key)) cells.set(key, []);
      cells.get(key).push({ ...entry, cont: k > 0 });
    }
  }

  for (const items of cells.values()) {
    items.sort(
      (a, b) =>
        a.code.localeCompare(b.code, "tr") || (a.group || 0) - (b.group || 0),
    );
  }

  return cells;
}

function buildRows(entries) {
  const used = new Set();
  for (const entry of entries) {
    for (let k = 0; k < spanOf(entry); k++) used.add(entry.slot + k);
  }
  if (used.size === 0) {
    return TIME_SLOTS.map((_, si) => ({ type: "slot", slot: si, empty: true }));
  }

  const first = Math.min(...used);
  const last = Math.max(...used);

  const rows = [];
  if (first > 0) {
    rows.push({ type: "edge", from: 0, to: first - 1 });
  }
  for (let si = first; si <= last; si++) {
    rows.push({ type: "slot", slot: si, empty: !used.has(si) });
  }
  if (last < TIME_SLOTS.length - 1) {
    rows.push({ type: "edge", from: last + 1, to: TIME_SLOTS.length - 1 });
  }
  return rows;
}

function Strip({ entry, color, slim, active, href, onToggle }) {
  const elective = entry.type === "Seçmeli";
  const meta = metaOf(entry);
  const detailed = !slim && !entry.cont && meta.length > 0;

  const label = [
    `${entry.code} ${entry.name}`,
    `${entry.group}. grup`,
    entry.cont ? "devam eden oturum" : null,
    entry.online ? "çevrimiçi" : null,
    ...meta,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div
      className="overflow-hidden rounded-md"
      style={{
        backgroundColor: tintOf(elective, entry.cont && !active),
        borderLeft: `2.5px ${entry.cont ? "dashed" : "solid"} ${color}`,
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={active}
        aria-label={label}
        className="block w-full py-1 pr-1.5 pl-1.5 text-left transition-colors hover:bg-primary-500/4 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-secondary-500"
      >
        <span className="flex items-baseline gap-1">
          <span
            className={`shrink-0 font-mono text-[9.5px] font-semibold ${entry.cont && !active ? "opacity-60" : ""}`}
            style={{ color }}
          >
            {entry.code}
          </span>
          <span
            className={`min-w-0 flex-1 truncate text-[11px] leading-snug font-medium ${
              entry.cont && !active ? "text-primary-500/50" : "text-primary-600"
            }`}
          >
            {entry.name}
          </span>
          {entry.online && (
            <Wifi
              size={9}
              strokeWidth={2.25}
              aria-hidden
              className="shrink-0 self-center text-secondary-600"
            />
          )}
          {entry.english && (
            <span className="shrink-0 font-mono text-[8.5px] font-semibold tracking-wide text-secondary-600">
              EN
            </span>
          )}
          <span className="shrink-0 font-mono text-[9px] text-primary-500/40">
            Gr.{entry.group}
          </span>
          <ChevronDown
            size={10}
            strokeWidth={2.25}
            className={`shrink-0 self-center text-primary-500/30 transition-transform ${active ? "rotate-180" : ""}`}
          />
        </span>

        {detailed && !active && (
          <span className="mt-px block truncate text-[9.5px] leading-snug text-primary-500/45">
            {meta.join(" · ")}
          </span>
        )}
      </button>

      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.12 }}
          className="border-t px-1.5 pt-1.5 pb-1.5"
          style={{ borderColor: `rgba(${NAVY},0.07)` }}
        >
          <span className="block font-mono text-[9.5px] text-primary-500/45">
            {DAYS[entry.day]} · {rangeOf(entry)}
          </span>

          <span className="mt-1 flex flex-wrap items-center gap-1">
            <span className="rounded-sm bg-primary-500/6 px-1 py-px font-mono text-[9px] text-primary-500/60">
              {entry.group}. grup
            </span>
            {(entry.badge || entry.type) && (
              <span
                className="rounded-sm px-1 py-px text-[9px] font-medium"
                style={{
                  backgroundColor: `rgba(${elective ? GOLD : NAVY},0.1)`,
                  color: elective
                    ? "var(--color-secondary-600)"
                    : "rgba(29,36,69,0.6)",
                }}
              >
                {entry.badge || entry.type}
              </span>
            )}
            {entry.english && (
              <span className="rounded-sm bg-secondary-500/12 px-1 py-px text-[9px] font-medium text-secondary-600">
                İngilizce
              </span>
            )}
          </span>

          <span className="mt-1.5 flex flex-col gap-1 text-[10px] leading-snug text-primary-500/55">
            {entry.instructor && entry.instructor !== "-" && (
              <span className="flex items-start gap-1">
                <User size={10} strokeWidth={1.5} className="mt-px shrink-0" />
                {entry.instructor}
              </span>
            )}
            {entry.online ? (
              <span className="flex items-center gap-1 text-secondary-600">
                <Wifi size={10} strokeWidth={1.75} className="shrink-0" />
                Çevrimiçi
              </span>
            ) : (
              entry.room &&
              entry.room !== "-" && (
                <span className="flex items-center gap-1 font-mono">
                  <MapPin size={10} strokeWidth={1.5} className="shrink-0" />
                  {entry.room}
                </span>
              )
            )}
          </span>

          {href && (
            <Link
              href={href}
              className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-medium text-secondary-600 hover:underline"
            >
              Ders sayfası
              <ArrowRight size={10} strokeWidth={2} />
            </Link>
          )}
        </motion.div>
      )}
    </div>
  );
}

function Cell({
  cellKey,
  items,
  day,
  row,
  odd,
  palette,
  courseHref,
  clash,
  openId,
  onOpen,
  expanded,
  onExpand,
}) {
  const conflict = clash && items.length > 1;
  const overflow = items.length > VISIBLE + 1;
  const shown = overflow && !expanded ? items.slice(0, VISIBLE) : items;

  return (
    <div
      className="flex flex-col gap-1 p-1"
      style={{
        gridColumn: day + 2,
        gridRow: row,
        backgroundColor: conflict
          ? "rgba(180,120,20,0.05)"
          : odd
            ? `rgba(${NAVY},0.012)`
            : "transparent",
        borderBottom: `1px solid rgba(${NAVY},0.05)`,
        borderRight:
          day < DAYS.length - 1 ? `1px solid rgba(${NAVY},0.04)` : "none",
      }}
    >
      {conflict && (
        <span className="flex items-center gap-1 px-0.5 text-[9px] font-semibold tracking-wide text-amber-700 uppercase">
          <TriangleAlert size={9} strokeWidth={2.25} />
          Çakışma
        </span>
      )}

      {shown.map((entry, index) => {
        const id = `${cellKey}#${index}`;
        return (
          <Strip
            key={`${entry.code}-${entry.group}-${entry.slot}-${index}`}
            entry={entry}
            color={colorOf(palette, entry.code)}
            slim={index >= VISIBLE}
            active={openId === id}
            href={courseHref?.(entry.code) || null}
            onToggle={() => onOpen(openId === id ? null : id)}
          />
        );
      })}

      {overflow && (
        <button
          type="button"
          onClick={onExpand}
          aria-expanded={expanded}
          className="flex items-center justify-center gap-0.5 rounded-md py-0.5 text-[9.5px] font-semibold text-secondary-600 transition-colors hover:bg-secondary-500/8"
        >
          <ChevronDown
            size={10}
            strokeWidth={2.25}
            className={`transition-transform ${expanded ? "rotate-180" : ""}`}
          />
          {expanded ? "Daralt" : `+${items.length - VISIBLE} grup`}
        </button>
      )}
    </div>
  );
}

function TimeLabel({ row, children }) {
  return (
    <div
      className="sticky left-0 z-20 flex flex-col items-center justify-start bg-white pt-1.5 leading-none"
      style={{
        gridColumn: 1,
        gridRow: row,
        borderBottom: `1px solid rgba(${NAVY},0.05)`,
        borderRight: `1px solid rgba(${NAVY},0.06)`,
      }}
    >
      {children}
    </div>
  );
}

export default function WeeklySchedule({
  entries = [],
  courseHref,
  note = null,
  clash = false,
}) {
  const [openId, setOpenId] = useState(null);
  const [expanded, setExpanded] = useState(() => new Set());

  const cells = useMemo(() => buildCells(entries), [entries]);
  const rows = useMemo(() => buildRows(entries), [entries]);
  const palette = useMemo(() => courseColors(entries), [entries]);

  useEffect(() => {
    if (!openId) return undefined;
    const onKey = (event) => event.key === "Escape" && setOpenId(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openId]);

  const toggleExpand = (key) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <div className="overflow-hidden rounded-xl border border-primary-500/10 bg-white shadow-xs">
      <div className="border-b border-primary-500/6 px-4 py-2 text-center sm:hidden">
        <span className="text-[11px] text-primary-500/40">
          ← Programı görmek için yatay kaydırın →
        </span>
      </div>

      <div className="overflow-x-auto">
        <div style={{ minWidth: 852 }}>
          <div
            className="grid"
            style={{
              gridTemplateColumns: "72px repeat(5, minmax(156px, 1fr))",
              gridTemplateRows: `40px ${rows
                .map((row) =>
                  row.type === "edge"
                    ? "26px"
                    : row.empty
                      ? "24px"
                      : "minmax(44px, auto)",
                )
                .join(" ")}`,
            }}
          >
            <div
              className="sticky left-0 z-20 flex items-center justify-center bg-white"
              style={{
                gridColumn: 1,
                gridRow: 1,
                borderBottom: `1px solid rgba(${NAVY},0.08)`,
                borderRight: `1px solid rgba(${NAVY},0.06)`,
              }}
            >
              <span className="text-[10px] font-semibold tracking-widest text-primary-500/30 uppercase">
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
                  borderBottom: `1px solid rgba(${NAVY},0.08)`,
                  borderRight:
                    di < DAYS.length - 1
                      ? `1px solid rgba(${NAVY},0.05)`
                      : "none",
                }}
              >
                <span className="text-[12px] font-semibold text-primary-500">
                  {day}
                </span>
              </div>
            ))}

            {rows.flatMap((row, ri) => {
              const gridRow = ri + 2;

              if (row.type === "edge") {
                return [
                  <TimeLabel key={`edgelabel-${ri}`} row={gridRow}>
                    <span className="font-mono text-[9px] whitespace-nowrap text-primary-500/25">
                      {startOf(row.from)}
                    </span>
                  </TimeLabel>,
                  <div
                    key={`edgeband-${ri}`}
                    className="flex items-center justify-center"
                    style={{
                      gridColumn: "2 / -1",
                      gridRow,
                      backgroundColor: `rgba(${NAVY},0.02)`,
                      borderBottom: `1px solid rgba(${NAVY},0.04)`,
                    }}
                  >
                    <span className="font-mono text-[9px] tracking-wide text-primary-500/25">
                      {startOf(row.from)} – {endOf(row.to)} · ders yok
                    </span>
                  </div>,
                ];
              }

              if (row.empty) {
                return [
                  <TimeLabel key={`emptylabel-${ri}`} row={gridRow}>
                    <span className="font-mono text-[9px] whitespace-nowrap text-primary-500/25">
                      {startOf(row.slot)}
                    </span>
                  </TimeLabel>,
                  <div
                    key={`emptyband-${ri}`}
                    style={{
                      gridColumn: "2 / -1",
                      gridRow,
                      backgroundColor: `rgba(${NAVY},0.015)`,
                      borderBottom: `1px solid rgba(${NAVY},0.04)`,
                    }}
                  />,
                ];
              }

              return [
                <TimeLabel key={`slotlabel-${ri}`} row={gridRow}>
                  <span className="font-mono text-[10.5px] font-semibold whitespace-nowrap text-primary-500/55">
                    {startOf(row.slot)}
                  </span>
                  <span className="mt-0.5 font-mono text-[8.5px] whitespace-nowrap text-primary-500/25">
                    {endOf(row.slot)}
                  </span>
                </TimeLabel>,
                ...DAYS.map((_, di) => {
                  const key = `${di}-${row.slot}`;
                  return (
                    <Cell
                      key={`cell-${key}`}
                      cellKey={key}
                      items={cells.get(key) ?? []}
                      day={di}
                      row={gridRow}
                      odd={ri % 2 === 1}
                      palette={palette}
                      courseHref={courseHref}
                      clash={clash}
                      openId={openId}
                      onOpen={setOpenId}
                      expanded={expanded.has(key)}
                      onExpand={() => toggleExpand(key)}
                    />
                  );
                }),
              ];
            })}
          </div>
        </div>
      </div>

      {note && (
        <div className="border-t border-primary-500/6 px-4 py-2.5 text-center">
          <span className="text-[11px] text-primary-500/45">{note}</span>
        </div>
      )}

      {entries.length === 0 && (
        <div className="border-t border-primary-500/6 py-12 text-center">
          <span className="text-[13px] text-primary-500/30">
            Bu program için ders bulunmuyor.
          </span>
        </div>
      )}
    </div>
  );
}
