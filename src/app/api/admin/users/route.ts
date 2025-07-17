// src/app/api/admin/users/route.ts
'use server';

import { getPrisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { adminUserCreateSchema } from '@/lib/types';
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Middleware to check for admin role
async function checkAdmin(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: NextResponse.json({ error: 'Authentification requise.' }, { status: 401 }) };
  }

  const prisma = getPrisma();
  const profile = await prisma.profile.findUnique({ where: { userId: user.id } });

  if (!profile || profile.role !== 'ADMIN') {
    return { error: NextResponse.json({ error: 'Accès non autorisé.' }, { status: 403 }) };
  }

  const cookieStore = await cookies();
  const adminClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              request.cookies.set(name, value)
            )
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value);
              if (options) {
                cookieStore.set(name, value, options);
              }
            });
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );

  return { user, adminClient };
}

export async function GET(request: NextRequest) {
  const adminCheck = await checkAdmin(request);
  if (adminCheck.error) return adminCheck.error;

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Utilisateur non authentifié.' }, { status: 401 });
  }

  const prisma = getPrisma();
  try {
    const users = await prisma.profile.findMany({
      where: {
        NOT: {
          userId: user.id,
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error('Erreur de récupération des utilisateurs:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des utilisateurs.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const adminCheck = await checkAdmin(request);
  if (adminCheck.error) return adminCheck.error;

  const body = await request.json();
  const validatedFields = adminUserCreateSchema.safeParse(body);

  if (!validatedFields.success) {
    return NextResponse.json({ error: 'Données invalides.', details: validatedFields.error.flatten() }, { status: 400 });
  }

  const { email, password, fullName, phoneNumber, role, balance } = validatedFields.data;
  const { adminClient } = adminCheck;
  const prisma = getPrisma();

  try {
    // Check if user already exists in Profile table
    const existingProfile = await prisma.profile.findFirst({
      where: { email: email }
    });
    if (existingProfile) {
      return NextResponse.json({ error: 'Un utilisateur avec cet email existe déjà.' }, { status: 409 });
    }

    const { data: { user }, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        phone_number: phoneNumber,
      }
    });

    if (authError || !user) {
      console.error("Erreur de création d'utilisateur Supabase:", authError);
      return NextResponse.json({ error: authError?.message || 'Erreur lors de la création de l\'authentification utilisateur.' }, { status: 400 });
    }

    const newUser = await prisma.profile.create({
      data: {
        userId: user.id,
        email,
        fullName,
        phoneNumber,
        role,
        balance
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Erreur de création d\'utilisateur:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur lors de la création de l\'utilisateur.' }, { status: 500 });
  }
}