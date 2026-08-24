"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, MotionConfig, useReducedMotion } from "framer-motion";
import { Search, ChevronUp, LogIn, LogOut, ExternalLink, ClipboardCheck, PencilLine, FileText, CalendarDays } from "lucide-react";
import { navigationItems, YTU_ANA_SITE } from "@/data/navigation";
import { useAuth } from "@/lib/auth";
import SearchOverlay from "@/app/components/Search/SearchOverlay";
import ProfilePanel from "@/app/components/Profile/ProfilePanel";
import { useCmsEditing } from "@/app/lib/cms-provider.jsx";
import { useT } from "@/i18n/useT";
import { useCmsRoute } from "inscribed";

const ROLE_LABELS = {
  ROLE_ADMIN: "Admin",
  ROLE_EDITOR: "Editör",
  ROLE_USER: "Öğrenci",
};

function hasCategories(children) {
  return children.length > 0 && children[0].category !== undefined;
}

function flattenChildren(children) {
  if (!hasCategories(children)) return children;
  const flat = [];
  children.forEach((group) => {
    flat.push({ type: "category", label: group.category });
    group.items.forEach((item) => flat.push({ type: "link", ...item }));
  });
  return flat;
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04, delayChildren: 0.05 },
  },
  exit: {
    transition: { staggerChildren: 0.02, staggerDirection: -1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, x: -8, transition: { duration: 0.12 } },
};

function AccordionSection({ item, onNavigate, pathname }) {
  const t = useT();
  const [isOpen, setIsOpen] = useState(false);
  const reduce = useReducedMotion();

  const isActive = item.children
    ? pathname.startsWith(item.basePath)
    : pathname === item.href;

  if (!item.children) {
    return (
      <Link href={item.href} onClick={onNavigate} className={`block font-medium text-base py-4 ${isActive ? "text-secondary-500" : "text-white"}`}>
        {t(item.label)}
      </Link>
    );
  }

  const flatItems = flattenChildren(item.children);

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between py-4">
        <span className={isActive ? "text-secondary-500 font-medium" : "text-white/80 font-light"}>{t(item.label)}</span>
        <motion.span animate={{ rotate: isOpen ? 0 : 180 }} transition={{ duration: 0.25, ease: "easeInOut" }}>
          <ChevronUp size={18} className="text-neutral-500" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: reduce ? 0 : 0.3, ease: [0.25, 0.1, 0.25, 1] }} className="overflow-hidden">
            <div className="relative pl-6 pb-2">
              <motion.div className="absolute left-0 top-0 bottom-2 w-px bg-white/10" initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }} exit={{ scaleY: 0 }} transition={{ duration: 0.4, ease: "easeOut" }}
                style={{ originY: 0 }}
              />
              <motion.div variants={staggerContainer} initial="hidden" animate="visible" exit="exit" className="space-y-1">
                {flatItems.map((child, i) =>
                  child.type === "category" ? (
                    <motion.div key={child.label} variants={staggerItem} className="pt-2 pb-1">
                      <span className="text-secondary-500 text-[11px] font-semibold uppercase tracking-wider">
                        {t(child.label)}
                      </span>
                    </motion.div>
                  ) : (
                    <motion.div key={child.href || i} variants={staggerItem}>
                      <Link href={child.href} onClick={onNavigate}
                        className={`block text-sm py-1.5 transition-colors ${pathname === child.href ? "text-white font-medium" : "text-neutral-400 font-light hover:text-white"}`}
                      >
                        {t(child.label)}
                      </Link>
                    </motion.div>
                  )
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function MobileNavbar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, signIn, signOut } = useAuth();
  const { canEdit, editing, setEditing } = useCmsEditing();
  const t = useT();
  const [panel, setPanel] = useState(null);
  const { locale, slug, localePath } = useCmsRoute();
  const reduce = useReducedMotion();
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const { body } = document;
    const previous = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = previous;
    };
  }, [isOpen]);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "--";
  const roles = (user?.authorities ?? []).map((a) => t(ROLE_LABELS[a] ?? a));
  const isAdmin = Boolean(user?.authorities?.includes("ROLE_ADMIN"));

  return (
    <MotionConfig reducedMotion="user">
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: reduce ? 0 : 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute top-full left-0 right-0 h-[calc(100dvh-100%)] bg-primary-500 -mt-px flex flex-col lg:hidden"
        >
          <div className="flex-1 overflow-y-auto px-6 pt-2 pb-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, delay: 0.15 }}>
              {navigationItems.map((item) => (
                <AccordionSection key={item.label} item={item} onNavigate={onClose} pathname={pathname} />
              ))}
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} className="shrink-0 px-6 pb-6 pt-3 space-y-2.5 border-t border-white/5"
            animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3, delay: 0.2 }}
          >
            {!searchOpen && (
              <motion.button
                type="button"
                layoutId="mm-arama-kutusu"
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setSearchOpen(true)}
                className="relative flex w-full items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-neutral-500 transition-colors hover:border-white/20"
              >
                <Search size={16} className="shrink-0" />
                {t("Ara...")}
              </motion.button>
            )}

            <div className="block sm:hidden space-y-2.5">
              <div className="-mx-6 border-t border-white/10" />

              <div className="flex items-center justify-between gap-3 text-[11px]">
                <div className="flex items-center gap-1.5 tracking-wide">
                  <Link href={localePath(slug, "tr")} onClick={onClose} className={locale === "tr" ? "text-white" : "text-white/40 hover:text-white transition-colors"}>
                    TR
                  </Link>
                  <span className="text-white/25 font-light">/</span>
                  <Link href={localePath(slug, "en")} onClick={onClose} className={locale === "en" ? "text-white" : "text-white/40 hover:text-white transition-colors"}>
                    EN
                  </Link>
                </div>

                <a href={YTU_ANA_SITE} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-secondary-500 transition-colors"
                >
                  YTÜ Ana Site
                  <ExternalLink size={11} />
                </a>
              </div>

              <div className="-mx-6 border-t border-white/10" />

              {isLoading ? (
                <div className="flex items-center justify-center py-3">
                  <div className="w-4 h-4 border-2 border-secondary-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : isAuthenticated ? (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 rounded-lg py-2">
                    <div className="w-9 h-9 rounded-lg bg-secondary-500 text-primary-600 flex items-center justify-center text-sm font-semibold shrink-0">
                      {initials}
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-white font-light truncate">{user?.name}</span>
                        {roles.map((role) => (
                          <span key={role} className="text-[9px] text-secondary-500/80 bg-secondary-500/10 px-2 py-px rounded-md shrink-0">
                            {role}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-neutral-400 truncate">{user?.email}</span>
                    </div>
                  </div>

                  <div className="-mx-6 border-t border-white/10" />

                  {[
                    { id: "notes", label: t("Notlarım"), icon: FileText },
                    { id: "schedule", label: t("Ders Programım"), icon: CalendarDays },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        onClose();
                        setPanel(id);
                      }}
                      className="flex items-center gap-3 w-full py-2.5 text-sm text-neutral-300 hover:text-white transition-colors"
                    >
                      <Icon size={16} className="shrink-0 text-secondary-500" />
                      <span className="flex-1 text-left">{label}</span>
                    </button>
                  ))}

                  {(canEdit || isAdmin) && (
                    <>
                      <div className="-mx-6 border-t border-white/10" />
                      <span className="block pt-1 text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
                        {t("Yönetim")}
                      </span>

                      {isAdmin && (
                        <Link
                          href="/yonetim/ders-notlari"
                          onClick={onClose}
                          className="flex items-center gap-3 w-full py-2.5 text-sm text-neutral-300 hover:text-white transition-colors"
                        >
                          <ClipboardCheck size={16} className="shrink-0 text-secondary-500" />
                          <span className="flex-1 text-left">{t("Not Yönetimi")}</span>
                        </Link>
                      )}

                      {canEdit && (
                        <button
                          type="button"
                          role="switch"
                          aria-checked={editing}
                          onClick={() => setEditing(!editing)}
                          className="flex items-center gap-3 w-full py-2.5 text-sm text-neutral-300 hover:text-white transition-colors"
                        >
                          <PencilLine size={16} className="shrink-0 text-secondary-500" />
                          <span className="flex-1 text-left">{t("Düzenleme modu")}</span>
                          <span
                            className={`relative h-4 w-7 shrink-0 rounded-full transition-colors ${
                              editing ? "bg-secondary-500" : "bg-white/15"
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
                    </>
                  )}

                  <div className="-mx-6 border-t border-white/10" />

                  <button onClick={() => { onClose(); signOut(); }}
                    className="flex items-center justify-center gap-2 w-full text-red-400/80 hover:text-red-300 text-sm py-2.5 rounded-lg bg-red-100/5 border border-white/10 hover:border-red-200/30 transition-colors"
                  >
                    <LogOut size={16} />
                    {t("Çıkış Yap")}
                  </button>
                </div>
              ) : (
                <button onClick={() => signIn()}
                  className="flex items-center justify-center gap-2 w-full bg-secondary-500/10 text-secondary-500 font-medium text-sm py-3 rounded-lg border border-secondary-500/30 hover:border-secondary-500/60 transition-colors"
                >
                  <LogIn size={16} />
                  {t("Öğrenci Girişi")}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    <ProfilePanel view={panel} onClose={() => setPanel(null)} />

    <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} fullScreen layoutId="mm-arama-kutusu" />
    </MotionConfig>
  );
}