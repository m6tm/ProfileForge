import AuthForm from "@/components/auth-form";
import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/profile");
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 selection:bg-primary/20">
      <AuthForm />
    </div>
  );
}
