// src/components/admin/game-history-dialog.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { GameHistory, Profile } from "@/generated/prisma";
import { AlertTriangle, Info } from "lucide-react";

interface GameHistoryDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    user: Profile | null;
}

async function fetchGameHistory(userId: string): Promise<GameHistory[]> {
    const res = await fetch(`/api/admin/users/${userId}/history`);
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Impossible de récupérer l'historique de jeu");
    }
    return res.json();
}

export function GameHistoryDialog({ isOpen, setIsOpen, user }: GameHistoryDialogProps) {
    const { data: history, isLoading, isError, error } = useQuery<GameHistory[]>({
        queryKey: ['gameHistory', user?.id],
        queryFn: () => fetchGameHistory(user!.id),
        enabled: !!user && isOpen, // Only fetch when the dialog is open and a user is selected
    });

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Historique de jeu</DialogTitle>
                    <DialogDescription>
                        Historique des parties pour {user?.fullName || 'l\'utilisateur'}.
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                    <ScrollArea className="h-96">
                        {isLoading && (
                             <div className="space-y-2">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                             </div>
                        )}
                        {isError && (
                            <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Erreur</AlertTitle>
                                <AlertDescription>
                                    {error instanceof Error ? error.message : "Une erreur inconnue est survenue."}
                                </AlertDescription>
                            </Alert>
                        )}
                        {!isLoading && !isError && history && (
                            history.length > 0 ? (
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
                                        {history.map((entry) => (
                                            <TableRow key={entry.id}>
                                                <TableCell className={cn("font-medium", entry.result === 'win' ? 'text-green-600' : 'text-red-600')}>
                                                    {entry.result === 'win' ? 'Gagné' : 'Perdu'}
                                                </TableCell>
                                                <TableCell className="text-center">{entry.number}</TableCell>
                                                <TableCell className={cn("text-center font-semibold", entry.balanceChange > 0 ? 'text-green-600' : 'text-red-600')}>
                                                    {entry.balanceChange > 0 ? '+' : ''}{entry.balanceChange}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {format(new Date(entry.createdAt), "d MMM yyyy, HH:mm", { locale: fr })}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <Alert>
                                    <Info className="h-4 w-4" />
                                    <AlertTitle>Aucune donnée</AlertTitle>
                                    <AlertDescription>
                                        Cet utilisateur n'a encore joué aucune partie.
                                    </AlertDescription>
                                </Alert>
                            )
                        )}
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}
