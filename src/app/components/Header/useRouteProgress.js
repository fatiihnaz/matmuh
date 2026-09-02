"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

const MIN_MS = 550;
const STUCK_MS = 12000;

let current = null;
const listeners = new Set();

function set(next) {
  current = next;
  for (const listener of listeners) listener();
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = () => current;
const getServerSnapshot = () => null;

export function startRouteProgress() {
  if (typeof window === "undefined") return;
  set({ path: window.location.pathname, at: Date.now() });
}

function shouldTrack(event) {
  if (event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
    return false;

  const target = event.target;
  const link = target instanceof Element ? target.closest("a[href]") : null;
  if (!link || link.hasAttribute("download")) return false;
  if (link.target && link.target !== "_self") return false;

  const url = new URL(link.href, location.href);
  if (url.origin !== location.origin) return false;
  return url.pathname !== location.pathname;
}

export function useRouteProgress() {
  const pathname = usePathname();
  const nav = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    const onClick = (event) => {
      if (shouldTrack(event)) startRouteProgress();
    };
    const onPopState = () => startRouteProgress();

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  useEffect(() => {
    if (!nav) return undefined;

    const landed = nav.path !== pathname;
    const wait = landed ? Math.max(0, MIN_MS - (Date.now() - nav.at)) : STUCK_MS;

    const timer = setTimeout(() => set(null), wait);
    return () => clearTimeout(timer);
  }, [nav, pathname]);

  return nav !== null;
}
