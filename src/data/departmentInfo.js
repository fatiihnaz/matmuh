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
  { id: "topoloji", label: "Topoloji", icon: "Atom", size: "sm" },
  { id: "cebirsel-geo", label: "Cebirsel Geometri", icon: "Globe", size: "sm" },
  { id: "kombinatorik", label: "Kombinatorik", icon: "Atom", size: "sm" },
];

export const milestones = [
  { id: "1911", year: "1911", event: "Kondüktör Mekteb-i Âlîsi'nin Kurulması" },
  { id: "1982", year: "1982", event: "Yıldız Üniversitesi Adını Alması ve Bölümün Modern Yapılanması" },
  { id: "1992", year: "1992", event: "Kimya-Metalürji Fakültesi Bünyesine Geçiş ve Akademik Genişleme" },
  { id: "2011", year: "2011", event: "Hesaplamalı Bilim ve Mühendislik Lisansüstü Programının Açılması" },
  { id: "2020", year: "2020", event: "MÜDEK ve EUR-ACE Uluslararası Mühendislik Akreditasyonunun Alınması" },
  { id: "2026", year: "2026", event: "YTÜ Cosmos T1 Modeli Çıkışı ve Çok Disiplinli Yapay Zeka Vizyonu" },
];

export const keyMetrics = [
  { id: "kurulus", value: "1976", label: "Kuruluş", sub: "Matematik Müh." },
  { id: "deneyim", value: "50", label: "Yıllık Deneyim", sub: "Akademik Birikim" },
  { id: "mezun", value: "1892", label: "Lisans Mezunu", sub: "Güçlü Mezun Ağı" },
  { id: "doluluk", value: "%100", label: "Doluluk Oranı", sub: "YKS Tercih Performansı" },
];

export const academicStats = [
  { id: "ogretimuye", value: "27", label: "Öğretim Üyesi" },
  { id: "lisansogr", value: "650+", label: "Lisans Öğrencisi" },
  { id: "ylisansogr", value: "50+", label: "Yüksek Lisans Öğrencisi" },
  { id: "arsgor", value: "6", label: "Araştırma Görevlisi" },
  { id: "laboratuvar", value: "290 m2", label: "Laboratuvar Alanı" },
  { id: "tercihendeks", value: "65.4", label: "İşveren Tercih Endeksi" },
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
