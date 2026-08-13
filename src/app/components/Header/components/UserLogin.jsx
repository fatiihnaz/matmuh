"use client";

import { useState, useRef, useEffect } from "react";
import { LogIn, ChevronDown, LogOut } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/lib/auth";

const ROLE_LABELS = {
  ROLE_ADMIN: "Admin",
  ROLE_EDITOR: "Editör",
  ROLE_USER: "Öğrenci",
};

const SLOT = "w-17 h-9";

export default function UserLogin() {
  const { user, isAuthenticated, isLoading, signIn, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handlePointerDown(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function handleKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (isLoading) {
    return (
      <div className={`${SLOT} flex items-center justify-center`}>
        <div className="w-4 h-4 border-2 border-secondary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <button
        onClick={() => signIn()}
        className="h-9 px-3 flex items-center gap-2 border border-secondary-500 text-secondary-500 rounded-lg hover:bg-secondary-500 hover:text-primary-500 transition-colors font-medium text-xs"
      >
        <LogIn size={14} className="shrink-0" />
        <span>Giriş</span>
      </button>
    );
  }

  const name = user?.name || "Ad Soyad";
  const email = user?.email || "";
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "--";
  const roles = (user?.authorities ?? []).map((a) => ROLE_LABELS[a] ?? a);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
        title={name}
        className={`${SLOT} flex items-center justify-center gap-1 rounded-lg transition-colors ${
          open ? "bg-white/10" : "hover:bg-white/5"
        }`}
      >
        <div className="w-8 h-8 shrink-0 rounded-lg bg-secondary-500 text-primary-600 flex items-center justify-center text-[11px] font-semibold tracking-tight">
          {initials}
        </div>
        <ChevronDown
          size={14}
          className={`shrink-0 text-neutral-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16, ease: [0.4, 0, 0.2, 1] }}
            className="absolute right-0 top-full mt-2 w-60 origin-top-right rounded-xl bg-white shadow-xl shadow-primary-500/25 ring-1 ring-primary-500/10 overflow-hidden"
          >
            <div className="flex items-center gap-2.5 px-3 py-2.5">
              <div className="w-8 h-8 shrink-0 rounded-lg bg-secondary-500/15 text-secondary-600 flex items-center justify-center text-[11px] font-semibold tracking-tight">
                {initials}
              </div>
              <div className="min-w-0 leading-tight">
                <p className="text-xs font-medium text-primary-600 truncate" title={name}>
                  {name}
                </p>
                {email && (
                  <p className="text-[10px] text-primary-500/40 truncate" title={email}>
                    {email}
                  </p>
                )}
              </div>
            </div>

            {roles.length > 0 && (
              <div className="flex flex-wrap gap-1.5 px-3 pb-2.5">
                {roles.map((role) => (
                  <span
                    key={role}
                    className="text-[10px] font-medium text-secondary-600 bg-secondary-500/10 px-2 py-0.5 rounded-full"
                  >
                    {role}
                  </span>
                ))}
              </div>
            )}

            <div className="p-1.5 border-t border-primary-500/8">
              <button
                onClick={() => {
                  setOpen(false);
                  signOut();
                }}
                className="flex items-center gap-2 w-full px-2 py-1.5 text-[11px] text-red-700/70 hover:bg-red-50 transition-colors rounded-lg"
              >
                <LogOut size={13} className="text-red-700/50 shrink-0" />
                <span>Çıkış Yap</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
