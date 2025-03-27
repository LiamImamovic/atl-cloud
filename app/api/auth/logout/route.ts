import { cookies } from "next/headers";
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
export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");

  return NextResponse.json({
    message: "Déconnexion réussie",
  });
}
