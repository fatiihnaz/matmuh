"use client";

import { Github, Linkedin, Globe, Mail } from "lucide-react";

import Avatar from "@/app/components/Avatar";
import { safeHref, isExternalHref } from "@/lib/href";

const ICONS = { github: Github, linkedin: Linkedin, site: Globe, mail: Mail };

export default function CreditCard({ person, idx }) {
  const links = (person?.links ?? []).filter((link) => link?.link?.href);

  return (
    <div className="flex w-full max-w-72 flex-col items-center gap-3 rounded-xl border border-white/10 bg-primary-700/55 px-5 py-6 text-center backdrop-blur-md transition-colors hover:border-secondary-500/40">
      <Avatar
        name={person?.name || "?"}
        photo={person?.photo}
        idx={idx}
        size="size-20"
        textSize="text-lg"
      />

      <div className="min-w-0">
        <p className="text-sm font-semibold text-white">{person?.name}</p>
        {person?.role && (
          <p className="mt-0.5 text-[11px] tracking-wide text-secondary-500">{person.role}</p>
        )}
      </div>

      {links.length > 0 && (
        <div className="flex items-center gap-1.5">
          {links.map((link, index) => {
            const Icon = ICONS[link.icon] ?? Globe;
            const href = safeHref(link.link.href);
            const external = isExternalHref(href);
            return (
              <a
                key={index}
                href={href}
                aria-label={link.link.label || link.icon}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex size-8 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-white/10 hover:text-secondary-500"
              >
                <Icon size={15} strokeWidth={1.5} />
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
