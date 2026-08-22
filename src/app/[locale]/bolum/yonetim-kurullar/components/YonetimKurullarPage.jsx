import { EditableRegion } from "inscribed";

import PageLayout from "@/app/components/PageLayout";
import SubHeader from "@/app/components/Header/SubHeader";
import Panel from "@/app/components/Panel";
import PageSection from "@/app/components/PageSection";
import AdvisoryBoard from "./AdvisoryBoard";
import ManagementRows from "./ManagementRows";

export default function YonetimKurullarPage({ initialStaff = [] }) {
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
              <ManagementRows initialStaff={initialStaff} />
            </Panel>
          </PageSection>

          <AdvisoryBoard />
        </div>
      </PageLayout>
    </>
  );
}
