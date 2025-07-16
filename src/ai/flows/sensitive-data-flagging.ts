// Sensitive data flagging flow
'use server';
/**
 * @fileOverview An AI agent that flags potentially sensitive data in user profile information.
 *
 * - flagSensitiveData - A function that handles the sensitive data flagging process.
 * - FlagSensitiveDataInput - The input type for the flagSensitiveData function.
 * - FlagSensitiveDataOutput - The return type for the flagSensitiveData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FlagSensitiveDataInputSchema = z.object({
  profileInformation: z
    .string()
    .describe('The user profile information to analyze.'),
});
export type FlagSensitiveDataInput = z.infer<typeof FlagSensitiveDataInputSchema>;

const FlagSensitiveDataOutputSchema = z.object({
  sensitiveDataFlags: z
    .array(z.string())
    .describe('An array of potentially sensitive data points found in the profile information.'),
  summary: z.string().describe('A summary of the analysis.'),
});
export type FlagSensitiveDataOutput = z.infer<typeof FlagSensitiveDataOutputSchema>;

export async function flagSensitiveData(input: FlagSensitiveDataInput): Promise<FlagSensitiveDataOutput> {
  return flagSensitiveDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'flagSensitiveDataPrompt',
  input: {schema: FlagSensitiveDataInputSchema},
  output: {schema: FlagSensitiveDataOutputSchema},
  prompt: `You are an AI assistant specializing in identifying potentially sensitive information in user profiles.

  Analyze the following user profile information and identify any data points that could be considered sensitive, such as:
  - Personally identifiable information (PII)
  - Financial information
  - Medical information
  - Security credentials
  - Private communications

  Return a list of the identified sensitive data points and a summary of the analysis.

  User Profile Information: {{{profileInformation}}}
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
