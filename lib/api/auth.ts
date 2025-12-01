import { auth } from "@/lib/firebase/config";

/**
 * Get the current user's Firebase ID token
 */
export async function getAuthToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  return await user.getIdToken();
}

/**
 * Get the current user's UID
 */
export function getCurrentUserId(): string | null {
  return auth.currentUser?.uid || null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!auth.currentUser;
}
