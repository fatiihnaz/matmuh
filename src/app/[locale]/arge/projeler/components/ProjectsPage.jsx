import { EditableRegion } from "inscribed";

import PageLayout from "@/app/components/PageLayout";
import SubHeader from "@/app/components/Header/SubHeader";
import PageSection from "@/app/components/PageSection";
import PendingContent from "@/app/components/PendingContent";
import ResearchLinks from "./ResearchLinks";

export default function ProjectsPage() {
  return (
    <>
      <SubHeader
        title={
          <EditableRegion
            blockPath="page.title"
            blockType="ShortText"
            defaultValue="Devam Eden Projeler"
          />
        }
        subTitle={
          <EditableRegion
            blockPath="page.subtitle"
            blockType="ShortText"
            defaultValue="Bölümde yürütülen araştırma projeleri"
          />
        }
      />
      <PageLayout>
        <div className="flex flex-col gap-8">
          <PendingContent>
            <EditableRegion
              blockPath="pending.body"
              blockType="LongText"
              defaultValue="Devam eden proje listesi güncellenmektedir. Bölüm öğretim üyelerinin yürüttüğü güncel projelere aşağıdaki kaynaklardan ulaşabilirsiniz."
            />
          </PendingContent>

          <PageSection
            title={
              <EditableRegion
                blockPath="resources.title"
                blockType="ShortText"
                defaultValue="Proje Kaynakları"
              />
            }
          >
            <ResearchLinks />
          </PageSection>
        </div>
      </PageLayout>
    </>
  );
}
