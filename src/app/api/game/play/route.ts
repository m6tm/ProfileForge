// src/app/api/game/play/route.ts
'use server';

import { getPrisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Utilisateur non authentifié.' }, { status: 401 });
  }

  const prisma = getPrisma();
  
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profil non trouvé.' }, { status: 404 });
    }

    const generatedNumber = Math.floor(Math.random() * 101);
    const hasWon = generatedNumber > 70;
    
    const balanceChange = hasWon ? 50 : -35;
    const newBalance = profile.balance + balanceChange;
    const result = hasWon ? "win" : "loss";

    await prisma.$transaction([
      prisma.profile.update({
        where: { id: profile.id },
        data: { balance: newBalance },
      }),
      prisma.gameHistory.create({
        data: {
          profileId: profile.id,
          result,
          number: generatedNumber,
          balanceChange,
        },
      }),
    ]);

    return NextResponse.json({
      result,
      generatedNumber,
      newBalance,
    });
  } catch (error) {
    console.error('Erreur lors du jeu:', error);
    return NextResponse.json({ error: 'Erreur lors du jeu.' }, { status: 500 });
  }
}
