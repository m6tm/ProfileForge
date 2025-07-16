// Flux de signalement des données sensibles
'use server';
/**
 * @fileOverview Un agent IA qui signale les données potentiellement sensibles dans les informations de profil utilisateur.
 *
 * - flagSensitiveData - Une fonction qui gère le processus de signalement des données sensibles.
 * - FlagSensitiveDataInput - Le type d'entrée pour la fonction flagSensitiveData.
 * - FlagSensitiveDataOutput - Le type de retour pour la fonction flagSensitiveData.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FlagSensitiveDataInputSchema = z.object({
  profileInformation: z
    .string()
    .describe('Les informations du profil utilisateur à analyser.'),
});
export type FlagSensitiveDataInput = z.infer<typeof FlagSensitiveDataInputSchema>;

const FlagSensitiveDataOutputSchema = z.object({
  sensitiveDataFlags: z
    .array(z.string())
    .describe('Un tableau de points de données potentiellement sensibles trouvés dans les informations de profil.'),
  summary: z.string().describe('Un résumé de l\'analyse.'),
});
export type FlagSensitiveDataOutput = z.infer<typeof FlagSensitiveDataOutputSchema>;

export async function flagSensitiveData(input: FlagSensitiveDataInput): Promise<FlagSensitiveDataOutput> {
  return flagSensitiveDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'flagSensitiveDataPrompt',
  input: {schema: FlagSensitiveDataInputSchema},
  output: {schema: FlagSensitiveDataOutputSchema},
  prompt: `Vous êtes un assistant IA spécialisé dans l'identification des informations potentiellement sensibles dans les profils utilisateur.

  Analysez les informations de profil utilisateur suivantes et identifiez tous les points de données qui pourraient être considérés comme sensibles, tels que :
  - Informations d'identification personnelle (PII)
  - Informations financières
  - Informations médicales
  - Identifiants de sécurité
  - Communications privées

  Renvoyez une liste des points de données sensibles identifiés et un résumé de l'analyse.

  Informations du profil utilisateur : {{{profileInformation}}}
  `,
});

const flagSensitiveDataFlow = ai.defineFlow(
  {
    name: 'flagSensitiveDataFlow',
    inputSchema: FlagSensitiveDataInputSchema,
    outputSchema: FlagSensitiveDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
