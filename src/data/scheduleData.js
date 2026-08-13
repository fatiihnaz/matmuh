export const DAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"];

export const TIME_SLOTS = [
  "09.00 - 09.50",
  "10.00 - 10.50",
  "11.00 - 11.50",
  "12.00 - 12.50",
  "13.00 - 13.50",
  "14.00 - 14.50",
  "15.00 - 15.50",
  "16.00 - 16.50",
  "17.00 - 17.50",
  "18.00 - 18.50",
];

export const SCHEDULE_TERM = "2025–2026 Bahar Yarıyılı";

export const LISANS_CLASSES = [
  { id: 1, label: "1. Sınıf" },
  { id: 2, label: "2. Sınıf" },
  { id: 3, label: "3. Sınıf" },
  { id: 4, label: "4. Sınıf" },
];

export const LISANS_SCHEDULE = {
  1: [
    { day: 0, slot: 0, span: 3, code: "MDB1032", name: "İleri İngilizce 2", instructor: "-", room: "KMB-224", type: "Zorunlu" },
    { day: 0, slot: 4, span: 2, code: "FIZ1002", name: "Fizik 2", instructor: "R. Köşker", room: "KMB-224", type: "Zorunlu" },
    { day: 1, slot: 0, span: 3, code: "MTM1502", name: "Analiz 2", instructor: "S. G. Körpeoğlu", room: "KMB-202", type: "Zorunlu" },
    { day: 1, slot: 4, span: 1, code: "TDB1032", name: "Türkçe 2", instructor: "D. Sekman", room: "-", type: "Zorunlu", online: true },
    { day: 1, slot: 6, span: 2, code: "FIZ1002", name: "Fizik 2", instructor: "R. Köşker", room: "KMB-211", type: "Zorunlu" },
    { day: 2, slot: 0, span: 3, code: "MTM1531", name: "Lineer Cebir", instructor: "K. Şimşek", room: "KMB-202", type: "Zorunlu" },
    { day: 2, slot: 4, span: 2, code: "MTM1502", name: "Analiz 2", instructor: "S. G. Körpeoğlu", room: "KMB-202", type: "Zorunlu" },
    { day: 3, slot: 0, span: 2, code: "MTM1512", name: "Programlama Dilleri II", instructor: "B. Aslanyürek", room: "KMB-329", type: "Zorunlu", note: "İng · Gr.2" },
    { day: 3, slot: 4, span: 2, code: "MTM1512", name: "Programlama Dilleri II", instructor: "H. Serab", room: "KMB-329", type: "Zorunlu", note: "Gr.1" },
    { day: 4, slot: 1, span: 2, code: "MTM1552", name: "İş Sağlığı ve Güvenliği 2", instructor: "N. Yahnioğlu", room: "-", type: "Zorunlu", online: true },
    { day: 4, slot: 5, span: 2, code: "FIZ1002", name: "Fizik 2", instructor: "R. Köşker", room: "-", type: "Zorunlu", online: true },
  ],
  2: [
    { day: 0, slot: 4, span: 2, code: "MTM2592", name: "Olasılık Teorisi", instructor: "N. Güler", room: "KMB-211", type: "Zorunlu" },
    { day: 1, slot: 0, span: 3, code: "MTM2522", name: "Veri Yönetimi ve Dosya Yapıları I", instructor: "İ. Emiroğlu", room: "-", type: "Zorunlu", online: true },
    { day: 3, slot: 0, span: 3, code: "MTM2532", name: "Analitik Geometri", instructor: "A. T. Dincel", room: "KMB-211", type: "Zorunlu" },
    { day: 3, slot: 4, span: 2, code: "MTM2502", name: "İleri Analiz 2", instructor: "Y. Uçan", room: "KMB-202", type: "Zorunlu" },
    { day: 4, slot: 0, span: 1, code: "MTM2552", name: "İntegral Denklemler", instructor: "N. Yahnioğlu", room: "KMB-224", type: "Seçmeli" },
    { day: 4, slot: 0, span: 1, code: "MTM2602", name: "Yapay Zekaya Giriş", instructor: "K. Köklü", room: "KMB-224", type: "Seçmeli" },
    { day: 4, slot: 5, span: 2, code: "MTM2502", name: "İleri Analiz 2", instructor: "Y. Uçan", room: "KMB-202", type: "Zorunlu" },
  ],
  3: [
    { day: 0, slot: 0, span: 3, code: "MTM3582", name: "Matris Analizi", instructor: "C. Güler", room: "KMB-211", type: "Seçmeli", note: "2G" },
    { day: 0, slot: 0, span: 3, code: "MTM3652", name: "Sonlu Elemanlar Yöntemine Giriş", instructor: "F. İ. Albayrak", room: "KMB-202", type: "Seçmeli", note: "2G · İng" },
    { day: 0, slot: 4, span: 2, code: "MTM3502", name: "Kısmi Diferansiyel Denklemler", instructor: "C. Güler", room: "KMB-202", type: "Zorunlu" },
    { day: 2, slot: 0, span: 3, code: "MTM3512", name: "Kompleks Analiz I", instructor: "R. Köşker", room: "KMB-203", type: "Zorunlu" },
    { day: 3, slot: 0, span: 3, code: "MTM3522", name: "Cebir", instructor: "S. Onar", room: "KMB-203", type: "Zorunlu", note: "İng" },
    { day: 1, slot: 4, span: 2, code: "MTM3542", name: "Varyasyonlar Hesabı", instructor: "N. Güler", room: "KMB-329", type: "Seçmeli" },
    { day: 1, slot: 4, span: 2, code: "MTM3562", name: "Adi Dif. Denk. Nümerik Çözümleri", instructor: "D. Sekman", room: "KMB-224", type: "Seçmeli", note: "2G" },
  ],
  4: [
    { day: 0, slot: 0, span: 3, code: "MTM4502", name: "Optimizasyon Teknikleri", instructor: "H. Köçken", room: "-", type: "Zorunlu", online: true },
    { day: 0, slot: 4, span: 2, code: "MTM4692", name: "Uygulamalı SQL", instructor: "F. Kıran", room: "-", type: "Seçmeli", online: true, note: "Gr.2" },
    { day: 1, slot: 0, span: 3, code: "MTM4582", name: "Kısmi Dif. Denk. Nümerik Çözümleri", instructor: "K. Köklü", room: "KMB-211", type: "Seçmeli", note: "2G" },
    { day: 1, slot: 4, span: 2, code: "MTM4592", name: "Bilişim Etiği", instructor: "İ. Emiroğlu", room: "KMB-329", type: "Seçmeli", note: "İng" },
    { day: 2, slot: 0, span: 3, code: "MTM4562", name: "Mesleki Terminoloji", instructor: "K. Köklü", room: "KMB-211", type: "Seçmeli" },
    { day: 2, slot: 0, span: 3, code: "MTM4552", name: "Görüntü İşleme", instructor: "İ. Emiroğlu", room: "KMB-329", type: "Seçmeli", note: "İng" },
    { day: 2, slot: 4, span: 2, code: "MTM4622", name: "Yapay Zeka", instructor: "M. Bal", room: "KMB-211", type: "Seçmeli" },
    { day: 2, slot: 6, span: 1, code: "MTM4712", name: "Proje Planlama ve Yönetimi", instructor: "H. Serab", room: "KMB-329", type: "Seçmeli" },
  ],
};

export const LISANSUSTU_SCHEDULE = [
  { day: 0, slot: 0, span: 2, code: "MTM5001", name: "Seminer (Yüksek Lisans)", instructor: "Prof. Dr. Fatih Taşçi", room: "-", level: "Yüksek Lisans" },
  { day: 0, slot: 2, span: 2, code: "MTM6001", name: "Seminer (Doktora)", instructor: "Prof. Dr. Fatih Taşçi", room: "-", level: "Doktora" },
  { day: 1, slot: 0, span: 3, code: "MTM5131", name: "Yapay Zekanın Matematiksel Temelleri", instructor: "Doç. Dr. Mert Bal", room: "KMB-211", level: "Yüksek Lisans" },
  { day: 1, slot: 0, span: 3, code: "MTM5107", name: "İntegral Denklemlerin Sayısal Çözümü", instructor: "Kevser Köklü", room: "KMB-212", level: "Yüksek Lisans" },
  { day: 1, slot: 4, span: 3, code: "MTM5134", name: "Derin Öğrenmenin Matematiksel Temelleri", instructor: "Doç. Dr. Mert Bal", room: "KMB-320", level: "Yüksek Lisans" },
  { day: 2, slot: 0, span: 3, code: "MTM5202", name: "İleri Nümerik Analiz", instructor: "Doç. Dr. Bayram Ali İbrahimoğlu", room: "KMB-228", level: "Yüksek Lisans" },
  { day: 2, slot: 4, span: 3, code: "MTM6107", name: "Görüntü Sıkıştırma Teknikleri ve Standartları", instructor: "Prof. Dr. İbrahim Emiroğlu", room: "KMB-212", level: "Doktora" },
  { day: 3, slot: 0, span: 3, code: "MTM5122", name: "Proje Yönetimi Stratejileri", instructor: "Hülya Serab", room: "KMB-228", level: "Yüksek Lisans" },
  { day: 3, slot: 4, span: 3, code: "MTM5121", name: "Mühendislikte Varyasyonlar Teorisi", instructor: "Seda G. Körpeoğlu", room: "KMB-211", level: "Yüksek Lisans" },
];
