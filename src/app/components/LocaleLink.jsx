"use client";

import Link from "next/link";

import { useLocaleNav } from "@/i18n/useLocaleNav";

export default function LocaleLink({ href, ...props }) {
  const { href: localize } = useLocaleNav();
  return <Link href={localize(href)} {...props} />;
}
