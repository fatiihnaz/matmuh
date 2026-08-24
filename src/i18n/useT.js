"use client";

import { useCallback } from "react";
import { useCmsRoute } from "inscribed";

import { translate } from "./index";

export function useT() {
  const { locale } = useCmsRoute();
  return useCallback((text) => translate(locale, text), [locale]);
}
