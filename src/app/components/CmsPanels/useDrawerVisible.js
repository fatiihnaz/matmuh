"use client";

import { useEffect, useRef, useState } from "react";

export function useDrawerVisible(anchorRef, onOpen) {
  const [visible, setVisible] = useState(true);
  const opened = useRef(onOpen);

  useEffect(() => {
    opened.current = onOpen;
  }, [onOpen]);

  useEffect(() => {
    const host = anchorRef?.current?.closest("[aria-hidden]");
    if (!host) return undefined;

    const read = () => host.getAttribute("aria-hidden") !== "true";
    let last = read();

    const observer = new MutationObserver(() => {
      const next = read();
      if (next === last) return;
      last = next;
      setVisible(next);
      if (next) opened.current?.();
    });

    observer.observe(host, { attributes: true, attributeFilter: ["aria-hidden"] });
    return () => observer.disconnect();
  }, [anchorRef]);

  return visible;
}
