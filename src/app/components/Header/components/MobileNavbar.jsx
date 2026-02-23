"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronUp, LogIn } from "lucide-react";
import { navigationItems } from "@/app/data/navigation";

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
  const [isOpen, setIsOpen] = useState(false);

  const isActive = item.children
    ? pathname.startsWith(item.basePath)
    : pathname === item.href;

  if (!item.children) {
    return (
      <Link href={item.href} onClick={onNavigate} className={`block font-medium text-base py-4 ${isActive ? "text-secondary-500" : "text-white"}`}>
        {item.label}
      </Link>
    );
  }

  const flatItems = flattenChildren(item.children);

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between py-4">
        <span className={isActive ? "text-secondary-500 font-medium" : "text-white/80 font-light"}>{item.label}</span>
        <motion.span animate={{ rotate: isOpen ? 0 : 180 }} transition={{ duration: 0.25, ease: "easeInOut" }}>
          <ChevronUp size={18} className="text-neutral-500" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }} className="overflow-hidden">
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
                        {child.label}
                      </span>
                    </motion.div>
                  ) : (
                    <motion.div key={child.href || i} variants={staggerItem}>
                      <Link href={child.href} onClick={onNavigate}
                        className={`block text-sm py-1.5 transition-colors ${pathname === child.href ? "text-white font-medium" : "text-neutral-400 font-light hover:text-white"}`}
                      >
                        {child.label}
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute top-full left-0 right-0 h-[calc(100dvh-100%)] bg-primary-500 -mt-px flex flex-col lg:hidden"
        >
          <div className="flex-1 overflow-y-auto px-6 pt-2 pb-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, delay: 0.15 }}>
              {navigationItems.map((item) => (
                <AccordionSection key={item.label} item={item} onNavigate={onClose} pathname={pathname}/>
              ))}
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} className="shrink-0 px-6 pb-6 pt-3 space-y-3 border-t border-white/5"
            animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input type="text" placeholder="Ara..."
                className="w-full bg-primary-600 text-white text-sm pl-10 pr-4 py-2.5 rounded-lg border border-white/10 placeholder:text-neutral-500 focus:outline-none focus:border-secondary-500 transition-colors"
              />
            </div>
            <Link href="/giris" onClick={onClose}
              className="flex items-center justify-center gap-2 w-full bg-secondary-500 text-primary-700 font-semibold text-sm py-3 rounded-lg hover:bg-secondary-400 transition-colors"
            >
              <LogIn size={16} />
              Öğrenci Girişi
            </Link>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}