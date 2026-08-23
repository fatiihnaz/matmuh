import { getCurriculum, getCurriculumSummary } from "@/data/curriculum";

import CurriculumPage from "./components/CurriculumPage";

export const metadata = {
  title: "Müfredat & Dersler",
  description: "Matematik Mühendisliği Bölümü lisans programı ders planı ve kredi bilgileri",
};

export default async function Page() {
  const [semesters, summary] = await Promise.all([getCurriculum(), getCurriculumSummary()]);
  return <CurriculumPage semesters={semesters} summary={summary} />;
}
