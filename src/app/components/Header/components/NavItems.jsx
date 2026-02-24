"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

function hasCategories(children) {
  return children.length > 0 && children[0].category !== undefined;
}

const dropdownVariants = {
  hidden: { opacity: 0, y: -4, transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] } },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.18, ease: [0.25, 0.1, 0.25, 1] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.035, delayChildren: 0.06 } },
  exit: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] } },
  exit: { opacity: 0, y: 4, transition: { duration: 0.1 } },
};

function DropdownItem({ item, pathname }) {
  const Icon = item.icon;
  const isActive = pathname === item.href;

  return (
    <motion.div variants={staggerItem}>
      <Link href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg group transition-colors duration-200 ${isActive ? "bg-primary-500/5" : "hover:bg-primary-500/3"}`}>
        {Icon && (
          <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 ${isActive ? "bg-primary-500/10" : "bg-primary-500/4 group-hover:bg-primary-500/7"}`}>
            <Icon size={14} strokeWidth={1.5} className={`transition-colors duration-200 ${isActive ? "text-primary-500" : "text-primary-500/45 group-hover:text-primary-500/70"}`}/>
          </div>
        )}
        <div className="flex flex-col">
          <span className={`text-xs transition-colors duration-200 text-primary-500 ${isActive? "font-medium" : "font-normal group-hover:text-primary-500"}`}>
            {item.label}
          </span>
          {item.description && (
            <span className="text-[10px] text-primary-500/40 font-normal leading-tight mt-0.5">
              {item.description}
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

function SimpleDropdown({ children, pathname }) {
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" exit="exit" className="py-2 px-1 space-y-0.5">
      {children.map((item) => (
        <DropdownItem key={item.href} item={item} pathname={pathname} />
      ))}
    </motion.div>
  );
}

function CategorizedDropdown({ children, pathname }) {
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" exit="exit" className="flex py-2 px-1">
      {children.map((group, groupIndex) => (
        <motion.div key={group.category} variants={staggerItem} className={`flex-1 px-2 ${ groupIndex > 0 ? "border-l border-black/5" : ""}`}>
          <div className="px-3 pt-1 pb-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary-500/35">
              {group.category}
            </span>
          </div>
          <div className="space-y-0.5">
            {group.items.map((item) => (
              <DropdownItem key={item.href} item={item} pathname={pathname} />
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function NavItems({ item, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const timeoutRef = useRef(null);

  const isActive = item.basePath ? pathname.startsWith(item.basePath) : pathname === item.href;

  const openDropdown = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  }, []);

  const closeDropdown = useCallback(() => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 120);
  }, []);

  if (!item.children) {
    return (
      <Link href={item.href} className={`hidden xl:block text-xs tracking-wide font-light transition-colors ${isActive ? "text-white" : "text-white/80 hover:text-white"}`}>
        {children}
      </Link>
    );
  }

  const categorized = hasCategories(item.children);

  return (
    <div className="relative" onMouseEnter={openDropdown} onMouseLeave={closeDropdown}>
      <Link href={item.children[0]?.href || "#"} className={`flex items-center gap-0.5 text-xs tracking-wide font-light transition-colors ${isActive || isOpen ? "text-white" : "text-white/80 hover:text-white"}`}>
        {children}
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25, ease: "easeInOut" }}>
          <ChevronDown size={12} strokeWidth={1.5} className="text-white/60" />
        </motion.span>
      </Link>

      <AnimatePresence>
        {isOpen && (
          <motion.div variants={dropdownVariants} initial="hidden" animate="visible" exit="exit"
            className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50"
            style={{ width: categorized ? "auto" : "240px", minWidth: categorized ? `${item.children.length * 220}px` : undefined}}
          >
            <div className="bg-white rounded-xl shadow-[0_20px_60px_-15px_rgba(29,36,69,0.18),0_0_0_1px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="h-0.75 bg-secondary-400" />

              {categorized ? (
                <CategorizedDropdown children={item.children} pathname={pathname}/>
              ) : (
                <SimpleDropdown children={item.children} pathname={pathname}/>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}