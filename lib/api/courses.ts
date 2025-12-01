import { Course } from "@/types";
import { getAuthToken } from "./auth";

const API_BASE_URL = "http://localhost:3001/api";

/**
 * Fetch all courses
 */
export async function fetchCourses(): Promise<Course[]> {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/courses`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  return data.data || [];
}

/**
 * Fetch courses by year
 */
export async function fetchCoursesByYear(year: string): Promise<Course[]> {
  const courses = await fetchCourses();
  return courses.filter((course) => String(course.year) === String(year));
}

/**
 * Create a new course
 */
export async function createCourse(
  courseData: Omit<Course, "id">
): Promise<Course> {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/courses`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(courseData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create course");
  }

  const data = await response.json();
  return data.data;
}
