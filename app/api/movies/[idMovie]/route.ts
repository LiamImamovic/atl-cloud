import { getAuthFromCookie } from "@/lib/auth";
import client from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/movies/{idMovie}:
 *   get:
 *     description: Récupère un film spécifique par son ID (nécessite une authentification)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du film
 *     responses:
 *       200:
 *         description: Film récupéré avec succès
 *       401:
 *         description: Non autorisé - authentification requise
 *       400:
 *         description: ID de film invalide
 *       404:
 *         description: Film non trouvé
 *       500:
 *         description: Erreur serveur
 */
export async function GET(request, context) {
  try {
    // Vérification d'authentification
    const auth = await getAuthFromCookie();
    if (!auth) {
      return NextResponse.json(
        {
          status: 401,
          message: "Unauthorized",
          error: "Authentication required to access this API",
        },
        { status: 401 },
      );
    }

    const mongoClient = await client.connect();
    const db = mongoClient.db("sample_mflix");

    const idMovie = context.params.idMovie;
    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json({
        status: 400,
        message: "Invalid movie ID",
        error: "ID format is incorrect",
      });
    }

    const movie = await db
      .collection("embedded_movies")
      .findOne({ _id: new ObjectId(idMovie) });

    if (!movie) {
      return NextResponse.json({
        status: 404,
        message: "Movie not found",
        error: "No movie found with the given ID",
      });
    }

    return NextResponse.json({ status: 200, data: movie });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

/**
 * @swagger
 * /api/movies/{idMovie}:
 *   post:
 *     description: Ajoute un nouveau film avec l'ID spécifié
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du film à créer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Film créé avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
export async function POST(request, context) {
  try {
    const mongoClient = await client.connect();
    const db = mongoClient.db("sample_mflix");

    const idMovie = context.params.idMovie;
    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json({
        status: 400,
        message: "Invalid movie ID",
        error: "ID format is incorrect",
      });
    }

    const movieData = await request.json();

    // Vérifie si le film existe déjà
    const existingMovie = await db
      .collection("embedded_movies")
      .findOne({ _id: new ObjectId(idMovie) });
    if (existingMovie) {
      return NextResponse.json({
        status: 409,
        message: "Conflict",
        error: "A movie with this ID already exists",
      });
    }

    // Ajouter _id à l'objet movieData
    movieData._id = new ObjectId(idMovie);

    await db.collection("embedded_movies").insertOne(movieData);

    return NextResponse.json({
      status: 201,
      message: "Movie created successfully",
      data: movieData,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

/**
 * @swagger
 * /api/movies/{idMovie}:
 *   put:
 *     description: Modifie un film existant
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du film à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Film modifié avec succès
 *       400:
 *         description: ID de film invalide
 *       404:
 *         description: Film non trouvé
 *       500:
 *         description: Erreur serveur
 */
export async function PUT(request, context) {
  try {
    const mongoClient = await client.connect();
    const db = mongoClient.db("sample_mflix");

    const idMovie = context.params.idMovie;
    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json({
        status: 400,
        message: "Invalid movie ID",
        error: "ID format is incorrect",
      });
    }

    const movieData = await request.json();
    delete movieData._id; // Supprimer _id s'il est présent pour éviter les erreurs

    const result = await db
      .collection("embedded_movies")
      .updateOne({ _id: new ObjectId(idMovie) }, { $set: movieData });

    if (result.matchedCount === 0) {
      return NextResponse.json({
        status: 404,
        message: "Movie not found",
        error: "No movie found with the given ID",
      });
    }

    return NextResponse.json({
      status: 200,
      message: "Movie updated successfully",
      data: { _id: idMovie, ...movieData },
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

/**
 * @swagger
 * /api/movies/{idMovie}:
 *   delete:
 *     description: Supprime un film
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du film à supprimer
 *     responses:
 *       200:
 *         description: Film supprimé avec succès
 *       401:
 *         description: Non autorisé - authentification requise
 *       400:
 *         description: ID de film invalide
 *       404:
 *         description: Film non trouvé
 *       500:
 *         description: Erreur serveur
 */
export async function DELETE(request, context) {
  try {
    // Vérification d'authentification
    const auth = await getAuthFromCookie();
    if (!auth) {
      return NextResponse.json(
        {
          status: 401,
          message: "Unauthorized",
          error: "Authentication required to access this API",
        },
        { status: 401 },
      );
    }

    const mongoClient = await client.connect();
    const db = mongoClient.db("sample_mflix");

    const idMovie = context.params.idMovie;
    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json({
        status: 400,
        message: "Invalid movie ID",
        error: "ID format is incorrect",
      });
    }

    const result = await db
      .collection("embedded_movies")
      .deleteOne({ _id: new ObjectId(idMovie) });

    if (result.deletedCount === 0) {
      return NextResponse.json({
        status: 404,
        message: "Movie not found",
        error: "No movie found with the given ID",
      });
    }

    return NextResponse.json({
      status: 200,
      message: "Movie deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
