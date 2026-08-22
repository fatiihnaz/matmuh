import { readFileSync } from "node:fs";
import { staffData } from "../src/data/staff.js";

const GROUPS = {
  management: "MANAGEMENT",
  academics: "ACADEMIC",
  researchAssistants: "TEACHING_AND_RESEARCH",
  administrative: "ADMINISTRATIVE",
};

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

function isSurnameToken(token) {
  return /\p{L}/u.test(token) && token === token.toLocaleUpperCase("tr");
}

function splitName(raw) {
  const parts = String(raw).trim().split(/\s+/);
  let cut = parts.length - 1;
  while (cut > 0 && isSurnameToken(parts[cut - 1])) cut -= 1;
  return {
    firstName: parts.slice(0, cut).join(" "),
    lastName: parts.slice(cut).join(" "),
  };
}

function build() {
  const byEmail = new Map();
  for (const [key, group] of Object.entries(GROUPS)) {
    for (const person of staffData[key] ?? []) {
      const id = person.email ? person.email.split("@")[0] : person.id;
      const existing = byEmail.get(id);
      if (existing) {
        if (!existing.groups.includes(group)) existing.groups.push(group);
        if (person.title && !existing.role) existing.role = person.title;
        continue;
      }
      const { firstName, lastName } = splitName(person.name);
      byEmail.set(id, {
        firstName,
        lastName,
        groups: [group],
        role: person.title ?? "",
        academicTitle: person.rank ?? "",
        email: person.email ?? "",
        phone: person.phone ?? "",
        office: person.room ?? "",
        avesisLink: person.email ? `https://avesis.yildiz.edu.tr/${id}` : "",
      });
    }
  }
  return [...byEmail.values()];
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

const records = build();

if (dryRun) {
  console.log(JSON.stringify(records, null, 2));
  console.log(`\n${records.length} kayıt hazırlandı (yazılmadı).`);
  process.exit(0);
}

if (!process.env.CMS_URL) throw new Error("CMS_URL tanımlı değil.");
if (!process.env.CMS_IMPORT_TOKEN) {
  throw new Error(
    "CMS_IMPORT_TOKEN tanımlı değil. Editör olarak giriş yapıp DevTools > Application > Cookies " +
      "altındaki access_token değerini .env'e CMS_IMPORT_TOKEN olarak yaz. Token kısa ömürlüdür.",
  );
}

const existing = await api("/cms/collections/staff?limit=100");
const identity = (data) =>
  data?.email || `${data?.firstName ?? ""} ${data?.lastName ?? ""}`.trim();

const bySlug = new Map();
for (const item of existing.items ?? []) {
  bySlug.set(identity(item.data), item);
}

let created = 0;
let updated = 0;

for (const record of records) {
  const match = bySlug.get(identity(record));
  if (match) {
    await api(`/cms/collections/staff/${encodeURIComponent(match.slug)}`, {
      method: "PUT",
      body: JSON.stringify({ data: record, version: match.version }),
    });
    updated += 1;
    console.log(`guncellendi  ${record.firstName} ${record.lastName}`);
  } else {
    const item = await api("/cms/collections/staff", {
      method: "POST",
      body: JSON.stringify({ data: record }),
    });
    created += 1;
    console.log(`olusturuldu  ${record.firstName} ${record.lastName}  -> ${item.slug}`);
  }
}

console.log(`\nbitti: ${created} oluşturuldu, ${updated} güncellendi, toplam ${records.length}`);
