import PageLayout from "@/app/components/PageLayout";
import SubHeader from "@/app/components/Header/SubHeader";
import Panel from "@/app/components/Panel";
import PageSection from "@/app/components/PageSection";
import PersonRow from "@/app/components/PersonRow";
import Avatar from "@/app/components/Avatar";
import { ADVISORY_BOARD, ADVISORY_BOARD_YEAR } from "@/data/departmentBoard";

const MANAGEMENT_IDS = ["tasci", "sonar"];

function BoardMemberRow({ member, idx }) {
  return (
    <div className="flex items-center gap-3 p-2.5 rounded-lg bg-primary-500/2 border border-primary-500/5">
      <Avatar name={member.name} idx={idx} />
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-medium text-primary-500 truncate">
          {member.rank && `${member.rank} `}
          {member.name}
        </span>
        <span className="block text-[11px] text-primary-500/50">
          {member.role}
        </span>
      </span>
    </div>
  );
}

export default function YonetimKurullarPage() {
  return (
    <>
      <SubHeader
        title="Yönetim & Kurullar"
        subTitle="Bölüm yönetimi ve Danışma Kurulu"
      />
      <PageLayout>
        <div className="flex flex-col gap-8">
          <PageSection title="Bölüm Yönetimi">
            <Panel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {MANAGEMENT_IDS.map((id, idx) => (
                  <PersonRow key={id} id={id} idx={idx} />
                ))}
              </div>
            </Panel>
          </PageSection>

          <PageSection
            title="Danışma Kurulu"
            count={ADVISORY_BOARD.length}
            action={
              <span className="shrink-0 text-[10px] font-semibold uppercase tracking-widest text-secondary-600 px-2 py-1 rounded bg-secondary-500/10">
                {ADVISORY_BOARD_YEAR} Güncel
              </span>
            }
          >
            <Panel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {ADVISORY_BOARD.map((member, idx) => (
                  <BoardMemberRow key={member.name} member={member} idx={idx} />
                ))}
              </div>
            </Panel>
          </PageSection>
        </div>
      </PageLayout>
    </>
  );
}
