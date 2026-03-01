import Link from "next/link";
import MainCard from "./MainCard";
import { quickLinks } from "@/data/landing";

export default function QuickLinks() {
  return (
    <>
      <div className="lg:hidden bg-white rounded-xl shadow-sm p-4 -mt-12">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 justify-center">
          {quickLinks.map((link) => (
            <Link key={link.label} href={link.href} className="flex flex-col items-center gap-2 min-w-18 shrink-0 group">
              <div className="w-10 h-10 rounded-xl bg-secondary-500/8 hover:bg-secondary-600/10 flex items-center justify-center">
                <link.icon className="w-4.5 h-4.5 text-secondary-500 group-hover:text-secondary-600" />
              </div>
              <span className="text-[9px] text-primary-500/50 text-center group-hover:text-primary-500 leading-tight">
                {link.shortLabel}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="hidden lg:block">
        <MainCard title="Hızlı Erişim">
          <nav className="space-y-1">
            {quickLinks.map((link) => (
              <Link key={link.label} href={link.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] text-primary-500 hover:bg-gray-50 transition-colors"
              >
                <link.icon className="w-4 h-4 text-primary-500/60" />
                {link.label}
              </Link>
            ))}
          </nav>
        </MainCard>
      </div>
    </>
  );
}
