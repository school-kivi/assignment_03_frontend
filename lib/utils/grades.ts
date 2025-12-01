import { GradeValue } from "@/types";

/**
 * Get color class for grade display
 */
export function getGradeColor(grade: string): string {
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
}

/**
 * Validate if a grade value is valid
 */
export function isValidGrade(grade: string): grade is GradeValue {
  return ["A", "B", "C", "D", "E", "F", ""].includes(grade);
}

/**
 * Format timestamp to readable date
 */
export function formatGradeDate(
  timestamp: string | { _seconds: number; _nanoseconds: number }
): string {
  if (!timestamp) return "N/A";

  try {
    if (typeof timestamp === "string") {
      return new Date(timestamp).toLocaleDateString();
    } else if (timestamp._seconds) {
      return new Date(timestamp._seconds * 1000).toLocaleDateString();
    }
    return "N/A";
  } catch {
    return "N/A";
  }
}
