import AdminDashboard from "@/components/admin/admin-dashboard";
import { getPrisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { format } from "date-fns";

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

    const usersData = await prisma.profile.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });

    // Format the date on the server to prevent hydration mismatch
    const users = usersData.map(user => ({
        ...user,
        createdAt: format(new Date(user.createdAt), "dd/MM/yyyy"),
    }));


    return <AdminDashboard initialUsers={users} />;
}
