import { z } from "zod";

export const jwtPayloadSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.string().optional(),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

export type JWTPayloadSchema = z.infer<typeof jwtPayloadSchema>;
