// src/app/api/admin/users/[id]/route.ts
'use server';

import { getPrisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { adminUserUpdateSchema } from '@/lib/types';
import { NextResponse, type NextRequest } from 'next/server';

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

    return { user, profile };
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

    const { fullName, phoneNumber, balance, role } = validatedFields.data;
    const prisma = getPrisma();

    try {
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

        const adminAuthClient = (await createClient()).auth.admin;
        await adminAuthClient.deleteUser(userToDelete.userId);

        await prisma.profile.delete({ where: { id } });

        return NextResponse.json({ message: 'Utilisateur supprimé avec succès.' });
    } catch (error: any) {
        console.error('Erreur de suppression d\'utilisateur:', error);
        // If user is already deleted from Supabase auth but not from DB
        if (error.code === 'P2025' || (error.message && error.message.includes("User not found"))) {
            await prisma.profile.delete({ where: { id } });
            return NextResponse.json({ message: 'Utilisateur supprimé avec succès (nettoyage).' });
        }
        return NextResponse.json({ error: 'Erreur lors de la suppression de l\'utilisateur.' }, { status: 500 });
    }
}
