// src/components/game-client.tsx
"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface GameHistoryEntry {
    id: string;
    result: string;
    number: number;
    balanceChange: number;
    createdAt: string;
}

interface GameClientProps {
    initialBalance: number;
    initialHistory: GameHistoryEntry[];
}

async function playGame() {
    const response = await fetch('/api/game/play', {
        method: 'POST',
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error || "Impossible de jouer.");
    }

    return result;
}


export default function GameClient({ initialBalance, initialHistory }: GameClientProps) {
    const [balance, setBalance] = useState(initialBalance);
    const [history, setHistory] = useState(initialHistory);

    const { mutate, isPending } = useMutation({
        mutationFn: playGame,
        onSuccess: (data) => {
            setBalance(data.newBalance);

            // Créer une nouvelle entrée d'historique
            const newHistoryEntry: GameHistoryEntry = {
                id: new Date().toISOString(), // ID temporaire
                result: data.result,
                number: data.generatedNumber,
                balanceChange: data.result === 'win' ? 50 : -35,
                createdAt: new Date().toISOString(),
            };

            setHistory(prevHistory => [newHistoryEntry, ...prevHistory]);

            if (data.result === 'win') {
                toast({
                    title: "Gagné !",
                    description: `Le nombre était ${data.generatedNumber}. Vous gagnez 50 points.`,
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Perdu...",
                    description: `Le nombre était ${data.generatedNumber}. Vous perdez 35 points.`,
                });
            }
        },
        onError: (error) => {
            toast({
                variant: "destructive",
                title: "Oh oh ! Quelque chose s'est mal passé.",
                description: error.message,
            });
        },
    });

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Votre Solde</CardTitle>
                        <CardDescription>Vos points accumulés.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">{balance} points</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Jouer une partie</CardTitle>
                        <CardDescription>Cliquez pour générer un nombre entre 0 et 100.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={() => mutate()}
                            disabled={isPending}
                            className="w-full"
                        >
                            {isPending ? 'Génération...' : 'Générer un nombre'}
                        </Button>
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Historique des parties</CardTitle>
                        <CardDescription>Vos 20 dernières parties.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-96">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Résultat</TableHead>
                                        <TableHead className="text-center">Nombre</TableHead>
                                        <TableHead className="text-center">Variation</TableHead>
                                        <TableHead className="text-right">Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {history.length > 0 ? (
                                        history.map((entry) => (
                                            <TableRow key={entry.id}>
                                                <TableCell
                                                    className={cn("font-medium",
                                                        entry.result === 'win' ? 'text-green-600' : 'text-red-600'
                                                    )}
                                                >
                                                    {entry.result === 'win' ? 'Gagné' : 'Perdu'}
                                                </TableCell>
                                                <TableCell className="text-center">{entry.number}</TableCell>
                                                <TableCell
                                                    className={cn("text-center",
                                                        entry.balanceChange > 0 ? 'text-green-600' : 'text-red-600'
                                                    )}
                                                >
                                                    {entry.balanceChange > 0 ? '+' : ''}{entry.balanceChange}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {format(new Date(entry.createdAt), "d MMM, HH:mm", { locale: fr })}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center">
                                                Aucune partie jouée pour le moment.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
