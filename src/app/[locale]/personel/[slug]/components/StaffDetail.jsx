import { Mail, ExternalLink, Phone, MapPin } from "lucide-react";

import Avatar from "@/app/components/Avatar";
import Panel from "@/app/components/Panel";
import PageSection from "@/app/components/PageSection";
import StaffSchedule from "./StaffSchedule";
import StaffOfferings from "./StaffOfferings";
import StaffNotes from "./StaffNotes";
import { fullName } from "@/lib/person";
import { safeHref } from "@/lib/href";
import { translate } from "@/i18n";

const LINE = "flex items-center gap-2.5 text-[13px] text-primary-500/70";

function Contact({ person, locale }) {
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
          {translate(locale, "AVESİS profili")}
        </a>
      )}
    </div>
  );
}

export default function StaffDetail({ person, entries, locale }) {
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
            <Contact person={person} locale={locale} />
          </div>
        </div>
      </Panel>

      {entries.length > 0 && (
        <PageSection title={translate(locale, "Haftalık Ders Programı")}>
          <StaffSchedule entries={entries} />
        </PageSection>
      )}

      <PageSection title={translate(locale, "Verdiği Dersler")}>
        <StaffOfferings staffId={person.id} />
      </PageSection>

      <PageSection title={translate(locale, "Ders Notları")}>
        <StaffNotes staffId={person.id} />
      </PageSection>
    </div>
  );
}
