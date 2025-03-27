import { z } from "zod";

// Schéma pour les réponses API
export const apiResponseSchema = z.object({
  status: z.number().int(),
  message: z.string(),
  data: z.any().optional(),
  error: z.string().optional(),
  pagination: z
    .object({
      currentPage: z.number().int().positive(),
      totalPages: z.number().int().nonnegative(),
      totalItems: z.number().int().nonnegative(),
      itemsPerPage: z.number().int().positive(),
    })
    .optional(),
});

// Schéma pour la configuration du rate limiting
export const rateLimitConfigSchema = z.object({
  limit: z.number().int().positive().default(10),
  window: z.number().int().positive().default(60),
});

// Type pour les réponses API
export type ApiResponse<T = any> = z.infer<typeof apiResponseSchema> & {
  data?: T;
};

// Type pour la configuration du rate limiting
export type RateLimitConfig = z.infer<typeof rateLimitConfigSchema>;
