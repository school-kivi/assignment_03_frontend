"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase/config";
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

interface Profile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  is_admin?: boolean;
}

interface Course {
  id: string;
  name: string;
  year: string;
}

interface Grade {
  id: string;
  user_id: string;
  course_id: string;
  grade: string;
  graded_by: string;
  created_at?: string | { _seconds: number; _nanoseconds: number };
  course?: {
    name: string;
    year: string;
  };
}

export default function RegisterGrades() {
  const [inlineEditStudent, setInlineEditStudent] = useState<string | null>(
    null
  );
  const [inlineGrade, setInlineGrade] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("1");
  const [students, setStudents] = useState<Profile[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchStudents();
    fetchCourses();
    fetchGrades();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getToken = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");
    return await user.getIdToken();
  };

  const fetchStudents = async () => {
    try {
      const token = await getToken();
      const response = await fetch("http://localhost:3001/api/profiles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setStudents(data.data || []);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const fetchCourses = async () => {
    try {
      const token = await getToken();
      const response = await fetch("http://localhost:3001/api/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setCourses(data.data || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  // Filter courses by selected year
  const filteredCourses = courses.filter(
    (course) => String(course.year) === selectedYear
  );

  // Get selected course name
  const selectedCourseName =
    courses.find((c) => c.id === selectedCourse)?.name || "Selected Course";

  const fetchGrades = async () => {
    try {
      const token = await getToken();
      const response = await fetch("http://localhost:3001/api/grades", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setGrades(data.data || []);
    } catch (err) {
      console.error("Error fetching grades:", err);
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
                {filteredCourses.map((course) => (
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
                  {students
                    .filter((s) => !s.is_admin)
                    .map((student) => {
                      // Find grade for this student and selected course
                      const grade = grades.find(
                        (g) =>
                          g.user_id === student.user_id &&
                          g.course_id === selectedCourse
                      );
                      // Find the user who graded (could be admin)
                      const gradedBy = grade
                        ? students.find((s) => s.user_id === grade.graded_by)
                        : null;
                      // Format date
                      let dateStr = "";
                      if (grade && grade.created_at) {
                        if (typeof grade.created_at === "string") {
                          dateStr = new Date(
                            grade.created_at
                          ).toLocaleDateString();
                        } else if (
                          typeof grade.created_at === "object" &&
                          "_seconds" in grade.created_at
                        ) {
                          dateStr = new Date(
                            grade.created_at._seconds * 1000
                          ).toLocaleDateString();
                        }
                      }
                      return (
                        <TableRow key={student.user_id}>
                          <TableCell>
                            {student.first_name} {student.last_name}
                          </TableCell>
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
                                onClick={async () => {
                                  setLoading(true);
                                  setError(null);
                                  setSuccess(null);
                                  try {
                                    const user = auth.currentUser;
                                    if (!user)
                                      throw new Error("Not authenticated");
                                    const token = await user.getIdToken();
                                    const gradeData = {
                                      user_id: student.user_id,
                                      course_id: selectedCourse,
                                      grade: inlineGrade,
                                      graded_by: user.uid,
                                    };
                                    let url =
                                      "http://localhost:3001/api/grades";
                                    let method = "POST";
                                    if (grade) {
                                      url = `http://localhost:3001/api/grades/${grade.id}`;
                                      method = "PUT";
                                    }
                                    const response = await fetch(url, {
                                      method,
                                      headers: {
                                        Authorization: `Bearer ${token}`,
                                        "Content-Type": "application/json",
                                      },
                                      body: JSON.stringify(gradeData),
                                    });
                                    if (!response.ok) {
                                      const data = await response.json();
                                      throw new Error(
                                        data.error || "Failed to save grade"
                                      );
                                    }
                                    setSuccess("Grade saved!");
                                    setInlineEditStudent(null);
                                    setInlineGrade("");
                                    fetchGrades();
                                  } catch (err) {
                                    setError(
                                      err instanceof Error
                                        ? err.message
                                        : "An error occurred"
                                    );
                                  } finally {
                                    setLoading(false);
                                  }
                                }}
                              >
                                {loading ? "Saving..." : "Save"}
                              </Button>
                            )}
                          </TableCell>
                          <TableCell>{grade ? dateStr : ""}</TableCell>
                          <TableCell>
                            {grade
                              ? gradedBy
                                ? `${gradedBy.first_name} ${gradedBy.last_name}`
                                : grade.graded_by
                              : ""}
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
