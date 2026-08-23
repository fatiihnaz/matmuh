import { readFileSync } from "node:fs";
import {
  LISANS_SCHEDULE,
  LISANSUSTU_SCHEDULE,
} from "../src/data/scheduleData.js";

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");

const ACADEMIC_YEAR = "2025-2026";
const SEMESTER = "SPRING";

// Bölüm doğrulayana kadar tahmini; AcademicTerm yalnızca /api/calendar'ın gün
// açması için kullanılıyor, haftalık ızgara bu tarihlere bakmıyor.
const TERM_START = "2026-02-09";
const TERM_END = "2026-06-19";

const DAY_KEYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
const FIRST_HOUR = 9;

const GRADUATE_LEVEL = { "Yüksek Lisans": "MASTERS", Doktora: "DOCTORATE" };

const TITLES = /\b(prof|doç|doc|dr|öğr|ogr|gör|gor|arş|ars|uzm)\b\.?/gi;

function loadEnv(path) {
  let text = "";
  try {
    text = readFileSync(path, "utf8");
  } catch {
    return;
  }
  for (const line of text.split(/\r?\n/)) {
    const match = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(line);
    if (!match) continue;
    const value = match[2].trim().replace(/^["']|["']$/g, "");
    if (!(match[1] in process.env)) process.env[match[1]] = value;
  }
}

const clean = (value) => String(value ?? "").trim();

const norm = (value) =>
  clean(value)
    .toLocaleUpperCase("tr")
    .replace(/[^A-ZÇĞİÖŞÜ ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function nameParts(raw) {
  const stripped = clean(raw).replace(TITLES, " ").replace(/\s+/g, " ").trim();
  const tokens = norm(stripped).split(" ").filter(Boolean);
  if (tokens.length === 0) return null;
  return { surname: tokens[tokens.length - 1], initial: tokens[0][0] };
}

function matcher(staff) {
  return (raw) => {
    const parts = nameParts(raw);
    if (!parts) return null;
    const bySurname = staff.filter((s) => {
      const last = norm(s.lastName);
      return last && last.split(" ").includes(parts.surname);
    });
    if (bySurname.length === 1) return bySurname[0];
    const byInitial = bySurname.filter((s) => norm(s.firstName).startsWith(parts.initial));
    return byInitial.length === 1 ? byInitial[0] : null;
  };
}

// Programda iki yazım var: "Gr.2" ve "2G", ikisi de grup numarası.
const GROUP_NOTE = /Gr\.(\d+)|\b(\d+)G\b/i;

const groupOf = (block) => {
  const match = GROUP_NOTE.exec(clean(block.note));
  return match ? Number(match[1] ?? match[2]) : 1;
};

const languageOf = (block) => (/İng/i.test(clean(block.note)) ? "ENGLISH" : null);

const hhmm = (time) => clean(time).slice(0, 5);

const slotKey = (code, group, day, time) =>
  `${clean(code).toUpperCase()}#${group ?? 1}#${day}#${hhmm(time)}`;

const timeOf = (block) => ({
  startTime: `${String(FIRST_HOUR + block.slot).padStart(2, "0")}:00:00`,
  endTime: `${String(FIRST_HOUR + block.slot + block.span - 1).padStart(2, "0")}:50:00`,
});

async function api(path, init) {
  const res = await fetch(`${process.env.CMS_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CMS_IMPORT_TOKEN}`,
      ...init?.headers,
    },
    signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) {
    throw new Error(`${init?.method ?? "GET"} ${path} -> ${res.status} ${await res.text()}`);
  }
  return res.status === 204 ? null : res.json();
}

async function pagedCollection(key) {
  const out = [];
  for (let offset = 0; ; offset += 100) {
    const page = await api(`/cms/collections/${key}?limit=100&offset=${offset}`);
    out.push(...(page.items ?? []));
    if (out.length >= (page.total ?? 0) || (page.items ?? []).length === 0) break;
  }
  return out;
}

const blocks = [
  ...Object.values(LISANS_SCHEDULE).flat().map((block) => ({ ...block, graduate: false })),
  ...LISANSUSTU_SCHEDULE.map((block) => ({ ...block, graduate: true })),
];

const graduateLectures = [];
const seenGraduate = new Set();
for (const block of LISANSUSTU_SCHEDULE) {
  const code = clean(block.code).toUpperCase();
  if (seenGraduate.has(code)) continue;
  seenGraduate.add(code);
  graduateLectures.push({
    code,
    name: clean(block.name),
    degreeLevels: [GRADUATE_LEVEL[block.level] ?? "MASTERS"],
  });
}

loadEnv(".env");

if (dryRun) {
  console.log(`dönem: ${ACADEMIC_YEAR} ${SEMESTER}  (${TERM_START} → ${TERM_END})`);
  console.log(`  DİKKAT: dönem tarihleri tahmini, bölümden doğrulanmalı\n`);

  console.log(`eklenecek lisansüstü ders (${graduateLectures.length}):`);
  for (const lecture of graduateLectures) {
    console.log(`  ${lecture.code.padEnd(9)} ${lecture.degreeLevels[0].padEnd(9)} ${lecture.name}`);
  }

  const offerings = new Map();
  for (const block of blocks) {
    const key = `${clean(block.code).toUpperCase()}#${groupOf(block)}`;
    if (!offerings.has(key)) offerings.set(key, { block, count: 0 });
    offerings.get(key).count += 1;
  }

  console.log(`\naçılış (${offerings.size}) ve ders saati (${blocks.length}):`);
  for (const [key, { block, count }] of offerings) {
    const { startTime, endTime } = timeOf(block);
    const lang = languageOf(block);
    console.log(
      `  ${key.padEnd(12)} ${count} blok  ilk: ${DAY_KEYS[block.day]?.slice(0, 3)} ${startTime.slice(0, 5)}-${endTime.slice(0, 5)}  ${lang ?? ""}  ${clean(block.instructor)}`,
    );
  }

  const odd = blocks.filter(
    (b) => clean(b.note) && !GROUP_NOTE.test(b.note) && !/İng/i.test(b.note),
  );
  if (odd.length > 0) {
    console.log(`\nçözülemeyen not (${odd.length}) — bu bilgi taşınmıyor:`);
    for (const b of odd) console.log(`  ${b.code.padEnd(9)} "${b.note}"`);
  }
  process.exit(0);
}

if (!process.env.CMS_URL) throw new Error("CMS_URL tanımlı değil.");
if (!process.env.CMS_IMPORT_TOKEN) throw new Error("CMS_IMPORT_TOKEN tanımlı değil.");

// Okumalar permitAll olduğu için geçersiz token ilk yazmaya kadar fark
// edilmiyor; o noktada yarım yazılmış veri kalabilir.
await api("/cms/collections/me").catch(() => {
  throw new Error("CMS_IMPORT_TOKEN geçersiz veya süresi dolmuş. .env içinde yenile.");
});

const staff = (await pagedCollection("staff")).map((item) => ({
  id: item.id,
  firstName: item.data?.firstName ?? "",
  lastName: item.data?.lastName ?? "",
}));
const find = matcher(staff);

const lectureByCode = new Map();
for (const item of await pagedCollection("lectures")) {
  const code = clean(item.data?.code).toUpperCase();
  if (code) lectureByCode.set(code, item.data.id);
}

let lecturesCreated = 0;
for (const lecture of graduateLectures) {
  if (lectureByCode.has(lecture.code)) continue;
  const item = await api("/cms/collections/lectures", {
    method: "POST",
    body: JSON.stringify({ data: lecture }),
  });
  lectureByCode.set(lecture.code, item.data?.id ?? item.id);
  lecturesCreated += 1;
  console.log(`  ders eklendi   ${lecture.code.padEnd(9)} ${lecture.name}`);
}

await api("/calendar-admin/terms", {
  method: "PUT",
  body: JSON.stringify({
    academicYear: ACADEMIC_YEAR,
    semester: SEMESTER,
    startDate: TERM_START,
    endDate: TERM_END,
  }),
});
console.log(`  dönem yazıldı  ${ACADEMIC_YEAR} ${SEMESTER}`);

const existingSlots = new Set();
const weekly = await api(
  `/calendar/weekly?academicYear=${ACADEMIC_YEAR}&semester=${SEMESTER}`,
).catch(() => null);
for (const slot of weekly?.data ?? []) {
  existingSlots.add(slotKey(slot.lectureCode, slot.groupNumber, slot.dayOfWeek, slot.startTime));
}

const offeringIds = new Map();
let offeringsCreated = 0;
let offeringsReused = 0;
const unmatched = [];

for (const block of blocks) {
  const code = clean(block.code).toUpperCase();
  const group = groupOf(block);
  const key = `${code}#${group}`;
  if (offeringIds.has(key)) continue;

  const lectureId = lectureByCode.get(code);
  if (!lectureId) {
    console.log(`  ATLANDI     ${code} lectures koleksiyonunda yok`);
    continue;
  }

  const rows = (await api(`/lectures/${lectureId}/offerings`))?.data ?? [];
  const already = (Array.isArray(rows) ? rows : []).find(
    (r) =>
      clean(r.academicYear) === ACADEMIC_YEAR &&
      clean(r.semester) === SEMESTER &&
      (r.groupNumber ?? 1) === group,
  );

  if (already) {
    offeringIds.set(key, already.id);
    offeringsReused += 1;
    continue;
  }

  const rawName = clean(block.instructor);
  const person = rawName && rawName !== "-" ? find(rawName) : null;
  if (rawName && rawName !== "-" && !person) unmatched.push(`${code}: ${rawName}`);

  const body = { academicYear: ACADEMIC_YEAR, semester: SEMESTER, groupNumber: group };
  if (person) body.staffId = person.id;
  else if (rawName && rawName !== "-") body.instructorRawName = rawName;
  const language = languageOf(block);
  if (language) body.language = language;

  const made = await api(`/lectures/${lectureId}/offerings`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  offeringIds.set(key, (made?.data ?? made)?.id);
  offeringsCreated += 1;
  console.log(`  açılış        ${key.padEnd(12)} ${person ? "" : "(serbest ad) "}${rawName}`);
}

let slotsCreated = 0;
let slotsSkipped = 0;

for (const block of blocks) {
  const code = clean(block.code).toUpperCase();
  const group = groupOf(block);
  const offeringId = offeringIds.get(`${code}#${group}`);
  if (!offeringId) continue;

  const { startTime, endTime } = timeOf(block);
  const day = DAY_KEYS[block.day];
  if (!day) continue;

  if (existingSlots.has(slotKey(code, group, day, startTime))) {
    slotsSkipped += 1;
    continue;
  }

  const online = Boolean(block.online);
  await api("/calendar-admin/slots", {
    method: "POST",
    body: JSON.stringify({
      lectureOfferingId: offeringId,
      dayOfWeek: day,
      startTime,
      endTime,
      online,
      ...(online ? {} : { classroom: clean(block.room) === "-" ? null : clean(block.room) }),
    }),
  });
  slotsCreated += 1;
  console.log(
    `  ders saati    ${code.padEnd(9)} ${day.slice(0, 3)} ${startTime.slice(0, 5)}-${endTime.slice(0, 5)} ${online ? "çevrimiçi" : clean(block.room)}`,
  );
}

console.log(
  `\nbitti: ${lecturesCreated} ders, ${offeringsCreated} açılış (${offeringsReused} mevcut), ${slotsCreated} ders saati (${slotsSkipped} zaten vardı).`,
);
if (unmatched.length > 0) {
  console.log(`\npersonel kaydına bağlanamayan eğitmen (${unmatched.length}) — serbest metin yazıldı:`);
  for (const u of unmatched) console.log(`  ${u}`);
}
