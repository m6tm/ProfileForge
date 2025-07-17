// src/app/api/admin/users/[id]/route.ts
'use server';

import { getPrisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { adminUserUpdateSchema } from '@/lib/types';
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

  // Create an admin client for protected operations
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

  return { user, profile, adminClient };
}

// UPDATE a user
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const adminCheck = await checkAdmin(request);
  if (adminCheck.error) return adminCheck.error;

  const { id } = params;
  const body = await request.json();
  const validatedFields = adminUserUpdateSchema.safeParse(body);

  if (!validatedFields.success) {
    return NextResponse.json({ error: 'Données invalides.', details: validatedFields.error.flatten() }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Utilisateur non authentifié.' }, { status: 401 });
  }

  const { fullName, phoneNumber, balance, role } = validatedFields.data;
  const prisma = getPrisma();

  try {
    const profileUserId = await prisma.profile.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!profileUserId) {
      return NextResponse.json({ error: 'Utilisateur non trouvé.' }, { status: 404 });
    }

    if (profileUserId.userId === user.id) {
      return NextResponse.json({ error: 'Vous ne pouvez pas mettre à jour votre propre compte admin.' }, { status: 400 });
    }

    const updatedUser = await prisma.profile.update({
      where: { id },
      data: {
        fullName,
        phoneNumber,
        balance,
        role,
      },
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Erreur de mise à jour du profil par l\'admin:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour de l\'utilisateur.' }, { status: 500 });
  }
}

// DELETE a user
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const adminCheck = await checkAdmin(request);
  if (adminCheck.error) return adminCheck.error;
  
  // Make sure adminClient is available
  if (!adminCheck.adminClient) {
    return NextResponse.json({ error: 'Client admin non initialisé.' }, { status: 500 });
  }

  const { id } = params;
  const prisma = getPrisma();

  try {
    const userToDelete = await prisma.profile.findUnique({ where: { id } });
    if (!userToDelete) {
      return NextResponse.json({ error: 'Utilisateur non trouvé.' }, { status: 404 });
    }

    // You cannot delete yourself
    if (userToDelete.userId === adminCheck.user?.id) {
      return NextResponse.json({ error: 'Vous ne pouvez pas supprimer votre propre compte admin.' }, { status: 400 });
    }

    const { adminClient } = adminCheck;
    const { error: deleteAuthUserError } = await adminClient.auth.admin.deleteUser(userToDelete.userId);

    // Continue even if user is not in auth, but log it
    if (deleteAuthUserError && deleteAuthUserError.message !== 'User not found') {
        console.error('Erreur de suppression de l\'utilisateur Supabase Auth:', deleteAuthUserError);
        return NextResponse.json({ error: 'Erreur lors de la suppression de l\'authentification de l\'utilisateur.' }, { status: 500 });
    }

    await prisma.profile.delete({ where: { id } });

    return NextResponse.json({ message: 'Utilisateur supprimé avec succès.' });
  } catch (error: any) {
    console.error('Erreur de suppression d\'utilisateur:', error);
    // If user is already deleted from Supabase auth but not from DB
    if (error.code === 'P2025' || (error.message && error.message.includes("User not found"))) {
      try {
        await prisma.profile.delete({ where: { id } });
        return NextResponse.json({ message: 'Utilisateur supprimé avec succès (nettoyage).' });
      } catch (cleanupError) {
        console.error('Erreur de nettoyage du profil:', cleanupError);
        return NextResponse.json({ error: 'Erreur lors du nettoyage du profil.' }, { status: 500 });
      }
    }
    return NextResponse.json({ error: 'Erreur lors de la suppression de l\'utilisateur.' }, { status: 500 });
  }
}
