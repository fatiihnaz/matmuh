import { readFileSync } from "node:fs";
import { UNIVERSITY_ELECTIVES, bolognaCourseUrl } from "../src/data/universityElectives.js";

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

function hoursOf(raw) {
  const match = /^(\d+)\+(\d+)\+(\d+)$/.exec(clean(raw));
  if (!match) return null;
  return {
    theoryHours: Number(match[1]),
    practiceHours: Number(match[2]),
    labHours: Number(match[3]),
  };
}

function records() {
  const out = [];
  const seen = new Set();
  for (const pool of Object.values(UNIVERSITY_ELECTIVES)) {
    const hours = hoursOf(pool.defaultHours);
    for (const course of pool.courses ?? []) {
      const code = clean(course.code).toUpperCase();
      if (!code || seen.has(code)) continue;
      seen.add(code);

      const record = { code, name: clean(course.title), type: "ELECTIVE" };
      if (course.bolognaId) record.bolognaLink = bolognaCourseUrl(course.bolognaId);
      if (hours) Object.assign(record, hours);
      if (Number.isFinite(pool.defaultEcts)) record.ects = pool.defaultEcts;
      out.push({ record, pool: pool.shortLabel });
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

const list = records();

if (dryRun) {
  const byPool = {};
  for (const { pool } of list) byPool[pool] = (byPool[pool] ?? 0) + 1;
  console.log(`${list.length} üniversite seçmelisi hazırlandı:`);
  for (const [pool, n] of Object.entries(byPool)) console.log(`  ${pool}: ${n}`);
  console.log("\nMevcut derslerle çakışan kodlar çalıştırma sırasında atlanacak.");
  console.log(`\nörnek kayıt:\n${JSON.stringify(list[0].record, null, 1)}`);
  process.exit(0);
}

if (!process.env.CMS_URL) throw new Error("CMS_URL tanımlı değil.");
if (!process.env.CMS_IMPORT_TOKEN) throw new Error("CMS_IMPORT_TOKEN tanımlı değil.");

const existing = await allLectures();
const known = new Set();
for (const item of existing) {
  const code = clean(item.data?.code).toUpperCase();
  if (code) known.add(code);
}
console.log(`koleksiyonda ${known.size} ders var, çakışanlar atlanacak.\n`);

let created = 0;
const skipped = [];

for (const { record } of list) {
  if (known.has(record.code)) {
    skipped.push(record.code);
    continue;
  }
  const item = await api("/cms/collections/lectures", {
    method: "POST",
    body: JSON.stringify({ data: record }),
  });
  created += 1;
  console.log(`  olusturuldu  ${record.code.padEnd(9)} ${record.name.slice(0, 45)} -> ${item.slug}`);
}

console.log(`\nbitti: ${created} oluşturuldu.`);
if (skipped.length > 0) {
  console.log(`atlanan (zaten katalogda): ${skipped.join(", ")}`);
}
