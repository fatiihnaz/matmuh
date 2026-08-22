import { EditableRegion } from "inscribed";

import SubHeader from "@/app/components/Header/SubHeader";
import DepartmentInfo from "./components/DepartmentInfo";

export const metadata = {
  title: "Bölüm Hakkında",
  description:
    "Matematik Mühendisliği Bölümü tarihçesi, misyon ve vizyonu, çalışma alanları ve program bilgileri.",
};

export default function Page() {
  return (
    <>
      <SubHeader
        title={
          <EditableRegion
            blockPath="page.title"
            blockType="ShortText"
            defaultValue="Bölüm Hakkında"
          />
        }
        subTitle={
          <EditableRegion
            blockPath="page.subtitle"
            blockType="ShortText"
            defaultValue="Matematik Mühendisliği; Tarih, Vizyon & Çalışma Alanları"
          />
        }
      />
      <DepartmentInfo />
    </>
  );
}
