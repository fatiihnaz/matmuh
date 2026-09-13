"use client";

import Link from "next/link";

import { useT } from "@/i18n/useT";
import { useLocaleNav } from "@/i18n/useLocaleNav";

const PAGES = [
  { path: "/gizlilik", label: "Gizlilik" },
  { path: "/kvkk", label: "KVKK" },
];

export default function LegalLinks() {
  const t = useT();
  const { href } = useLocaleNav();

  return PAGES.map(({ path, label }) => (
    <span key={path}>
      {" · "}
      <Link
        href={href(path)}
        className="text-neutral-500 underline-offset-2 transition-colors hover:text-secondary-700 hover:underline"
      >
        {t(label)}
      </Link>
    </span>
  ));
}
