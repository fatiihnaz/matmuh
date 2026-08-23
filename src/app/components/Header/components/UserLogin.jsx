"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { LogIn, ChevronDown, LogOut, ClipboardCheck, PencilLine, FileText, CalendarDays } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { useCmsEditing } from "@/app/lib/cms-provider.jsx";
import ProfilePanel from "@/app/components/Profile/ProfilePanel";

const ROLE_LABELS = {
  ROLE_ADMIN: "Admin",
  ROLE_EDITOR: "Editör",
  ROLE_USER: "Öğrenci",
};

const SLOT = "w-16 h-9";

export default function UserLogin() {
  const { user, isAuthenticated, isLoading, signIn, signOut } = useAuth();
  const { canEdit, editing, setEditing } = useCmsEditing();
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState(null);
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
        className="h-9 px-3.5 flex items-center gap-2 border border-secondary-500 text-secondary-500 rounded-lg hover:bg-secondary-500 hover:text-primary-500 transition-colors font-medium text-xs"
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
  const isAdmin = Boolean(user?.authorities?.includes("ROLE_ADMIN"));

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
        title={name}
        className={`${SLOT} group flex items-center justify-center gap-1.5 px-2 rounded-lg transition-colors ${
          open ? "bg-white/10" : "hover:bg-white/5"
        }`}
      >
        <span
          className={`w-7 h-7 shrink-0 rounded-full border flex items-center justify-center text-[10px] font-semibold tracking-tight transition-colors ${
            open
              ? "border-secondary-500 bg-secondary-500/20 text-secondary-300"
              : "border-secondary-500/45 text-secondary-500 group-hover:border-secondary-500 group-hover:bg-secondary-500/10"
          }`}
        >
          {initials}
        </span>
        <ChevronDown
          size={13}
          className={`shrink-0 transition-all duration-200 ${
            open ? "rotate-180 text-secondary-500" : "text-neutral-400 group-hover:text-neutral-300"
          }`}
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
            className="absolute right-0 top-full mt-2 w-[clamp(17rem,80vw,21rem)] origin-top-right rounded-xl bg-white shadow-xl shadow-primary-500/25 ring-1 ring-primary-500/10 overflow-hidden"
          >
            <div className="flex items-start gap-3 px-4 pt-4 pb-3">
              <span className="w-9 h-9 shrink-0 rounded-full border border-secondary-500/35 bg-secondary-500/10 text-secondary-600 flex items-center justify-center text-xs font-semibold tracking-tight">
                {initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-primary-600 leading-snug wrap-break-word">
                  {name}
                </p>
                {email && (
                  <p className="mt-0.5 text-[11px] text-primary-500/45 leading-snug break-all">
                    {email}
                  </p>
                )}
              </div>
            </div>

            {roles.length > 0 && (
              <div className="flex flex-wrap gap-1.5 px-4 pb-3">
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
              {[
                { id: "notes", label: "Notlarım", icon: FileText },
                { id: "schedule", label: "Ders Programım", icon: CalendarDays },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setPanel(id);
                  }}
                  className="flex items-center gap-2 w-full px-2.5 py-2 text-[12px] text-primary-500/70 hover:bg-primary-500/4 transition-colors rounded-lg"
                >
                  <Icon size={14} className="shrink-0 text-secondary-500" />
                  <span className="flex-1 text-left">{label}</span>
                </button>
              ))}
            </div>

            {(canEdit || isAdmin) && (
              <div className="p-1.5 border-t border-primary-500/8">
                <span className="block px-2.5 pb-1 text-[10px] font-semibold uppercase tracking-widest text-primary-500/35">
                  Yönetim
                </span>
                {isAdmin && (
                  <Link
                    href="/yonetim/ders-notlari"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 w-full px-2.5 py-2 text-[12px] text-primary-500/70 hover:bg-primary-500/4 transition-colors rounded-lg"
                  >
                    <ClipboardCheck size={14} className="shrink-0 text-secondary-500" />
                    <span className="flex-1 text-left">Not Yönetimi</span>
                  </Link>
                )}
                {canEdit && (
                <button
                  type="button"
                  role="switch"
                  aria-checked={editing}
                  onClick={() => setEditing(!editing)}
                  className="flex items-center gap-2 w-full px-2.5 py-2 text-[12px] text-primary-500/70 hover:bg-primary-500/4 transition-colors rounded-lg"
                >
                  <PencilLine size={14} className="shrink-0 text-secondary-500" />
                  <span className="flex-1 text-left">Düzenleme modu</span>
                  <span
                    className={`relative h-4 w-7 shrink-0 rounded-full transition-colors ${
                      editing ? "bg-secondary-500" : "bg-primary-500/15"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 size-3 rounded-full bg-white transition-all ${
                        editing ? "left-3.5" : "left-0.5"
                      }`}
                    />
                  </span>
                </button>
                )}
              </div>
            )}

            <div className="p-1.5 border-t border-primary-500/8">
              <button
                onClick={() => {
                  setOpen(false);
                  signOut();
                }}
                className="flex items-center gap-2 w-full px-2.5 py-2 text-[12px] text-red-700/75 hover:bg-red-50 transition-colors rounded-lg"
              >
                <LogOut size={14} className="text-red-700/50 shrink-0" />
                <span>Çıkış Yap</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ProfilePanel view={panel} onClose={() => setPanel(null)} />
    </div>
  );
}
