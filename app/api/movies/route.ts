import client from "@/lib/mongodb";
import { Db } from "mongodb";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/movies:
 *   get:
 *     description: Récupère tous les films
 *     responses:
 *       200:
 *         description: Liste des films récupérée avec succès
 *       500:
 *         description: Erreur serveur
 */
export async function GET(): Promise<NextResponse> {
  try {
    const mongoClient = await client.connect();
    const db: Db = mongoClient.db("sample_mflix");
    const movies = await db.collection("movies").find({}).limit(20).toArray();

    return NextResponse.json({ status: 200, data: movies });
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
 * /api/movies:
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

/**
 * @swagger
 * /api/movies:
 *   put:
 *     description: Cette méthode n'est pas supportée sur cette route
 *     responses:
 *       405:
 *         description: Méthode non autorisée
 */
export async function PUT(): Promise<NextResponse> {
  return NextResponse.json({
    status: 405,
    message: "Method Not Allowed",
    error: "PUT method is not supported on this endpoint",
  });
}

/**
 * @swagger
 * /api/movies:
 *   delete:
 *     description: Cette méthode n'est pas supportée sur cette route
 *     responses:
 *       405:
 *         description: Méthode non autorisée
 */
export async function DELETE(): Promise<NextResponse> {
  return NextResponse.json({
    status: 405,
    message: "Method Not Allowed",
    error: "DELETE method is not supported on this endpoint",
  });
}
