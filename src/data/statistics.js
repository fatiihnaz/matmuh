import { obsdata } from "./obsdata";

const SEMESTER_ORDER = { FALL: 0, SPRING: 1, SUMMER: 2 };
const SEMESTER_LABEL = { FALL: "Güz", SPRING: "Bahar", SUMMER: "Yaz" };

export const termLabel = (offering) =>
  `${offering.academicYear} ${SEMESTER_LABEL[offering.semester] ?? offering.semester}`;

export const termOrder = (offering) =>
  parseInt(offering.academicYear, 10) * 10 + (SEMESTER_ORDER[offering.semester] ?? 9);

const instructorLabel = (instructor) => instructor?.rawName ?? "Atanmamış Eğitmen";

const instructorKey = (instructor) =>
  instructor?.staffId ? `staff:${instructor.staffId}` : `name:${instructorLabel(instructor)}`;

const toDistribution = (result) =>
  (result?.gradeDistributions ?? []).map((row) => ({
    grade: row.letterGrade,
    start: row.minScore,
    end: row.maxScore,
    count: row.studentCount,
  }));

const toExams = (offering) =>
  (offering.examStatistics ?? []).map((exam) => ({
    type: exam.examType ?? null,
    name: exam.name,
    weight: exam.weightPercent,
    average: exam.averageScore,
    attended: exam.attendedStudentCount,
    total: exam.totalStudentCount ?? null,
    absent: exam.absentStudentCount ?? null,
    failedByAbsence: exam.failedByAbsenceCount ?? null,
  }));

const toSection = (offering) => ({
  section: String(offering.groupNumber),
  summary: {
    average: offering.finalResult?.classAverage ?? null,
    stdDev: offering.finalResult?.standardDeviation ?? null,
    participantCount: offering.finalResult?.participantCount ?? null,
    evaluationMethod: offering.finalResult?.evaluationMethod ?? null,
    resultDate: offering.finalResult?.resultDate ?? null,
  },
  gradeDistribution: toDistribution(offering.finalResult),
  makeupDistribution: toDistribution(offering.butResult),
  exams: toExams(offering),
});

export function toViewModel(offerings = []) {
  const terms = new Map();

  for (const offering of offerings) {
    const label = termLabel(offering);
    if (!terms.has(label)) {
      terms.set(label, { name: label, order: termOrder(offering), instructors: new Map() });
    }
    const term = terms.get(label);

    const key = instructorKey(offering.instructor);
    if (!term.instructors.has(key)) {
      term.instructors.set(key, {
        name: instructorLabel(offering.instructor),
        staffId: offering.instructor?.staffId ?? null,
        sections: [],
      });
    }
    term.instructors.get(key).sections.push(toSection(offering));
  }

  return [...terms.values()]
    .map((term) => ({
      name: term.name,
      order: term.order,
      instructors: [...term.instructors.values()]
        .map((instructor) => ({
          ...instructor,
          sections: instructor.sections.sort(
            (a, b) => Number(a.section) - Number(b.section),
          ),
        }))
        .sort((a, b) => a.name.localeCompare(b.name, "tr")),
    }))
    .sort((a, b) => b.order - a.order);
}

export function getCourseStatistics(courseCode) {
  const course = obsdata.find((c) => c.code === courseCode);
  if (!course) return null;
  return { code: course.code, name: course.name, terms: toViewModel(course.offerings) };
}
