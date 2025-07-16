'use server';

/**
 * @fileOverview Summarizes the user's profile information using AI.
 *
 * - summarizeProfile - A function that generates a summary of the user's profile.
 * - ProfileSummaryInput - The input type for the summarizeProfile function.
 * - ProfileSummaryOutput - The return type for the summarizeProfile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProfileSummaryInputSchema = z.object({
  profileInformation: z
    .string()
    .describe('The user profile information to be summarized.'),
});
export type ProfileSummaryInput = z.infer<typeof ProfileSummaryInputSchema>;

const ProfileSummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of the user profile information.'),
});
export type ProfileSummaryOutput = z.infer<typeof ProfileSummaryOutputSchema>;

export async function summarizeProfile(input: ProfileSummaryInput): Promise<ProfileSummaryOutput> {
  return profileSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'profileSummaryPrompt',
  input: {schema: ProfileSummaryInputSchema},
  output: {schema: ProfileSummaryOutputSchema},
  prompt: `Summarize the following user profile information:\n\n{{{profileInformation}}}`,
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
      progress: 'Profile summary generated successfully.'
    } as ProfileSummaryOutput & {progress: string};
  }
);
