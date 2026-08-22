import { EditableRegion } from "inscribed";

import PageLayout from "@/app/components/PageLayout";
import SubHeader from "@/app/components/Header/SubHeader";
import PendingContent from "@/app/components/PendingContent";
import LaboratoryList from "./LaboratoryList";

export default function LaboratoriesPage() {
  return (
    <>
      <SubHeader
        title={
          <EditableRegion
            blockPath="page.title"
            blockType="ShortText"
            defaultValue="Laboratuvarlar"
          />
        }
        subTitle={
          <EditableRegion
            blockPath="page.subtitle"
            blockType="ShortText"
            defaultValue="Bölüm laboratuvarları ve donanımları"
          />
        }
      />
      <PageLayout>
        <div className="flex flex-col gap-8">
          <LaboratoryList />

          <PendingContent>
            <EditableRegion
              blockPath="pending.body"
              blockType="LongText"
              defaultValue="Laboratuvar donanım ve yazılım envanteri güncellenmektedir. Ayrıntılı bilgi için bölüm sekreterliğine başvurabilirsiniz."
            />
          </PendingContent>
        </div>
      </PageLayout>
    </>
  );
}
