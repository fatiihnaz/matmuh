"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, Copy, Home, RotateCw } from "lucide-react";

import Collapse from "./components/Collapse";
import { IndeterminatePlot } from "./components/MathPlot";

function errorReport(error) {
  return [
    error?.digest && `Hata kodu: ${error.digest}`,
    error?.name && error?.message && `${error.name}: ${error.message}`,
    typeof window !== "undefined" && `Sayfa: ${window.location.href}`,
    `Zaman: ${new Date().toLocaleString("tr-TR")}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function ErrorDetails({ error }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [report, setReport] = useState("");

  useEffect(() => {
    setReport(errorReport(error));
  }, [error]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* pano yoksa metin zaten ekranda seçilebilir durumda */
    }
  };

  return (
    <div className="mt-6 text-left">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="mx-auto flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px] font-medium text-primary-500/70 transition-colors hover:text-primary-500"
      >
        <ChevronDown
          size={13}
          strokeWidth={2}
          className={`transition-transform duration-200 motion-reduce:transition-none ${
            open ? "rotate-180" : ""
          }`}
        />
        {open ? "Ayrıntıları gizle" : "Ayrıntıları göster"}
      </button>

      <Collapse open={open}>
        <div className="mt-2 rounded-lg border border-primary-500/10 bg-white p-3 shadow-xs">
          <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-primary-500/70">
            {report}
          </pre>
          <div className="mt-2 flex items-center justify-between gap-3 border-t border-primary-500/6 pt-2">
            <span className="text-[11px] text-primary-500/70">
              Sorun sürerse bu bilgileri bize iletin.
            </span>
            <button
              type="button"
              onClick={copy}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium text-primary-500/70 transition-colors hover:bg-primary-500/5 hover:text-primary-500"
            >
              {copied ? (
                <Check size={12} strokeWidth={2} className="text-secondary-700" />
              ) : (
                <Copy size={12} strokeWidth={2} />
              )}
              {copied ? "Kopyalandı" : "Kopyala"}
            </button>
          </div>
        </div>
      </Collapse>
    </div>
  );
}

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="w-full flex-1 py-20">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="relative mx-auto flex w-fit items-center justify-center">
          <IndeterminatePlot />
          <span className="absolute font-mono text-4xl font-bold tracking-tight text-primary-500 [text-shadow:0_0_18px_var(--color-background)]">
            0/0
          </span>
        </div>

        <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-primary-500/70">
          500
        </p>

        <h1 className="mt-2 text-xl font-semibold text-primary-500">Bir şeyler ters gitti</h1>

        <p className="mt-3 text-[13px] text-primary-500/70 leading-relaxed">
          Beklenmeyen bir hata oluştu ve nedeni buradan belirlenemiyor.
          Tekrar denemek çoğu zaman yeterli oluyor.
        </p>

        <ErrorDetails error={error} />

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={reset}
            className="flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-primary-400"
          >
            <RotateCw size={14} />
            Tekrar dene
          </button>

          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg border border-primary-500/10 bg-white px-4 py-2 text-[13px] font-medium text-primary-500/70 shadow-xs transition-colors hover:border-primary-500/20 hover:text-primary-500"
          >
            <Home size={14} className="text-secondary-700" />
            Anasayfa
          </Link>
        </div>
      </div>
    </div>
  );
}
