import { getCmsCollection } from "inscribed/server";

import { cmsConfig } from "./cms-config.js";

export async function getStaff() {
  const { items } = await getCmsCollection(cmsConfig, "staff", { limit: 100 }).catch(() => ({
    items: [],
  }));
  return items.map((item) => ({ ...item.data, slug: item.slug }));
}

const FACULTY_TITLES = ["Prof. Dr.", "Doç. Dr.", "Dr. Öğr. Üyesi"];

export async function getStaffCounts() {
  const people = await getStaff();
  const withTitle = (title) => people.filter((p) => p.academicTitle === title).length;

  return {
    professor: withTitle("Prof. Dr."),
    associate: withTitle("Doç. Dr."),
    assistant: withTitle("Dr. Öğr. Üyesi"),
    faculty: FACULTY_TITLES.reduce((total, title) => total + withTitle(title), 0),
    research: people.filter((p) => p.groups?.includes("TEACHING_AND_RESEARCH")).length,
  };
}
