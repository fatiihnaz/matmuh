"use client";

import { useEffect } from "react";
import { useCmsRoute } from "inscribed";

export default function HtmlLang() {
  const { locale } = useCmsRoute();

  useEffect(() => {
    if (locale) document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
