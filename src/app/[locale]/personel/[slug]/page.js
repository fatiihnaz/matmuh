import { notFound } from "next/navigation";

import SubHeader from "@/app/components/Header/SubHeader";
import { getStaff } from "@/app/lib/staff.js";
import { getWeeklySchedule } from "@/data/schedule";
import { fullName, localizePerson } from "@/lib/person";
import StaffDetail from "./components/StaffDetail";

async function findPerson(slug, locale) {
  const people = await getStaff();
  return localizePerson(people.find((person) => person.slug === slug) ?? null, locale);
}

export async function generateMetadata({ params }) {
  const { slug, locale } = await params;
  const person = await findPerson(slug, locale);
  if (!person) return {};
  const name = [person.academicTitle, fullName(person)].filter(Boolean).join(" ");
  return {
    title: name,
    description: [name, person.role, "Matematik Mühendisliği Bölümü"]
      .filter(Boolean)
      .join(" · "),
  };
}

export default async function Page({ params }) {
  const { slug, locale } = await params;
  const person = await findPerson(slug, locale);
  if (!person) notFound();

  const { entries } = await getWeeklySchedule({ staffId: person.id, locale });
  const name = fullName(person);

  return (
    <>
      <SubHeader
        title={[person.academicTitle, name].filter(Boolean).join(" ")}
        subTitle={person.role}
        lastLabel={name}
      />
      <StaffDetail person={person} entries={entries} locale={locale} />
    </>
  );
}
