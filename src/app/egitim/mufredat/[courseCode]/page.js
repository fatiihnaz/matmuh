import { getCourseByCode } from "@/data/courses";
import { notFound } from "next/navigation";
import CourseInfo from "./components/CourseInfo";

export default async function CoursePage({ params }) {
  const { courseCode } = await params;
  const course = await getCourseByCode(courseCode);

  return (
    <div className="container mx-auto">
      <CourseInfo course={course} />
    </div>
  );
}