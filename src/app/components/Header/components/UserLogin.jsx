"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { LogIn, ChevronDown, User, GraduationCap, Settings, LogOut } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/lib/hooks/useAuth";

export default function UserLogin() {
  const { user, isLoading, isAuthenticated, login, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="w-40 flex items-center justify-center py-1.5">
        <div className="w-4 h-4 border-2 border-secondary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <button onClick={login} className="w-40 flex items-center justify-center gap-2 border border-secondary-500 text-secondary-500 px-4 py-1.5 rounded-lg hover:bg-secondary-500 hover:text-primary-500 transition-colors font-medium text-xs">
        <LogIn size={14} />
        <span>Giriş</span>
      </button>
    );
  }

  const initials = user.name ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase() : "--";

  const authorityLabels = {
    ROLE_USER: "Öğrenci",
    ROLE_EDITOR: "Editör",
    ROLE_ADMIN: "Admin",
  };

  const roles = (user.authorities || []).map((a) => authorityLabels[a] || a);

  const menuItems = [
    { label: "Profilim", href: "/profil", icon: User },
    { label: "Derslerim", href: "/derslerim", icon: GraduationCap },
    { label: "Ayarlar", href: "/ayarlar", icon: Settings },
  ];

  const dropdownItems = [
    ...menuItems.map((item) => ({ type: "link", ...item })),
    { type: "divider" },
    { type: "logout" },
  ];

  return (
    <div ref={ref} className="relative z-50">

      <div className="w-40 flex items-center gap-2 px-2 py-1.5 invisible" aria-hidden="true"> {/* Ghost */}
        <div className="w-7.5 h-7.5 shrink-0" />
        <div className="flex flex-col items-start leading-tight">
          <span className="text-xs">{user.name || "Ad Soyad"}</span>
          <span className="text-[8px] px-1.5 py-0.5">{user.email || "email"}</span>
        </div>
        <ChevronDown size={14} className="ml-auto" />
      </div>

      <div className={`absolute left-0 top-0 rounded-lg transition-all duration-200 ${open ? "bg-white shadow-2xl shadow-primary-500/20 ring-1 ring-black/5" : ""}`}>
        <button onClick={() => setOpen((prev) => !prev)} className="w-40 flex items-center gap-2 px-2 py-1.5 text-left">
          <div className="w-7.5 h-7.5 rounded-lg bg-secondary-500 text-primary-600 flex items-center justify-center text-xs font-semibold shrink-0">
            {initials}
          </div>
          <div className="flex flex-col items-start leading-tight min-w-0 flex-1">
            <span className={`text-xs font-light truncate w-full ${open ? "text-primary-600" : "text-white"}`}>{user.name || "Ad Soyad"}</span>
            <span className={`text-[8px] truncate w-full ${open ? "text-primary-600/40" : "text-neutral-400"}`}>{user.email || "email"}</span>
          </div>
          <ChevronDown size={14} className={`shrink-0 transition-transform duration-200 ${open ? "text-primary-600/40 rotate-180" : "text-neutral-400"}`}/>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div className="overflow-hidden" 
              initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              <motion.div className="flex flex-wrap items-center gap-1 px-2 pt-1 pb-2 border-b border-black/5"
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2, delay: 0.05 }}
              >
                {roles.map((role) => (
                  <span key={role} className="text-[8px] text-secondary-600 bg-primary-600/4 px-1.5 py-0.5 rounded-lg text-center w-full block">{role}</span>
                ))}
              </motion.div>

              {dropdownItems.map((item, i) => {
                if (item.type === "divider") {
                  return (
                    <motion.div key="divider" className="border-t border-black/5"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15, delay: 0.08 + i * 0.04 }}
                    />
                  );
                }

                if (item.type === "logout") {
                  return (
                    <motion.div key="logout"
                      initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2, delay: 0.08 + i * 0.04 }}
                    >
                      <button onClick={() => { setOpen(false); logout(); }} className="flex items-center gap-2 w-full px-2 py-2 text-[11px] text-red-700/70 hover:bg-red-50 transition-colors rounded-lg">
                        <LogOut size={13} className="text-red-700/50" />
                        <span>Çıkış Yap</span>
                      </button>
                    </motion.div>
                  );
                }

                return (
                  <motion.div key={item.label}
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2, delay: 0.08 + i * 0.04 }}
                  >
                    <Link href={item.href} onClick={() => setOpen(false)} className="flex items-center gap-2 px-2 py-2 text-[11px] text-primary-600 hover:bg-primary-600/3 transition-colors">
                      <item.icon size={13} className="text-primary-600/35" />
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}