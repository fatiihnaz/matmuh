export const SUMMER_TERM = "2025-2026";

export const CREDIT_LIMIT = 9;

export const PARTNER_UNIVERSITIES = [
  "İstanbul Teknik Üniversitesi",
  "Orta Doğu Teknik Üniversitesi",
  "Boğaziçi Üniversitesi",
  "İstanbul Üniversitesi",
  "Marmara Üniversitesi",
];

export const APPROVAL_PATHS = [
  {
    id: "listed",
    label: "Ders listede varsa",
    summary: "Dilekçe gerekmez.",
    steps: [
      "Almak istediğin dersin, yaz okulunda ders alınabilecek üniversiteler tarafından açıldığını doğrula.",
      "Dersin “Diğer Üniversitelerden Alınabilir Dersler Listesi”nde yer aldığını kontrol et.",
      "Doğrudan karşı üniversiteye kayıt yaptır.",
    ],
  },
  {
    id: "unlisted",
    label: "Ders listede yoksa",
    summary: "Öğretim üyesinden uygunluk alınması gerekir.",
    steps: [
      "Listede adı belirtilen ilgili öğretim üyesinden dersin içerik uygunluğunu al.",
      "Dilekçeyi doldur.",
      "Dilekçeyi ve uygunluk yazısını Bölüm Öğrenci İşleri’ne teslim et.",
    ],
  },
];

export const EQUIVALENCE_NOTE =
  "Başka bölümden ders alma veya yaz okulunda başka üniversiteden ders alma durumunda, saydırmak istediğin ders için listede belirtilen öğretim üyesinden uygunluk alınması zorunludur. Uygunluk, kurumsal e-posta adresi üzerinden ya da ders içerik çıktılarının üzerine yazılıp imzalanarak alınabilir. Uygunluk yazısında eşleşme net biçimde ifade edilmelidir.";

export const EQUIVALENCE_EXAMPLES = [
  {
    context: "Bölüm içi ders saydırma",
    text: "MTM3512 Kompleks Analiz 1 dersinin içeriği MAT4111 Kompleks Fonksiyonlar Teorisi 1 dersi ile içerik yönünden %75 uygundur.",
  },
  {
    context: "Başka üniversiteden ders saydırma",
    text: "MTM2552 İntegral Denklemler dersinin İstanbul Teknik Üniversitesinin MAT 447/E İntegral Denklemler dersi ile yerel kredisinin en az %65’i, ders içeriğinin ise %75’i uyumludur.",
  },
];

export const SUMMER_DOCUMENTS = [
  {
    label: "Diğer Üniversitelerden Alınabilir Dersler Listesi",
    kind: "pdf",
    term: SUMMER_TERM,
    href: "https://mtm.yildiz.edu.tr/media/files/YAZ%20OKULU%20D%C4%B0%C4%9EER%20%C3%9CN%C4%B0VERS%C4%B0TELERDEN%20ALINAB%C4%B0L%C4%B0R%20DERSLER%C4%B0N%20L%C4%B0STES%C4%B0%202025-2026(1).pdf",
  },
  {
    label: "Ders İçerik Uygunluğu Alınması Gereken Öğretim Üyesi Listesi",
    kind: "pdf",
    href: "https://mtm.yildiz.edu.tr/media/files/Ders%20%C4%B0%C3%A7erik%20Uygunlu%C4%9Fu%20Al%C4%B1nmas%C4%B1%20Gereken%20%C3%96%C4%9Fretim%20%C3%9Cyesi%20Listesi_.pdf",
  },
  {
    label: "Başka Üniversiteden Yaz Okulu Ders Alma Dilekçesi",
    kind: "docx",
    term: SUMMER_TERM,
    href: "https://mtm.yildiz.edu.tr/media/files/BA%C5%9EKA%20%C3%9CN%C4%B0VERS%C4%B0TEDEN%20YAZ%20OKULU%20DERS%20ALMA%20D%C4%B0LEK%C3%87E_2025-2026.docx",
  },
  {
    label: "YÖ-097 YTÜ Eşdeğerlik ve İntibak İşlemleri Yönergesi",
    kind: "doc",
    href: "https://kalite.yildiz.edu.tr/media/files/YO%CC%88-097-YTU%CC%88%20Es%CC%A7deg%CC%86erlik%20ve%20I%CC%87ntibak%20I%CC%87s%CC%A7lemleri%20Yo%CC%88nergesi.doc",
  },
];
