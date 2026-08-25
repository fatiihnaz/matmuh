import { Mail, ExternalLink } from "lucide-react";

import Avatar from "@/app/components/Avatar";
import { safeHref } from "@/lib/href";
import { fullName } from "@/app/components/PersonRow";

export default function StaffMember({ member, idx }) {
  const name = fullName(member);
  const avesisUrl = safeHref(member.avesisLink);
  const office = member.office ?? "";
  const isRoomNumber = office && (office.includes("-") || /^\d+$/.test(office));

  return (
    <div className="group rounded-xl p-5 bg-white border border-primary-500/10 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-primary-500/20 hover:shadow-sm">
      <div className="flex flex-col items-center text-center">
        <Avatar
          name={name}
          photo={member.photo}
          idx={idx}
          size="mb-3 h-16 w-16 transition-transform duration-300 group-hover:scale-105"
          textSize="font-sans text-base tracking-wider"
        />

        <div className="font-sans text-sm font-semibold text-primary-500 leading-tight transition-colors duration-200 group-hover:text-secondary-700">
          {member.academicTitle} {name}
        </div>

        {member.role && (
          <div className="mt-1 font-sans text-xs font-semibold text-secondary-700 tracking-tight">
            {member.role}
          </div>
        )}

        <div className="mt-2 pt-1 font-sans text-xs text-primary-500/70 leading-tight">
          Tel: {member.phone}
        </div>

        <div className="mt-2">
          <span className="text-xs font-bold text-secondary-700 bg-secondary-500/10 px-2 py-1 rounded-md">
            {isRoomNumber ? `Oda: ${office}` : office}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2">
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="rounded-md p-1.5 text-primary-500/70 transition-all duration-200 hover:bg-secondary-500/10 hover:text-secondary-700"
              title="E-posta"
              onClick={(e) => e.stopPropagation()}
            >
              <Mail size={14} strokeWidth={2} />
            </a>
          )}

          {avesisUrl && (
            <a
              href={avesisUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md p-1.5 text-primary-500/70 transition-all duration-200 hover:bg-secondary-500/10 hover:text-secondary-700"
              title="AVESİS Profili"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={14} strokeWidth={2} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
