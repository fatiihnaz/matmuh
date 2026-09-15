"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";

import Panel from "@/app/components/Panel";
import DocumentLink from "@/app/components/DocumentLink";
import { SkeletonBlock } from "@/app/components/Skeleton";
import { useAuth } from "@/lib/auth";
import { fetchStaffNotes, noteTypeLabel } from "@/data/lecture-notes";
import { useT } from "@/i18n/useT";

export default function StaffNotes({ staffId }) {
  const t = useT();
  const { isAuthenticated, getAccessToken, signIn } = useAuth();
  const [notes, setNotes] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || notes) return undefined;
    let alive = true;
    (async () => {
      try {
        const token = await getAccessToken();
        if (!token || !alive) return;
        const result = await fetchStaffNotes(staffId, token);
        if (alive) setNotes(result.items);
      } catch {
        if (alive) setFailed(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [isAuthenticated, notes, staffId, getAccessToken]);

  if (!isAuthenticated) {
    return (
      <Panel>
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <Lock className="size-5 text-primary-500/70" />
          <p className="text-[13px] text-primary-500/70">
            {t("Derslerine yüklenen notlar giriş yapan kullanıcılara açıktır.")}
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
          {t("Notlar yüklenemedi.")}
        </p>
      </Panel>
    );
  }

  if (!notes) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }, (_, i) => (
          <SkeletonBlock key={i} className="h-14" />
        ))}
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <Panel>
        <p className="py-4 text-center text-[13px] text-primary-500/70">
          {t("Derslerine yüklenmiş onaylı not bulunmuyor.")}
        </p>
      </Panel>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {notes.map((note) => (
        <DocumentLink
          key={note.id}
          label={note.title}
          href={note.href}
          previewHref={note.previewHref}
          kind={note.extension?.toLowerCase()}
          size={0}
          term={[note.lectureCode, noteTypeLabel(note.type)].filter(Boolean).join(" · ")}
        />
      ))}
    </div>
  );
}
