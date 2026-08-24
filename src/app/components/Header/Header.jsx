"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Menu, X } from "lucide-react";
import UserLogin from "./components/UserLogin";
import MobileNavbar from "./components/MobileNavbar";
import NavItems from "./components/NavItems";
import NavSearch from "./components/NavSearch";
import { navigationItems, DEPARTMENT_EMAIL, YTU_ANA_SITE } from "@/data/navigation";
import { useCmsBlock, useCmsRoute } from "inscribed";
import { useT } from "@/i18n/useT";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { locale, slug, localePath } = useCmsRoute();
  const t = useT();
  const { value: eposta } = useCmsBlock("footer.contact.email");
  const isHome = slug === "/";
  const epostaAdresi = eposta?.label || DEPARTMENT_EMAIL;
  const epostaBagi = eposta?.href || `mailto:${DEPARTMENT_EMAIL}`;

  return (
    <header className="w-full sticky top-0 z-50">
      <div className="hidden sm:block bg-primary-600">
        <div className="max-w-7xl mx-auto px-6 py-1 flex items-center justify-between">
          <a
            href={epostaBagi}
            className="flex items-center gap-2 text-xs text-neutral-300 hover:text-white transition-colors"
          >
            <Mail size={14} className="shrink-0 text-secondary-500" />
            {epostaAdresi}
          </a>

          <div className="flex items-center gap-3 text-xs">
            <a href={YTU_ANA_SITE} target="_blank" rel="noopener noreferrer" className="text-secondary-500 hover:text-secondary-300 transition-colors">
              YTÜ Ana Site
            </a>
            <div className="w-px h-3 bg-neutral-600"></div>
            <div className="flex items-center gap-1.5 text-[11px] tracking-wide">
              <Link href={localePath(slug, "tr")} className={locale === "tr" ? "text-white font hover:opacity-80 transition-opacity" : "text-white/50 hover:text-white transition-colors"}>
                TR
              </Link>
              <span className="text-white/30 font-light">/</span>
              <Link href={localePath(slug, "en")} className={locale === "en" ? "text-white hover:opacity-80 transition-opacity" : "text-white/50 hover:text-white transition-colors"}>
                EN
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-0.5" style={{ background: "linear-gradient(to right, var(--color-primary-500) 0%, var(--color-secondary-500) 30%, var(--color-secondary-500) 70%, var(--color-primary-500) 100%)" }} />

      <div className="bg-primary-500">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <Link href="/" className="shrink-0 py-2">
            <Image
              src={locale === "en" ? "/main-logo-en.svg" : "/main-logo.svg"}
              alt={
                locale === "en"
                  ? "YTU Department of Mathematical Engineering"
                  : "YTÜ Matematik Mühendisliği Bölümü"
              }
              width={400}
              height={54}
              className="h-8 sm:h-10 w-auto"
              priority
            />
          </Link>

          <div className="flex flex-1 items-center justify-end gap-2">
            {!searchOpen && (
              <motion.nav
                aria-label={t("Ana menü")}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="hidden lg:flex items-center gap-6"
              >
                {navigationItems.map((item) => (
                  <NavItems key={item.label} item={item}>
                    {t(item.label).toLocaleUpperCase(locale === "en" ? "en-US" : "tr-TR")}
                  </NavItems>
                ))}
              </motion.nav>
            )}

            {!isHome && (
              <NavSearch
                open={searchOpen}
                onOpen={() => setSearchOpen(true)}
                onClose={() => setSearchOpen(false)}
              />
            )}

            <div className="hidden lg:block w-[0.5px] h-6 bg-neutral-600"></div>

            <div className="hidden sm:block">
              <UserLogin />
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-neutral-400 hover:text-white transition-colors">
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>
      <MobileNavbar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
}