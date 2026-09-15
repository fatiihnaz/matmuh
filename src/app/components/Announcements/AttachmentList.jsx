"use client";

import DocumentLink from "@/app/components/DocumentLink";
import { useT } from "@/i18n/useT";

export default function AttachmentList({ items }) {
  const t = useT();
  if (!items.length) return null;
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-widest text-primary-500/70">
        {t("Ekler")}
      </span>
      {items.map((item) => (
        <DocumentLink
          key={item.href}
          label={item.label}
          href={item.href}
          kind={item.kind}
          size={item.size}
          previewHref={item.previewHref}
        />
      ))}
    </div>
  );
}
