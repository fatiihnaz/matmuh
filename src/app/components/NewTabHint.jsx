"use client";

import { useT } from "@/i18n/useT";

export default function NewTabHint() {
  const t = useT();
  return <span className="sr-only"> {t("(yeni sekmede açılır)")}</span>;
}
