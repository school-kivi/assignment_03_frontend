import { useState, useEffect } from "react";
import { Profile } from "@/types";
import { fetchProfiles } from "@/lib/api/profiles";
import {
  sortProfilesByLastName,
  filterNonAdminProfiles,
} from "@/lib/utils/profiles";

export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfiles = async () => {
    setLoading(true);
    try {
      const allProfiles = await fetchProfiles();
      const studentProfiles = filterNonAdminProfiles(allProfiles);
      const sorted = sortProfilesByLastName(studentProfiles);
      setProfiles(sorted);
      setError(null);
    } catch (err) {
      console.error("Error fetching profiles:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch profiles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  return { profiles, loading, error, refetch: loadProfiles };
}
