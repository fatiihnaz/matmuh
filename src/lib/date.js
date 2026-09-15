const MONTHS = {
  tr: [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
  ],
  en: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ],
};

const SHORT = {
  tr: ["OCA", "ŞUB", "MAR", "NİS", "MAY", "HAZ", "TEM", "AĞU", "EYL", "EKİ", "KAS", "ARA"],
  en: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
};

function parts(iso) {
  if (typeof iso !== "string" || iso.length < 10) return null;
  const year = iso.slice(0, 4);
  const month = Number(iso.slice(5, 7));
  const day = iso.slice(8, 10);
  if (!(month >= 1 && month <= 12)) return null;
  return { year, month, day };
}

export function formatDate(iso, locale) {
  const p = parts(iso);
  if (!p) return "";
  const day = Number(p.day);
  const month = (MONTHS[locale] ?? MONTHS.tr)[p.month - 1];
  return locale === "en" ? `${month} ${day}, ${p.year}` : `${day} ${month} ${p.year}`;
}

export function formatDayMonth(iso, locale) {
  const p = parts(iso);
  if (!p) return { day: "", month: "" };
  return { day: String(Number(p.day)), month: (SHORT[locale] ?? SHORT.tr)[p.month - 1] };
}
