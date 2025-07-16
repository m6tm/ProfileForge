import { ProfileForm } from '@/components/profile-form';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import { LogOut, Rocket } from 'lucide-react';
import { redirect } from 'next/navigation';
import { logout } from '@/app/auth/actions';
import { getPrisma } from '@/lib/prisma';

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
    redirect('/');
  }

  const initialProfileData = {
    fullName: profileData.fullName,
    email: profileData.email,
    phoneNumber: profileData.phoneNumber,
    bio: profileData.bio || '',
    website: profileData.website || '',
    preferences: {
      newsletter: profileData.newsletter,
      marketing: profileData.marketing,
    },
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between py-4 border-b">
        <div className="flex items-center gap-2">
          <Rocket className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline">ProfileForge</h1>
        </div>
        <form action={logout}>
          <Button variant="ghost" type="submit">
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </form>
      </header>
      <div className="grid grid-cols-1 gap-8 items-start">
        <div className="lg:col-span-2">
          <ProfileForm initialData={initialProfileData} />
        </div>
      </div>
    </div>
  );
}
