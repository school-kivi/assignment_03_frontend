"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Grade } from "@/types";
import { createGrade, updateGrade } from "@/lib/api/grades";
import { getCurrentUserId } from "@/lib/api/auth";
import { getFullName } from "@/lib/utils/profiles";
import { formatGradeDate, isValidGrade } from "@/lib/utils/grades";
import { useRegisterGrades } from "@/lib/hooks/useRegisterGrades";

export default function RegisterGrades() {
  const [inlineEditStudent, setInlineEditStudent] = useState<string | null>(
    null
  );
  const [inlineGrade, setInlineGrade] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("1");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { students, allStudents, courses, grades, refetch } =
    useRegisterGrades(selectedYear);

  const selectedCourseName =
    courses.find((c) => c.id === selectedCourse)?.name || "Selected Course";

  const handleSaveGrade = async (
    studentUserId: string,
    existingGrade?: Grade
  ) => {
    if (!isValidGrade(inlineGrade)) {
      setError("Please select a valid grade");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const currentUserId = await getCurrentUserId();
      if (!currentUserId) throw new Error("Not authenticated");

      const gradeData = {
        user_id: studentUserId,
        course_id: selectedCourse,
        grade: inlineGrade,
        graded_by: currentUserId,
      };

      if (existingGrade) {
        await updateGrade(existingGrade.id, gradeData);
      } else {
        await createGrade(gradeData);
      }

      setSuccess("Grade saved!");
      setInlineEditStudent(null);
      setInlineGrade("");
      refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Year Filter Buttons and Course Dropdown */}
        <div className="flex gap-4 items-end mb-6">
          <div>
            <Label className="mb-2 block">Year</Label>
            <div className="flex gap-2">
              {["1", "2", "3"].map((year) => (
                <Button
                  key={year}
                  variant={selectedYear === year ? "default" : "outline"}
                  onClick={() => setSelectedYear(year)}
                >
                  Year {year}
                </Button>
              ))}
            </div>
          </div>
          <div className="w-64">
            <Label htmlFor="course">Course</Label>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Select course for year" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Register Grades</h1>
          <Link href="/admin">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Grades for {selectedCourseName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Graded By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => {
                    // Find grade for this student and selected course
                    const grade = grades.find(
                      (g) =>
                        g.user_id === student.user_id &&
                        g.course_id === selectedCourse
                    );
                    // Find the user who graded
                    const gradedBy = grade
                      ? allStudents.find((s) => s.user_id === grade.graded_by)
                      : null;
                    // Format date
                    const dateStr = grade
                      ? formatGradeDate(grade.created_at)
                      : "";

                    return (
                      <TableRow key={student.user_id}>
                        <TableCell>{getFullName(student)}</TableCell>
                        <TableCell>
                          {inlineEditStudent === student.user_id ? (
                            <Select
                              value={inlineGrade}
                              onValueChange={setInlineGrade}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select grade" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="A">A</SelectItem>
                                <SelectItem value="B">B</SelectItem>
                                <SelectItem value="C">C</SelectItem>
                                <SelectItem value="D">D</SelectItem>
                                <SelectItem value="E">E</SelectItem>
                                <SelectItem value="F">F</SelectItem>
                                <SelectItem value="N/A">N/A</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <span
                              className="font-semibold cursor-pointer underline"
                              onClick={() => {
                                setInlineEditStudent(student.user_id);
                                setInlineGrade(grade ? grade.grade : "");
                              }}
                            >
                              {grade ? grade.grade : "Add"}
                            </span>
                          )}
                          {inlineEditStudent === student.user_id && (
                            <Button
                              size="sm"
                              className="ml-2"
                              disabled={loading}
                              onClick={() =>
                                handleSaveGrade(student.user_id, grade)
                              }
                            >
                              {loading ? "Saving..." : "Save"}
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>{dateStr}</TableCell>
                        <TableCell>
                          {gradedBy
                            ? getFullName(gradedBy)
                            : grade?.graded_by || ""}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
              {success && (
                <p className="text-sm text-green-500 mt-2">{success}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
