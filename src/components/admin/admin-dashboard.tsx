// src/components/admin/admin-dashboard.tsx
"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { UserDialog } from "@/components/admin/user-dialog";
import { toast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import type { Profile } from "@prisma/client";
import { format } from "date-fns";

async function fetchUsers(): Promise<Profile[]> {
    const res = await fetch('/api/admin/users');
    if (!res.ok) throw new Error("Impossible de récupérer les utilisateurs");
    return res.json();
}

async function deleteUser(userId: string) {
    const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Impossible de supprimer l'utilisateur");
    }
    return res.json();
}

interface AdminDashboardProps {
    initialUsers: Profile[];
}

export default function AdminDashboard({ initialUsers }: AdminDashboardProps) {
    const queryClient = useQueryClient();
    const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<Profile | null>(null);

    const { data: users = initialUsers } = useQuery<Profile[]>({
        queryKey: ['users'],
        queryFn: fetchUsers,
        initialData: initialUsers,
        refetchOnWindowFocus: false,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            toast({ title: "Succès", description: "Utilisateur supprimé avec succès." });
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: (error: Error) => {
            toast({ variant: "destructive", title: "Erreur", description: error.message });
        },
    });

    const handleEdit = (user: Profile) => {
        setSelectedUser(user);
        setIsUserDialogOpen(true);
    };
    
    const handleAddNew = () => {
        setSelectedUser(null);
        setIsUserDialogOpen(true);
    };

    const columns: ColumnDef<Profile>[] = useMemo(() => [
        { accessorKey: "fullName", header: "Nom complet" },
        { accessorKey: "email", header: "Email" },
        { accessorKey: "role", header: "Rôle" },
        { accessorKey: "balance", header: "Solde" },
        { 
            accessorKey: "createdAt", 
            header: "Créé le",
            cell: ({ row }) => format(new Date(row.original.createdAt), "dd/MM/yyyy")
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <AlertDialog>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Ouvrir le menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleEdit(user)}>
                                    Modifier
                                </DropdownMenuItem>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                                        Supprimer
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Cette action est irréversible et supprimera définitivement l'utilisateur et toutes ses données associées.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction 
                                    onClick={() => deleteMutation.mutate(user.id)}
                                    className="bg-destructive hover:bg-destructive/90"
                                >
                                    Supprimer
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                );
            },
        },
    ], [deleteMutation]);

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Tableau de bord Admin</h1>
                <Button onClick={handleAddNew}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajouter un utilisateur
                </Button>
            </div>
            <DataTable columns={columns} data={users} />
            <UserDialog
                isOpen={isUserDialogOpen}
                setIsOpen={setIsUserDialogOpen}
                user={selectedUser}
            />
        </div>
    );
}
