"use client";

import { useAuth } from "@/lib/firebase/AuthContext";
import { signOutUser } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ThemeSwitcher } from "./theme-switcher";

export function Navbar() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOutUser();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="w-full flex justify-center h-16">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <span>Student Portal</span>
        </div>
        <div className="flex items-center gap-4">
          {loading ? (
            <>
              <div className="rounded-full bg-muted-foreground/10 min-w-32 h-5"></div>
              <Button variant="outline" size="sm" disabled>
                Log Out
              </Button>
            </>
          ) : user ? (
            <>
              <span className="text-sm text-muted-foreground">
                {profile
                  ? `${profile.first_name} ${profile.last_name}`
                  : user.email}
              </span>
              <Button onClick={handleLogout} variant="outline" size="sm">
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  Log In
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
}
