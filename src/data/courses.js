export const COURSES = [
  {
    id: "MTM1501",
    title: "Analiz 1",
    semester: 1,
    type: "Zorunlu",
    hours: "5+0+0",
    ects: 7,
    language: "Türkçe (%30 İngilizce)",
    category: "Temel Meslek Dersleri",
    content: "Reel Değerli Fonksiyonlar, Limit, Süreklilik, Türev ve Uygulamaları, Ortalama Değer Teoremleri, Riemann Toplamları ve Belirli İntegral.",
    assessment: {
      midterm: { count: 2, weight: 60 },
      final: { count: 1, weight: 40 }
    },
    sections: [
      {
        groupNo: 1,
        staffId: "ozisik",
        language: "TR",
        schedule: [
          { day: "Pazartesi", time: "09:00 - 10:50", room: "B-302", type: "Teori" },
          { day: "Perşembe", time: "11:00 - 11:50", room: "B-302", type: "Uygulama" }
        ]
      },
      {
        groupNo: 2,
        staffId: "ozkoklu",
        language: "TR",
        schedule: [
          { day: "Salı", time: "13:00 - 14:50", room: "D-102", type: "Teori" },
          { day: "Cuma", time: "09:00 - 09:50", room: "D-102", type: "Uygulama" }
        ]
      }
    ],
    syllabus: [
      { topic: "Reel sayılar ve özellikleri, fonksiyonlar ve sınıflandırılması" },
      { topic: "Fonksiyonlarda limit ve süreklilik kavramları" },
      { topic: "Türev tanımı ve türev alma kuralları" },
      { topic: "Ortalama Değer Teoremi ve Rolle Teoremi" },
      { topic: "Türevin uygulamaları ve eğri çizimleri" },
      { topic: "Belirli integral tanımı ve özellikleri" },
      { topic: "Riemann toplamları ile alan hesabı" }
    ]
  },
  {
    id: "MTM3512",
    title: "Kompleks Analiz 1",
    semester: 6,
    type: "Zorunlu",
    hours: "3+0+0",
    ects: 5,
    language: "İngilizce, Türkçe",
    category: "Temel Meslek Dersleri",
    content: "Kompleks değişkenli fonksiyonlar, Limit, Süreklilik, Analitik fonksiyonlar, Cauchy-Riemann denklemleri, Harmonik fonksiyonlar, Rezidü teoremi ve Konform dönüşümler.",
    assessment: {
      midterm: { count: 2, weight: 60 },
      final: { count: 1, weight: 40 }
    },
    sections: [
      {
        groupNo: 1,
        staffId: "ibayrak",
        language: "TR",
        schedule: [
          { day: "Pazartesi", time: "13:00 - 15:50", room: "B-204", type: "Teori" }
        ]
      },
      {
        groupNo: 2,
        staffId: "kosker",
        language: "ENG",
        schedule: [
          { day: "Çarşamba", time: "09:00 - 11:50", room: "D-104", type: "Teori" }
        ]
      }
    ],
    syllabus: [
      { topic: "Kompleks sayılar ve özellikleri, kompleks düzlem gösterimi" },
      { topic: "Kuvvetler ve kökler, Riemann küresi" },
      { topic: "Kompleks fonksiyonlar, limit ve süreklilik" },
      { topic: "Cauchy-Riemann denklemleri, harmonik fonksiyonlar" },
      { topic: "Elementer fonksiyonlar (Üstel, Logaritmik, Trigonometrik)" },
      { topic: "Kompleks integraller ve Cauchy Teoremi" },
      { topic: "Taylor ve Laurent serileri, Rezidü hesabı" }
    ]
  }
];

export async function getCourseByCode(code) {
  if (!code) return null;
  return COURSES.find(c => c.id.toLowerCase() === code.toLowerCase());
}