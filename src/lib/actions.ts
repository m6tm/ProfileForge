"use server";

import type { UserProfile } from "@/lib/types";

// Mock server action
export async function updateProfile(data: UserProfile): Promise<{ success: boolean; message: string }> {
  console.log("Mise à jour du profil avec :", data);
  // Simuler un délai réseau
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Dans une application réelle, vous enregistreriez cela dans une base de données.
  return { success: true, message: "Profil mis à jour avec succès !" };
}
