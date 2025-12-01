import { Profile } from "@/types";
import { getAuthToken } from "./auth";

const API_BASE_URL = "http://localhost:3001/api";

/**
 * Fetch all profiles
 */
export async function fetchProfiles(): Promise<Profile[]> {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/profiles`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  return data.data || [];
}

/**
 * Fetch a single profile by ID
 */
export async function fetchProfileById(profileId: string): Promise<Profile> {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/profiles/${profileId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  return data.data;
}

/**
 * Create a new profile
 */
export async function createProfile(
  profileData: Omit<Profile, "id">
): Promise<Profile> {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/profiles`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create profile");
  }

  const data = await response.json();
  return data.data;
}

/**
 * Update an existing profile
 */
export async function updateProfile(
  profileId: string,
  profileData: Partial<Profile>
): Promise<Profile> {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/profiles/${profileId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update profile");
  }

  const data = await response.json();
  return data.data;
}

/**
 * Delete a profile
 */
export async function deleteProfile(profileId: string): Promise<void> {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/profiles/${profileId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Failed to delete profile");
  }
}

/**
 * Upload CSV file to import profiles
 */
export async function uploadProfilesCSV(file: File): Promise<{
  imported: number;
  failed: number;
}> {
  const token = await getAuthToken();
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/profiles/import-csv`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.message || "Failed to import CSV");
  }

  const data = await response.json();
  return {
    imported: data.imported,
    failed: data.failed,
  };
}
