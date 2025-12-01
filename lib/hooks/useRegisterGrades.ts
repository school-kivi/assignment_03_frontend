import { useState, useEffect } from "react";
import { Profile, Course, Grade } from "@/types";
import { fetchProfiles } from "@/lib/api/profiles";
import { fetchCoursesByYear } from "@/lib/api/courses";
import { fetchGrades } from "@/lib/api/grades";
import {
  filterNonAdminProfiles,
  sortProfilesByLastName,
} from "@/lib/utils/profiles";

export function useRegisterGrades(selectedYear: string) {
  const [students, setStudents] = useState<Profile[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [allProfiles, allGrades] = await Promise.all([
        fetchProfiles(),
        fetchGrades(),
      ]);
      setStudents(allProfiles);
      setGrades(allGrades);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadCoursesByYear = async () => {
    try {
      const yearCourses = await fetchCoursesByYear(selectedYear);
      setCourses(yearCourses);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadCoursesByYear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear]);

  const studentList = sortProfilesByLastName(filterNonAdminProfiles(students));

  return {
    students: studentList,
    allStudents: students,
    courses,
    grades,
    loading,
    refetch: loadData,
  };
}
