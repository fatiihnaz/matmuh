"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Youtube, Search, Twitter, Menu, X } from "lucide-react";
import UserLogin from "./components/UserLogin";
import MobileNavbar from "./components/MobileNavbar";
import NavItems from "./components/NavItems";
import { navigationItems } from "@/app/data/navigation";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full relative">
      <div className="bg-primary-600">
        <div className="max-w-7xl mx-auto px-6 py-1 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-white transition-colors">
              <Facebook size={16} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-white transition-colors">
              <Instagram size={16} />
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-white transition-colors">
              <Twitter size={16} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-white transition-colors">
              <Linkedin size={16} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-white transition-colors">
              <Youtube size={16} />
            </a>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <a href="https://www.yildiz.edu.tr" target="_blank" rel="noopener noreferrer" className="text-secondary-500 hover:text-secondary-300 transition-colors">
              YTÜ Ana Site
            </a>
            <div className="w-px h-3 bg-neutral-600"></div>
            <div className="flex items-center gap-1.5 text-[11px] tracking-wide">
              <button className="text-white font hover:opacity-80 transition-opacity">
                TR
              </button>
              <span className="text-white/30 font-light">/</span>
              <button className="text-white/50 hover:text-white transition-colors">
                EN
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-0.5" style={{ background: "linear-gradient(to right, var(--color-primary-500) 0%, var(--color-secondary-500) 30%, var(--color-secondary-500) 70%, var(--color-primary-500) 100%)" }} />

      <div className="bg-primary-500">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <Link href="/" className="shrink-0 py-2">
            <Image src="/main-logo.svg" alt="YTÜ Matematik Mühendisliği Bölümü" width={400} height={54} className="h-10 w-auto" priority />
          </Link>

          <div className="flex items-center gap-6">
            <nav className="hidden lg:flex items-center gap-6">
              {navigationItems.map((item) => (
                <NavItems key={item.label} item={item}>
                  {item.label.toUpperCase()}
                </NavItems>
              ))}
            </nav>

            <button className="hidden lg:block text-neutral-400 hover:text-white transition-colors">
              <Search size={14} />
            </button>

            <div className="hidden lg:block w-[0.5px] h-6 bg-neutral-600"></div>

            <div className="hidden lg:block">
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