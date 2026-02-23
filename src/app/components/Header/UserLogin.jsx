"use client";

import Link from "next/link";
import { LogIn, ChevronDown } from "lucide-react";

export default function UserLogin({ user = null }) {
  if (!user) {
    return (
      <Link href="/giris" className="w-40 flex items-center justify-center gap-2 border border-secondary-500 text-secondary-500 px-4 py-1.5 rounded-lg hover:bg-secondary-500 hover:text-primary-500 transition-colors font-medium text-xs">
        <LogIn size={14} />
        <span>Giriş</span>
      </Link>
    );
  }

  return (
    <button className="w-40 flex items-center gap-3 group">
      <div className="w-7.5 h-7.5 rounded-lg bg-secondary-500 text-primary-600 flex items-center justify-center text-xs font-semibold shrink-0">
        {user?.initials || "--"}
      </div>
      <div className="flex flex-col items-start leading-tight">
        <span className="text-white text-xs font-light">{user?.name || "Ad Soyad"}</span>
        <span className="text-[8px] text-secondary-500 bg-white/10 px-1.5 py-0.5 rounded-sm">{user?.grade || "0. Sınıf"}</span>
      </div>
      <ChevronDown size={14} className="text-neutral-400 ml-auto" />
    </button>
  );
}