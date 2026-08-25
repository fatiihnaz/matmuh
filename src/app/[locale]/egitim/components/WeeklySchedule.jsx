"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Wifi, MapPin, User } from "lucide-react";
import { DAYS, TIME_SLOTS } from "@/data/schedule-grid";
import Modal from "@/app/components/Modal";

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

// Ayni saatte birden fazla ders varsa tam kartlari alt alta yigmak hucreyi
// okunmaz hale getiriyordu — dordu birden sigmiyor, hicbiri okunmuyordu. Hepsi tek
// kutuda toplaniyor ve her ders tek satira iniyor: ad, sonra grup / hoca / derslik.
//
// Bunu "cakisma" diye adlandirmiyoruz: genel programda ayni saatte iki ders olmasi
// normal, paralel acilmis gruplardir. Cakisma ancak bir ogrencinin *kendi* programi
// icin anlamli, o da profil panelinde ayrica isaretleniyor. Grup numarasi burada
// gorunuyor cunku ayni saatteki satirlar cogu zaman ayni dersin farkli gruplari ve
// ayirt edici olan tek sey o.
function ParallelRow({ entry, href }) {
  const isElective = entry.type === "Seçmeli";
  const accent = isElective ? "var(--color-secondary-500)" : "var(--color-primary-500)";

  const row = (
    <div className="flex flex-col gap-0.5 rounded px-1.5 py-1 transition-colors hover:bg-primary-500/4">
      <div className="flex items-baseline gap-1.5">
        <span
          className="shrink-0"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.625rem",
            fontWeight: 600,
            color: accent,
          }}
        >
          {entry.code}
        </span>
        <span
          className="truncate leading-snug"
          style={{ fontSize: "0.6875rem", fontWeight: 500, color: "var(--color-primary-500)" }}
        >
          {entry.name}
        </span>
      </div>
      <div
        className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5"
        style={{ fontSize: "0.5625rem", color: "rgba(29,36,69,0.5)" }}
      >
        <span className="font-mono font-semibold" style={{ color: accent }}>
          Gr.{entry.group}
        </span>
        {entry.instructor && entry.instructor !== "-" && (
          <>
            <span aria-hidden>·</span>
            <span className="truncate">{entry.instructor}</span>
          </>
        )}
        {entry.online ? (
          <>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-0.5">
              <Wifi size={8} strokeWidth={2} /> Online
            </span>
          </>
        ) : (
          entry.room &&
          entry.room !== "-" && (
            <>
              <span aria-hidden>·</span>
              <span className="font-mono">{entry.room}</span>
            </>
          )
        )}
      </div>
    </div>
  );

  if (!href) return row;
  return (
    <Link
      href={href}
      aria-label={`${entry.code} ${entry.name}, grup ${entry.group} - ders detayına git`}
      className="block rounded focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-secondary-500"
    >
      {row}
    </Link>
  );
}

// Hucre yuksekligi `minmax(74px, auto)`: kaydirma koysak minicik bir kutuda kac
// tane oldugu belirsiz bir liste olur, kaldirsak satir icerige gore buyuyup o
// gundeki butun hucreleri gerer. Ikisi de kotu. Onun yerine dilim sayisi kadarini
// yerinde gosterip gerisini yer olan bir yuzeye tasiyoruz — havuz derslerinde ayni
// saatte on grup gorulebiliyor.
// `clash`: ogrencinin kendi programinda ayni saatte iki ders **cakismadir**, genel
// programda ise paralel gruplardir. Ayni bilesen iki baglamda calisiyor, tonu ve
// sozu baglamdan geliyor.
function ParallelCell({ items, span, courseHref, clash = false }) {
  const [open, setOpen] = useState(false);

  const fits = Math.min(items.length, Math.max(1, Math.min(span, 3)));
  // Tek kayit gizlemek icin dugme koymak sacma; o durumda hepsini gosteriyoruz.
  const shown = items.length - fits === 1 ? items.length : fits;
  const hidden = items.length - shown;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="flex h-full flex-col overflow-hidden rounded-lg border"
        style={{
          borderColor: clash ? "rgba(180,120,20,0.35)" : "rgba(29,36,69,0.12)",
          backgroundColor: clash ? "rgba(180,120,20,0.06)" : "rgba(29,36,69,0.03)",
        }}
      >
        <div
          className="shrink-0 px-2 pt-1.5 pb-1"
          style={{
            fontSize: "0.5625rem",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: clash ? "#8A5A08" : "rgba(29,36,69,0.45)",
          }}
        >
          {clash ? `${items.length} ders çakışıyor` : `Bu saatte ${items.length} grup`}
        </div>

        <div className="min-h-0 flex-1 space-y-0.5 px-1">
          {items.slice(0, shown).map((entry, k) => (
            <ParallelRow
              key={`${entry.code}-${entry.group}-${k}`}
              entry={entry}
              href={courseHref?.(entry.code) || null}
            />
          ))}
        </div>

        {hidden > 0 && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="shrink-0 border-t px-2 py-1 text-left transition-colors hover:bg-primary-500/4"
            style={{
              borderColor: "rgba(29,36,69,0.08)",
              fontSize: "0.5625rem",
              fontWeight: 600,
              color: "var(--color-secondary-600, #8A7444)",
            }}
          >
            +{hidden} grup — tümünü gör
          </button>
        )}
      </motion.div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        label={`${DAYS[items[0].day]} ${TIME_SLOTS[items[0].slot]} — ${items.length} grup`}
        contentClassName="flex items-center justify-center px-4 py-14"
      >
        <div className="flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
          <div className="shrink-0 border-b border-primary-500/8 px-5 py-3.5">
            <h2 className="text-sm font-semibold text-primary-600">
              {DAYS[items[0].day]} · {TIME_SLOTS[items[0].slot].split(" - ")[0]}
            </h2>
            <p className="mt-0.5 text-[11px] text-primary-500/45">
              Bu saatte açık {items.length} grup
            </p>
          </div>
          <div className="min-h-0 flex-1 space-y-0.5 overflow-y-auto overscroll-contain p-2">
            {items.map((entry, k) => (
              <ParallelRow
                key={`all-${entry.code}-${entry.group}-${k}`}
                entry={entry}
                href={courseHref?.(entry.code) || null}
              />
            ))}
          </div>
        </div>
      </Modal>
    </>
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

export default function WeeklySchedule({ entries = [], courseHref, note = null, clash = false }) {
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

      {/* `no-scrollbar` kaldirildi: dar kapta izgara kayiyordu ama gostergesi
          gizli oldugu icin son sutun kesik gorunuyor, kaydirilabildigi
          anlasilmiyordu. Sigan genislikte cubuk zaten cikmiyor. */}
      <div className="overflow-x-auto">
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
                  {multiple ? (
                    <ParallelCell
                      items={group.items}
                      span={group.span}
                      courseHref={courseHref}
                      clash={clash}
                    />
                  ) : (
                    <EntryCard
                      entry={group.items[0]}
                      fill
                      href={courseHref?.(group.items[0].code) || null}
                    />
                  )}
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

      {/* Yabanci dil ve sosyal secmeliler bolumun programina girmiyor; ogrenci
          onlari gormeyince programi eksik saniyor. Yoklugu acikca soylemek, sessiz
          birakmaktan iyi. */}
      {note && (
        <div className="px-4 py-2.5 text-center border-t border-primary-500/6">
          <span style={{ fontSize: "0.6875rem", color: "rgba(29,36,69,0.45)" }}>{note}</span>
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
