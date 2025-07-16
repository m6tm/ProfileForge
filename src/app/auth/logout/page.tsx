import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut } from 'lucide-react';
import { logout } from '../actions';

export default function LogoutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Déconnexion</CardTitle>
          <CardDescription>
            Êtes-vous sûr de vouloir vous déconnecter ?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <form action={logout}>
                <Button variant="outline" type="submit" className="w-full">
                    <LogOut className="mr-2 h-4 w-4" />
                    Se déconnecter
                </Button>
            </form>
          <Button variant="ghost" asChild className="w-full">
            <Link href="/profile">Retour au profil</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
