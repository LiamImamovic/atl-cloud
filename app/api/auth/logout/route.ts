import { removeAuthCookie } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     description: Déconnecte l'utilisateur en supprimant le cookie d'authentification
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 */
export async function POST(): Promise<NextResponse> {
  await removeAuthCookie();

  return NextResponse.json({
    status: 200,
    message: "Logged out successfully",
  });
}
