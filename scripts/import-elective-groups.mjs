import { readFileSync } from "node:fs";
import { ELECTIVE_GROUPS, SEMESTERS } from "../src/data/coursesData.js";

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");

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

function slotName(title) {
  return clean(title).replace(/\s+Dersleri$/, "");
}

function slots() {
  const out = [];
  for (const sem of SEMESTERS) {
    for (const entry of sem.courses) {
      if (!entry.isElectiveGroup) continue;
      const group = ELECTIVE_GROUPS[entry.electiveGroupId];
      if (!group) continue;
      out.push({
        code: clean(entry.id),
        name: slotName(group.title),
        term: sem.semesterNumber,
        semester: sem.semesterNumber % 2 === 1 ? "FALL" : "SPRING",
        external: Boolean(group.external),
        note: clean(group.note) || null,
        courseCodes: group.external
          ? (group.courses ?? []).map((c) => clean(c.code))
          : (group.courseIds ?? []).map(clean),
      });
    }
  }
  return out;
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

async function allLectures() {
  const out = [];
  for (let offset = 0; ; offset += 100) {
    const page = await api(`/cms/collections/lectures?limit=100&offset=${offset}`);
    out.push(...(page.items ?? []));
    if (out.length >= (page.total ?? 0) || (page.items ?? []).length === 0) break;
  }
  return out;
}

loadEnv(".env");

const list = slots();

if (dryRun) {
  console.log(`${list.length} seçmeli slot:\n`);
  for (const s of list) {
    const kind = s.external ? "üniversite havuzu" : "bölüm dersleri";
    console.log(
      `  ${s.code.padEnd(10)} ${s.name.padEnd(30)} yarıyıl ${String(s.term).padEnd(2)} ${s.semester.padEnd(6)} ${String(s.courseCodes.length).padStart(3)} ders  (${kind})`,
    );
    if (s.note) console.log(`${" ".repeat(13)}about: ${s.note}`);
  }
  const total = list.reduce((n, s) => n + s.courseCodes.length, 0);
  console.log(`\ntoplam ${total} ders bağlantısı kurulacak.`);
  console.log("Kodu lectures koleksiyonunda bulunamayan seçenekler çalıştırma sonunda listelenir.");
  process.exit(0);
}

if (!process.env.CMS_URL) throw new Error("CMS_URL tanımlı değil.");
if (!process.env.CMS_IMPORT_TOKEN) throw new Error("CMS_IMPORT_TOKEN tanımlı değil.");

const lectures = await allLectures();
const idByCode = new Map();
for (const item of lectures) {
  const code = clean(item.data?.code);
  if (code) idByCode.set(code.toUpperCase(), item.data?.id ?? item.id);
}
console.log(`${idByCode.size} ders eşlendi.\n`);

const existing = await api("/cms/collections/elective-groups?limit=100");
const bySlot = new Map();
for (const item of existing.items ?? []) {
  if (item.data?.code) bySlot.set(item.data.code, item);
}

let created = 0;
let updated = 0;
const unresolved = [];

for (const slot of list) {
  const ids = [];
  for (const code of slot.courseCodes) {
    const id = idByCode.get(code.toUpperCase());
    if (id) ids.push(id);
    else unresolved.push(`${slot.code}: ${code}`);
  }

  const data = {
    code: slot.code,
    name: slot.name,
    term: slot.term,
    semester: slot.semester,
    selectionCount: 1,
  };
  if (slot.note) data.about = slot.note;
  if (ids.length > 0) data.optionLectureIds = ids;

  const match = bySlot.get(slot.code);
  if (match) {
    await api(`/cms/collections/elective-groups/${encodeURIComponent(match.slug)}`, {
      method: "PUT",
      body: JSON.stringify({ data, version: match.version }),
    });
    updated += 1;
    console.log(`  guncellendi  ${slot.code.padEnd(10)} ${ids.length} seçenek`);
  } else {
    const item = await api("/cms/collections/elective-groups", {
      method: "POST",
      body: JSON.stringify({ data }),
    });
    created += 1;
    console.log(`  olusturuldu  ${slot.code.padEnd(10)} ${ids.length} seçenek -> ${item.slug}`);
  }
}

console.log(`\nbitti: ${created} oluşturuldu, ${updated} güncellendi.`);
if (unresolved.length > 0) {
  console.log(`\neşleşmeyen ders kodu (${unresolved.length}) — lectures koleksiyonunda yoklar:`);
  const shown = unresolved.slice(0, 12);
  for (const u of shown) console.log(`  ${u}`);
  if (unresolved.length > shown.length) console.log(`  … ve ${unresolved.length - shown.length} tane daha`);
}
