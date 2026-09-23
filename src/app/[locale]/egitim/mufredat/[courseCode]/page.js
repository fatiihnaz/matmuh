import { notFound } from "next/navigation";

import { getCourseByCode } from "@/data/curriculum";
import { getCourseSections } from "@/data/schedule";

import CourseInfo from "./components/CourseInfo";

export async function generateMetadata({ params }) {
  const { courseCode, locale } = await params;
  const course = await getCourseByCode(courseCode, locale);
  if (!course) return { title: "Ders bulunamadı" };

  return {
    title: `${course.title} (${course.code})`,
    description: `${course.title} dersi içeriği, kredi ve AKTS bilgileri, ölçme değerlendirme kriterleri.`,
  };
}

export default async function CoursePage({ params }) {
  const { courseCode, locale } = await params;
  const course = await getCourseByCode(courseCode, locale);
  if (!course) notFound();

  const sections = await getCourseSections(course.code);

  return (
    <div className="container mx-auto">
      <CourseInfo course={course} sections={sections} />
    </div>
  );
}
