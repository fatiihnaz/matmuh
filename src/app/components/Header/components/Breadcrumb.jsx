"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

const labelMap = {
  "": "Anasayfa",
  "bolum": "Bölüm",
  "personel": "Personel",
  "egitim": "Eğitim",
  "arge": "AR-GE",
  "dis-iliskiler": "Dış İlişkiler",
  "akademik-kadro": "Akademik Kadro",
};

export default function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = [
    { label: "Anasayfa", href: "/" },
    ...segments.map((seg, i) => ({
      label: labelMap[seg] || seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " "),
      href: "/" + segments.slice(0, i + 1).join("/"),
    })),
  ];

  return (
    <nav className="flex items-center gap-2 text-xs">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={crumb.href} className="flex items-center gap-2">
            {i > 0 && <ChevronRight size={12} className="text-neutral-500" />}
            {isLast ? (
              <span className="text-secondary-400 font-medium">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="text-neutral-400 hover:text-white transition-colors">
                {crumb.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}