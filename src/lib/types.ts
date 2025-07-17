import { UserRole as UserRoleEnum } from "@/generated/prisma";
import { z } from "zod";

export const UserRole = UserRoleEnum;

export const profileFormSchema = z.object({
  fullName: z.string().min(2, { message: "Le nom complet doit comporter au moins 2 caractères." }),
  email: z.string().email(),
  phoneNumber: z.string().min(9, { message: "Le numéro de téléphone doit comporter au moins 9 chiffres." }),
  bio: z.string().max(160, { message: "La biographie ne doit pas dépasser 160 caractères." }).optional().or(z.literal('')),
  website: z.string().url({ message: "Veuillez saisir une URL valide." }).optional().or(z.literal('')),
  preferences: z.object({
    newsletter: z.boolean().default(false),
    marketing: z.boolean().default(false),
  }),
});

export type UserProfile = z.infer<typeof profileFormSchema>;

// Base schema for user data from the admin panel
const adminUserBaseSchema = z.object({
  id: z.string().optional(),
  fullName: z.string().min(2, { message: "Le nom complet est requis." }),
  phoneNumber: z.string().min(9, { message: "Le numéro de téléphone est requis." }),
  balance: z.number().int().min(0, { message: "Le solde doit être un nombre positif." }),
  role: z.nativeEnum(UserRole),
});

// Schema for creating a user, requires email and password
export const adminUserCreateSchema = adminUserBaseSchema.extend({
  email: z.string().email({ message: "Veuillez saisir une adresse e-mail valide." }),
  password: z.string().min(6, { message: "Le mot de passe doit comporter au moins 6 caractères." }),
});

// Schema for updating a user, email and password are not editable/required here
export const adminUserUpdateSchema = adminUserBaseSchema.extend({
   email: z.string().email({ message: "Veuillez saisir une adresse e-mail valide." }).optional(),
   password: z.string().min(6, { message: "Le mot de passe doit comporter au moins 6 caractères." }).optional(),
});

export type AdminUserCreate = z.infer<typeof adminUserCreateSchema>;
export type AdminUserUpdate = z.infer<typeof adminUserUpdateSchema>;
