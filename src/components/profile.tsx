import { ProfileForm } from '@/components/profile-form';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import { LogOut, Rocket, Gamepad2, ShieldCheck } from 'lucide-react';
import { redirect } from 'next/navigation';
import { logout } from '@/app/auth/actions';
import { getPrisma } from '@/lib/prisma';
import type { UserProfile } from '@/lib/types';
import Link from 'next/link';

export default async function Profile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const profileData = await getPrisma().profile.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!profileData) {
    console.error("Erreur lors de la récupération du profil ou profil non trouvé:");
    // This might happen if the profile creation in the callback failed.
    // We log out the user to allow them to try signing up again.
    await logout();
    redirect('/');
  }

  const initialProfileData: UserProfile = {
    fullName: profileData.fullName || '',
    email: profileData.email || '',
    phoneNumber: profileData.phoneNumber || '',
    bio: profileData.bio || '',
    website: profileData.website || '',
    preferences: {
      newsletter: profileData.newsletter,
      marketing: profileData.marketing,
    },
  };

  const isAdmin = profileData.role === 'ADMIN';

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between py-4 border-b">
        <div className="flex items-center gap-2">
          <Rocket className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline">ProfileForge</h1>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
             <Button variant="outline" asChild>
                <Link href="/admin">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Admin
                </Link>
             </Button>
          )}
          <Button variant="outline" asChild>
            <Link href="/game">
              <Gamepad2 className="mr-2 h-4 w-4" />
              Jouer
            </Link>
          </Button>
          <form action={logout}>
            <Button variant="ghost" type="submit">
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </form>
        </div>
      </header>
      <div className="grid grid-cols-1 gap-8 items-start">
        <div className="lg:col-span-2">
          <ProfileForm initialData={initialProfileData} />
        </div>
      </div>
    </div>
  );
}
