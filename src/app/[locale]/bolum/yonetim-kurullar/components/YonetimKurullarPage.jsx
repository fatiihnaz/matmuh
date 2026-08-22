import { EditableRegion } from "inscribed";

import PageLayout from "@/app/components/PageLayout";
import SubHeader from "@/app/components/Header/SubHeader";
import Panel from "@/app/components/Panel";
import PageSection from "@/app/components/PageSection";
import PersonRow from "@/app/components/PersonRow";
import AdvisoryBoard from "./AdvisoryBoard";

const MANAGEMENT_IDS = ["tasci", "sonar"];

export default function YonetimKurullarPage() {
  return (
    <>
      <SubHeader
        title={
          <EditableRegion
            blockPath="page.title"
            blockType="ShortText"
            defaultValue="Yönetim & Kurullar"
          />
        }
        subTitle={
          <EditableRegion
            blockPath="page.subtitle"
            blockType="ShortText"
            defaultValue="Bölüm yönetimi ve Danışma Kurulu"
          />
        }
      />
      <PageLayout>
        <div className="flex flex-col gap-8">
          <PageSection
            title={
              <EditableRegion
                blockPath="management.title"
                blockType="ShortText"
                defaultValue="Bölüm Yönetimi"
              />
            }
          >
            <Panel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {MANAGEMENT_IDS.map((id, idx) => (
                  <PersonRow key={id} id={id} idx={idx} />
                ))}
              </div>
            </Panel>
          </PageSection>

          <AdvisoryBoard />
        </div>
      </PageLayout>
    </>
  );
}
