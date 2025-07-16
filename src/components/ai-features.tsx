"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { summarizeProfile } from '@/ai/flows/profile-summary';
import { suggestProfileUpdates } from '@/ai/flows/suggest-profile-updates';
import { flagSensitiveData } from '@/ai/flows/sensitive-data-flagging';
import { Lightbulb, Scan, FileText, AlertTriangle } from 'lucide-react';
import type { UserProfile } from '@/lib/types';
import { Skeleton } from './ui/skeleton';

interface AiFeaturesProps {
    profileData: UserProfile;
}

type AiResult = {
    title: string;
    content: React.ReactNode;
    icon: React.ElementType;
} | null;

export function AiFeatures({ profileData }: AiFeaturesProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<AiResult>(null);

    const handleSummarize = async () => {
        setIsLoading(true);
        setResult(null);
        try {
            const profileString = JSON.stringify(profileData, null, 2);
            const response = await summarizeProfile({ profileInformation: profileString });
            setResult({
                title: 'Profile Summary',
                content: <p className="text-sm">{response.summary}</p>,
                icon: FileText
            });
        } catch (error) {
            console.error(error);
            setResult({ title: 'Error', content: <p>Could not generate summary.</p>, icon: AlertTriangle });
        }
        setIsLoading(false);
    };

    const handleSuggest = async () => {
        setIsLoading(true);
        setResult(null);
        try {
            const response = await suggestProfileUpdates({ currentProfileData: profileData });
            setResult({
                title: 'Update Suggestions',
                content: (
                    <ul className="list-disc list-inside space-y-1 text-sm">
                        {response.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                ),
                icon: Lightbulb
            });
        } catch (error) {
            console.error(error);
            setResult({ title: 'Error', content: <p>Could not get suggestions.</p>, icon: AlertTriangle });
        }
        setIsLoading(false);
    };

    const handleScan = async () => {
        setIsLoading(true);
        setResult(null);
        try {
            const profileString = JSON.stringify(profileData, null, 2);
            const response = await flagSensitiveData({ profileInformation: profileString });
            setResult({
                title: 'Sensitive Data Scan',
                content: (
                    <div className="space-y-2 text-sm">
                        <p>{response.summary}</p>
                        {response.sensitiveDataFlags.length > 0 && (
                             <ul className="list-disc list-inside space-y-1 font-medium text-destructive-foreground/80 bg-destructive/80 rounded-md p-3">
                                {response.sensitiveDataFlags.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        )}
                    </div>
                ),
                icon: Scan
            });
        } catch (error) {
            console.error(error);
            setResult({ title: 'Error', content: <p>Could not perform scan.</p>, icon: AlertTriangle });
        }
        setIsLoading(false);
    };

    return (
        <Card className="sticky top-8">
            <CardHeader>
                <CardTitle>AI-Enhanced Tools</CardTitle>
                <CardDescription>Use AI to improve your profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-col space-y-2">
                    <Button onClick={handleSummarize} disabled={isLoading} variant="outline"><FileText className="mr-2 h-4 w-4" /> Summarize Profile</Button>
                    <Button onClick={handleSuggest} disabled={isLoading} variant="outline"><Lightbulb className="mr-2 h-4 w-4" /> Suggest Updates</Button>
                    <Button onClick={handleScan} disabled={isLoading} variant="outline"><Scan className="mr-2 h-4 w-4" /> Scan for Sensitive Data</Button>
                </div>

                {isLoading && (
                    <div className="space-y-2 pt-4">
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                )}
                {result && !isLoading && (
                    <Card className="mt-4 bg-secondary">
                        <CardHeader>
                            <CardTitle className="flex items-center text-lg">
                                <result.icon className="mr-2 h-5 w-5" />
                                {result.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {result.content}
                        </CardContent>
                    </Card>
                )}
            </CardContent>
        </Card>
    );
}
