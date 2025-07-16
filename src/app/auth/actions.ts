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

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: fullName,
      }
    },
  });

  if (error) {
    return { error: "Impossible de créer le compte. L'utilisateur existe peut-être déjà." };
  }
  
  // Un message sera affiché à l'utilisateur pour qu'il vérifie son e-mail.
  // Le profil sera créé dans la route de callback.
  return { error: null };
}

export async function logout() {
  const supabase = createServerClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
