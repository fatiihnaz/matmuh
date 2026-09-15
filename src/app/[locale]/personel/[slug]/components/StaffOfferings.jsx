"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, Lock } from "lucide-react";

import Collapse from "@/app/components/Collapse";
import Panel from "@/app/components/Panel";
import GradeDistribution from "@/app/components/GradeDistribution";
import { SkeletonBlock } from "@/app/components/Skeleton";
import { useAuth } from "@/lib/auth";
import { fetchStaffOfferings } from "@/data/statistics";
import { useT } from "@/i18n/useT";

const STAT = "flex flex-col gap-0.5 rounded-lg bg-primary-500/2 px-3 py-2";

function Summary({ summary }) {
  const rows = [
    ["Ortalama", summary.average?.toFixed?.(2) ?? summary.average],
    ["Std. sapma", summary.stdDev?.toFixed?.(2) ?? summary.stdDev],
    ["Katılan", summary.participantCount],
  ].filter(([, value]) => value !== null && value !== undefined);

  if (rows.length === 0) return null;

  return (
    <div className="grid grid-cols-3 gap-2">
      {rows.map(([label, value]) => (
        <span key={label} className={STAT}>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-primary-500/70">
            {label}
          </span>
          <span className="font-mono text-[13px] font-semibold text-primary-600">
            {value}
          </span>
        </span>
      ))}
    </div>
  );
}

function LectureRow({ lecture, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-lg border border-primary-500/8">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-primary-500/3"
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-semibold text-primary-500">
            {lecture.name}
          </span>
          <span className="mt-0.5 block font-mono text-[11px] text-secondary-700">
            {lecture.code}
            <span className="ml-2 font-sans text-primary-500/70">
              {lecture.sections.length} grup
            </span>
          </span>
        </span>
        <ChevronDown
          size={15}
          className={`shrink-0 text-primary-500/70 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <Collapse open={open}>
        <div className="flex flex-col gap-5 px-3 pb-4">
          {lecture.code && (
            <Link
              href={`/egitim/mufredat/${lecture.code}`}
              className="text-[11px] font-medium text-secondary-700 hover:underline"
            >
              {t("Ders sayfası")}
            </Link>
          )}
          {lecture.sections.map((section) => (
            <div key={section.section} className="flex flex-col gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-primary-500/70">
                Grup {section.section}
              </span>
              <Summary summary={section.summary} />
              <GradeDistribution data={section.gradeDistribution} />
            </div>
          ))}
        </div>
      </Collapse>
    </div>
  );
}

export default function StaffOfferings({ staffId }) {
  const t = useT();
  const { isAuthenticated, getAccessToken, signIn } = useAuth();
  const [terms, setTerms] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || terms) return undefined;
    let alive = true;
    (async () => {
      try {
        const token = await getAccessToken();
        if (!token || !alive) return;
        const result = await fetchStaffOfferings(staffId, token);
        if (alive) setTerms(result);
      } catch {
        if (alive) setFailed(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [isAuthenticated, terms, staffId, getAccessToken]);

  if (!isAuthenticated) {
    return (
      <Panel>
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <Lock className="size-5 text-primary-500/70" />
          <p className="text-[13px] text-primary-500/70">
            {t("Verdiği dersler ve not istatistikleri giriş yapan kullanıcılara açıktır.")}
          </p>
          <button
            type="button"
            onClick={() => signIn()}
            className="rounded-lg border border-secondary-500 px-3.5 py-1.5 text-xs font-medium text-secondary-700 transition-colors hover:bg-secondary-500 hover:text-primary-500"
          >
            {t("Giriş yap")}
          </button>
        </div>
      </Panel>
    );
  }

  if (failed) {
    return (
      <Panel>
        <p className="py-4 text-center text-[13px] text-primary-500/70">
          {t("İstatistikler yüklenemedi.")}
        </p>
      </Panel>
    );
  }

  if (!terms) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }, (_, i) => (
          <SkeletonBlock key={i} className="h-14" />
        ))}
      </div>
    );
  }

  if (terms.length === 0) {
    return (
      <Panel>
        <p className="py-4 text-center text-[13px] text-primary-500/70">
          {t("Kayıtlı dönem bulunmuyor.")}
        </p>
      </Panel>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {terms.map((term, termIndex) => (
        <div key={term.name} className="flex flex-col gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-primary-500/70">
            {term.name}
          </span>
          {term.lectures.map((lecture, index) => (
            <LectureRow
              key={`${lecture.code}-${index}`}
              lecture={lecture}
              defaultOpen={termIndex === 0 && index === 0}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
