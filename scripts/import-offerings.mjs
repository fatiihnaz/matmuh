import { readFileSync } from "node:fs";
import { obsdata } from "../src/data/obsdata.js";

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

const KNOWN_EVALUATION = new Set(["RELATIVE", "ABSOLUTE"]);

const norm = (value) =>
  String(value ?? "")
    .toLocaleUpperCase("tr")
    .replace(/[^A-ZÇĞİÖŞÜ ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function matcher(staff) {
  return (rawName) => {
    const needle = norm(rawName);
    if (!needle) return null;
    const exact = staff.find((s) => {
      const last = norm(s.lastName);
      return last && needle.endsWith(last);
    });
    if (exact) return exact;
    const tail = staff.filter((s) => {
      const token = norm(s.lastName).split(" ").pop();
      return token && needle.endsWith(` ${token}`);
    });
    return tail.length === 1 ? tail[0] : null;
  };
}

function gradeResult(source, label = "") {
  if (!source) return null;
  const result = { rangesChanged: Boolean(source.rangesChanged) };
  const copy = (key) => {
    const value = source[key];
    if (typeof value === "number" && Number.isFinite(value)) result[key] = value;
    else if (typeof value === "string" && clean(value)) result[key] = clean(value);
  };
  const evaluation = clean(source.evaluationMethod);
  if (evaluation && !KNOWN_EVALUATION.has(evaluation)) {
    droppedFields.push(`${label} evaluationMethod=${evaluation}`);
  }
  for (const key of [
    "resultStatus",
    "resultDate",
    "examCurriculumName",
    "participantCount",
    "classAverage",
    "classAverageParticipantCount",
    "standardDeviation",
    "classLevel",
  ]) {
    copy(key);
  }
  if (evaluation && KNOWN_EVALUATION.has(evaluation)) result.evaluationMethod = evaluation;
  result.grades = (source.gradeDistributions ?? []).map((g) => {
    const detail = { letterGrade: clean(g.letterGrade), studentCount: g.studentCount ?? 0 };
    if (g.minScore != null) detail.minScore = g.minScore;
    if (g.maxScore != null) detail.maxScore = g.maxScore;
    return detail;
  });
  return result;
}

function examStatistic(source) {
  const statistic = {};
  for (const key of [
    "weightPercent",
    "totalStudentCount",
    "attendedStudentCount",
    "failedByAbsenceCount",
    "averageScore",
  ]) {
    if (Number.isFinite(source[key])) statistic[key] = source[key];
  }
  if (clean(source.announcedAt)) statistic.announcedAt = clean(source.announcedAt);
  return statistic;
}

async function api(path, init, { tolerate = [] } = {}) {
  const res = await fetch(`${process.env.CMS_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CMS_IMPORT_TOKEN}`,
      ...init?.headers,
    },
  });
  if (!res.ok) {
    if (tolerate.includes(res.status)) return { __rejected: res.status };
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

loadEnv(".env");

if (!process.env.CMS_URL) throw new Error("CMS_URL tanımlı değil.");
if (!process.env.CMS_IMPORT_TOKEN) throw new Error("CMS_IMPORT_TOKEN tanımlı değil.");

const staff = (await pagedCollection("staff")).map((item) => ({
  id: item.id,
  lastName: item.data?.lastName ?? "",
}));
const lectureIdByCode = new Map();
for (const item of await pagedCollection("lectures")) {
  const code = clean(item.data?.code).toUpperCase();
  if (code) lectureIdByCode.set(code, item.id);
}
const find = matcher(staff);

const plan = [];
const missingLecture = [];
const emptyOfferings = [];
const droppedFields = [];
let matched = 0;

for (const course of obsdata) {
  const code = clean(course.code).toUpperCase();
  const lectureId = lectureIdByCode.get(code);
  if (!lectureId) {
    missingLecture.push(course.code);
    continue;
  }
  for (const offering of course.offerings ?? []) {
    const hasContent =
      Boolean(offering.finalResult) ||
      Boolean(offering.butResult) ||
      (offering.examStatistics?.length ?? 0) > 0;
    if (!hasContent) {
      emptyOfferings.push(`${course.code} ${clean(offering.academicYear)} ${clean(offering.semester)}`);
      continue;
    }
    const rawName = clean(offering.instructor?.rawName);
    const person = find(rawName);
    if (person) matched += 1;
    plan.push({ code, lectureId, offering, rawName, staffId: person?.id ?? null });
  }
}

console.log(`${plan.length} dönem kaydı hazır (${matched} tanesi personel kaydına bağlı).`);
console.log(`  bağlanamayan eğitmen adı serbest metin olarak yazılacak: ${plan.length - matched}`);
if (missingLecture.length > 0) {
  console.log(`  lectures koleksiyonunda bulunamayan ders: ${missingLecture.join(", ")}`);
}
if (emptyOfferings.length > 0) {
  console.log(`  içi boş olduğu için atlanan kayıt (${emptyOfferings.length}): ${emptyOfferings.join(", ")}`);
}

if (dryRun) {
  for (const p of plan) {
    gradeResult(p.offering.finalResult, `${p.code} NORMAL`);
    gradeResult(p.offering.butResult, `${p.code} BUT`);
  }
  const sample = plan.find((p) => !p.staffId) ?? plan[0];
  console.log(`\nörnek (personelsiz) gövde:`);
  console.log(
    JSON.stringify(
      {
        instructorRawName: sample.rawName,
        academicYear: clean(sample.offering.academicYear),
        semester: clean(sample.offering.semester),
        groupNumber: sample.offering.groupNumber,
      },
      null,
      1,
    ),
  );
  const grades = plan.filter((p) => p.offering.finalResult).length;
  const buts = plan.filter((p) => p.offering.butResult).length;
  const stats = plan.reduce((n, p) => n + (p.offering.examStatistics?.length ?? 0), 0);
  console.log(`\nyazılacak: ${plan.length} kayıt, ${grades} normal + ${buts} bütünleme sonucu, ${stats} sınav istatistiği`);
  if (droppedFields.length > 0) {
    console.log(`\nbackend enum'unda olmadığı için atlanan alan (${droppedFields.length}):`);
    for (const f of droppedFields) console.log(`  ${f}`);
  }
  process.exit(0);
}

let created = 0;
let skipped = 0;
let gradeWrites = 0;
let statWrites = 0;
const rejectedTypes = {};

for (const entry of plan) {
  const { code, lectureId, offering, rawName, staffId } = entry;
  const year = clean(offering.academicYear);
  const semester = clean(offering.semester);
  const group = offering.groupNumber;

  const existing = await api(`/lectures/${lectureId}/offerings`);
  const rows = existing?.data ?? existing ?? [];
  const already = (Array.isArray(rows) ? rows : []).find(
    (r) => clean(r.academicYear) === year && clean(r.semester) === semester && r.groupNumber === group,
  );

  let offeringId;
  if (already) {
    offeringId = already.id;
    skipped += 1;
    console.log(`  mevcut      ${code.padEnd(9)} ${year} ${semester} grup ${group}`);
  } else {
    const body = { academicYear: year, semester };
    if (Number.isFinite(group)) body.groupNumber = group;
    if (staffId) body.staffId = staffId;
    if (rawName) body.instructorRawName = rawName;
    const made = await api(`/lectures/${lectureId}/offerings`, {
      method: "POST",
      body: JSON.stringify(body),
    });
    offeringId = (made?.data ?? made)?.id;
    created += 1;
    console.log(`  olusturuldu ${code.padEnd(9)} ${year} ${semester} grup ${group}${staffId ? "" : "  (serbest ad)"}`);
  }

  if (!offeringId) continue;

  for (const [period, source] of [
    ["NORMAL", offering.finalResult],
    ["BUT", offering.butResult],
  ]) {
    const result = gradeResult(source, `${code} ${period}`);
    if (!result) continue;
    await api(`/lecture-offerings/${offeringId}/grade-results/${period}`, {
      method: "PUT",
      body: JSON.stringify(result),
    });
    gradeWrites += 1;
  }

  const seenTypes = new Set();
  for (const stat of offering.examStatistics ?? []) {
    const examType = clean(stat.examType);
    if (!examType || seenTypes.has(examType)) continue;
    seenTypes.add(examType);
    const written = await api(
      `/lecture-offerings/${offeringId}/exam-statistics/${examType}`,
      { method: "PUT", body: JSON.stringify(examStatistic(stat)) },
      { tolerate: [409] },
    );
    if (written?.__rejected) rejectedTypes[examType] = (rejectedTypes[examType] ?? 0) + 1;
    else statWrites += 1;
  }
}

console.log(
  `\nbitti: ${created} kayıt oluşturuldu, ${skipped} mevcut, ${gradeWrites} harf sonucu, ${statWrites} sınav istatistiği yazıldı.`,
);
