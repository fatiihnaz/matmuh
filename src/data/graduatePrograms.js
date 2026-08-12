const BOLOGNA_AID_ABD = 86;
const BOLOGNA_AID_BOLUM = 24;

function bolognaProgramUrl(id, aid) {
  return `https://bologna.yildiz.edu.tr/index.php?r=program/view&id=${id}&aid=${aid}`;
}

export const GRADUATE_PROGRAMS = [
  {
    id: "tezli-yl",
    title: "Tezli Yüksek Lisans",
    duration: "2 yıl (4 yarıyıl)",
    akts: "120 AKTS",
    description:
      "Temel ve uygulamalı matematik bilgisiyle, öğrencinin bilimsel araştırma yaparak bilgiye erişme, bilgiyi değerlendirme ve yorumlama yeteneğini kazanmasını sağlamaktır.",
    tracks: [
      { label: "Türkçe", href: bolognaProgramUrl(180, BOLOGNA_AID_ABD) },
      { label: "İngilizce", href: bolognaProgramUrl(181, BOLOGNA_AID_ABD) },
    ],
  },
  {
    id: "tezsiz-yl",
    title: "Tezsiz Yüksek Lisans (2. Öğretim)",
    duration: "1 yıl",
    akts: "92,5 AKTS",
    description:
      "Disiplinlerarası bir program olarak kurulması hedeflenen Matematik Mühendisliği 2. Öğretim Tezsiz Yüksek Lisans Programı, farklı disiplinlerden gelen profesyonellerin mühendislik, ekonomi, bilişim ve hizmet sektörlerinde etkin rol alabilmesini hedefler.",
    tracks: [
      { label: "Türkçe", href: bolognaProgramUrl(224, BOLOGNA_AID_ABD) },
      { label: "İngilizce", href: bolognaProgramUrl(225, BOLOGNA_AID_ABD) },
    ],
  },
  {
    id: "doktora",
    title: "Doktora",
    duration: "4 yıl (8 yarıyıl)",
    akts: "240 AKTS",
    description:
      "Öğrenciye bağımsız araştırma yapma, bilimsel olayları geniş ve derin bir bakış açısıyla irdeleyerek yorum yapabilme ve yeni sentezlere ulaşmak için gerekli adımları belirleme yeteneği kazandırmaktır.",
    tracks: [
      { label: "Türkçe", href: bolognaProgramUrl(184, BOLOGNA_AID_BOLUM) },
      { label: "İngilizce", href: bolognaProgramUrl(226, BOLOGNA_AID_BOLUM) },
    ],
    admission: {
      minAlesQuantitative: 55,
      minLanguageScore: 55,
      relatedFields: ["Bilgisayar Mühendisliği", "Endüstri Mühendisliği", "Matematik Mühendisliği"],
    },
  },
];

export const FBE_LINKS = [
  { label: "FBE Lisansüstü Programlar", href: "https://fbe.yildiz.edu.tr/lisansustu-programlar" },
  { label: "Program İletişim Bilgileri", href: "https://fbe.yildiz.edu.tr/iletisim/program-iletisim-bilgileri" },
];
