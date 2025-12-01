// Shared TypeScript types/interfaces
export interface Profile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  person_number: string;
  is_admin: boolean;
  address: string;
  email?: string;
}

export interface Course {
  id: string;
  name: string;
  year: string | number;
}

export interface Grade {
  id: string;
  user_id: string;
  course_id: string;
  grade: string;
  created_at: string | { _seconds: number; _nanoseconds: number };
  graded_by: string;
  course?: {
    name: string;
    year: string;
  } | null;
}

export type GradeValue = "A" | "B" | "C" | "D" | "E" | "F" | "";
