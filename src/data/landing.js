import { Monitor, BookOpen, CalendarDays, Briefcase, Calendar, Scale, KeyRound, File } from "lucide-react";

export const quickLinks = [
  { label: "Öğrenci Bilgi Sistemi (OBS)", shortLabel: "OBS", icon: Monitor, href: "https://obs.yildiz.edu.tr/oibs/std/login.aspx", external: true },
  { label: "Akademik Takvim", shortLabel: "Takvim", icon: Calendar, href: "https://ogi.yildiz.edu.tr/akademik-takvim", external: true },
  { label: "Müfredat", shortLabel: "Müfredat", icon: BookOpen, href: "/egitim/mufredat" },
  { label: "Ders Programı", shortLabel: "Program", icon: CalendarDays, href: "/egitim/ders-programi" },
  { label: "Staj İşlemleri", shortLabel: "Staj", icon: Briefcase, href: "/egitim/staj" },
  { label: "Formlar / Belgeler", shortLabel: "Formlar", icon: File, href: "/egitim/formlar" },
  { label: "Yönetmelik ve Yönergeler", shortLabel: "Mevzuat", icon: Scale, href: "https://ogi.yildiz.edu.tr/iletisim/hizli-erisim/yonetmelik-ve-yonergeler", external: true },
  { label: "OBS Şifresi ve Öğrenci E-postası", shortLabel: "OBS Şifre", icon: KeyRound, href: "https://teknikdestek.yildiz.edu.tr/kb/index.php", external: true },
];

export const institutionalLinks = quickLinks.filter((link) => link.external);
