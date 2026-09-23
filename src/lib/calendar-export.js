import { FIRST_HOUR } from "@/data/schedule-grid";

const TZID = "Europe/Istanbul";

const pad = (n) => String(n).padStart(2, "0");

const escape = (text) =>
  String(text ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");

function fold(line) {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const parts = [];
  let current = "";
  let size = 0;
  for (const char of line) {
    const width = new TextEncoder().encode(char).length;
    if (size + width > (parts.length ? 74 : 75)) {
      parts.push(current);
      current = "";
      size = 0;
    }
    current += char;
    size += width;
  }
  parts.push(current);
  return parts.join("\r\n ");
}

function firstDate(startIso, weekday) {
  const [y, m, d] = startIso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const offset = (weekday - ((date.getUTCDay() + 6) % 7) + 7) % 7;
  date.setUTCDate(date.getUTCDate() + offset);
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}`;
}

const stamp = (date) =>
  `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(
    date.getUTCHours(),
  )}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;

export function buildIcs(entries, term, { t = (text) => text, name = null } = {}) {
  if (!term?.startDate || !term?.endDate) return null;
  const until = `${term.endDate.replace(/-/g, "")}T235959Z`;
  const now = stamp(new Date());

  const events = entries.map((entry) => {
    const day = firstDate(term.startDate, entry.day);
    const startHour = FIRST_HOUR + entry.slot;
    const endHour = FIRST_HOUR + entry.slot + Math.max(1, entry.span || 1) - 1;
    const location = entry.online ? t("Çevrimiçi") : entry.room !== "-" ? entry.room : "";
    const description = [
      t("Grup {group}", { group: entry.group }),
      entry.instructor && entry.instructor !== "-" ? entry.instructor : null,
    ]
      .filter(Boolean)
      .join(" · ");
    return [
      "BEGIN:VEVENT",
      `UID:${entry.offeringId ?? entry.code}-${entry.day}-${entry.slot}@matmuh.yildiz.edu.tr`,
      `DTSTAMP:${now}`,
      `DTSTART;TZID=${TZID}:${day}T${pad(startHour)}0000`,
      `DTEND;TZID=${TZID}:${day}T${pad(endHour)}5000`,
      `RRULE:FREQ=WEEKLY;UNTIL=${until}`,
      `SUMMARY:${escape(`${entry.code} ${entry.name}`)}`,
      location && `LOCATION:${escape(location)}`,
      description && `DESCRIPTION:${escape(description)}`,
      "END:VEVENT",
    ].filter(Boolean);
  });

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//YTU Matematik Muhendisligi//Ders Programi//TR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    name && `X-WR-CALNAME:${escape(name)}`,
    `X-WR-TIMEZONE:${TZID}`,
    "REFRESH-INTERVAL;VALUE=DURATION:PT12H",
    "X-PUBLISHED-TTL:PT12H",
    "BEGIN:VTIMEZONE",
    `TZID:${TZID}`,
    "BEGIN:STANDARD",
    "DTSTART:19700101T000000",
    "TZOFFSETFROM:+0300",
    "TZOFFSETTO:+0300",
    "TZNAME:+03",
    "END:STANDARD",
    "END:VTIMEZONE",
    ...events.flat(),
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .map(fold)
    .join("\r\n")
    .concat("\r\n");
}

export function downloadIcs(text, filename) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/calendar;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
