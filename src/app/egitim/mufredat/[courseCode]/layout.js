import SubHeader from "../../../components/Header/SubHeader";
import { getCourseByCode } from "@/data/courses";
import { notFound } from "next/navigation";

export default async function CourseLayout({ params, children }) {
  const { courseCode } = await params;
  const course = await getCourseByCode(courseCode);

  if (!course) notFound();

  const detailString = `${course.semester}. Yarıyıl · ${course.type} · ${course.hours} · ${course.ects} ECTS`;

  return (
    <>
      <SubHeader 
        title={`${course.id} — ${course.title}`} 
        subTitle={detailString} 
      />
      {children}
    </>
  );
}