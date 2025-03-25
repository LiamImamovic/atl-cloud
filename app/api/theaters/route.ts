import client from "@/lib/mongodb";
import { Db } from "mongodb";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/theaters:
 *   get:
 *     description: Récupère tous les théâtres et cinémas
 *     responses:
 *       200:
 *         description: Théâtres récupérés avec succès
 *       500:
 *         description: Erreur serveur
 */
export async function GET(): Promise<NextResponse> {
  try {
    const mongoClient = await client.connect();
    const db: Db = mongoClient.db("sample_mflix");
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
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
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
