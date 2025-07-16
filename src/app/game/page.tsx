import GameClient from "@/components/game-client";
import { getPrisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User } from "lucide-react";

export default async function GamePage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/');
    }

    const prisma = getPrisma();
    const profile = await prisma.profile.findUnique({
        where: { userId: user.id },
        include: {
            gameHistory: {
                orderBy: {
                    createdAt: 'desc',
                },
                take: 20, // Limiter à 20 entrées pour commencer
            },
        },
    });

    if (!profile) {
        console.error("Erreur lors de la récupération du profil ou profil non trouvé:");
        redirect('/');
    }

    // Mapper les données pour éviter de passer des objets Date aux composants clients
    const initialHistory = profile.gameHistory.map(entry => ({
        ...entry,
        createdAt: entry.createdAt.toISOString(),
    }));

    return (
        <div className="w-full max-w-4xl mx-auto p-4 space-y-8 animate-in fade-in duration-500">
            <header className="flex items-center justify-between py-4 border-b">
                <h1 className="text-2xl font-bold font-headline">Jeu TrueNumber</h1>
                <Button variant="ghost" asChild>
                    <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        Mon Profil
                    </Link>
                </Button>
            </header>
            <GameClient initialBalance={profile.balance} initialHistory={initialHistory} />
        </div>
    );
}
