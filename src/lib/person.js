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

export function fullName(person) {
  return [person?.firstName, person?.lastName].filter(Boolean).join(" ");
}
