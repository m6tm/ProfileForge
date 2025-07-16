"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Rocket } from "lucide-react";

interface AuthFormProps {
  onAuthSuccess: () => void;
}

export default function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAuthSuccess();
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
                <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input id="login-email" type="email" placeholder="m@exemple.com" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="login-password">Mot de passe</Label>
                    <Input id="login-password" type="password" required />
                </div>
                <Button type="submit" className="w-full">Connexion</Button>
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
                <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input id="register-email" type="email" placeholder="m@exemple.com" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="register-password">Mot de passe</Label>
                    <Input id="register-password" type="password" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                    <Input id="confirm-password" type="password" required />
                </div>
                <Button type="submit" className="w-full">S'inscrire</Button>
                </form>
            </CardContent>
            </Card>
        </TabsContent>
        </Tabs>
    </div>
  );
}
