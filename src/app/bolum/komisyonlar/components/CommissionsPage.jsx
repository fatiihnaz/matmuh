"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import PageLayout from "@/app/components/PageLayout";
import SubHeader from "@/app/components/Header/SubHeader";
import Panel from "@/app/components/Panel";
import PageSection from "@/app/components/PageSection";
import Avatar from "@/app/components/Avatar";
import DocumentLink from "@/app/components/DocumentLink";
import { COMMISSIONS, COMMISSIONS_SOURCE } from "@/data/commissions";

function classifyRole(role) {
  if (role === "Komisyon Başkanı") return { isChair: true, tag: null };
  if (role === "Komisyon Üyeleri") return { isChair: false, tag: null };
  const parenthetical = role.match(/\(([^)]+)\)/);
  return { isChair: false, tag: parenthetical ? parenthetical[1] : role };
}

function flattenMembers(commission) {
  const members = [];
  commission.roles.forEach((roleGroup) => {
    const { isChair, tag } = classifyRole(roleGroup.role);
    roleGroup.members.forEach((member) => members.push({ ...member, isChair, tag }));
  });
  return members;
}

function CommissionCard({ commission }) {
  const [open, setOpen] = useState(false);
  const members = flattenMembers(commission);
  const chair = members.find((m) => m.isChair);
  const rest = members.filter((m) => !m.isChair);

  return (
    <div className="rounded-lg border border-primary-500/5 bg-primary-500/2 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-primary-500/3 transition-colors"
      >
        {chair && <Avatar name={chair.name} size="size-8" textSize="text-[10px]" />}
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] font-semibold text-primary-500 leading-snug">
            {commission.name}
          </span>
          <span className="block text-[11px] text-primary-500/45 truncate">
            {chair ? `${chair.rank} ${chair.name}` : `${members.length} üye`}
          </span>
        </span>
        <span className="shrink-0 text-[10px] text-primary-500/35">{members.length}</span>
        <ChevronDown
          className={`shrink-0 size-4 text-primary-500/30 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="px-4 pb-4 pt-3 flex flex-col gap-2 border-t border-primary-500/5">
          {rest.map((member, idx) => (
            <div key={`${member.name}-${member.tag ?? "u"}`} className="flex items-center gap-2.5">
              <Avatar name={member.name} idx={idx + 1} size="size-7" textSize="text-[9px]" />
              <span className="text-[12px] text-primary-500/70 leading-snug">
                {member.rank} {member.name}
                {member.tag && (
                  <span className="ml-1.5 text-[10px] font-medium text-secondary-500">
                    {member.tag}
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CommissionsPage() {
  return (
    <>
      <SubHeader
        title="Komisyonlar"
        subTitle={`Bölüm komisyonları ve üyeleri · ${COMMISSIONS_SOURCE.date}`}
      />
      <PageLayout>
        <div className="flex flex-col gap-8">
          <PageSection title="Bölüm Komisyonları" count={COMMISSIONS.length}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
              {COMMISSIONS.map((commission) => (
                <CommissionCard key={commission.name} commission={commission} />
              ))}
            </div>
          </PageSection>

          <PageSection title="Belgeler">
            <Panel>
              <DocumentLink
                label={`${COMMISSIONS_SOURCE.label} (${COMMISSIONS_SOURCE.date})`}
                kind="pdf"
                href={COMMISSIONS_SOURCE.href}
              />
            </Panel>
          </PageSection>
        </div>
      </PageLayout>
    </>
  );
}
