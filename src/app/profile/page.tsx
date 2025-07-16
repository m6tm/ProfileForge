import Profile from "@/components/profile";
import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const supabase = createServerClient();

    const { data: { session }} = await supabase.auth.getSession();

    if (!session) {
        redirect('/');
    }

    return <Profile />;
}
