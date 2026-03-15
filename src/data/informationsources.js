import { 
  Search, Library, BookOpen, ExternalLink, Globe, Building2, 
  GraduationCap, Languages, Users, MapPin, School, Globe2, 
  ShieldCheck, UserPlus, Database, Network, Landmark, Flag, 
  Briefcase, Award, Twitter, SearchCode, History, Wallet, 
  Euro, Scale, Contact2, Link, FileText 
} from 'lucide-react';

export const informationSources = [
  {
    id: 1,
    label: "YÖK Tez Tarama",
    href: "http://tez2.yok.gov.tr/",
    icon: Search,
    category: "Akademik"
  },
  {
    id: 2,
    label: "YTÜ Kütüphane",
    href: "http://www.ktp.yildiz.edu.tr/",
    icon: Library,
    category: "Akademik"
  },
  {
    id: 3,
    label: "Sciencedirect",
    href: "http://www.sciencedirect.com/",
    icon: BookOpen,
    category: "Akademik"
  },
  {
    id: 4,
    label: "Springerlink",
    href: "http://www.springerlink.com/",
    icon: ExternalLink,
    category: "Akademik"
  },
  {
    id: 5,
    label: "Erasmus+",
    href: "http://www.europa.eu.int/comm/education/erasmus.html",
    icon: Globe,
    category: "Erasmus"
  },
  {
    id: 6,
    label: "Elçilikler ve Konsolosluklar",
    href: "http://www.mfa.gov.tr/yerlesik-diplomatik-ve-konsuler-misyonlar.tr.mfa",
    icon: Building2,
    category: "Resmi Kurumlar"
  },
  {
    id: 7,
    label: "Avrupa Kredi Transfer Sistemi (ECTS)",
    href: "http://www.europa.eu.int/comm/education/socrates/ects.html",
    icon: GraduationCap,
    category: "Eğitim"
  },
  {
    id: 8,
    label: "Intensive Language Program (ILPC)",
    href: "http://www.europa.eu.int/comm/education/ilpc/index_en.html",
    icon: Languages,
    category: "Eğitim"
  },
  {
    id: 9,
    label: "Erasmus Student Network",
    href: "http://www.esn.org/",
    icon: Users,
    category: "Erasmus"
  },
  {
    id: 10,
    label: "UK Socrates-Erasmus Council",
    href: "http://www.erasmus.ac.uk/",
    icon: MapPin,
    category: "Erasmus"
  },
  {
    id: 11,
    label: "European University Association (EUA)",
    href: "http://www.eua.org/",
    icon: School,
    category: "Birlikler"
  },
  {
    id: 12,
    label: "Int. Education Association (EAIE)",
    href: "http://www.eaie.org/",
    icon: Globe2,
    category: "Birlikler"
  },
  {
    id: 13,
    label: "Quality Assurance (ENQA)",
    href: "http://www.enqa.net/",
    icon: ShieldCheck,
    category: "Birlikler"
  },
  {
    id: 14,
    label: "Partbase Partner Finding Tool",
    href: "http://partbase.eupro.se/",
    icon: UserPlus,
    category: "Araçlar"
  },
  {
    id: 15,
    label: "Norveç Ulusal Ajansı Ortak Bulma",
    href: "http://www.siu.no/socpart",
    icon: Database,
    category: "Araçlar"
  },
  {
    id: 16,
    label: "European Schoolnet",
    href: "http://eunbrux02.eun.org/portal/index-en.cfm",
    icon: Network,
    category: "Birlikler"
  },
  {
    id: 17,
    label: "Yüksek Öğretim Kurumu (YÖK)",
    href: "http://www.yok.gov.tr/",
    icon: Landmark,
    category: "Resmi Kurumlar"
  },
  {
    id: 18,
    label: "Dışişleri Bakanlığı",
    href: "http://www.mfa.gov.tr/default.tr.mfa",
    icon: Flag,
    category: "Resmi Kurumlar"
  },
  {
    id: 19,
    label: "AB Genel Sekreterliği",
    href: "http://www.abgs.gov.tr/",
    icon: Briefcase,
    category: "Resmi Kurumlar"
  },
  {
    id: 20,
    label: "Ulusal Ajans",
    href: "http://www.ua.gov.tr/",
    icon: Award,
    category: "Resmi Kurumlar"
  },
  {
    id: 21,
    label: "Ulusal Ajans Twitter",
    href: "http://twitter.com/ulusalajans",
    icon: Twitter,
    category: "Sosyal Medya"
  },
  {
    id: 22,
    label: "Ortak Arama Portalı",
    href: "http://partnersearch.ua.gov.tr/",
    icon: SearchCode,
    category: "Araçlar"
  },
  {
    id: 23,
    label: "Jean Monnet Burs Programı",
    href: "http://www.jeanmonnet.org.tr/web/",
    icon: History,
    category: "Burslar"
  },
  {
    id: 24,
    label: "Merkezi Finans ve İhale Birimi",
    href: "http://www.cfcu.gov.tr/",
    icon: Wallet,
    category: "Resmi Kurumlar"
  },
  {
    id: 25,
    label: "European Commission",
    href: "http://ec.europa.eu/education/index_en.htm",
    icon: Euro,
    category: "Resmi Kurumlar"
  },
  {
    id: 26,
    label: "Council of Europe",
    href: "http://www.coe.int/",
    icon: Scale,
    category: "Resmi Kurumlar"
  },
  {
    id: 27,
    label: "Int. Association of Universities",
    href: "http://www.iau-aiu.net/",
    icon: Globe,
    category: "Birlikler"
  },
  {
    id: 28,
    label: "European Students' Union",
    href: "http://www.esib.org/",
    icon: Contact2,
    category: "Birlikler"
  },
  {
    id: 29,
    label: "ENIC - NARIC Networks",
    href: "http://www.enic-naric.net/index.aspx?s=n&r=g&d=about",
    icon: Link,
    category: "Araçlar"
  },
  {
    id: 30,
    label: "EU Publications Portal",
    href: "http://publications.europa.eu/",
    icon: FileText,
    category: "Yayınlar"
  }
];