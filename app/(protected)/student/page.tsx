"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStudentGrades } from "@/lib/hooks/useGrades";
import { getGradeColor } from "@/lib/utils/grades";

export default function StudentGrades() {
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");

  const { mergedCourses, subjects, loading, error } = useStudentGrades({
    selectedYear,
    selectedSubject,
  });

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
