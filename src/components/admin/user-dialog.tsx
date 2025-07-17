// src/components/admin/user-dialog.tsx
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { type AdminUserUpdate, adminUserCreateSchema, adminUserUpdateSchema } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Profile, UserRole } from "@/generated/prisma";

interface UserDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    user: Profile | null;
}

async function createUser(data: AdminUserUpdate) {
    const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Impossible de créer l'utilisateur.");
    }
    return response.json();
}

async function updateUser(data: AdminUserUpdate) {
    if (!data.id) throw new Error("ID utilisateur manquant");
    const response = await fetch(`/api/admin/users/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Impossible de mettre à jour l'utilisateur.");
    }
    return response.json();
}

export function UserDialog({ isOpen, setIsOpen, user }: UserDialogProps) {
    const queryClient = useQueryClient();
    const isEditMode = user !== null;

    const form = useForm<AdminUserUpdate>({
        resolver: zodResolver(isEditMode ? adminUserUpdateSchema : adminUserCreateSchema),
        defaultValues: {
            email: '',
            password: '',
            fullName: '',
            phoneNumber: '',
            balance: 0,
            role: UserRole.CLIENT,
        },
    });

    useEffect(() => {
        if (isOpen) {
            if (isEditMode && user) {
                form.reset({
                    id: user.id,
                    fullName: user.fullName || '',
                    phoneNumber: user.phoneNumber || '',
                    balance: user.balance || 0,
                    role: user.role || UserRole.CLIENT,
                });
            } else {
                form.reset({
                    email: '',
                    password: '',
                    fullName: '',
                    phoneNumber: '',
                    balance: 0,
                    role: UserRole.CLIENT,
                });
            }
        }
    }, [isOpen, isEditMode, user, form]);

    const mutation = useMutation({
        mutationFn: isEditMode ? updateUser : createUser,
        onSuccess: () => {
            toast({
                title: "Succès !",
                description: `Utilisateur ${isEditMode ? 'mis à jour' : 'créé'} avec succès.`,
            });
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setIsOpen(false);
            form.reset();
        },
        onError: (error: Error) => {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: error.message,
            });
        },
    });

    const onSubmit = (data: AdminUserUpdate) => {
        mutation.mutate(data);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "Modifier l'utilisateur" : "Créer un utilisateur"}</DialogTitle>
                    <DialogDescription>
                        {isEditMode ? "Modifiez les informations de l'utilisateur." : "Remplissez les détails pour créer un nouvel utilisateur."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {!isEditMode && (
                            <>
                                <FormField control={form.control} name="email" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="password" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mot de passe</FormLabel>
                                        <FormControl><Input type="password" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </>
                        )}
                        <FormField control={form.control} name="fullName" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nom complet</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Numéro de téléphone</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="balance" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Solde</FormLabel>
                                <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="role" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Rôle</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner un rôle" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value={UserRole.CLIENT}>CLIENT</SelectItem>
                                        <SelectItem value={UserRole.ADMIN}>ADMIN</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Annuler</Button>
                            <Button type="submit" disabled={mutation.isPending}>
                                {mutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
