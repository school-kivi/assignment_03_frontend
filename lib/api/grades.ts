import { Grade } from "@/types";
import { getAuthToken } from "./auth";

const API_BASE_URL = "http://localhost:3001/api";

/**
 * Fetch all grades
 */
export async function fetchGrades(): Promise<Grade[]> {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/grades`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  return data.data || [];
}

/**
 * Fetch grades for a specific user
 */
export async function fetchGradesByUser(userId: string): Promise<Grade[]> {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/grades/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  return data.data || [];
}

/**
 * Create a new grade
 */
export async function createGrade(gradeData: {
  user_id: string;
  course_id: string;
  grade: string;
  graded_by: string;
}): Promise<Grade> {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/grades`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(gradeData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create grade");
  }

  const data = await response.json();
  return data.data;
}

/**
 * Update an existing grade
 */
export async function updateGrade(
  gradeId: string,
  gradeData: Partial<Grade>
): Promise<Grade> {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/grades/${gradeId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(gradeData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update grade");
  }

  const data = await response.json();
  return data.data;
}

/**
 * Delete a grade
 */
export async function deleteGrade(gradeId: string): Promise<void> {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/grades/${gradeId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Failed to delete grade");
  }
}
