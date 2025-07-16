"use server";

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Les identifiants sont incorrects." };
  }

  revalidatePath("/", "layout");
  redirect("/profile");
}

export async function signup(formData: FormData) {
  const origin = headers().get("origin");
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const supabase = createServerClient();

  const { error: signUpError, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: fullName,
      }
    },
  });

  if (signUpError) {
    return { error: "Impossible de créer le compte. L'utilisateur existe peut-être déjà." };
  }

  if (!data.user) {
    return { error: "Impossible de créer le compte." };
  }

  // Create a profile entry for the new user
  const { error: profileError } = await supabase.from('Profile').insert({
    userId: data.user.id,
    email: email,
    fullName: fullName,
  });
  
  if (profileError) {
      // If profile creation fails, we should probably delete the user
      // to avoid inconsistent state. For now, we'll just log the error.
      console.error('Failed to create profile for new user:', profileError);
      return { error: "Une erreur est survenue lors de la création de votre profil."};
  }

  revalidatePath("/", "layout");
  redirect("/profile");
}

export async function logout() {
  const supabase = createServerClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}