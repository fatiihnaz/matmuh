import { getCurriculum, getCurriculumSummary } from "@/data/curriculum";

import CurriculumPage from "./components/CurriculumPage";

export const metadata = {
  title: "Müfredat & Dersler",
  description: "Matematik Mühendisliği Bölümü lisans programı ders planı ve kredi bilgileri",
};

export default async function Page({ params }) {
  const { locale } = await params;
  const [semesters, summary] = await Promise.all([getCurriculum(locale), getCurriculumSummary()]);
  return <CurriculumPage semesters={semesters} summary={summary} />;
}
