"use server";

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { profileFormSchema, type UserProfile } from "@/lib/types";

export async function updateProfile(data: UserProfile): Promise<{ success: boolean; message: string }> {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Utilisateur non authentifié." };
  }
  
  const validatedFields = profileFormSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Données invalides.",
    };
  }

  const { fullName, bio, website, preferences } = validatedFields.data;
  
  const { error } = await supabase
    .from("Profile")
    .update({
      fullName,
      bio,
      website,
      newsletter: preferences.newsletter,
      marketing: preferences.marketing,
      updatedAt: new Date().toISOString(),
    })
    .eq("userId", user.id);

  if (error) {
    console.error("Erreur de mise à jour du profil Supabase:", error);
    return { success: false, message: "Erreur lors de la mise à jour du profil." };
  }

  revalidatePath("/profile");
  return { success: true, message: "Profil mis à jour avec succès !" };
}
