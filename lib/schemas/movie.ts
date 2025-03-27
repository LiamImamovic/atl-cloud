import { ObjectId } from "mongodb";
import { z } from "zod";

// Validateur personnalisé pour ObjectId MongoDB
const objectIdValidator = z
  .string()
  .refine((id) => ObjectId.isValid(id), { message: "ID format is incorrect" });

// Schéma pour l'acteur
export const actorSchema = z.object({
  name: z.string(),
  role: z.string().optional(),
});

// Schéma pour le directeur
export const directorSchema = z.object({
  name: z.string(),
});

// Schéma pour les coordonnées géographiques
export const geoSchema = z.object({
  type: z.string().default("Point"),
  coordinates: z.tuple([z.number(), z.number()]),
});

// Schéma pour l'adresse du théâtre
export const locationSchema = z.object({
  address: z.string(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipcode: z.string().optional(),
  geo: geoSchema.optional(),
});

// Schéma pour les théâtres
export const theaterSchema = z.object({
  _id: objectIdValidator.optional(),
  theaterId: z.number().int().positive(),
  location: locationSchema,
  name: z.string().optional(),
});

// Schéma pour les critiques IMDB
export const imdbSchema = z.object({
  rating: z.number().min(0).max(10).optional(),
  votes: z.number().int().nonnegative().optional(),
  id: z.number().int().positive().optional(),
});

// Schéma pour les critiques Rotten Tomatoes
export const tomatoesSchema = z.object({
  viewer: z
    .object({
      rating: z.number().min(0).max(10).optional(),
      numReviews: z.number().int().nonnegative().optional(),
    })
    .optional(),
  critic: z
    .object({
      rating: z.number().min(0).max(10).optional(),
      numReviews: z.number().int().nonnegative().optional(),
    })
    .optional(),
});

// Schéma complet pour un film
export const movieSchema = z.object({
  _id: objectIdValidator.optional(),
  title: z.string().min(1, "Le titre est requis"),
  year: z.number().int().min(1888, "L'année doit être valide"),
  runtime: z.number().int().positive().optional(),
  released: z.date().or(z.string().datetime()).optional(),
  poster: z.string().url().optional(),
  plot: z.string().optional(),
  fullplot: z.string().optional(),
  genres: z.array(z.string()).default([]),
  countries: z.array(z.string()).default([]),
  directors: z.array(directorSchema).or(z.array(z.string())).default([]),
  writers: z.array(z.string()).default([]),
  actors: z.array(actorSchema).or(z.array(z.string())).default([]),
  rated: z.string().optional(),
  awards: z
    .object({
      wins: z.number().int().nonnegative().optional(),
      nominations: z.number().int().nonnegative().optional(),
      text: z.string().optional(),
    })
    .optional(),
  languages: z.array(z.string()).default([]),
  type: z.enum(["movie", "series", "episode"]).default("movie"),
  imdb: imdbSchema.optional(),
  tomatoes: tomatoesSchema.optional(),
  num_mflix_comments: z.number().int().nonnegative().default(0),
});

// Schéma pour les commentaires
export const commentSchema = z.object({
  _id: objectIdValidator.optional(),
  movie_id: objectIdValidator,
  name: z.string().min(1, "Le nom est requis").optional(), // Optionnel car ajouté automatiquement
  email: z.string().email("Format d'email invalide").optional(), // Optionnel car ajouté automatiquement
  text: z
    .string()
    .min(1, "Le commentaire ne peut pas être vide")
    .max(1000, "Le commentaire ne peut pas dépasser 1000 caractères"),
  date: z.date().or(z.string().datetime()).optional(),
  rating: z.number().min(0).max(10).optional(),
});

// Schéma pour la pagination et le filtrage
export const movieQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  title: z.string().optional(),
  year: z.coerce.number().int().optional(),
  genre: z.string().optional(),
  director: z.string().optional(),
  minRating: z.coerce.number().min(0).max(10).optional(),
  sortBy: z.enum(["title", "year", "rating"]).default("title"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

// Types inférés à partir des schémas
export type Movie = z.infer<typeof movieSchema>;
export type Comment = z.infer<typeof commentSchema>;
export type MovieQuery = z.infer<typeof movieQuerySchema>;
export type Theater = z.infer<typeof theaterSchema>;
