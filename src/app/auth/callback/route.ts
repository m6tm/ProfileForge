// Ce fichier n'existe pas, créez-le
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/profile";

  if (code) {
    const supabase = createServerClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Check if profile already exists
        const { data: profile } = await supabase.from('Profile').select('userId').eq('userId', user.id).single();

        if (!profile) {
          // Create profile if it doesn't exist
          const { error: profileError } = await supabase.from('Profile').insert({
            userId: user.id,
            email: user.email,
            // Retrieve full name from metadata set during sign-up
            fullName: user.user_metadata.full_name,
          });

          if (profileError) {
            console.error("Erreur lors de la création du profil:", profileError);
            // Redirect to an error page or show a message
            return NextResponse.redirect(`${origin}/auth/auth-code-error`);
          }
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
