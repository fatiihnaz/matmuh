import { notFound } from "next/navigation";

import { getCourseByCode } from "@/data/curriculum";
import { getCourseSections } from "@/data/schedule";
import { getStaff } from "@/app/lib/staff.js";

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

  const [rawSections, staff] = await Promise.all([getCourseSections(course.code), getStaff()]);
  const slugById = new Map(staff.map((person) => [person.id, person.slug]));
  const sections = rawSections.map((section) => ({
    ...section,
    staffSlug: slugById.get(section.staffId) ?? null,
  }));

  return (
    <div className="container mx-auto">
      <CourseInfo course={course} sections={sections} />
    </div>
  );
}
