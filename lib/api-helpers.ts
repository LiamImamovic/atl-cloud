import { getAuthFromCookie } from "@/lib/auth";
import client from "@/lib/mongodb";
import { Db, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

/**
 * Vérifie l'authentification de l'utilisateur pour les endpoints API
 * @returns Un objet avec le statut d'authentification et éventuellement une réponse d'erreur
 */
export async function checkApiAuth() {
  const auth = await getAuthFromCookie();

  if (!auth) {
    return {
      isAuthenticated: false,
      user: null,
      unauthorizedResponse: NextResponse.json(
        {
          status: 401,
          message: "Unauthorized",
          error: "Authentication required to access this API",
        },
        { status: 401 },
      ),
    };
  }

  return {
    isAuthenticated: true,
    user: auth,
    unauthorizedResponse: null,
  };
}

/**
 * Génère une réponse d'erreur standardisée pour les API
 * @param statusCode Code HTTP de l'erreur
 * @param message Message d'erreur principal
 * @param errorDetail Détails supplémentaires sur l'erreur
 * @returns NextResponse formatée avec l'erreur
 */
export function apiError(
  statusCode: number,
  message: string,
  errorDetail?: string,
): NextResponse {
  return NextResponse.json(
    {
      status: statusCode,
      message,
      error: errorDetail || message,
    },
    { status: statusCode },
  );
}

/**
 * Vérifie si un ID est un ObjectId MongoDB valide
 * @param id ID à vérifier
 * @returns NextResponse d'erreur si invalide, null si valide
 */
export function validateMongoId(id: string): NextResponse | null {
  if (!ObjectId.isValid(id)) {
    return apiError(400, "Invalid ID", "ID format is incorrect");
  }
  return null;
}

/**
 * Obtient une instance de la base de données MongoDB
 * @returns Instance de la base de données
 */
export async function getMflixDb(): Promise<Db> {
  const mongoClient = await client.connect();
  return mongoClient.db("sample_mflix");
}
