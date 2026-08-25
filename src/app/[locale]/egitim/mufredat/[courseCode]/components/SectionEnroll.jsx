"use client";

import { useCallback, useEffect, useState } from "react";
import { CalendarPlus, Check, TriangleAlert, X } from "lucide-react";

import { useAuth } from "@/lib/auth";
import { enroll, fetchMyEnrollments, unenroll } from "@/data/enrollments";
import { DAY_KEYS, DAYS } from "@/data/schedule-grid";

const API = process.env.NEXT_PUBLIC_API_URL || "/api";

const minutes = (time) => {
  const [h, m] = String(time ?? "").split(":");
  return Number(h) * 60 + Number(m ?? 0);
};

// Ogrencinin kayitli oldugu gruplarin haftalik saatleri. `/calendar/weekly` herkese
// acik, o yuzden kimlik bilgisi gerekmiyor; kayitli offering kimlikleriyle suzuyoruz.
async function fetchEnrolledSlots(offeringIds) {
  if (offeringIds.size === 0) return [];
  const res = await fetch(`${API}/calendar/weekly`).catch(() => null);
  if (!res?.ok) return [];
  const body = await res.json().catch(() => null);
  return (body?.data ?? [])
    .filter((slot) => offeringIds.has(slot.offeringId))
    .map((slot) => ({
      offeringId: slot.offeringId,
      dayIndex: DAY_KEYS.indexOf(slot.dayOfWeek),
      startMin: minutes(slot.startTime),
      endMin: minutes(slot.endTime),
      lectureCode: slot.lectureCode,
      groupNumber: slot.groupNumber,
    }));
}

const clock = (total) =>
  `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;

// Iki aralik kesisiyorsa cakisma var. Bitisik saatler (11:00 biten ve 11:00
// baslayan) cakisma sayilmiyor - backend'in slot kontrolundeki tanimla ayni.
function findClash(schedule, enrolledSlots, ownOfferingId) {
  for (const own of schedule) {
    for (const other of enrolledSlots) {
      if (other.offeringId === ownOfferingId) continue;
      if (other.dayIndex !== own.dayIndex) continue;
      if (own.startMin < other.endMin && own.endMin > other.startMin) {
        return {
          day: DAYS[own.dayIndex],
          from: clock(Math.max(own.startMin, other.startMin)),
          to: clock(Math.min(own.endMin, other.endMin)),
          with: `${other.lectureCode} grup ${other.groupNumber}`,
        };
      }
    }
  }
  return null;
}

const BUTTON =
  "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-colors disabled:opacity-40";

export default function SectionEnroll({ offeringId, schedule = [] }) {
  const { isAuthenticated, getAccessToken } = useAuth();
  const [enrolled, setEnrolled] = useState(null);
  const [enrolledSlots, setEnrolledSlots] = useState([]);
  const [busy, setBusy] = useState(false);
  const [clash, setClash] = useState(null);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    const token = await getAccessToken();
    const rows = await fetchMyEnrollments(token);
    const ids = new Set(rows.map((row) => row.offeringId));
    setEnrolled(ids.has(offeringId));
    setEnrolledSlots(await fetchEnrolledSlots(ids));
  }, [getAccessToken, offeringId]);

  useEffect(() => {
    if (!isAuthenticated || !offeringId) return;
    void load().catch(() => setEnrolled(false));
  }, [isAuthenticated, offeringId, load]);

  if (!isAuthenticated || !offeringId || enrolled === null) return null;

  const run = async (action) => {
    setBusy(true);
    setFailed(false);
    try {
      const token = await getAccessToken();
      await action(offeringId, token);
      setClash(null);
      await load();
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };

  const onAdd = () => {
    if (!clash) {
      const found = findClash(schedule, enrolledSlots, offeringId);
      // Cakismayi engellemiyoruz, yalnizca bir kez soruyoruz: ogrenci iki grubu
      // karsilastirmak icin bilerek ikisini de ekleyebilir.
      if (found) {
        setClash(found);
        return;
      }
    }
    void run(enroll);
  };

  if (enrolled) {
    return (
      <div className="mt-3 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-secondary-600">
          <Check size={13} strokeWidth={2} />
          Programında
        </span>
        <button
          type="button"
          onClick={() => void run(unenroll)}
          disabled={busy}
          className={`${BUTTON} text-primary-500/45 hover:bg-primary-500/5 hover:text-primary-500`}
        >
          {busy ? "…" : "Kaldır"}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-3">
      {clash && (
        <p className="mb-2 flex items-start gap-1.5 rounded-lg bg-amber-50 px-2.5 py-2 text-[11px] leading-relaxed text-amber-800">
          <TriangleAlert size={13} strokeWidth={2} className="mt-px shrink-0" />
          <span>
            {clash.day} {clash.from}–{clash.to} arası {clash.with} ile çakışıyor. Yine de
            eklemek için tekrar dokun.
          </span>
        </p>
      )}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onAdd}
          disabled={busy}
          className={`${BUTTON} border border-secondary-500/40 text-secondary-600 hover:bg-secondary-500/10`}
        >
          <CalendarPlus size={13} strokeWidth={2} />
          {busy ? "…" : clash ? "Yine de ekle" : "Programıma ekle"}
        </button>

        {clash && (
          <button
            type="button"
            onClick={() => setClash(null)}
            className={`${BUTTON} text-primary-500/45 hover:text-primary-500`}
          >
            <X size={13} strokeWidth={2} />
            Vazgeç
          </button>
        )}
      </div>

      {failed && (
        <p className="mt-1.5 text-[11px] text-red-700/75">İşlem tamamlanamadı, tekrar deneyin.</p>
      )}
    </div>
  );
}
