import { z } from "zod";

export const profileFormSchema = z.object({
  fullName: z.string().min(2, { message: "Le nom complet doit comporter au moins 2 caractères." }),
  email: z.string().email(),
  bio: z.string().max(160, { message: "La biographie ne doit pas dépasser 160 caractères." }).optional().or(z.literal('')),
  website: z.string().url({ message: "Veuillez saisir une URL valide." }).optional().or(z.literal('')),
  preferences: z.object({
    newsletter: z.boolean().default(false),
    marketing: z.boolean().default(false),
  }),
});

export type UserProfile = z.infer<typeof profileFormSchema>;
