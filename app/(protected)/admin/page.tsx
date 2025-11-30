"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { BookOpen, Users } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="flex items-start justify-center p-6 mt-12">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8">Admin Dashboard</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Register Grades Card */}
          <Link href="/admin/register-grades">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-6 w-6" />
                  <CardTitle>Register Grades</CardTitle>
                </div>
                <CardDescription>
                  Add, edit, or delete student grades for courses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Manage grades for all students across different courses and
                  years.
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Admin Student Accounts Card */}
          <Link href="/admin/student-accounts">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  <CardTitle>Admin Student Accounts</CardTitle>
                </div>
                <CardDescription>
                  View, edit, delete student profiles or import CSV
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Manage all student accounts and import bulk data via CSV
                  files.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
