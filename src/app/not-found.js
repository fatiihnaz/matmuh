import Link from "next/link";
import { Home, Bell, GraduationCap } from "lucide-react";

import { UndefinedPlot } from "./components/MathPlot";

export const metadata = {
  title: "Sayfa bulunamadı",
};

const KISAYOLLAR = [
  { href: "/", label: "Anasayfa", icon: Home },
  { href: "/duyurular", label: "Duyurular", icon: Bell },
  { href: "/egitim/mufredat", label: "Müfredat", icon: GraduationCap },
];

export default function NotFound() {
  return (
    <div className="w-full flex-1 py-20">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="relative mx-auto flex w-fit items-center justify-center">
          <UndefinedPlot />
          <span className="absolute font-mono text-4xl font-bold tracking-tight text-primary-500 [text-shadow:0_0_18px_var(--color-background)]">
            1/0
          </span>
        </div>

        <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-primary-500/70">
          404
        </p>

        <h1 className="mt-2 text-xl font-semibold text-primary-500">Sayfa bulunamadı</h1>

        <p className="mt-3 text-[13px] text-primary-500/70 leading-relaxed">
          Sıfıra bölmek gibi: aradığınız adresin bir karşılığı yok. Sayfa taşınmış,
          adı değişmiş ya da hiç var olmamış olabilir.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {KISAYOLLAR.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 rounded-lg border border-primary-500/10 bg-white px-4 py-2 text-[13px] font-medium text-primary-500/70 shadow-xs transition-colors hover:border-primary-500/20 hover:text-primary-500"
            >
              <Icon size={14} className="text-secondary-700" />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
