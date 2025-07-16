import { z } from "zod";

export const profileFormSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email(),
  bio: z.string().max(160, { message: "Bio must not be longer than 160 characters." }).min(10, {message: "Bio must be at least 10 characters."}),
  website: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  preferences: z.object({
    newsletter: z.boolean(),
    marketing: z.boolean(),
  }),
});

export type UserProfile = z.infer<typeof profileFormSchema>;
