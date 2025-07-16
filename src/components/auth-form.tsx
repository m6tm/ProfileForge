import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Rocket } from "lucide-react";
import { login, signup } from "@/app/auth/actions";
import { toast } from "@/hooks/use-toast";

export default function AuthForm() {

  const handleAuthAction = async (formData: FormData) => {
    const action = formData.get('action');
    let error;

    if (action === 'signup') {
      const result = await signup(formData);
      error = result?.error;
    } else {
      const result = await login(formData);
      error = result?.error;
    }

    if (error) {
      toast({
        variant: "destructive",
        title: "Oh oh ! Quelque chose s'est mal passé.",
        description: error,
      });
    }
  };


  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex items-center gap-2 text-2xl font-bold font-headline">
        <Rocket className="w-8 h-8 text-primary" />
        <h1>ProfileForge</h1>
      </div>
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Connexion</TabsTrigger>
          <TabsTrigger value="register">S'inscrire</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Content de vous revoir</CardTitle>
              <CardDescription>Entrez vos identifiants pour accéder à votre profil.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={handleAuthAction}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="m@exemple.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input id="password" name="password" type="password" required />
                  </div>
                  <Button type="submit" name="action" value="login" className="w-full">Connexion</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Créer un compte</CardTitle>
              <CardDescription>Rejoignez ProfileForge pour gérer votre profil avec l'IA.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={handleAuthAction}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input id="register-email" name="email" type="email" placeholder="m@exemple.com" required />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="register-fullName">Nom complet</Label>
                    <Input id="register-fullName" name="fullName" type="text" placeholder="Alex Dubois" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Mot de passe</Label>
                    <Input id="register-password" name="password" type="password" required />
                  </div>
                  <Button type="submit" name="action" value="signup" className="w-full">S'inscrire</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
