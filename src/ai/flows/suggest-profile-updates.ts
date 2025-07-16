'use server';
/**
 * @fileOverview Un flux pour suggérer des mises à jour de profil à l'utilisateur.
 *
 * - suggestProfileUpdates - Une fonction qui suggère des mises à jour de profil en fonction des données de profil actuelles.
 * - SuggestProfileUpdatesInput - Le type d'entrée pour la fonction suggestProfileUpdates.
 * - SuggestProfileUpdatesOutput - Le type de retour pour la fonction suggestProfileUpdates.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestProfileUpdatesInputSchema = z.object({
  currentProfileData: z.record(z.any()).describe('Les données de l\'utilisateur.'),
});
export type SuggestProfileUpdatesInput = z.infer<
  typeof SuggestProfileUpdatesInputSchema
>;

const SuggestProfileUpdatesOutputSchema = z.object({
  suggestions: z.array(z.string()).describe(
    'Une liste de suggestions de mises à jour de profil, basée sur les meilleures pratiques courantes pour la complétude du profil.'
  ),
});
export type SuggestProfileUpdatesOutput = z.infer<
  typeof SuggestProfileUpdatesOutputSchema
>;

export async function suggestProfileUpdates(
  input: SuggestProfileUpdatesInput
): Promise<SuggestProfileUpdatesOutput> {
  return suggestProfileUpdatesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestProfileUpdatesPrompt',
  input: {schema: SuggestProfileUpdatesInputSchema},
  output: {schema: SuggestProfileUpdatesOutputSchema},
  prompt: `Vous êtes un assistant IA conçu pour aider les utilisateurs à compléter leurs informations de profil.

  En fonction des données actuelles du profil de l'utilisateur, suggérez les champs que l'utilisateur devrait mettre à jour pour compléter son profil.
  Tenez compte des meilleures pratiques courantes en matière de complétude de profil lors de vos suggestions.

  Données de profil actuelles : {{{currentProfileData}}}
  Suggestions :`,
});

const suggestProfileUpdatesFlow = ai.defineFlow(
  {
    name: 'suggestProfileUpdatesFlow',
    inputSchema: SuggestProfileUpdatesInputSchema,
    outputSchema: SuggestProfileUpdatesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
