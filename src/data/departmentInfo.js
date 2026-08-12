export const workingAreas = [
  { id: "veri-bilimi", label: "Veri Bilimi", icon: "BarChart3", size: "lg" },
  { id: "yapay-zeka", label: "Yapay Zeka", icon: "Cpu", size: "lg" },
  { id: "optimizasyon", label: "Optimizasyon", icon: "Target", size: "lg" },
  { id: "finans-mat", label: "Finans Matematiği", icon: "TrendingUp", size: "md" },
  { id: "kriptografi", label: "Kriptografi", icon: "Shield", size: "md" },
  { id: "stokastik", label: "Stokastik Süreçler", icon: "Lightbulb", size: "md" },
  { id: "numerik", label: "Nümerik Analiz", icon: "BookOpen", size: "md" },
  { id: "difdenk", label: "Diferansiyel Denklemler", icon: "Award", size: "md" },
  { id: "istatistik", label: "İstatistik", icon: "BarChart3", size: "md" },
  { id: "fonksiyonel", label: "Fonksiyonel Analiz", icon: "Atom", size: "sm" },
  { id: "ters-problem", label: "Ters Problemler", icon: "Globe", size: "sm" },
  { id: "mat-fizik", label: "Matematiksel Fizik", icon: "Atom", size: "sm" },
];

export const milestones = [
  { id: "1911", year: "1911", event: "Kondüktör Mekteb-i Âlîsi adıyla kuruluş" },
  { id: "1922", year: "1922", event: "Nafia Fen Mektebi'ne dönüşüm" },
  { id: "1937", year: "1937", event: "İstanbul Teknik Okulu adını alması" },
  { id: "1969", year: "1969", event: "İstanbul Devlet Mühendislik ve Mimarlık Akademisi'ne dönüşüm" },
  { id: "1982", year: "1982", event: "Yıldız Üniversitesi'nin kurulması" },
  { id: "1992", year: "1992", event: "Yıldız Teknik Üniversitesi adının alınması ve Kimya-Metalurji Fakültesi'nin kurulması" },
];

export const keyMetrics = [
  { id: "akts", value: "240", label: "AKTS", sub: "Lisans Programı" },
  { id: "yariyil", value: "8", label: "Yarıyıl", sub: "Dört Yıllık Eğitim" },
  { id: "program", value: "2", label: "Lisans Programı", sub: "%100 ve %30 İngilizce" },
  { id: "kadro", value: "26", label: "Akademisyen", sub: "Bölüme Özgü Kadro" },
];

export const academicStats = [
  { id: "profesor", value: "14", label: "Profesör" },
  { id: "docent", value: "10", label: "Doçent" },
  { id: "druyesi", value: "2", label: "Dr. Öğr. Üyesi" },
  { id: "lisansustu", value: "2", label: "Lisansüstü Program" },
  { id: "staj", value: "40", label: "İş Günü Zorunlu Staj" },
  { id: "turkiye", value: "2", label: "Türkiye'de Program Sayısı" },
];

export const missionVision = {
  mission: "Matematiksel düşünce ve mühendislik yaklaşımını birleştirerek, toplumun ve endüstrinin ihtiyaç duyduğu nitelikli bilim insanları ve mühendisler yetiştirmek; evrensel bilime katkıda bulunmak.",
  vision: "Matematik mühendisliği alanında ulusal ve uluslararası düzeyde öncü, yenilikçi araştırmalarıyla tanınan, tercih edilen bir bölüm olmak.",
};

export const departmentInfoContent = {
  id: "page-bolum-hakkinda",
  slug: "bolum/hakkinda",
  title: "Bölüm Hakkında",
  type: { slug: "sayfalar", name: "Sayfalar" },
  isPublished: true,
  coverImage: null,
  blocks: [],
  metadata: {
    workingAreas,
    milestones,
    keyMetrics,
    academicStats,
    missionVision,
  },
};
