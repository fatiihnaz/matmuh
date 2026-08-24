"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { useT } from "@/i18n/useT";
import { useLocaleNav } from "@/i18n/useLocaleNav";

const labelMap = {
  "": "Anasayfa",
  bolum: "Bölüm",
  hakkinda: "Hakkımızda",
  "yonetim-kurullar": "Yönetim & Kurullar",
  komisyonlar: "Komisyonlar",
  paydaslar: "Paydaşlar",
  mezunlar: "Mezunlar",
  personel: "Personel",
  "akademik-kadro": "Akademik Kadro",
  egitim: "Eğitim",
  "ders-programi": "Ders Programı",
  mufredat: "Müfredat",
  yonetmelikler: "Yönetmelikler",
  "lisansustu-ders-programi": "Lisansüstü Ders Programı",
  programlar: "Programlar",
  "tez-arsivi": "Tez Arşivi",
  "lisansustu-yonetmelikler": "Lisansüstü Yönetmelikler",
  staj: "Staj",
  arge: "AR-GE",
  laboratuvarlar: "Laboratuvarlar",
  projeler: "Devam Eden Projeler",
  "bilgi-kaynaklari": "Bilgi Kaynakları",
  "dis-iliskiler": "Dış İlişkiler",
  erasmus: "Erasmus+",
  endustriyel: "Endüstriyel İşbirlikleri",
  duyurular: "Duyurular",
  haberler: "Haberler",
  yonetim: "Yönetim",
  "ders-notlari": "Not Yönetimi",
};

const unclickablePaths = [
  "yonetim",
  "bolum",
  "personel",
  "egitim",
  "arge",
  "dis-iliskiler",
];

function formatSegmentLabel(seg) {
  if (labelMap[seg]) return labelMap[seg];
  if (/^[a-zA-Z]{3,4}\d{4}$/i.test(seg)) return seg.toUpperCase();
  return seg
    .split("-")
    .map((word) =>
      word
        ? word.charAt(0).toLocaleUpperCase("tr-TR") +
          word.slice(1).toLocaleLowerCase("tr-TR")
        : "",
    )
    .join(" ");
}

export default function Breadcrumb({ lastLabel }) {
  const { href, path } = useLocaleNav();
  const t = useT();
  const segments = path.split("/").filter(Boolean);

  const crumbs = [
    { label: t("Anasayfa"), href: href("/") },
    ...segments.map((seg, i) => ({
      label:
        lastLabel && i === segments.length - 1 ? lastLabel : t(formatSegmentLabel(seg)),
      href: href("/" + segments.slice(0, i + 1).join("/")),
      isClickable: !unclickablePaths.includes(seg),
    })),
  ];

  return (
    <nav aria-label={t("Sayfa yolu")} className="flex items-center gap-2 text-xs min-w-0">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span
            key={crumb.href}
            className={`flex items-center gap-2 ${isLast ? "min-w-0" : "shrink-0"}`}
          >
            {i > 0 && <ChevronRight size={12} className="shrink-0 text-neutral-500" />}
            {isLast ? (
              <span className="text-secondary-400 font-medium truncate">
                {crumb.label}
              </span>
            ) : crumb.isClickable ? (
              <Link
                href={crumb.href}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="text-neutral-400">{crumb.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
