import { Profile } from "@/types";

/**
 * Sort profiles alphabetically by last name
 */
export function sortProfilesByLastName(profiles: Profile[]): Profile[] {
  return [...profiles].sort((a, b) => a.last_name.localeCompare(b.last_name));
}

/**
 * Filter out admin profiles
 */
export function filterNonAdminProfiles(profiles: Profile[]): Profile[] {
  return profiles.filter((profile) => !profile.is_admin);
}

/**
 * Get full name from profile
 */
export function getFullName(profile: Profile): string {
  return `${profile.first_name} ${profile.last_name}`;
}

/**
 * Search profiles by name
 */
export function searchProfiles(
  profiles: Profile[],
  searchTerm: string
): Profile[] {
  const term = searchTerm.toLowerCase();
  return profiles.filter(
    (profile) =>
      profile.first_name.toLowerCase().includes(term) ||
      profile.last_name.toLowerCase().includes(term) ||
      profile.email?.toLowerCase().includes(term)
  );
}
