"use client";

import { Github, Linkedin, Globe, Mail } from "lucide-react";

import Avatar from "@/app/components/Avatar";
import { safeHref, isExternalHref } from "@/lib/href";

export const LINK_FIELDS = [
  { key: "github", Icon: Github, label: "GitHub" },
  { key: "linkedin", Icon: Linkedin, label: "LinkedIn" },
  { key: "site", Icon: Globe, label: "Site" },
  { key: "mail", Icon: Mail, label: "E-posta" },
];

export default function CreditCard({ person, idx, coord, markClassName = "" }) {
  const links = LINK_FIELDS.map((field) => ({
    ...field,
    href: safeHref(person?.[field.key]?.href),
  })).filter((link) => link.href);

  return (
    <div className="group relative flex w-full max-w-80 flex-col items-center gap-4 rounded-xl border border-white/8 bg-primary-700/30 px-6 py-8 text-center backdrop-blur-[2px] transition-colors duration-300 hover:border-secondary-500/45 hover:bg-primary-700/50">
      <span
        aria-hidden
        className={`absolute right-3.5 top-3.5 flex items-center gap-1 font-mono text-[10px] tracking-widest text-secondary-500/35 transition-colors duration-300 group-hover:text-secondary-500/70 ${markClassName}`}
      >
        <span className="size-1 rounded-full bg-secondary-500/60" />
        {coord}
      </span>

      <Avatar
        name={person?.name || "?"}
        photo={person?.photo}
        idx={idx}
        size="size-28"
        textSize="text-2xl"
      />

      <div className="min-w-0">
        <p className="text-base font-semibold text-white">{person?.name}</p>
        {person?.role && (
          <p className="mt-1 text-xs tracking-wide text-secondary-500">{person.role}</p>
        )}
        {person?.about && (
          <p className="mt-2.5 text-[12px] leading-relaxed text-neutral-400">{person.about}</p>
        )}
      </div>

      {links.length > 0 && (
        <div className="flex items-center gap-2">
          {links.map(({ key, Icon, label, href }) => {
            const external = isExternalHref(href);
            return (
              <a
                key={key}
                href={href}
                aria-label={`${person?.name ?? ""} ${label}`}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex size-9 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-white/10 hover:text-secondary-500"
              >
                <Icon size={16} strokeWidth={1.5} />
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
