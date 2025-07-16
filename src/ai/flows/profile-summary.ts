'use server';

/**
 * @fileOverview Résume les informations du profil de l'utilisateur à l'aide de l'IA.
 *
 * - summarizeProfile - Une fonction qui génère un résumé du profil de l'utilisateur.
 * - ProfileSummaryInput - Le type d'entrée pour la fonction summarizeProfile.
 * - ProfileSummaryOutput - Le type de retour pour la fonction summarizeProfile.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProfileSummaryInputSchema = z.object({
  profileInformation: z
    .string()
    .describe('Les informations du profil utilisateur à résumer.'),
});
export type ProfileSummaryInput = z.infer<typeof ProfileSummaryInputSchema>;

const ProfileSummaryOutputSchema = z.object({
  summary: z.string().describe('Un résumé des informations du profil utilisateur.'),
});
export type ProfileSummaryOutput = z.infer<typeof ProfileSummaryOutputSchema>;

export async function summarizeProfile(input: ProfileSummaryInput): Promise<ProfileSummaryOutput> {
  return profileSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'profileSummaryPrompt',
  input: {schema: ProfileSummaryInputSchema},
  output: {schema: ProfileSummaryOutputSchema},
  prompt: `Résumez les informations de profil utilisateur suivantes :\n\n{{{profileInformation}}}`,
});

const profileSummaryFlow = ai.defineFlow(
  {
    name: 'profileSummaryFlow',
    inputSchema: ProfileSummaryInputSchema,
    outputSchema: ProfileSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      ...output,
      progress: 'Résumé du profil généré avec succès.'
    } as ProfileSummaryOutput & {progress: string};
  }
);
