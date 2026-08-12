import SubHeader from "../../../components/Header/SubHeader";
import { getCourseByCode } from "@/data/courses";
import { notFound } from "next/navigation";

export default async function CourseLayout({ params, children }) {
  const { courseCode } = await params;
  const course = await getCourseByCode(courseCode);

  if (!course) notFound();

  const detailString = [
    course.semester ? `${course.semester}. Yarıyıl` : null,
    course.type,
    course.hours,
    course.ects != null ? `${course.ects} ECTS` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <SubHeader
        title={`${course.code} - ${course.title.trim()}`}
        subTitle={detailString}
      />
      {children}
    </>
  );
}