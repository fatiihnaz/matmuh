import { notFound } from "next/navigation";

import SubHeader from "@/app/components/Header/SubHeader";
import { getStaff } from "@/app/lib/staff.js";
import { getWeeklySchedule } from "@/data/schedule";
import { fullName } from "@/lib/person";
import StaffDetail from "./components/StaffDetail";

async function findPerson(slug) {
  const people = await getStaff();
  return people.find((person) => person.slug === slug) ?? null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const person = await findPerson(slug);
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
  const person = await findPerson(slug);
  if (!person) notFound();

  const { entries } = await getWeeklySchedule({ staffId: person.id });
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
