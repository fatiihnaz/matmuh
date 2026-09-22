const pick = (tr, en, locale) =>
  locale === "en" && typeof en === "string" && en.trim() ? en : tr;

export function localizePerson(person, locale) {
  if (!person || locale !== "en") return person;
  return {
    ...person,
    role: pick(person.role, person.roleEn, locale),
    officeHours: (person.officeHours ?? []).map((hour) => ({
      ...hour,
      description: pick(hour.description, hour.descriptionEn, locale),
    })),
  };
}

const LEADERSHIP_RANK = {
  "Bölüm Başkanı": 0,
  "Head of Department": 0,
  "Bölüm Başkan Yardımcısı": 1,
  "Deputy Head of Department": 1,
};

const leadershipRank = (person) => LEADERSHIP_RANK[person?.role?.trim()] ?? 2;

export const byLeadership = (a, b) => leadershipRank(a) - leadershipRank(b);

export function contactLine(person, t, { withRole = true } = {}) {
  return [
    withRole && person.role,
    person.office && `${t("Oda")} ${person.office}`,
    person.phone,
  ]
    .filter(Boolean)
    .join(" · ");
}

export function fullName(person) {
  return [person?.firstName, person?.lastName].filter(Boolean).join(" ");
}
