export const INTERNSHIP_CONTACT = "mtmstaj@yildiz.edu.tr";

export const INTERNSHIP_SOURCE = {
  label: "DD-097 · YTÜ KMF Matematik Mühendisliği Bölümü Staj Uygulama Esasları",
  senate: "Senato 23.05.2023 / 05-05",
};

export const MANDATORY_INTERNSHIPS = [
  {
    order: "1. Staj",
    code: "MTM2002",
    title: "Bilgisayar Donanımı ve Temel Uygulamaları Stajı",
    days: 20,
    ects: 2,
    term: "2. sınıf",
  },
  {
    order: "2. Staj",
    code: "MTM3002",
    title: "Sorun Çözüm Teknikleri Stajı",
    days: 20,
    ects: 3,
    term: "3. sınıf",
  },
];

export const STAJ_COMMISSION = {
  chairId: "hsahin",
  groups: [
    {
      code: "MTM2002",
      label: "I. Staj Komisyonu",
      subtitle: "Bilgisayar Donanımı ve Temel Uygulamaları Stajı",
      memberIds: ["asahiner", "ionder", "huozer", "bguler"],
    },
    {
      code: "MTM3002",
      label: "II. Staj Komisyonu",
      subtitle: "Sorun Çözüm Teknikleri",
      memberIds: ["kemalp", "eugurlu"],
    },
  ],
  composition: [
    "Bölüm Kurulu tarafından, Bölüm öğretim elemanları arasından, 3 kişiden az olmayacak şekilde belirlenir.",
    "Görev süresi 2 yıldır; süresi dolan üyeler tekrar seçilebilir.",
    "Komisyon başkanı öğretim üyesi olmak zorundadır.",
    "Sekretarya görevini Bölüm Sekreterliği yürütür.",
  ],
  duties: [
    "Öğrencilerin staj yapacağı iş yerlerinin uygunluğuna karar verir.",
    "Bölüm Başkanlığı'nca iletilen staj belgelerini inceler ve değerlendirir.",
    "Staja ilişkin duyuruları öğrencilere iletir.",
    "Değerlendirme ve itiraz sonuçlarını yazılı olarak Bölüm Başkanlığı'na bildirir.",
    "Gerek gördüğünde, Bölüm Sekreterliği aracılığıyla öğrencilere staj anketi yapabilir.",
  ],
};

export const TIMING_RULES = [
  "Stajların yarıyıl veya yaz tatiline rastlayan haftalarda yapılması esastır.",
  "Haftada en az 3 serbest tam iş günü bulunan öğrenciler eğitim-öğretim dönemi, yaz okulu ve genel sınav dönemlerinde de staj yapabilir.",
  "Stajlar tam gündür; yarım iş günü staj yapılmaz ve resmî tatil günleri staj süresinden sayılmaz.",
  "Staj yapılan bir günde dersi veya sınavı olduğu tespit edilen öğrencinin o stajı iptal edilir.",
  "Cumartesi çalışan iş yerlerinde cumartesi de iş gününden sayılır; iş yerinden alınmış imzalı ve mühürlü belge teslim edilmesi zorunludur.",
  "İki staj türünün günleri birleştirilemez ve her tür 20 iş gününü aşamaz.",
];

export const PROCESS_STEPS = [
  {
    title: "Staj yerini bul",
    detail:
      "Staj yapılacak iş yerini bulma sorumluluğu öğrenciye aittir. Yer, yurt içinde veya yurt dışında mühendislik uygulamaları üzerine çalışan bir fabrika, büro ya da kamu/özel iş yeri olabilir.",
  },
  {
    title: "Bölüm Staj Komisyonu onayı",
    detail:
      "Önerilen staj yerinin uygunluğuna Bölüm Staj Komisyonu karar verir.",
  },
  {
    title: "Belgeleri en az 10 gün önce teslim et",
    detail:
      "SGK girişinin yapılabilmesi için belgeler, staja başlama tarihinden en az 10 gün önce Fakülte Dekanlığı Staj Birimine teslim edilir.",
  },
  {
    title: "Sigorta girişi yapıldıktan sonra başla",
    detail:
      "Öğrenci, sigorta girişleri Dekanlık tarafından yapıldıktan sonra staj çalışmasına başlayabilir. Primler Üniversite tarafından karşılanır.",
  },
  {
    title: "Staj bitiminden itibaren 1 ay içinde teslim et",
    detail:
      "İş yeri yetkilisince onaylanmış Staj Sicil Formu, Staj Değerlendirme Formu ve Staj Defteri bölüm başkanlığına verilir. 1 ayı geçen staj defteri değerlendirmeye alınmaz.",
  },
  {
    title: "Değerlendirme",
    detail:
      "Komisyon belgeleri 1 ay içinde inceler; kabul, ret veya düzeltme kararı verir. Düzeltme istenirse belgeler 30 gün içinde tamamlanmalıdır. Ret kararına, yazılı bildirimden sonraki 1 hafta içinde itiraz edilebilir.",
  },
];

export const SPECIAL_CASES = [
  {
    title: "İsteğe bağlı staj",
    detail:
      "4. yarıyılın sona ermesinden itibaren, en fazla 2 kere ve toplamda 20 iş günü olmak üzere yapılabilir. Zorunlu staj yerine geçmez.",
  },
  {
    title: "Erasmus+ ile yurt dışı staj",
    detail:
      "Bölüm Staj Komisyonunun uygun görüşü, bölüm başkanlığının önerisi ve Fakülte Yönetim Kurulu kararı ile yapılabilir. Erasmus+ kapsamında en az 60 iş günü staj yapılması esastır.",
  },
  {
    title: "Ulusal Staj Programı",
    detail:
      "T.C. Cumhurbaşkanlığı Ulusal Staj Programı kapsamında isteğe bağlı veya zorunlu staj yapılabilir.",
  },
  {
    title: "Muafiyet",
    detail:
      "Daha önce kayıtlı olunan yükseköğretim kurumunda yapılan staj belgelenirse muafiyet istenebilir. Belgelerin kayıt olunan ilk yarıyıl içinde bölüme teslim edilmesi gerekir.",
  },
];

export const INTERNSHIP_DOCUMENTS = [
  {
    category: "Kılavuz ve esaslar",
    items: [
      {
        label: "Matematik Mühendisliği Staj Kılavuzu 2023",
        kind: "pdf",
        href: "https://mtm.yildiz.edu.tr/media/files/MATEMAT%C4%B0K%20M%C3%9CHEND%C4%B0SL%C4%B0%C4%9E%C4%B0%20STAJ%20KILAVUZU%202023-.pdf",
        size: 1321606,
      },
      {
        label: "Staj Akış Diyagramı",
        kind: "pdf",
        href: "https://mtm.yildiz.edu.tr/media/files/Staj_Ak%C4%B1%C5%9F_Diyagram%C4%B1.pdf",
        size: 240240,
      },
      {
        label: "DD-097 Staj Uygulama Esasları",
        kind: "docx",
        href: "https://kalite.yildiz.edu.tr/media/files/DD-097-YT%C3%9C%20KMF%20Matematik%20M%C3%BChendisli%C4%9Fi%20B%C3%B6l%C3%BCm%C3%BC%20Staj%20Uygulama%20Esaslar%C4%B1.docx",
        size: 188557,
      },
      {
        label: "2026 Staj Takvimi",
        kind: "pdf",
        href: "https://mtm.yildiz.edu.tr/media/files/2026%20TAKV%C4%B0M.pdf",
        size: 235313,
      },
    ],
  },
  {
    category: "Başvuru belgeleri",
    items: [
      {
        label: "FR-1877 YTÜ Staj Başvuru Formu",
        kind: "doc",
        href: "https://mtm.yildiz.edu.tr/media/files/FR-1877-YT%C3%9C%20Staj%20Ba%C5%9Fvuru%20Formu%20(Internship%20Application%20Form)_.doc",
        size: 167424,
      },
      {
        label: "FR-1936 Staj Ücretlerine İşsizlik Fonu Katkısı Bilgi Formu",
        kind: "docx",
        href: "https://kalite.yildiz.edu.tr/media/files/FR-1936-Staj%20%C3%9Ccretlerine%20%C4%B0%C5%9Fsizlik%20Fonu%20Katk%C4%B1s%C4%B1%20Bilgi%20Formu.docx",
        size: 118394,
      },
    ],
  },
  {
    category: "Staj sonrası belgeler",
    items: [
      {
        label: "FR-0286 Staj Sicil Formu",
        kind: "doc",
        href: "https://kalite.yildiz.edu.tr/media/files/FR-0286-Staj%20Sicil%20Formu.doc",
        size: 96256,
      },
      {
        label: "Staj Değerlendirme Formu",
        kind: "pdf",
        href: "https://mtm.yildiz.edu.tr/media/files/Staj-DegerlendirmeFormu2.pdf",
        size: 738861,
      },
    ],
  },
  {
    category: "Staj defterleri",
    note: "Her staj çalışması için ayrı bir staj defteri hazırlanır.",
    items: [
      {
        label: "1. Staj Defteri — Türkçe",
        kind: "docx",
        href: "https://mtm.yildiz.edu.tr/media/files/1_STAJ_B%C4%B0LG%C4%B0SAYAR%20DONANIMI%20VE%20TEMEL%20UYGULAMALARI%20STAJ%20DEFTER%C4%B0(T%C3%9CRK%C3%87E).docx",
        size: 143955,
      },
      {
        label: "1. Staj Defteri — İngilizce",
        kind: "docx",
        href: "https://mtm.yildiz.edu.tr/media/files/1_STAJ_B%C4%B0LG%C4%B0SAYAR%20DONANIMI%20VE%20TEMEL%20UYGULAMALARI%20STAJ%20DEFTER%C4%B0(%C4%B0NG%C4%B0L%C4%B0CE).docx",
        size: 127892,
      },
      {
        label: "2. Staj Defteri — Türkçe",
        kind: "docx",
        href: "https://mtm.yildiz.edu.tr/media/files/2_STAJ_SORUN%20%C3%87%C3%96Z%C3%9CM%20TEKN%C4%B0KLER%C4%B0%20STAJ%20DEFTER%C4%B0(T%C3%9CRK%C3%87E)(1).docx",
        size: 406002,
      },
      {
        label: "2. Staj Defteri — İngilizce",
        kind: "docx",
        href: "https://mtm.yildiz.edu.tr/media/files/2_STAJ_SORUN%20%C3%87%C3%96Z%C3%9CM%20TEKN%C4%B0KLER%C4%B0%20STAJ%20DEFTER%C4%B0(%C4%B0NG%C4%B0L%C4%B0ZCE)(1).docx",
        size: 401356,
      },
    ],
  },
];
