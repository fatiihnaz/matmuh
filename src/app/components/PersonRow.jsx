"use client";

import { Mail } from "lucide-react";
import { useCollection } from "inscribed/collections";

import Avatar from "./Avatar";

export const STAFF_WINDOW = { limit: 100 };

export function staffKey(person) {
  return String(person?.email ?? "").split("@")[0];
}

export function fullName(person) {
  return [person?.firstName, person?.lastName].filter(Boolean).join(" ");
}

export function useStaff() {
  const { items, isLoading, error } = useCollection("staff", STAFF_WINDOW);
  const people = (items ?? []).map((item) => ({ ...item.data, slug: item.slug }));
  return { people, isLoading, error };
}

export default function PersonRow({ id, idx = 0 }) {
  const { people } = useStaff();
  const person = people.find((candidate) => staffKey(candidate) === id);
  if (!person) return null;

  const name = fullName(person);

  return (
    <div className="flex items-center gap-3 p-2.5 rounded-lg bg-primary-500/2 border border-primary-500/5">
      <Avatar name={name} idx={idx} />
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-medium text-primary-500 leading-snug wrap-break-word">
          {person.academicTitle} {name}
        </span>
        <span className="block text-[11px] text-primary-500/45 wrap-break-word">
          {person.role && `${person.role} · `}
          Oda {person.office} · {person.phone}
        </span>
      </span>
      {person.email && (
        <a
          href={`mailto:${person.email}`}
          title="E-posta gönder"
          className="shrink-0 flex items-center justify-center size-7 rounded-lg text-primary-500/30 hover:bg-secondary-500/10 hover:text-secondary-500 transition-colors"
        >
          <Mail className="size-3.5" />
        </a>
      )}
    </div>
  );
}
