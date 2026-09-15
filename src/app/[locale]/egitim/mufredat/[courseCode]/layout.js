import { notFound } from "next/navigation";

import SubHeader from "@/app/components/Header/SubHeader";
import { translate } from "@/i18n";
import { getCourseByCode } from "@/data/curriculum";

export default async function CourseLayout({ params, children }) {
  const { courseCode, locale } = await params;
  const course = await getCourseByCode(courseCode);

  if (!course) notFound();

  const detailString = [
    course.semester
      ? `${course.semester}. ${translate(locale, "Yarıyıl")}`
      : null,
    translate(locale, course.type),
    course.hours,
    course.ects != null ? `${course.ects} ECTS` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <SubHeader
        title={`${course.code} · ${course.title}`}
        subTitle={detailString}
      />
      {children}
    </>
  );
}
