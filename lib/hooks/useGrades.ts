import { useState, useEffect } from "react";
import { Grade, Course } from "@/types";
import { fetchCourses } from "@/lib/api/courses";
import { fetchGradesByUser } from "@/lib/api/grades";
import { getCurrentUserId } from "@/lib/api/auth";
import { getUniqueSubjects, extractBaseSubject } from "@/lib/utils/courses";

interface MergedCourse extends Course {
  grade: string;
}

interface UseGradesOptions {
  selectedYear?: string;
  selectedSubject?: string;
}

export function useStudentGrades(options: UseGradesOptions = {}) {
  const { selectedYear = "all", selectedSubject = "all" } = options;
  const [grades, setGrades] = useState<Grade[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = await getCurrentUserId();
        if (!userId) throw new Error("Not authenticated");

        const [allCourses, userGrades] = await Promise.all([
          fetchCourses(),
          fetchGradesByUser(userId),
        ]);

        setCourses(allCourses);
        setGrades(userGrades);
        setSubjects(getUniqueSubjects(allCourses));
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Compute merged courses with filtering
  const mergedCourses: MergedCourse[] = courses
    .filter(
      (course) =>
        selectedYear === "all" || String(course.year) === String(selectedYear)
    )
    .filter((course) => {
      if (selectedSubject === "all") return true;
      return extractBaseSubject(course.name) === selectedSubject;
    })
    .map((course) => {
      const grade = grades.find((g) => g.course_id === course.id);
      return { ...course, grade: grade?.grade ?? "" };
    })
    .sort((a, b) => Number(a.year) - Number(b.year));

  return { mergedCourses, subjects, loading, error };
}
