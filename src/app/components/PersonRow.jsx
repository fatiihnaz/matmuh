import { Mail } from "lucide-react";
import { findStaffById } from "@/data/staff";
import Avatar from "./Avatar";

export default function PersonRow({ id, idx = 0 }) {
  const person = findStaffById(id);
  if (!person) return null;

  return (
    <div className="flex items-center gap-3 p-2.5 rounded-lg bg-primary-500/2 border border-primary-500/5">
      <Avatar name={person.name} idx={idx} />
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-medium text-primary-500 truncate">
          {person.rank} {person.name}
        </span>
        <span className="block text-[11px] text-primary-500/45">
          {person.title && `${person.title} · `}
          Oda {person.room} · {person.phone}
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
