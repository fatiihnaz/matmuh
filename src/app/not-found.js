import Link from "next/link";
import { Home, Bell, GraduationCap } from "lucide-react";

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
        <p className="font-mono text-5xl font-bold text-primary-500/15 tracking-tight">404</p>

        <h1 className="mt-4 text-xl font-semibold text-primary-500">Sayfa bulunamadı</h1>

        <p className="mt-3 text-[13px] text-primary-500/60 leading-relaxed">
          Aradığınız sayfa taşınmış, adı değişmiş ya da hiç var olmamış olabilir.
          Bağlantı bir duyuruya aitse duyuru kaldırılmış olabilir.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {KISAYOLLAR.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 rounded-lg border border-primary-500/10 bg-white px-4 py-2 text-[13px] font-medium text-primary-500/70 shadow-xs transition-colors hover:border-primary-500/20 hover:text-primary-500"
            >
              <Icon size={14} className="text-secondary-500" />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
