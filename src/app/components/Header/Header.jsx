"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Youtube, Search, Twitter } from "lucide-react";
import UserLogin from "./UserLogin";

const navItems = [
  { label: "ANASAYFA", href: "/" },
  { label: "BÖLÜM", href: "/bolum" },
  { label: "PERSONEL", href: "/personel" },
  { label: "EĞİTİM", href: "/egitim" },
  { label: "AR-GE", href: "/arge" },
  { label: "DIŞ İLİŞKİLER", href: "/dis-iliskiler" },
];

export default function Header() {
  return (
    <header className="w-full">
      <div className="bg-primary-600 border-b-2 border-secondary-500">
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
            <button className="text-white border border-white/40 px-3 py-0.5 rounded text-[10px] font-medium hover:bg-white/10 transition-colors">
              TR
            </button>
          </div>
        </div>
      </div>

      <div className="bg-primary-500">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <Link href="/" className="shrink-0">
            <Image src="/logo.png" alt="YTÜ Matematik Mühendisliği Bölümü" width={400} height={54} className="h-16 w-auto" priority/>
          </Link>

          <div className="flex items-center gap-6">
            <nav className="hidden lg:flex items-center gap-6">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="text-white text-sm tracking-wide font-light hover:text-secondary-500 transition-colors">
                  {item.label}
                </Link>
              ))}
            </nav>

            <button className="text-neutral-400 hover:text-white transition-colors">
              <Search size={14} />
            </button>

            <div className="w-[0.5px] h-6 bg-neutral-600"></div>

            <UserLogin />
          </div>
        </div>
      </div>
    </header>
  );
}