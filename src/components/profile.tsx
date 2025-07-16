"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ProfileForm } from '@/components/profile-form';
import { AiFeatures } from '@/components/ai-features';
import { LogOut, Rocket } from 'lucide-react';
import type { UserProfile } from '@/lib/types';

interface ProfileProps {
  onLogout: () => void;
}

const initialProfileData: UserProfile = {
    fullName: 'Alex Dubois',
    email: 'alex.dubois@exemple.com',
    bio: 'Ingénieur logiciel passionné par la création d\'applications web belles et fonctionnelles. Intéressé par l\'IA, les systèmes de design et l\'open-source.',
    website: 'https://alexdubois.com',
    preferences: {
        newsletter: true,
        marketing: false,
    }
};

export default function Profile({ onLogout }: ProfileProps) {
  const [profileData, setProfileData] = useState<UserProfile>(initialProfileData);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between py-4 border-b">
        <div className="flex items-center gap-2">
          <Rocket className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline">ProfileForge</h1>
        </div>
        <Button variant="ghost" onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </Button>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
            <ProfileForm initialData={profileData} onUpdate={setProfileData} />
        </div>
        <div className="lg:col-span-1">
            <AiFeatures profileData={profileData} />
        </div>
      </div>
    </div>
  );
}
