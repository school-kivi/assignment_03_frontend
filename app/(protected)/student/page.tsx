"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase/config";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Grade {
  id: string;
  user_id: string;
  course_id: string;
  grade: string;
  created_at: string | { _seconds: number; _nanoseconds: number };
  graded_by: string;
  course: {
    name: string;
    year: string;
  } | null;
}

export default function StudentGrades() {
  const [grades, setGrades] = useState<Grade[]>([]);
  interface Course {
    id: string;
    name: string;
    year: string | number;
  }
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setError("Not authenticated");
        return;
      }
      const token = await user.getIdToken();

      // Fetch all courses
      const courseRes = await fetch("http://localhost:3001/api/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const courseData = await courseRes.json();
      setCourses(courseData.data || []);

      // Fetch grades for user
      const gradeRes = await fetch(
        `http://localhost:3001/api/grades/user/${user.uid}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const gradeData = await gradeRes.json();
      setGrades(gradeData.data || []);

      // Extract base subjects (e.g., Svenska from Svenska 1)
      const baseSubjects = Array.from(
        new Set(
          (courseData.data || []).map((c: Course) => {
            // Get base subject before first digit (e.g., Svenska from Svenska 1)
            const match = c.name.match(/^[^\d]+/);
            return match ? match[0].trim() : c.name;
          })
        )
      );
      setSubjects(baseSubjects as string[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Merge courses and grades
  const mergedCourses = courses
    .filter(
      (course) =>
        selectedYear === "all" || String(course.year) === String(selectedYear)
    )
    .filter((course) => {
      if (selectedSubject === "all") return true;
      // Get base subject from course name
      const match = course.name.match(/^[^\d]+/);
      const base = match ? match[0].trim() : course.name;
      return base === selectedSubject;
    })
    .map((course) => {
      const grade = grades.find((g) => g.course_id === course.id);
      return { ...course, grade: grade?.grade ?? "" };
    })
    .sort((a, b) => Number(a.year) - Number(b.year));

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A":
      case "B":
        return "text-green-600 font-semibold";
      case "C":
      case "D":
        return "text-yellow-600 font-semibold";
      case "E":
        return "text-orange-600 font-semibold";
      case "F":
        return "text-red-600 font-semibold";
      default:
        return "text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading grades...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Grades</h1>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex gap-2">
            <Button
              variant={selectedYear === "all" ? "default" : "outline"}
              onClick={() => setSelectedYear("all")}
            >
              All
            </Button>
            <Button
              variant={selectedYear === "1" ? "default" : "outline"}
              onClick={() => setSelectedYear("1")}
            >
              Year 1
            </Button>
            <Button
              variant={selectedYear === "2" ? "default" : "outline"}
              onClick={() => setSelectedYear("2")}
            >
              Year 2
            </Button>
            <Button
              variant={selectedYear === "3" ? "default" : "outline"}
              onClick={() => setSelectedYear("3")}
            >
              Year 3
            </Button>
          </div>

          <div className="w-64">
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Courses Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 text-left">Course</th>
                <th className="py-2 px-4 text-left">Grade</th>
                <th className="py-2 px-4 text-left">Year</th>
              </tr>
            </thead>
            <tbody>
              {mergedCourses.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="py-4 text-center text-muted-foreground"
                  >
                    No courses found for the selected filters.
                  </td>
                </tr>
              ) : (
                mergedCourses.map((course) => (
                  <tr key={course.id} className="border-b">
                    <td className="py-2 px-4">
                      {course.name || "Unknown Course"}
                    </td>
                    <td className={`py-2 px-4 ${getGradeColor(course.grade)}`}>
                      {course.grade || ""}
                    </td>
                    <td className="py-2 px-4">{course.year || "N/A"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
