"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCw, Home } from "lucide-react";

import { IndeterminatePlot } from "./components/MathPlot";

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

        {error?.digest && (
          <p className="mt-4 font-mono text-[11px] text-primary-500/70">Hata kodu: {error.digest}</p>
        )}

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
