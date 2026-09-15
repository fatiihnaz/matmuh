import { Mail, ExternalLink, Phone, MapPin } from "lucide-react";

import Avatar from "@/app/components/Avatar";
import Panel from "@/app/components/Panel";
import PageSection from "@/app/components/PageSection";
import StaffSchedule from "./StaffSchedule";
import StaffOfferings from "./StaffOfferings";
import StaffNotes from "./StaffNotes";
import { fullName } from "@/lib/person";
import { safeHref } from "@/lib/href";

const LINE = "flex items-center gap-2.5 text-[13px] text-primary-500/70";

function Contact({ person }) {
  const avesis = safeHref(person.avesisLink);
  const office = person.office ?? "";
  const isRoom = office && (office.includes("-") || /^\d+$/.test(office));

  return (
    <div className="flex flex-col gap-2.5">
      {office && (
        <span className={LINE}>
          <MapPin className="size-4 shrink-0 text-secondary-700" />
          {isRoom ? `Oda ${office}` : office}
        </span>
      )}
      {person.phone && (
        <span className={LINE}>
          <Phone className="size-4 shrink-0 text-secondary-700" />
          {person.phone}
        </span>
      )}
      {person.email && (
        <a className={`${LINE} hover:text-secondary-700 transition-colors`} href={`mailto:${person.email}`}>
          <Mail className="size-4 shrink-0 text-secondary-700" />
          <span className="break-all">{person.email}</span>
        </a>
      )}
      {avesis && (
        <a
          className={`${LINE} hover:text-secondary-700 transition-colors`}
          href={avesis}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink className="size-4 shrink-0 text-secondary-700" />
          AVESİS profili
        </a>
      )}
    </div>
  );
}

export default function StaffDetail({ person, entries }) {
  const name = fullName(person);

  return (
    <div className="flex flex-col gap-8">
      <Panel padding="p-5 sm:p-6">
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left">
          <Avatar
            name={name}
            photo={person.photo}
            idx={0}
            size="h-24 w-24 shrink-0"
            textSize="font-sans text-xl tracking-wider"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div>
              <h2 className="text-base font-semibold text-primary-600 wrap-break-word">
                {person.academicTitle} {name}
              </h2>
              {person.role && (
                <p className="mt-1 text-[13px] font-medium text-secondary-700">
                  {person.role}
                </p>
              )}
            </div>
            <Contact person={person} />
          </div>
        </div>
      </Panel>

      {entries.length > 0 && (
        <PageSection title="Haftalık Ders Programı">
          <StaffSchedule entries={entries} />
        </PageSection>
      )}

      <PageSection title="Verdiği Dersler">
        <StaffOfferings staffId={person.id} />
      </PageSection>

      <PageSection title="Ders Notları">
        <StaffNotes staffId={person.id} />
      </PageSection>
    </div>
  );
}
