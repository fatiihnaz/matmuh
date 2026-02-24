import {
  Info, Users, Handshake, GraduationCap, Shield, BookUser, Microscope, Briefcase,
  CalendarDays, BookOpen, Scale, Library, Archive, FlaskConical, FolderOpen, Globe, Factory, ClipboardList,
} from "lucide-react";

export const navigationItems = [
  { label: "Anasayfa", href: "/" },
  {
    label: "Bölüm",
    basePath: "/bolum",
    children: [
      { label: "Hakkımızda", href: "/bolum/hakkinda", icon: Info, description: "Bölüm tanıtımı ve tarihçe" },
      { label: "Yönetim & Kurullar", href: "/bolum/yonetim-kurullar", icon: Users, description: "Bölüm yönetimi ve kurulları" },
      { label: "Komisyonlar", href: "/bolum/komisyonlar", icon: BookUser, description: "Akademik komisyonlar" },
      { label: "Paydaşlar", href: "/bolum/paydaslar", icon: Handshake, description: "Sektör ve akademik ortaklar" },
      { label: "Mezunlar", href: "/bolum/mezunlar", icon: GraduationCap, description: "Mezun ağı ve iletişim" },
    ],
  },
  {
    label: "Personel",
    basePath: "/personel",
    children: [
      { label: "Yönetim", href: "/personel/yonetim", icon: Shield, description: "Bölüm başkanlığı" },
      { label: "Akademik Kadro", href: "/personel/akademik-kadro", icon: GraduationCap, description: "Profesör ve doçentler" },
      { label: "Öğretim & Araştırma Gör.", href: "/personel/ogretim-arastirma", icon: Microscope, description: "Araştırma görevlileri" },
      { label: "İdari Personel", href: "/personel/idari-personel", icon: Briefcase, description: "İdari kadro" },
    ],
  },
  {
    label: "Eğitim",
    basePath: "/egitim",
    children: [
      {
        category: "Lisans",
        items: [
          { label: "Ders Programı", href: "/egitim/ders-programi", icon: CalendarDays, description: "Haftalık ders programı" },
          { label: "Müfredat", href: "/egitim/mufredat", icon: BookOpen, description: "Ders içerikleri ve krediler" },
          { label: "Yönetmelikler", href: "/egitim/yonetmelikler", icon: Scale, description: "Lisans yönetmelikleri" },
        ],
      },
      {
        category: "Lisansüstü",
        items: [
          { label: "Programlar", href: "/egitim/programlar", icon: Library, description: "Yüksek lisans ve doktora" },
          { label: "Tez Arşivi", href: "/egitim/tez-arsivi", icon: Archive, description: "Tamamlanmış tezler" },
          { label: "Yönetmelikler", href: "/egitim/lisansustu-yonetmelikler", icon: Scale, description: "Lisansüstü yönetmelikleri" },
        ],
      },
      {
        category: "Staj",
        items: [
          { label: "Staj İşlemleri & Evraklar", href: "/egitim/staj", icon: ClipboardList, description: "Staj başvuru ve belgeleri" },
        ],
      },
    ],
  },
  {
    label: "Ar-Ge",
    basePath: "/arge",
    children: [
      { label: "Laboratuvarlar", href: "/arge/laboratuvarlar", icon: FlaskConical, description: "Araştırma laboratuvarları" },
      { label: "Devam Eden Projeler", href: "/arge/projeler", icon: FolderOpen, description: "Aktif araştırma projeleri" },
      { label: "Bilgi Kaynakları", href: "/arge/bilgi-kaynaklari", icon: Library, description: "e-Kütüphane ve kaynaklar" },
    ],
  },
  {
    label: "Dış İlişkiler",
    basePath: "/dis-iliskiler",
    children: [
      { label: "Erasmus+ (Uluslararası)", href: "/dis-iliskiler/erasmus", icon: Globe, description: "Değişim programları" },
      { label: "Endüstriyel İşbirlikleri", href: "/dis-iliskiler/endustriyel", icon: Factory, description: "Sanayi ortaklıkları" },
    ],
  },
];