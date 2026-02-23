import {
  Info, Users, UsersRound, Handshake, GraduationCap, Shield, BookUser, Microscope, Briefcase,
  CalendarDays, BookOpen, Scale, Library, Archive, FileCheck, FlaskConical, FolderOpen, Database,
  Globe, Factory,
} from "lucide-react";

export const navigationItems = [
  { label: "Anasayfa", href: "/" },
  {
    label: "Bölüm",
    basePath: "/bolum",
    children: [
      { label: "Hakkımızda", href: "/bolum", icon: Info },
      { label: "Yönetim & Kurullar", href: "/bolum/yonetim-kurullar", icon: Users },
      { label: "Komisyonlar", href: "/bolum/komisyonlar", icon: UsersRound },
      { label: "Paydaşlar", href: "/bolum/paydaslar", icon: Handshake },
      { label: "Mezunlar", href: "/bolum/mezunlar", icon: GraduationCap },
    ],
  },
  {
    label: "Personel",
    basePath: "/personel",
    children: [
      { label: "Yönetim", href: "/personel/yonetim", icon: Shield },
      { label: "Akademik Kadro", href: "/personel/akademik-kadro", icon: BookUser },
      { label: "Öğretim & Araştırma Gör.", href: "/personel/ogretim-arastirma", icon: Microscope },
      { label: "İdari Personel", href: "/personel/idari-personel", icon: Briefcase },
    ],
  },
  {
    label: "Eğitim",
    basePath: "/egitim",
    children: [
      {
        category: "Lisans",
        items: [
          { label: "Ders Programı", href: "/egitim/ders-programi", icon: CalendarDays },
          { label: "Müfredat", href: "/egitim/mufredat", icon: BookOpen },
          { label: "Yönetmelikler", href: "/egitim/yonetmelikler", icon: Scale },
        ],
      },
      {
        category: "Lisansüstü",
        items: [
          { label: "Programlar", href: "/egitim/programlar", icon: Library },
          { label: "Tez Arşivi", href: "/egitim/tez-arsivi", icon: Archive },
          { label: "Yönetmelikler", href: "/egitim/lisansustu-yonetmelikler", icon: Scale },
        ],
      },
      {
        category: "Staj",
        items: [
          { label: "Staj İşlemleri & Evraklar", href: "/egitim/staj", icon: FileCheck },
        ],
      },
    ],
  },
  {
    label: "Ar-Ge",
    basePath: "/arge",
    children: [
      { label: "Laboratuvarlar", href: "/arge/laboratuvarlar", icon: FlaskConical },
      { label: "Devam Eden Projeler", href: "/arge/projeler", icon: FolderOpen },
      { label: "Bilgi Kaynakları", href: "/arge/bilgi-kaynaklari", icon: Database },
    ],
  },
  {
    label: "Dış İlişkiler",
    basePath: "/dis-iliskiler",
    children: [
      { label: "Erasmus+ (Uluslararası)", href: "/dis-iliskiler/erasmus", icon: Globe },
      { label: "Endüstriyel İşbirlikleri", href: "/dis-iliskiler/endustriyel", icon: Factory },
    ],
  },
];