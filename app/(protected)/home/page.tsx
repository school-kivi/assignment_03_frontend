"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/AuthContext";
import Link from "next/link";

export default function ProtectedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
    if (user) {
      (async () => {
        try {
          const token = await user.getIdToken();
          const res = await fetch(
            `http://localhost:3001/api/profiles/user/${user.uid}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (!res.ok) throw new Error("Profile not found");
          const data = await res.json();
          setIsAdmin(!!data.data.is_admin);
        } catch {
          setIsAdmin(false);
        } finally {
          setProfileLoading(false);
        }
      })();
    }
  }, [user, loading, router]);

  if (loading || profileLoading) {
    return (
      <div className="flex-1 w-full flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      {isAdmin ? (
        // Admin dashboard
        <div>
          <h2 className="text-2xl font-bold mb-4">Welcome, Admin!</h2>
          {/* Inline admin dashboard cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/admin/register-grades">
              <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="flex items-center gap-2 mb-2">
                  <span role="img" aria-label="grades">
                    📚
                  </span>
                  <span className="font-semibold">Register Grades</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Add, edit, or delete student grades for courses.
                </p>
              </div>
            </Link>
            <Link href="/admin/student-accounts">
              <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="flex items-center gap-2 mb-2">
                  <span role="img" aria-label="students">
                    👥
                  </span>
                  <span className="font-semibold">Admin Student Accounts</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Manage student profiles, import CSVs, and edit/delete info.
                </p>
              </div>
            </Link>
          </div>
        </div>
      ) : (
        // Student grades view
        <div>
          <h2 className="text-2xl font-bold mb-4">Welcome, Student!</h2>
          <Link href="/student">
            <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex items-center gap-2 mb-2">
                <span role="img" aria-label="grades">
                  📖
                </span>
                <span className="font-semibold">View My Grades</span>
              </div>
              <p className="text-sm text-muted-foreground">
                See all your grades, filter by year and subject.
              </p>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
