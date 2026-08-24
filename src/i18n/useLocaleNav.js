"use client";

import { useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useCmsRoute } from "inscribed";

import { DEFAULT_LOCALE } from "./index";

const LOCALE_PREFIX = /^\/(tr|en)(?=\/|$)/;

export function stripLocale(pathname) {
  return pathname.replace(LOCALE_PREFIX, "") || "/";
}

export function useLocaleNav() {
  const { locale } = useCmsRoute();
  const pathname = usePathname();

  const href = useCallback(
    (path) => {
      if (!path?.startsWith("/") || locale === DEFAULT_LOCALE) return path;
      const [route, query] = path.split("?");
      const prefixed = route === "/" ? `/${locale}` : `/${locale}${route}`;
      return query ? `${prefixed}?${query}` : prefixed;
    },
    [locale],
  );

  return useMemo(() => ({ href, path: stripLocale(pathname) }), [href, pathname]);
}
