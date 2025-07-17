import AuthForm from "@/components/auth-form";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 selection:bg-primary/20">
      <AuthForm />
    </div>
  );
}
