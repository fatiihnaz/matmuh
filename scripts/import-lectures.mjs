import { readFileSync } from "node:fs";
import { COURSE_DETAILS, ELECTIVE_GROUPS, SEMESTERS } from "../src/data/coursesData.js";

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");

const TYPES = { Zorunlu: "REQUIRED", Seçmeli: "ELECTIVE" };

const CATEGORIES = {
  "Temel Bilim Dersleri": "BASIC_SCIENCE",
  "Yabancı Dil Dersleri": "FOREIGN_LANGUAGE",
  "Ortak Zorunlu Dersler": "COMMON_REQUIRED",
  "Temel Meslek Dersleri": "CORE_PROFESSION",
  "Uzmanlık/Alan Dersleri": "SPECIALIZATION",
  "Genel Kültür Dersleri": "GENERAL_CULTURE",
};

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

function semesterOf(code) {
  const upper = clean(code).toUpperCase();
  for (const sem of SEMESTERS) {
    for (const entry of sem.courses) {
      if (!entry.isElectiveGroup && clean(entry.id).toUpperCase() === upper) {
        return sem.semesterNumber;
      }
      if (entry.isElectiveGroup) {
        const group = ELECTIVE_GROUPS[entry.electiveGroupId];
        const ids = group?.external
          ? (group.courses ?? []).map((c) => c.code)
          : (group?.courseIds ?? []);
        if (ids.some((id) => clean(id).toUpperCase() === upper)) return sem.semesterNumber;
      }
    }
  }
  return null;
}

function hoursOf(raw) {
  const match = /^(\d+)\+(\d+)\+(\d+)$/.exec(clean(raw));
  if (!match) return null;
  return {
    theoryHours: Number(match[1]),
    practiceHours: Number(match[2]),
    labHours: Number(match[3]),
  };
}

const problems = [];
const skipped = [];

function toRecord(course) {
  const code = clean(course.code);
  const record = {
    code,
    name: clean(course.title),
  };

  const language = clean(course.language);
  if (language) record.language = language;

  const about = clean(course.content);
  if (about) record.about = about;

  const rawType = clean(course.type);
  if (rawType) {
    const mapped = TYPES[rawType];
    if (!mapped) problems.push(`${code}: bilinmeyen tür ${JSON.stringify(rawType)}`);
    else record.type = mapped;
  }

  const rawCategory = clean(course.category);
  if (rawCategory) {
    const mapped = CATEGORIES[rawCategory];
    if (!mapped) problems.push(`${code}: bilinmeyen kategori ${JSON.stringify(rawCategory)}`);
    else record.category = mapped;
  }

  const hours = hoursOf(course.hours);
  if (hours) Object.assign(record, hours);
  else if (clean(course.hours)) problems.push(`${code}: saat biçimi çözülemedi ${JSON.stringify(course.hours)}`);

  if (Number.isFinite(course.ects)) record.ects = course.ects;

  const term = semesterOf(code);
  if (term) {
    record.term = term;
    record.semester = term % 2 === 1 ? "FALL" : "SPRING";
  }

  const syllabus = (course.syllabus ?? [])
    .map((entry, index) => ({ week: index + 1, topic: clean(entry.topic) }))
    .filter((entry) => entry.topic);
  if (syllabus.length > 0) record.syllabus = syllabus;

  const midterm = course.assessment?.midterm?.weight;
  if (Number.isFinite(midterm) && midterm > 0) {
    record.midtermWeight = midterm;
    record.finalWeight = 100 - midterm;
  } else if (course.assessment) {
    problems.push(`${code}: vize ağırlığı 0, ağırlık alanları gönderilmiyor`);
  }

  return record;
}

async function api(path, init) {
  const res = await fetch(`${process.env.CMS_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CMS_IMPORT_TOKEN}`,
      ...init?.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`${init?.method ?? "GET"} ${path} -> ${res.status} ${await res.text()}`);
  }
  return res.status === 204 ? null : res.json();
}

loadEnv(".env");

const records = [];
for (const course of Object.values(COURSE_DETAILS)) {
  const record = toRecord(course);
  const reasons = [];
  if (!record.type) reasons.push("tür yok");
  if (!record.term) reasons.push("yarıyıla bağlı değil");
  if (reasons.length > 0) {
    skipped.push(`${record.code}  ${record.name.slice(0, 42).padEnd(44)} ${reasons.join(", ")}`);
    continue;
  }
  records.push(record);
}

if (dryRun) {
  const withType = records.filter((r) => r.type).length;
  const withSyllabus = records.filter((r) => r.syllabus).length;
  const syllabusRows = records.reduce((sum, r) => sum + (r.syllabus?.length ?? 0), 0);
  const withTerm = records.filter((r) => r.term).length;
  const withMid = records.filter((r) => r.midtermWeight !== undefined).length;
  const pairs = {};
  for (const r of records) {
    if (r.midtermWeight === undefined) continue;
    const key = `${r.midtermWeight}/${r.finalWeight}`;
    pairs[key] = (pairs[key] ?? 0) + 1;
  }

  console.log(`kaynakta ${Object.keys(COURSE_DETAILS).length} ders, ${skipped.length} tanesi atlandı, ${records.length} tanesi yüklenecek`);
  if (skipped.length > 0) {
    console.log("\natlananlar (kod bazlı; aynı isimli düzgün dersler korunuyor):");
    for (const line of skipped) console.log(`  ${line}`);
    console.log();
  }
  console.log(`  tür dolu: ${withType}   kategori dolu: ${records.filter((r) => r.category).length}`);
  console.log(`  yarıyıl çözüldü: ${withTerm}   saat ayrıştırıldı: ${records.filter((r) => r.theoryHours !== undefined).length}`);
  console.log(`  haftalık program: ${withSyllabus} ders / ${syllabusRows} satır`);
  console.log(`  ağırlık çifti atanan: ${withMid} ders (final = 100 - vize)`);
  console.log(`    dağılım: ${Object.entries(pairs).map(([k, v]) => `${k} -> ${v}`).join("  ")}`);
  if (problems.length > 0) {
    console.log(`\nnot (${problems.length}):`);
    for (const p of problems) console.log(`  ${p}`);
  }
  const sample = records.find((r) => r.syllabus && r.type && r.term);
  console.log(`\nörnek kayıt:\n${JSON.stringify(sample, null, 1).slice(0, 700)}`);
  process.exit(0);
}

if (!process.env.CMS_URL) throw new Error("CMS_URL tanımlı değil.");
if (!process.env.CMS_IMPORT_TOKEN) throw new Error("CMS_IMPORT_TOKEN tanımlı değil.");

const existing = await api("/cms/collections/lectures?limit=100");
const byCode = new Map();
for (const item of existing.items ?? []) {
  if (item.data?.code) byCode.set(item.data.code, item);
}

let created = 0;
let updated = 0;

for (const record of records) {
  const match = byCode.get(record.code);
  if (match) {
    await api(`/cms/collections/lectures/${encodeURIComponent(match.slug)}`, {
      method: "PUT",
      body: JSON.stringify({ data: record, version: match.version }),
    });
    updated += 1;
    console.log(`  guncellendi  ${record.code}  ${record.name.slice(0, 45)}`);
  } else {
    const item = await api("/cms/collections/lectures", {
      method: "POST",
      body: JSON.stringify({ data: record }),
    });
    created += 1;
    console.log(`  olusturuldu  ${record.code}  ${record.name.slice(0, 45)} -> ${item.slug}`);
  }
}

console.log(`\nbitti: ${created} oluşturuldu, ${updated} güncellendi, toplam ${records.length}`);
