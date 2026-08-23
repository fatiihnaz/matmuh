import { cache } from "react";
import { getCmsCollection, getCmsCollectionItem } from "inscribed/server";

import { cmsConfig } from "@/app/lib/cms-config.js";

const PAGE = 100;
const TERMS = [1, 2, 3, 4, 5, 6, 7, 8];

const emptyPage = { items: [], total: 0 };

function semesterName(term) {
  return `${Math.ceil(term / 2)}. Yıl - ${term % 2 === 1 ? "Güz" : "Bahar"} Yarıyılı`;
}

function hoursOf(lecture) {
  const { theoryHours: t, practiceHours: p, labHours: l } = lecture;
  if (t == null && p == null && l == null) return null;
  return `${t ?? 0}+${p ?? 0}+${l ?? 0}`;
}

function uniform(values) {
  const seen = new Set(values.filter((v) => v != null));
  return seen.size === 1 ? [...seen][0] : null;
}

const fetchAll = cache(async (key) => {
  const out = [];
  for (let offset = 0; ; offset += PAGE) {
    const page = await getCmsCollection(cmsConfig, key, { limit: PAGE, offset }).catch(
      () => emptyPage,
    );
    out.push(...(page.items ?? []));
    if (out.length >= (page.total ?? 0) || (page.items ?? []).length === 0) break;
  }
  return out;
});

export const getLectures = cache(async () =>
  (await fetchAll("lectures")).map((item) => ({ ...item.data, slug: item.slug })),
);

const getElectiveGroups = cache(async () =>
  (await fetchAll("elective-groups")).map((item) => ({ ...item.data, slug: item.slug })),
);

function courseRow(lecture) {
  const internal = `/egitim/mufredat/${lecture.code}`;
  const offsite = !lecture.about && Boolean(lecture.bolognaLink);
  return {
    isGroup: false,
    code: lecture.code,
    name: (lecture.name ?? lecture.code).trim(),
    hours: hoursOf(lecture) ?? "-",
    ects: lecture.ects ?? "-",
    status: lecture.type === "REQUIRED" ? "Zorunlu" : "Seçmeli",
    href: offsite ? lecture.bolognaLink : internal,
    external: offsite,
  };
}

function groupRow(group, byId) {
  const options = (group.options ?? []).map((o) => byId.get(o.id)).filter(Boolean);
  const rows = options.map(courseRow);
  return {
    isGroup: true,
    code: group.code,
    groupTitle: group.name,
    note: group.about || null,
    hours: group.weeklyHours ?? uniform(options.map(hoursOf)) ?? "-",
    ects: group.ects ?? uniform(options.map((o) => o.ects)) ?? "-",
    selectionCount: group.selectionCount ?? 1,
    options: rows,
  };
}

const byCode = (a, b) => a.code.localeCompare(b.code, "tr");

export const getCurriculum = cache(async () => {
  const [lectures, groups] = await Promise.all([getLectures(), getElectiveGroups()]);

  const byId = new Map(lectures.map((l) => [l.id, l]));
  const inGroup = new Set();
  for (const group of groups) {
    for (const option of group.options ?? []) inGroup.add(option.id);
  }

  return TERMS.map((term) => {
    const courses = lectures
      .filter((l) => l.term === term && !inGroup.has(l.id))
      .map(courseRow)
      .sort(byCode);
    const slots = groups
      .filter((g) => g.term === term)
      .map((g) => groupRow(g, byId))
      .sort(byCode);
    const rows = [...courses, ...slots];
    const totalEcts = rows.reduce((sum, r) => sum + (Number(r.ects) || 0), 0);
    return { number: term, name: semesterName(term), totalEcts, rows };
  });
});

export const getCurriculumSummary = cache(async () => {
  const semesters = await getCurriculum();
  const active = semesters.filter((s) => s.rows.length > 0);
  return {
    termCount: active.length,
    totalEcts: active.reduce((sum, s) => sum + s.totalEcts, 0),
    courseCount: active.reduce((sum, s) => sum + s.rows.length, 0),
    yearCount: Math.ceil(active.length / 2),
  };
});

export const getLectureBySlug = cache(async (slug) => {
  const item = await getCmsCollectionItem(cmsConfig, "lectures", slug).catch(() => null);
  return item ? { ...item.data, slug: item.slug } : null;
});
