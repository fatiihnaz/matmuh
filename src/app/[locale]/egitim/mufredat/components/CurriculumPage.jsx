"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  ArrowUpDown,
  ChevronRight,
  ChevronLeft,
  Info,
  ListFilter,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import PageLayout from "@/app/components/PageLayout";
import SubHeader from "@/app/components/Header/SubHeader";

function sortRows(rows, col, dir) {
  if (!col) return rows;
  return [...rows].sort((a, b) => {
    const av = a[col];
    const bv = b[col];
    if (av == null) return 1;
    if (bv == null) return -1;
    if (typeof av === "string" && typeof bv === "string")
      return dir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    return dir === "asc" ? av - bv : bv - av;
  });
}

function SortBtn({ label, col, sortCol, sortDir, onSort }) {
  return (
    <button
      onClick={() => onSort(col)}
      className="flex items-center gap-1.5 transition-colors hover:text-secondary-700"
      style={{
        fontSize: "0.6875rem",
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: sortCol === col ? "var(--color-secondary-500)" : "rgba(29,36,69,0.38)",
      }}
    >
      {label}
      <ArrowUpDown size={10} strokeWidth={1.5} />
    </button>
  );
}

function StatusBadge({ status }) {
  const isRequired = status === "Zorunlu";
  return (
    <span
      className="inline-block px-2.5 py-1 rounded-md"
      style={{
        fontSize: "0.6875rem",
        fontWeight: 500,
        letterSpacing: "0.02em",
        color: isRequired ? "var(--color-primary-500)" : "var(--color-secondary-500)",
        backgroundColor: isRequired
          ? "rgba(29,36,69,0.06)"
          : "rgba(173,151,111,0.1)",
      }}
    >
      {status}
    </span>
  );
}

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -48 : 48, opacity: 0 }),
};
const slideTransition = { duration: 0.28, ease: [0.4, 0, 0.2, 1] };

const COLS = [
  { key: "code", label: "Ders Kodu", w: 140 },
  { key: "name", label: "Ders Adı", w: null },
  { key: "hours", label: "T+U+L", w: 80 },
  { key: "ects", label: "ECTS", w: 70 },
  { key: "status", label: "Durum", w: 110 },
  { key: "_action", label: "", w: 48 },
];

function Colgroup() {
  return (
    <colgroup>
      {COLS.map((col) => (
        <col key={col.key} style={col.w ? { width: col.w } : undefined} />
      ))}
    </colgroup>
  );
}

export default function CurriculumPage({ semesters, summary }) {
  const [activeTab, setActiveTab] = useState(0);
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [direction, setDirection] = useState(1);
  const router = useRouter();

  const semester = semesters[activeTab];
  const rows = semester?.rows ?? [];
  const sorted = sortRows(rows, sortCol, sortDir);
  const totalEcts = semester?.totalEcts ?? 0;

  function handleSort(col) {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortCol(col); setSortDir("asc"); }
  }

  function handleTabChange(idx) {
    if (idx === activeTab && !expandedGroup) return;
    setDirection(idx > activeTab ? 1 : -1);
    setActiveTab(idx);
    setSortCol(null);
    setExpandedGroup(null);
  }

  function openGroup(row) {
    setDirection(1);
    setExpandedGroup(row);
  }

  function closeGroup() {
    setDirection(-1);
    setExpandedGroup(null);
  }

  const panelKey = expandedGroup ? `group-${expandedGroup.code}` : `sem-${activeTab}`;

  return (
    <>
      <SubHeader
        title="Müfredat & Dersler"
        subTitle="Lisans programı ders planı ve kredi bilgileri"
      />
      <PageLayout>
        <div className="space-y-4">

          <div className="rounded-xl overflow-hidden border border-primary-500/10 shadow-xs bg-white">
            <div className="grid grid-cols-2 sm:grid-cols-4">
              {[
                { val: String(summary.termCount), lbl: "Yarıyıl" },
                { val: String(summary.totalEcts), lbl: "Toplam ECTS" },
                { val: String(summary.courseCount), lbl: "Toplam Ders" },
                { val: `${summary.yearCount} Yıl`, lbl: "Süre" },
              ].map((s, i) => (
                <div
                  key={s.lbl}
                  className={`px-4 sm:px-6 py-4 flex items-center gap-3 border-primary-500/5 ${
                    i % 2 === 0 ? "border-r" : ""
                  } ${i < 2 ? "border-b" : ""} sm:border-b-0 ${
                    i < 3 ? "sm:border-r" : "sm:border-r-0"
                  }`}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "1.125rem",
                        fontWeight: 600,
                        color: "var(--color-primary-500)",
                      }}
                    >
                      {s.val}
                    </div>
                    <div
                      style={{
                        fontSize: "0.6875rem",
                        color: "rgba(29,36,69,0.45)",
                        fontWeight: 450,
                      }}
                    >
                      {s.lbl}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-primary-500/10 shadow-xs bg-white">

            <div
              className="flex items-center gap-0 overflow-x-auto no-scrollbar px-1 pt-1"
              style={{ borderBottom: "1px solid rgba(29,36,69,0.06)" }}
            >
              {semesters.map((sem, idx) => (
                <button
                  key={sem.number}
                  onClick={() => handleTabChange(idx)}
                  className="px-4 py-3 transition-all duration-200 whitespace-nowrap"
                  style={{
                    fontSize: "0.8125rem",
                    fontWeight: activeTab === idx ? 600 : 450,
                    color:
                      activeTab === idx
                        ? "var(--color-primary-500)"
                        : "rgba(29,36,69,0.4)",
                    borderBottom:
                      activeTab === idx
                        ? "2px solid var(--color-secondary-500)"
                        : "2px solid transparent",
                  }}
                >
                  {sem.number}. Yarıyıl
                </button>
              ))}
            </div>

            <div className="px-6 pt-4 pb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {expandedGroup ? (
                  <button
                    onClick={closeGroup}
                    className="flex items-center gap-1 mr-1 transition-colors"
                    style={{ color: "var(--color-secondary-500)" }}
                  >
                    <ChevronLeft size={14} strokeWidth={1.5} />
                  </button>
                ) : (
                  <BookOpen
                    size={14}
                    strokeWidth={1.5}
                    style={{ color: "var(--color-secondary-500)" }}
                  />
                )}
                <span
                  style={{
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    color: "var(--color-primary-500)",
                  }}
                >
                  {expandedGroup ? expandedGroup.groupTitle : (semester?.name ?? "")}
                </span>
                {!expandedGroup && (
                  <span
                    className="ml-2 px-2 py-0.5 rounded-sm"
                    style={{
                      fontSize: "0.625rem",
                      fontWeight: 500,
                      backgroundColor: "rgba(173,151,111,0.1)",
                      color: "var(--color-secondary-500)",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {totalEcts} ECTS
                  </span>
                )}
              </div>
              <span style={{ fontSize: "0.75rem", color: "rgba(29,36,69,0.4)" }}>
                {expandedGroup
                  ? `${expandedGroup.options.length} ders`
                  : `${rows.length} ders`}
              </span>
            </div>

            {expandedGroup?.note && (
              <div
                className="mx-6 mb-3 px-3 py-2 rounded-lg flex items-start gap-2"
                style={{ backgroundColor: "rgba(173,151,111,0.07)" }}
              >
                <Info
                  size={13}
                  strokeWidth={1.5}
                  className="mt-0.5 shrink-0"
                  style={{ color: "var(--color-secondary-500)" }}
                />
                <span
                  style={{
                    fontSize: "0.75rem",
                    lineHeight: 1.5,
                    color: "rgba(29,36,69,0.55)",
                  }}
                >
                  {expandedGroup.note} Ders içeriği için satırlar YTÜ Bologna
                  kataloğuna açılır.
                </span>
              </div>
            )}

            <div className="sm:hidden px-4 pb-2 text-center">
              <span style={{ fontSize: "0.6875rem", color: "rgba(29,36,69,0.4)" }}>
                ← Tabloyu görmek için yatay kaydırın →
              </span>
            </div>

            <div className="overflow-x-auto no-scrollbar">
              <div className="min-w-160">
                <table className="w-full table-fixed">
              <Colgroup />
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(29,36,69,0.06)" }}>
                  {COLS.map((col) => (
                    <th key={col.key} className="text-left px-4 sm:px-6 py-3">
                      {col.key !== "_action" && (
                        <SortBtn
                          label={col.label}
                          col={col.key}
                          sortCol={sortCol}
                          sortDir={sortDir}
                          onSort={handleSort}
                        />
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
            </table>

            <div className="relative overflow-hidden h-[60vh] sm:h-105">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={panelKey}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={slideTransition}
                  className="absolute inset-0 overflow-y-auto"
                >
                  <table className="w-full table-fixed">
                    <Colgroup />
                    <tbody>
                      {(expandedGroup ? electiveRows(expandedGroup) : sorted).map(
                        (row, idx, arr) => {
                          if (row._empty) {
                            return (
                              <tr key="empty">
                                <td colSpan={6} className="px-4 sm:px-6 py-12 text-center">
                                  <span style={{ fontSize: "0.8125rem", color: "rgba(29,36,69,0.3)" }}>
                                    Ders bilgisi mevcut değil
                                  </span>
                                </td>
                              </tr>
                            );
                          }

                          const isLast = idx === arr.length - 1;
                          const rowStyle = {
                            borderBottom: !isLast ? "1px solid rgba(29,36,69,0.03)" : "none",
                            backgroundColor:
                              idx % 2 === 1 ? "rgba(29,36,69,0.012)" : "transparent",
                          };

                          if (row.isGroup) {
                            return (
                              <tr
                                key={`${row.code}-${idx}`}
                                className="transition-colors cursor-pointer hover:bg-[rgba(173,151,111,0.04)] group"
                                style={rowStyle}
                                onClick={() => openGroup(row)}
                              >
                                <td className="px-4 sm:px-6 py-3.5">
                                  <span
                                    style={{
                                      fontFamily: "'JetBrains Mono', monospace",
                                      fontSize: "0.8125rem",
                                      color: "rgba(173,151,111,0.35)",
                                    }}
                                  >
                                    -
                                  </span>
                                </td>
                                <td className="px-4 sm:px-6 py-3.5">
                                  <span className="flex items-center gap-2 min-w-0">
                                    <ListFilter
                                      size={13}
                                      strokeWidth={1.5}
                                      style={{ color: "var(--color-secondary-500)", opacity: 0.6, flexShrink: 0 }}
                                    />
                                    <span
                                      className="truncate"
                                      style={{
                                        fontSize: "0.8125rem",
                                        fontWeight: 450,
                                        color: "rgba(29,36,69,0.65)",
                                      }}
                                    >
                                      {row.groupTitle}
                                    </span>
                                    {row.options.length > 0 && (
                                      <span
                                        className="shrink-0"
                                        style={{
                                          fontSize: "0.625rem",
                                          color: "rgba(29,36,69,0.3)",
                                        }}
                                      >
                                        ({row.options.length} seçenek)
                                      </span>
                                    )}
                                  </span>
                                </td>
                                <td className="px-4 sm:px-6 py-3.5">
                                  <span
                                    style={{
                                      fontFamily: row.hours === "-" ? undefined : "'JetBrains Mono', monospace",
                                      fontSize: "0.75rem",
                                      color: row.hours === "-" ? "rgba(29,36,69,0.2)" : "rgba(29,36,69,0.45)",
                                    }}
                                  >
                                    {row.hours}
                                  </span>
                                </td>
                                <td className="px-4 sm:px-6 py-3.5">
                                  <span
                                    style={{
                                      fontFamily: row.ects === "-" ? undefined : "'JetBrains Mono', monospace",
                                      fontSize: row.ects === "-" ? "0.75rem" : "0.8125rem",
                                      fontWeight: row.ects === "-" ? 400 : 600,
                                      color: row.ects === "-" ? "rgba(29,36,69,0.2)" : "var(--color-primary-500)",
                                    }}
                                  >
                                    {row.ects}
                                  </span>
                                </td>
                                <td className="px-4 sm:px-6 py-3.5">
                                  <StatusBadge status="Seçmeli" />
                                </td>
                                <td className="px-4 sm:px-6 py-3.5">
                                  <ChevronRight
                                    size={14}
                                    strokeWidth={1.5}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    style={{ color: "var(--color-secondary-500)" }}
                                  />
                                </td>
                              </tr>
                            );
                          }

                          const isExternal = Boolean(row.external);
                          const target = row.href;

                          return (
                            <tr
                              key={`${row.code}-${idx}`}
                              className="transition-colors cursor-pointer hover:bg-[rgba(173,151,111,0.03)] group"
                              style={rowStyle}
                              onClick={() =>
                                isExternal
                                  ? window.open(target, "_blank", "noopener,noreferrer")
                                  : router.push(target)
                              }
                            >
                              <td className="px-4 sm:px-6 py-3.5">
                                <span
                                  style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: "0.8125rem",
                                    fontWeight: 500,
                                    color: "var(--color-secondary-500)",
                                    letterSpacing: "0.02em",
                                  }}
                                >
                                  {row.code}
                                </span>
                              </td>
                              <td className="px-4 sm:px-6 py-3.5">
                                <Link
                                  href={target}
                                  {...(isExternal
                                    ? { target: "_blank", rel: "noopener noreferrer" }
                                    : {})}
                                  className="hover:text-secondary-700 transition-colors block truncate"
                                  style={{
                                    fontSize: "0.8125rem",
                                    fontWeight: 450,
                                    color: "var(--color-primary-500)",
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {row.name}
                                </Link>
                              </td>
                              <td className="px-4 sm:px-6 py-3.5">
                                <span
                                  style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: "0.75rem",
                                    color: "rgba(29,36,69,0.45)",
                                  }}
                                >
                                  {row.hours}
                                </span>
                              </td>
                              <td className="px-4 sm:px-6 py-3.5">
                                <span
                                  style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: "0.8125rem",
                                    fontWeight: 600,
                                    color: "var(--color-primary-500)",
                                  }}
                                >
                                  {row.ects}
                                </span>
                              </td>
                              <td className="px-4 sm:px-6 py-3.5">
                                <StatusBadge status={row.status} />
                              </td>
                              <td className="px-4 sm:px-6 py-3.5">
                                {isExternal ? (
                                  <ExternalLink
                                    size={14}
                                    strokeWidth={1.5}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    style={{ color: "var(--color-secondary-500)" }}
                                  />
                                ) : (
                                  <Info
                                    size={14}
                                    strokeWidth={1.5}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    style={{ color: "rgba(29,36,69,0.3)" }}
                                  />
                                )}
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </motion.div>
              </AnimatePresence>
                </div>
              </div>
            </div>

            <div
              className="px-4 sm:px-6 py-3 flex items-center justify-between gap-3 flex-wrap"
              style={{ borderTop: "1px solid rgba(29,36,69,0.06)" }}
            >
              <div className="flex items-center gap-3">
                {expandedGroup ? (
                  <button
                    onClick={closeGroup}
                    className="flex items-center gap-1.5 transition-colors"
                    style={{ fontSize: "0.75rem", color: "var(--color-secondary-500)" }}
                  >
                    <ChevronLeft size={12} strokeWidth={1.5} />
                    Yarıyıl listesine dön
                  </button>
                ) : (
                  <span style={{ fontSize: "0.75rem", color: "rgba(29,36,69,0.4)", fontWeight: 400 }}>
                    Toplam {rows.length} ders · {totalEcts} ECTS
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-sm"
                  style={{
                    fontSize: "0.625rem",
                    fontWeight: 500,
                    color: "var(--color-primary-500)",
                    backgroundColor: "rgba(29,36,69,0.04)",
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-sm inline-block"
                    style={{ backgroundColor: "rgba(29,36,69,0.15)" }}
                  />
                  Zorunlu
                </span>
                <span
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-sm"
                  style={{
                    fontSize: "0.625rem",
                    fontWeight: 500,
                    color: "var(--color-secondary-500)",
                    backgroundColor: "rgba(173,151,111,0.06)",
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-sm inline-block"
                    style={{ backgroundColor: "rgba(173,151,111,0.3)" }}
                  />
                  Seçmeli
                </span>
              </div>
            </div>
          </div>

        </div>
      </PageLayout>
    </>
  );
}

function electiveRows(group) {
  return group.options.length > 0 ? group.options : [{ _empty: true }];
}
