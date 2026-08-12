import { SEMESTERS, ELECTIVE_GROUPS, COURSE_DETAILS } from "./coursesData";

export async function getAllCourseCodes() {
  return Object.keys(COURSE_DETAILS);
}

export async function getCourseByCode(code) {
  if (!code) return null;
  const course = COURSE_DETAILS[code.toUpperCase()];
  if (!course) return null;
  return { ...course, semester: await getCourseSemester(course.code) };
}

export async function getCurriculum() {
  return SEMESTERS;
}

export async function getCoursesByGroup(groupId) {
  const group = ELECTIVE_GROUPS[groupId];
  if (!group) return [];
  if (group.external) return group.courses;
  return group.courseIds.map((id) => COURSE_DETAILS[id]).filter(Boolean);
}

export async function getCourseSemester(code) {
  if (!code) return null;
  const upper = code.toUpperCase();
  for (const sem of SEMESTERS) {
    for (const c of sem.courses) {
      if (!c.isElectiveGroup && c.id.toUpperCase() === upper) {
        return sem.semesterNumber;
      }
      if (c.isElectiveGroup) {
        const group = ELECTIVE_GROUPS[c.electiveGroupId];
        const ids = group?.external
          ? group.courses.map((x) => x.code)
          : (group?.courseIds ?? []);
        if (ids.some((id) => id.toUpperCase() === upper)) {
          return sem.semesterNumber;
        }
      }
    }
  }
  return null;
}
