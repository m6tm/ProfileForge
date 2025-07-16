"use server";

import type { UserProfile } from "@/lib/types";

// Mock server action
export async function updateProfile(data: UserProfile): Promise<{ success: boolean; message: string }> {
  console.log("Updating profile with:", data);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  // In a real app, you would save this to a database.
  return { success: true, message: "Profile updated successfully!" };
}
