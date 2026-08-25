"use client";

import { Mail } from "lucide-react";

import Avatar from "@/app/components/Avatar";
import { fullName, useStaff } from "@/app/components/PersonRow";

export default function ManagementRows({ initialStaff = [] }) {
  const { people } = useStaff(initialStaff);
  const management = people.filter((person) => person.groups?.includes("MANAGEMENT"));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {management.map((person, idx) => {
        const name = fullName(person);
        return (
          <div
            key={person.slug}
            className="flex items-center gap-3 p-2.5 rounded-lg bg-primary-500/2 border border-primary-500/5"
          >
            <Avatar name={name} idx={idx} />
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
                title="E-posta gönder"
                className="shrink-0 flex items-center justify-center size-7 rounded-lg text-primary-500/70 hover:bg-secondary-500/10 hover:text-secondary-700 transition-colors"
              >
                <Mail className="size-3.5" />
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}
