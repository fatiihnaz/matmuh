import { notFound } from "next/navigation";
import { getAllCourseCodes, getCourseByCode } from "@/data/courses";
import CourseInfo from "./components/CourseInfo";

export const dynamicParams = true;

export async function generateStaticParams() {
  const codes = await getAllCourseCodes();
  return codes.map((courseCode) => ({ courseCode }));
}

export async function generateMetadata({ params }) {
  const { courseCode } = await params;
  const course = await getCourseByCode(courseCode);
  if (!course) return { title: "Ders bulunamadı" };

  return {
    title: `${course.title} (${course.code})`,
    description: `${course.title} dersi içeriği, kredi ve AKTS bilgileri, ölçme değerlendirme kriterleri.`,
  };
}

export default async function CoursePage({ params }) {
  const { courseCode } = await params;
  const course = await getCourseByCode(courseCode);
  if (!course) notFound();

  return (
    <div className="container mx-auto">
      <CourseInfo course={course} />
    </div>
  );
}
