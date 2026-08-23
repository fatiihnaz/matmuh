"use client";

import { useEffect, useState } from "react";
import { CalendarDays, FileText, Info, MapPin, Wifi } from "lucide-react";

import Modal from "@/app/components/Modal";
import { useAuth } from "@/lib/auth";
import {
  NOTE_STATUS,
  fetchMyNotes,
  fetchMySchedule,
  formatDay,
  weekdayOf,
} from "@/data/profile";

function Skeleton({ rows = 4 }) {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="h-14 animate-pulse rounded-lg bg-primary-500/6" />
      ))}
    </div>
  );
}

function Empty({ children }) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-12 text-center text-[13px] text-primary-500/40">
      <Info size={18} strokeWidth={1.5} className="text-primary-500/25" />
      {children}
    </div>
  );
}

function NotesBody({ items }) {
  if (items.length === 0) return <Empty>Henüz not yüklemediniz.</Empty>;

  return (
    <ul className="divide-y divide-primary-500/6">
      {items.map((note) => {
        const status = NOTE_STATUS[note.status] ?? NOTE_STATUS.PENDING;
        return (
          <li key={note.id} className="flex items-start gap-3 px-4 py-3">
            <span className="mt-0.5 flex size-9 shrink-0 flex-col items-center justify-center rounded-lg bg-primary-500/5">
              <FileText size={15} strokeWidth={1.5} className="text-primary-700" />
              <span className="text-[7px] font-bold tracking-wide text-primary-500/50">
                {note.extension}
              </span>
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="text-[13px] font-medium text-primary-600">{note.title}</span>
                <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${status.tone}`}>
                  {status.label}
                </span>
              </span>
              <span className="mt-0.5 block text-[11px] text-primary-500/45">
                {note.lectureCode ? `${note.lectureCode} · ` : ""}
                {formatDay(note.createdAt)}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function ScheduleBody({ items }) {
  if (items.length === 0) return <Empty>Bu hafta için ders kaydınız görünmüyor.</Empty>;

  const days = items.reduce((acc, item) => {
    (acc[item.date] ??= []).push(item);
    return acc;
  }, {});

  return (
    <div className="divide-y divide-primary-500/6">
      {Object.entries(days).map(([date, entries]) => (
        <div key={date} className="px-4 py-3">
          <div className="mb-2 flex items-baseline gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-primary-500/40">
              {weekdayOf(date)}
            </span>
            <span className="text-[11px] text-primary-500/30">{formatDay(date)}</span>
          </div>
          <ul className="space-y-1.5">
            {entries.map((entry) => (
              <li key={entry.id} className="flex items-start gap-3 rounded-lg bg-primary-500/2 px-3 py-2">
                <span className="shrink-0 font-mono text-[11px] text-secondary-600">
                  {entry.startTime}
                  <span className="block text-primary-500/30">{entry.endTime}</span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium text-primary-600">
                    {entry.lectureCode ? `${entry.lectureCode} · ` : ""}
                    {entry.title}
                  </span>
                  <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-primary-500/45">
                    {entry.online ? (
                      <span className="inline-flex items-center gap-1">
                        <Wifi size={11} strokeWidth={1.5} /> Çevrimiçi
                      </span>
                    ) : entry.classroom ? (
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={11} strokeWidth={1.5} /> {entry.classroom}
                      </span>
                    ) : null}
                    {entry.staffName && <span className="truncate">{entry.staffName}</span>}
                    {entry.examType && (
                      <span className="rounded bg-secondary-500/12 px-1.5 py-0.5 text-[10px] font-semibold text-secondary-600">
                        Sınav
                      </span>
                    )}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

const VIEWS = {
  notes: { label: "Notlarım", icon: FileText, load: fetchMyNotes, Body: NotesBody },
  schedule: { label: "Ders Programım", icon: CalendarDays, load: fetchMySchedule, Body: ScheduleBody },
};

export default function ProfilePanel({ view, onClose }) {
  const { getAccessToken } = useAuth();
  const [state, setState] = useState({ view: null, status: "loading", items: [] });

  useEffect(() => {
    if (!view) return undefined;

    let alive = true;

    (async () => {
      try {
        const token = await getAccessToken();
        const items = await VIEWS[view].load(token);
        if (alive) setState({ view, status: "ready", items });
      } catch {
        if (alive) setState({ view, status: "error", items: [] });
      }
    })();

    return () => {
      alive = false;
    };
  }, [view, getAccessToken]);

  if (!view) return null;

  const { label, icon: Icon, Body } = VIEWS[view];
  const status = state.view === view ? state.status : "loading";

  return (
    <Modal
      open
      onClose={onClose}
      label={label}
      contentClassName="flex items-start justify-center px-3 pt-16 pb-6 sm:px-6"
    >
      <div className="flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex shrink-0 items-center gap-2.5 border-b border-primary-500/8 px-4 py-3">
          <Icon size={16} strokeWidth={1.5} className="text-secondary-500" />
          <h2 className="text-sm font-semibold text-primary-600">{label}</h2>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {status === "loading" && <Skeleton />}
          {status === "error" && <Empty>Bilgiler alınamadı.</Empty>}
          {status === "ready" && <Body items={state.items} />}
        </div>
      </div>
    </Modal>
  );
}
