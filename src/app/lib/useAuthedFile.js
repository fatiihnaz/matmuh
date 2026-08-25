"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/lib/auth";

// `/api/uploads/files/**` kimlik dogrulamali. Prod'da HttpOnly cerez ayni kokene
// gittigi icin <iframe src> calisiyor, ama gelistirmede oturum elle yapistirilan bir
// bearer token; iframe basik tasiyamadigi icin 401 aliyorduk. Dosyayi fetch ile
// cekip blob URL'e cevirince iki ortam da ayni yoldan gidiyor.
//
// Gorseller bu yoldan gecmiyor: `/api/uploads/images/**` zaten permitAll.
function needsAuth(href) {
  return typeof href === "string" && href.startsWith("/api/");
}

export function useAuthedFile(href, active) {
  const { getAccessToken } = useAuth();
  const [state, setState] = useState({ url: null, status: "idle" });

  useEffect(() => {
    if (!active || !href) return undefined;

    if (!needsAuth(href)) {
      setState({ url: href, status: "ready" });
      return undefined;
    }

    let alive = true;
    let objectUrl = null;
    setState({ url: null, status: "loading" });

    (async () => {
      try {
        const token = await getAccessToken();
        const response = await fetch(href, {
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!response.ok) throw new Error(String(response.status));
        const blob = await response.blob();
        if (!alive) return;
        objectUrl = URL.createObjectURL(blob);
        setState({ url: objectUrl, status: "ready" });
      } catch {
        if (alive) setState({ url: null, status: "error" });
      }
    })();

    return () => {
      alive = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [href, active, getAccessToken]);

  return state;
}
