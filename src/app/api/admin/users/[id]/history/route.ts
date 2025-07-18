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

/**
 * @swagger
 * /api/admin/users/{id}/history:
 *   get:
 *     summary: Récupère l'historique des jeux pour un utilisateur spécifique
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du profil de l'utilisateur
 *     responses:
 *       200:
 *         description: Une liste d'entrées de l'historique des jeux
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GameHistory'
 *       401:
 *         description: Authentification requise
 *       403:
 *         description: Accès non autorisé (l'utilisateur n'est pas un admin)
 *       500:
 *         description: Erreur interne du serveur
 */
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
