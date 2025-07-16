import { z } from "zod";

export const profileFormSchema = z.object({
  fullName: z.string().min(2, { message: "Le nom complet doit comporter au moins 2 caractères." }),
  email: z.string().email(),
  bio: z.string().max(160, { message: "La biographie ne doit pas dépasser 160 caractères." }).min(10, {message: "La biographie doit comporter au moins 10 caractères."}),
  website: z.string().url({ message: "Veuillez saisir une URL valide." }).optional().or(z.literal('')),
  preferences: z.object({
    newsletter: z.boolean(),
    marketing: z.boolean(),
  }),
});

export type UserProfile = z.infer<typeof profileFormSchema>;
