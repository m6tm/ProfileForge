'use server';

import { getPrisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { profileFormSchema } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Utilisateur non authentifié.' }, { status: 401 });
  }

  const body = await request.json();
  const validatedFields = profileFormSchema.safeParse(body);

  if (!validatedFields.success) {
    return NextResponse.json({ error: 'Données invalides.', details: validatedFields.error.flatten() }, { status: 400 });
  }

  const { fullName, phoneNumber, bio, website, preferences } = validatedFields.data;
  const prisma = getPrisma();

  try {
    await prisma.profile.update({
      where: { userId: user.id },
      data: {
        fullName,
        phoneNumber,
        bio,
        website,
        newsletter: preferences.newsletter,
        marketing: preferences.marketing,
        updatedAt: new Date().toISOString(),
      },
    });

    return NextResponse.json({ message: 'Profil mis à jour avec succès !' });
  } catch (error) {
    console.error('Erreur de mise à jour du profil Prisma:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour du profil.' }, { status: 500 });
  }
}
