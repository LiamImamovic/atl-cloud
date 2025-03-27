import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),
  email: z
    .string()
    .email("Format d'email invalide")
    .max(100, "L'email ne peut pas dépasser 100 caractères"),
  password: z
    .string()
    .min(10, "Le mot de passe doit contenir au moins 10 caractères")
    .max(100, "Le mot de passe ne peut pas dépasser 100 caractères")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/,
      "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial",
    ),
});

export const loginSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export const userSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Format d'email invalide"),
  password: z.string(), // Mot de passe haché stocké en base
  createdAt: z.date().or(z.string().datetime()),
  role: z.enum(["user", "admin"]).default("user"),
  lastLogin: z.date().or(z.string().datetime()).optional(),
});

// Schéma pour les JWT
export const jwtPayloadSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  role: z.enum(["user", "admin"]).default("user"),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

// Types inférés à partir des schémas
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type User = z.infer<typeof userSchema>;
export type JWTPayload = z.infer<typeof jwtPayloadSchema>;
