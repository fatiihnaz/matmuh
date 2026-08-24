"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(min-width: 1024px)";

let media;

function query() {
  return (media ??= window.matchMedia(QUERY));
}

function subscribe(onChange) {
  const list = query();
  list.addEventListener("change", onChange);
  return () => list.removeEventListener("change", onChange);
}

// Duzenleme cekmecesi dar ekranda kullanilamiyor; orada acik kalmasi editorun
// gormedigi bir alani kaydetmesine yol aciyor.
export function useWideViewport() {
  return useSyncExternalStore(subscribe, () => query().matches, () => false);
}
