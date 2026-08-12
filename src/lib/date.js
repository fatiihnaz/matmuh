const MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

const SHORT = ["OCA", "ŞUB", "MAR", "NİS", "MAY", "HAZ", "TEM", "AĞU", "EYL", "EKİ", "KAS", "ARA"];

function parts(iso) {
  if (typeof iso !== "string" || iso.length < 10) return null;
  const year = iso.slice(0, 4);
  const month = Number(iso.slice(5, 7));
  const day = iso.slice(8, 10);
  if (!(month >= 1 && month <= 12)) return null;
  return { year, month, day };
}

export function formatTrDate(iso) {
  const p = parts(iso);
  if (!p) return "";
  return `${Number(p.day)} ${MONTHS[p.month - 1]} ${p.year}`;
}

export function formatTrDayMonth(iso) {
  const p = parts(iso);
  if (!p) return { day: "", month: "" };
  return { day: String(Number(p.day)), month: SHORT[p.month - 1] };
}
