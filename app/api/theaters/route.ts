import { apiError, checkApiAuth, getMflixDb } from "@/lib/api-helpers";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/theaters:
 *   get:
 *     description: Récupère tous les théâtres et cinémas (nécessite une authentification)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Théâtres récupérés avec succès
 *       401:
 *         description: Non autorisé - authentification requise
 *       500:
 *         description: Erreur serveur
 */
export async function GET(): Promise<NextResponse> {
  try {
    // Vérification d'authentification
    const { isAuthenticated, unauthorizedResponse } = await checkApiAuth();
    if (!isAuthenticated) {
      return unauthorizedResponse!;
    }

    const db = await getMflixDb();
    const theaters = await db
      .collection("theaters")
      .find({})
      .limit(20)
      .toArray();

    return NextResponse.json({
      status: 200,
      data: theaters,
    });
  } catch (error: any) {
    return apiError(500, "Internal Server Error", error.message);
  }
}

/**
 * @swagger
 * /api/theaters:
 *   post:
 *     description: Cette méthode n'est pas supportée sur cette route
 *     responses:
 *       405:
 *         description: Méthode non autorisée
 */
export async function POST(): Promise<NextResponse> {
  return NextResponse.json({
    status: 405,
    message: "Method Not Allowed",
    error: "POST method is not supported on this endpoint",
  });
}
