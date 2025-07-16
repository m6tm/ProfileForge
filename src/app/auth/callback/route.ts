import { getPrisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { createServerClient, type CookieMethodsServer } from '@supabase/ssr'; // Correct import and add CookieMethodsServer type
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/profile";

  if (code) {
    const cookieStore = await cookies(); // Await cookies()
    const supabase = createServerClient( // Use createServerClient
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: { // Use getAll and setAll methods
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        } as CookieMethodsServer, // Explicitly cast to the new type
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const prisma = getPrisma()
        const existingProfile = await prisma.profile.findUnique({
          where: { userId: user.id },
        });

        const newData = {
          userId: user.id,
          email: user.email!,
          fullName: user.user_metadata.full_name,
          phoneNumber: user.user_metadata.phone_number,
        }
        if (!existingProfile) {
          await prisma.profile.create({
            data: newData,
          });
        }
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
