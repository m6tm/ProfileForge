// src/app/api/admin/users/[id]/history/route.ts
'use server';

import { getPrisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { NextResponse, type NextRequest } from 'next/server';

// Middleware to check for admin role
async function checkAdmin() {
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
  
  return { user };
}

// GET game history for a user
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const adminCheck = await checkAdmin();
  if (adminCheck.error) return adminCheck.error;

  const { id: profileId } = params;
  const prisma = getPrisma();

  try {
    const gameHistory = await prisma.gameHistory.findMany({
      where: { profileId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(gameHistory);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'historique de jeu:", error);
    return NextResponse.json({ error: "Erreur lors de la récupération de l'historique." }, { status: 500 });
  }
}
