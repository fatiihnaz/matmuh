import { Monitor, BookOpen, ClipboardList, Briefcase, Calendar, FileText, Users, File } from "lucide-react";

export const quickLinks = [
  { label: "Öğrenci Bilgi Sistemi (OBS)", shortLabel: "OBS", icon: Monitor, href: "#" },
  { label: "Müfredat", shortLabel: "Müfredat", icon: BookOpen, href: "#" },
  { label: "Ders Kayıtları", shortLabel: "Kayıt", icon: ClipboardList, href: "#" },
  { label: "Staj İşlemleri", shortLabel: "Staj", icon: Briefcase, href: "#" },
  { label: "Akademik Takvim", shortLabel: "Takvim", icon: Calendar, href: "#" },
  { label: "Yönetmelik ve Yönergeler", shortLabel: "Mevzuat", icon: FileText, href: "#" },
  { label: "Öğrenci İşleri Daire Başkanlığı", shortLabel: "Öğr. İşleri", icon: Users, href: "#" },
  { label: "Formlar / Belgeler", shortLabel: "Formlar", icon: File, href: "#" },
];

export const news = [
  {
    date: "10 Şubat 2026",
    title: "Bölümüz Öğretim Üyesi Prof. Dr. Ayşe Demir, TÜBİTAK Bilim Ödülü'ne Layık Görüldü",
    description:
      "Stokastik analiz ve matematiksel modelleme alanındaki çalışmalarıyla tanınan Prof. Dr. Demir, ödülü törenle aldı.",
  },
  {
    date: "03 Şubat 2026",
    title: "Matematik Mühendisliği Bölümü Araştırma Merkezi Açıldı",
    description:
      "Yeni kurulan Uygulamalı Matematik ve Veri Bilimi Araştırma Merkezi hizmete girdi.",
  },
  {
    date: "25 Ocak 2026",
    title: "Öğrencilerimiz Uluslararası Matematik Yarışmasında Derece Aldı",
    description:
      "Bölümümüz lisans öğrencileri, Romanya'da düzenlenen yarışmada gümüş madalya kazandı.",
  },
];

export const seminars = [
  {
    day: "20",
    month: "ŞUB",
    title: "Sagopa Kajmer Şarkılarının Fourier Analizi",
    speaker: "Prof. Dr. Mehmet Kaya",
    time: "14:00",
    location: "SAM1",
  },
  {
    day: "25",
    month: "ŞUB",
    title: "Riemann Zeta Fonksiyonunun Özel Değerleri Üzerine",
    speaker: "Doç. Dr. Fatma Özkan",
    time: "15:30",
    location: "Zoom",
  },
  {
    day: "03",
    month: "MAR",
    title: "Veri Bilimi ve Makine Öğrenmesi",
    speaker: "Dr. Ali Yılmaz",
    time: "10:00",
    location: "Lab-3",
  },
];

export const announcements = [
  {
    day: "10",
    month: "ŞUB",
    title: "Kontenjan Artırımları Hk. (2025-2026 Bahar)",
  },
  {
    day: "4",
    month: "ŞUB",
    title: "2025-2026 Güz Yarıyılı Mezuniyet Sınav Programı",
  },
  {
    day: "2",
    month: "ŞUB",
    title: "Ders Grubu Bölme İşlemleri Hk. (2025-2026 Bahar)",
  },
  {
    day: "2",
    month: "ŞUB",
    title: "Başka Bölümlerden Ders Alınması Hk. (2025-2026 Bahar Yarıyılı)",
  },
  {
    day: "2",
    month: "ŞUB",
    title: "Çakışan Ders Seçimleri Hk. (2025-2026 Bahar Yarıyılı)",
  },
  {
    day: "29",
    month: "OCA",
    title: "2025-2026 Bahar Yarıyılı Lisans ve Lisansüstü Ders Programları",
  },
];
