import {
  Info, Users, GraduationCap, Shield, BookUser, Microscope, Briefcase,
  CalendarDays, BookOpen, Scale, Library, Archive, FlaskConical, FolderOpen, Globe, ClipboardList, Sun, FileStack,
} from "lucide-react";
export const YTU_ANA_SITE = "https://www.yildiz.edu.tr";

export const BOLOGNA_CATALOG = "https://bologna.yildiz.edu.tr";
export const DEPARTMENT_EMAIL = "mtmblm@yildiz.edu.tr";
export const navigationItems = [
  { label: "Anasayfa", href: "/" },
  {
    label: "Bölüm",
    basePath: "/bolum",
    children: [
      { label: "Hakkımızda", href: "/bolum/hakkinda", icon: Info, description: "Bölüm tanıtımı ve tarihçe" },
      { label: "Yönetim & Kurullar", href: "/bolum/yonetim-kurullar", icon: Users, description: "Bölüm yönetimi ve kurulları" },
      { label: "Komisyonlar", href: "/bolum/komisyonlar", icon: BookUser, description: "Akademik komisyonlar" },
      { label: "Mezunlar", href: "https://mezun.yildiz.edu.tr/", icon: GraduationCap, description: "Mezunlar Koordinatörlüğü", external: true },
    ],
  },
  {
    label: "Personel",
    href: "/personel",
    basePath: "/personel",
    children: [
    { label: "Yönetim", href: "/personel?type=yonetim", icon: Shield, description: "Bölüm başkanlığı" },
    { label: "Akademik Kadro", href: "/personel?type=akademik", icon: GraduationCap, description: "Profesör ve doçentler"
    },
    { label: "Öğretim & Araştırma Gör.", href: "/personel?type=arastirma", icon: Microscope, description: "Araştırma görevlileri"
    },
    { label: "İdari Personel", href: "/personel?type=idari", icon: Briefcase, description: "İdari kadro" },
  ],
  },
  {
    label: "Eğitim",
    basePath: "/egitim",
    href: "/egitim/mufredat",
    children: [
      {
        category: "Lisans",
        items: [
          { label: "Müfredat", href: "/egitim/mufredat", icon: BookOpen, description: "Ders içerikleri ve krediler" },
          { label: "Ders Programı", href: "/egitim/ders-programi", icon: CalendarDays, description: "Haftalık ders programı" },
          { label: "Yaz Okulu", href: "/egitim/yaz-okulu", icon: Sun, description: "Başka üniversiteden ders alma" },
          { label: "Yönetmelikler", href: "https://ogi.yildiz.edu.tr/iletisim/hizli-erisim/yonetmelik-ve-yonergeler", icon: Scale, description: "Lisans yönetmelikleri", external: true },
        ],
      },
      {
        category: "Lisansüstü",
        items: [
          { label: "Ders Programı", href: "/egitim/lisansustu-ders-programi", icon: CalendarDays, description: "Haftalık ders programı" },
          { label: "Programlar", href: "/egitim/programlar", icon: Library, description: "Yüksek lisans ve doktora" },
          { label: "Tez Arşivi", href: "https://tez.yok.gov.tr/UlusalTezMerkezi/", icon: Archive, description: "YÖK Ulusal Tez Merkezi", external: true },
          { label: "Yönetmelikler", href: "https://fbe.yildiz.edu.tr/mevzuat", icon: Scale, description: "Lisansüstü yönetmelikleri", external: true },
        ],
      },
      {
        category: "Staj & Belgeler",
        items: [
          { label: "Staj İşlemleri & Evraklar", href: "/egitim/staj", icon: ClipboardList, description: "Staj başvuru ve belgeleri" },
          { label: "Formlar / Belgeler", href: "/egitim/formlar", icon: FileStack, description: "Öğrenci ve personel formları" },
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
    ],
  },
];
