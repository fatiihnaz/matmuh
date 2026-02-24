import StaffMember from "./components/StaffMember";

const staffData = [
  { name: "Serkan ONAR", rank: "Doç. Dr.", email: "sonar@yildiz.edu.tr", phone: "0212 383 46 14", room: "108" },
  { name: "Kevser Özden KÖKLÜ", rank: "Prof. Dr.", email: "ozkoklu@yildiz.edu.tr", phone: "0212 383 46 01", room: "A-229" },
  { name: "Ülkü BABUŞCU YEŞİL", rank: "Prof. Dr.", email: "ubabuscu@yildiz.edu.tr", phone: "0212 383 45 97", room: "A-231" },
  { name: "Hale GONCE KÖÇKEN", rank: "Prof. Dr.", email: "hgonce@yildiz.edu.tr", phone: "0212 383 46 05", room: "A-227" },
  { name: "Fatma Aydın AKGÜN", rank: "Prof. Dr.", email: "fakgun@yildiz.edu.tr", phone: "0212 383 46 06", room: "A-236" },
  { name: "Ayla ŞAYLI", rank: "Prof. Dr.", email: "sayli@yildiz.edu.tr", phone: "0212 383 46 15", room: "A-234" },
  { name: "Reşat KÖŞKER", rank: "Prof. Dr.", email: "kosker@yildiz.edu.tr", phone: "0212 383 46 07", room: "A-230" },
  { name: "Aydın SECER", rank: "Prof. Dr.", email: "asecer@yildiz.edu.tr", phone: "0212 383 46 22", room: "A-243" },
  { name: "Vatan KARAKAYA", rank: "Prof. Dr.", email: "vkkaya@yildiz.edu.tr", phone: "0212 383 46 21", room: "A-223" },
  { name: "Coşkun GÜLER", rank: "Prof. Dr.", email: "cguler@yildiz.edu.tr", phone: "0212 383 45 99", room: "A-246" },
  { name: "Hülya SERAB", rank: "Prof. Dr.", email: "hsahin@yildiz.edu.tr", phone: "0212 383 46 04", room: "A-244" },
  { name: "İnci ALBAYRAK", rank: "Prof. Dr.", email: "ibayrak@yildiz.edu.tr", phone: "0212 383 46 87", room: "A-219" },
  { name: "Nazmiye YAHNİOĞLU", rank: "Prof. Dr.", email: "nazmiye@yildiz.edu.tr", phone: "0212 383 45 96", room: "A-232" },
  { name: "İbrahim EMİROĞLU", rank: "Prof. Dr.", email: "emir@yildiz.edu.tr", phone: "0212 383 45 95", room: "A-221" },
  { name: "Fatih TAŞÇI", rank: "Prof. Dr.", email: "tasci@yildiz.edu.tr", phone: "0212 383 46 03", room: "A-245" },
  { name: "Seda Göktepe Körpeoğlu", rank: "Doç. Dr.", email: "sgoktepe@yildiz.edu.tr", phone: "0212 383 -- --", room: "A-217" },
  { name: "Mert BAL", rank: "Doç. Dr.", email: "mertbal@yildiz.edu.tr", phone: "0212 383 46 12", room: "A-220" },
  { name: "Birol ASLANYÜREK", rank: "Doç. Dr.", email: "baslan@yildiz.edu.tr", phone: "0212 383 45 94", room: "A-222" },
  { name: "Ramazan TEKERCİOĞLU", rank: "Doç. Dr.", email: "tramazan@yildiz.edu.tr", phone: "0212 383 45 68", room: "106" },
  { name: "Müslüm ÖZIŞIK", rank: "Doç. Dr.", email: "ozisik@yildiz.edu.tr", phone: "0212 383 46 08", room: "109" },
  { name: "Yasemen UÇAN", rank: "Doç. Dr.", email: "ucan@yildiz.edu.tr", phone: "0212 383 46 13", room: "A-218" },
  { name: "Kadriye Şimşek ALAN", rank: "Doç. Dr.", email: "ksimsek@yildiz.edu.tr", phone: "0212 383 46 10", room: "A-224" },
  { name: "Bayram Ali İBRAHİMOĞLU", rank: "Doç. Dr.", email: "bibrahim@yildiz.edu.tr", phone: "0212 383 46 14", room: "A-233" },
  { name: "Arzu TURAN DİNCEL", rank: "Doç. Dr.", email: "artur@yildiz.edu.tr", phone: "0212 383 ....", room: "205" },
  { name: "Nilgün Güler BAYAZIT", rank: "Doç. Dr.", email: "guler@yildiz.edu.tr", phone: "0212 383 46 13", room: "A-220" },
  { name: "Melih ÇINAR", rank: "Doç. Dr.", email: "mcinar@yildiz.edu.tr", phone: "0212 383 -- --", room: "--" },
  { name: "Derya SEKMAN", rank: "Dr. Öğr. Üyesi", email: "derya.sekman@yildiz.edu.tr", phone: "0212 383 -- --", room: "A-235" },
  { name: "Fatih AYLIKCI", rank: "Dr. Öğr. Üyesi", email: "faylikci@yildiz.edu.tr", phone: "0212 383 -- --", room: "A-228" }
];

const fields = ["Tümü", "Topoloji", "Stokastik Analiz", "Optimizasyon", "Veri Bilimi", "Kriptografi", "Finans Matematiği", "Nümerik Analiz"];
const ranks = ["Tümü", "Prof. Dr.", "Doç. Dr.", "Dr. Öğr. Üyesi", "Arş. Gör."];

const bgColors = [
  "#1D2445", "#2a3158", "#33295a", "#1a3348", "#2d3a2e",
  "#3a2d2d", "#2a2d45", "#1D2445", "#2a3158", "#33295a",
  "#1a3348", "#2d3a2e", "#3a2d2d", "#2a2d45", "#1D2445", "#2a3158",
];

export default function MajorPage() {
  return (
    <main className="w-full flex-1 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {staffData.map((member, idx) => (<StaffMember key={member.email} member={member} idx={idx} bgColors={bgColors}/>))}
        </div>   
      </div>
    </main>
  )
}