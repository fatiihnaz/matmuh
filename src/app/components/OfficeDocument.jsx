"use client";

import { useEffect, useRef, useState } from "react";

const STATUS = {
  loading: "Belge açılıyor…",
  error: "Bu belge tarayıcıda açılamadı. İndirip görüntüleyebilirsiniz.",
};

async function renderDocx(buffer, node) {
  const { renderAsync } = await import("docx-preview");
  node.replaceChildren();
  await renderAsync(buffer, node, undefined, {
    className: "mm-docx",
    inWrapper: false,
    ignoreLastRenderedPageBreak: true,
  });
}

async function renderXlsx(buffer, node) {
  const { default: readXlsx } = await import("read-excel-file/browser");
  const rows = await readXlsx(new Blob([buffer]));
  node.replaceChildren();

  const table = document.createElement("table");
  table.className = "mm-sheet";
  rows.forEach((row, rowIndex) => {
    const tr = document.createElement("tr");
    row.forEach((cell) => {
      const td = document.createElement(rowIndex === 0 ? "th" : "td");
      td.textContent = cell === null || cell === undefined ? "" : String(cell);
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });
  node.appendChild(table);
}

export default function OfficeDocument({ href, kind }) {
  const hostRef = useRef(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const node = hostRef.current;
    if (!node || !href) return undefined;

    let alive = true;
    setStatus("loading");

    (async () => {
      try {
        const response = await fetch(href, { credentials: "include" });
        if (!response.ok) throw new Error(String(response.status));
        const buffer = await response.arrayBuffer();
        if (!alive) return;

        if (kind === "docx") await renderDocx(buffer, node);
        else await renderXlsx(buffer, node);

        if (alive) setStatus("ready");
      } catch {
        if (alive) setStatus("error");
      }
    })();

    return () => {
      alive = false;
    };
  }, [href, kind]);

  return (
    <div className="relative h-full w-full overflow-auto bg-white">
      {status !== "ready" && (
        <p className="absolute inset-x-0 top-0 z-10 bg-white px-6 py-10 text-center text-[13px] text-primary-500/50">
          {STATUS[status]}
        </p>
      )}
      <div ref={hostRef} className="mm-doc" />
    </div>
  );
}
