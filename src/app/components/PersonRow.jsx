"use client";

import { Mail } from "lucide-react";
import { useCollection } from "inscribed/collections";

import Avatar from "./Avatar";

export const STAFF_WINDOW = { limit: 100 };

export function staffKey(value) {
  return String(value ?? "")
    .trim()
    .split("@")[0]
    .toLocaleLowerCase("tr");
}

export function fullName(person) {
  return [person?.firstName, person?.lastName].filter(Boolean).join(" ");
}

export function useStaff(initial = []) {
  const { items, isLoading, error } = useCollection("staff", STAFF_WINDOW);
  const people = (items ?? []).map((item) => ({
    ...item.data,
    slug: item.slug,
  }));
  const roster = people.length > 0 ? people : initial;
  return { people: roster, isLoading, error };
}

export function findPerson(people, id) {
  const key = staffKey(id);
  return people.find((person) => staffKey(person.email) === key);
}

export default function PersonRow({ id, idx = 0, staff = [] }) {
  const { people } = useStaff(staff);
  const person = findPerson(people, id);
  if (!person) return null;

  const name = fullName(person);

  return (
    <div className="flex items-center gap-3 p-2.5 rounded-lg bg-primary-500/2 border border-primary-500/5">
      <Avatar name={name} photo={person.photo} idx={idx} />
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-medium text-primary-500 leading-snug wrap-break-word">
          {person.academicTitle} {name}
        </span>
        <span className="block text-[11px] text-primary-500/70 wrap-break-word">
          {person.role && `${person.role} · `}
          Oda {person.office} · {person.phone}
        </span>
      </span>
      {person.email && (
        <a
          href={`mailto:${person.email}`}
          aria-label={`${name} kişisine e-posta gönder`}
          className="shrink-0 flex items-center justify-center size-7 rounded-lg text-primary-500/70 hover:bg-secondary-500/10 hover:text-secondary-700 transition-colors"
        >
          <Mail className="size-3.5" />
        </a>
      )}
    </div>
  );
}
