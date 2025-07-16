// This file is machine-generated - edit with caution!
'use server';
/**
 * @fileOverview A flow to suggest profile updates to the user.
 *
 * - suggestProfileUpdates - A function that suggests profile updates based on current profile data.
 * - SuggestProfileUpdatesInput - The input type for the suggestProfileUpdates function.
 * - SuggestProfileUpdatesOutput - The return type for the suggestProfileUpdates function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestProfileUpdatesInputSchema = z.object({
  currentProfileData: z.record(z.any()).describe('The user data.'),
});
export type SuggestProfileUpdatesInput = z.infer<
  typeof SuggestProfileUpdatesInputSchema
>;

const SuggestProfileUpdatesOutputSchema = z.object({
  suggestions: z.array(z.string()).describe(
    'A list of suggestions for profile updates, based on common best practices for profile completeness.'
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
  prompt: `You are an AI assistant designed to help users complete their profile information.

  Based on the user's current profile data, suggest which fields the user should update to complete their profile.
  Consider common best practices for profile completeness when making suggestions.

  Current profile data: {{{currentProfileData}}}
  Suggestions:`,
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
