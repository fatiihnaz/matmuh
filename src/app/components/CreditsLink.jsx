"use client";

import Link from "next/link";

import { useT } from "@/i18n/useT";
import { useLocaleNav } from "@/i18n/useLocaleNav";

export default function CreditsLink() {
  const t = useT();
  const { href } = useLocaleNav();

  return (
    <Link
      href={href("/emegi-gecenler")}
      className="text-neutral-500 underline-offset-2 transition-colors hover:text-secondary-700 hover:underline"
    >
      {t("Emeği Geçenler")}
    </Link>
  );
}
