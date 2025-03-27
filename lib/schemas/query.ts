import { ObjectId } from "mongodb";
import { z } from "zod";

// Validateur personnalisé pour ObjectId MongoDB
const objectIdValidator = z
  .string()
  .refine((id) => ObjectId.isValid(id), { message: "ID format is incorrect" });

// Schéma de base pour la pagination
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// Schéma pour les requêtes de recherche de films
export const movieSearchSchema = paginationSchema.extend({
  title: z.string().optional(),
  year: z.coerce.number().int().optional(),
  genre: z.string().optional(),
  country: z.string().optional(),
  director: z.string().optional(),
  cast: z.string().optional(),
  minRating: z.coerce.number().min(0).max(10).optional(),
  maxRating: z.coerce.number().min(0).max(10).optional(),
  sortBy: z.enum(["title", "year", "rating"]).default("title"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

// Schéma pour les requêtes de recherche de commentaires
export const commentSearchSchema = paginationSchema.extend({
  movieId: objectIdValidator.optional(),
  email: z.string().email().optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  sortBy: z.enum(["date", "name"]).default("date"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Schéma pour les requêtes de recherche de théâtres
export const theaterSearchSchema = paginationSchema.extend({
  city: z.string().optional(),
  state: z.string().optional(),
  zipcode: z.string().optional(),
  near: z.tuple([z.number(), z.number()]).optional(),
  maxDistance: z.coerce.number().positive().optional(),
});

// Types inférés à partir des schémas
export type PaginationQuery = z.infer<typeof paginationSchema>;
export type MovieSearchQuery = z.infer<typeof movieSearchSchema>;
export type CommentSearchQuery = z.infer<typeof commentSearchSchema>;
export type TheaterSearchQuery = z.infer<typeof theaterSearchSchema>;
