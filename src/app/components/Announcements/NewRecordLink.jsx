"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { useIsEditor } from "@/app/lib/cms-provider.jsx";

export default function NewRecordLink({ href, label }) {
  const isEditor = useIsEditor();
  if (!isEditor) return null;

  return (
    <Link
      href={href}
      className="inline-flex shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary-500/10 text-[12px] font-medium text-secondary-600 hover:bg-secondary-500/15 transition-colors"
    >
      <Plus className="size-3.5" />
      {label}
    </Link>
  );
}
