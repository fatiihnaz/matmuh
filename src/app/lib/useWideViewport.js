"use client";

import { useSyncExternalStore } from "react";

const lists = new Map();

function query(media) {
  let list = lists.get(media);
  if (!list) {
    list = window.matchMedia(media);
    lists.set(media, list);
  }
  return list;
}

export function useMediaQuery(media) {
  return useSyncExternalStore(
    (onChange) => {
      const list = query(media);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => query(media).matches,
    () => false,
  );
}

// Duzenleme cekmecesi dar ekranda kullanilamiyor; orada acik kalmasi editorun
// gormedigi bir alani kaydetmesine yol aciyor.
export function useWideViewport() {
  return useMediaQuery("(min-width: 1024px)");
}
