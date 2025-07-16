import AdminDashboard from "@/components/admin/admin-dashboard";
import { getPrisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminPage() {
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
    });

    if (!profile || profile.role !== 'ADMIN') {
        redirect('/profile');
    }

    const users = await prisma.profile.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });

    return <AdminDashboard initialUsers={users} />;
}
