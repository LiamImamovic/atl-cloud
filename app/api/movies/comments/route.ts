import client from "@/lib/mongodb";
import { Db } from "mongodb";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/movies/comments:
 *   get:
 *     description: Récupère tous les commentaires liés aux films
 *     parameters:
 *       - in: query
 *         name: movieId
 *         schema:
 *           type: string
 *         description: ID du film pour filtrer les commentaires (optionnel)
 *     responses:
 *       200:
 *         description: Commentaires récupérés avec succès
 *       500:
 *         description: Erreur serveur
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get("movieId");

    const mongoClient = await client.connect();
    const db: Db = mongoClient.db("sample_mflix");

    let query = {};
    if (movieId) {
      query = { movie_id: movieId };
    }

    const comments = await db
      .collection("comments")
      .find(query)
      .limit(20)
      .toArray();

    return NextResponse.json({
      status: 200,
      data: comments,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

/**
 * @swagger
 * /api/movies/comments:
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
