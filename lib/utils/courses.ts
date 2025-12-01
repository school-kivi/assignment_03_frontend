import { Course } from "@/types";

/**
 * Extract base subject name from course name
 * e.g., "Svenska 1" -> "Svenska"
 */
export function extractBaseSubject(courseName: string): string {
  const match = courseName.match(/^[^\d]+/);
  return match ? match[0].trim() : courseName;
}

/**
 * Group courses by base subject
 */
export function groupCoursesBySubject(
  courses: Course[]
): Record<string, Course[]> {
  return courses.reduce((acc, course) => {
    const baseSubject = extractBaseSubject(course.name);
    if (!acc[baseSubject]) {
      acc[baseSubject] = [];
    }
    acc[baseSubject].push(course);
    return acc;
  }, {} as Record<string, Course[]>);
}

/**
 * Get unique base subjects from courses
 */
export function getUniqueSubjects(courses: Course[]): string[] {
  const subjects = courses.map((course) => extractBaseSubject(course.name));
  return Array.from(new Set(subjects)).sort();
}

/**
 * Filter courses by year and subject
 */
export function filterCourses(
  courses: Course[],
  year: string | null,
  subject: string | null
): Course[] {
  return courses.filter((course) => {
    const yearMatch =
      !year || year === "all" || String(course.year) === String(year);
    const subjectMatch =
      !subject ||
      subject === "all" ||
      extractBaseSubject(course.name) === subject;
    return yearMatch && subjectMatch;
  });
}

/**
 * Sort courses by year
 */
export function sortCoursesByYear(courses: Course[]): Course[] {
  return [...courses].sort((a, b) => Number(a.year) - Number(b.year));
}
