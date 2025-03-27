import { checkApiAuth } from "@/lib/api-helpers";
import { getAuthFromCookie } from "@/lib/auth";
import client from "@/lib/mongodb";
import { Db, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/movies/comments/{idComment}:
 *   get:
 *     description: Récupère un commentaire spécifique
 *     parameters:
 *       - in: path
 *         name: idComment
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du commentaire
 *     responses:
 *       200:
 *         description: Commentaire récupéré avec succès
 *       400:
 *         description: ID de commentaire invalide
 *       401:
 *         description: Non autorisé - authentification requise
 *       404:
 *         description: Commentaire non trouvé
 *       500:
 *         description: Erreur serveur
 */
export async function GET(
  request: Request,
  { params }: { params: { idComment: string } },
): Promise<NextResponse> {
  try {
    const { idComment } = params;
    if (!ObjectId.isValid(idComment)) {
      return NextResponse.json({
        status: 400,
        message: "Invalid comment ID",
        error: "ID format is incorrect",
      });
    }

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
    const db: Db = mongoClient.db("sample_mflix");

    const comment = await db
      .collection("comments")
      .findOne({ _id: new ObjectId(idComment) });

    if (!comment) {
      return NextResponse.json({
        status: 404,
        message: "Comment not found",
        error: "No comment found with the given ID",
      });
    }

    return NextResponse.json({
      status: 200,
      data: comment,
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
 * /api/movies/comments/{idComment}:
 *   post:
 *     description: Ajoute un nouveau commentaire avec l'ID spécifié (nécessite une authentification)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idComment
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du commentaire à créer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Commentaire créé avec succès
 *       401:
 *         description: Non autorisé - authentification requise
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
export async function POST(
  request: Request,
  { params }: { params: { idComment: string } },
): Promise<NextResponse> {
  try {
    // Vérification d'authentification
    const { isAuthenticated, unauthorizedResponse } = await checkApiAuth();
    if (!isAuthenticated) {
      return unauthorizedResponse!;
    }

    const { idComment } = params;
    if (!ObjectId.isValid(idComment)) {
      return NextResponse.json({
        status: 400,
        message: "Invalid comment ID",
        error: "ID format is incorrect",
      });
    }

    const mongoClient = await client.connect();
    const db: Db = mongoClient.db("sample_mflix");

    const commentData = await request.json();

    // Vérifier si le commentaire existe déjà
    const existingComment = await db
      .collection("comments")
      .findOne({ _id: new ObjectId(idComment) });
    if (existingComment) {
      return NextResponse.json({
        status: 409,
        message: "Conflict",
        error: "A comment with this ID already exists",
      });
    }

    // Ajouter _id et date à l'objet commentData
    commentData._id = new ObjectId(idComment);
    commentData.date = new Date();

    // Utiliser un ID utilisateur "en dur" comme demandé dans le cahier des charges
    commentData.email = "user@example.com";
    commentData.name = "Example User";

    await db.collection("comments").insertOne(commentData);

    return NextResponse.json({
      status: 201,
      message: "Comment created successfully",
      data: commentData,
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
 * /api/movies/comments/{idComment}:
 *   put:
 *     description: Modifie un commentaire existant
 *     parameters:
 *       - in: path
 *         name: idComment
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du commentaire à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Commentaire modifié avec succès
 *       400:
 *         description: ID de commentaire invalide
 *       404:
 *         description: Commentaire non trouvé
 *       500:
 *         description: Erreur serveur
 */
export async function PUT(
  request: Request,
  { params }: { params: { idComment: string } },
): Promise<NextResponse> {
  try {
    const { idComment } = params;
    if (!ObjectId.isValid(idComment)) {
      return NextResponse.json({
        status: 400,
        message: "Invalid comment ID",
        error: "ID format is incorrect",
      });
    }

    const mongoClient = await client.connect();
    const db: Db = mongoClient.db("sample_mflix");

    const commentData = await request.json();
    delete commentData._id; // Supprimer _id s'il est présent pour éviter les erreurs

    // Ajouter date de mise à jour
    commentData.updated = new Date();

    const result = await db
      .collection("comments")
      .updateOne({ _id: new ObjectId(idComment) }, { $set: commentData });

    if (result.matchedCount === 0) {
      return NextResponse.json({
        status: 404,
        message: "Comment not found",
        error: "No comment found with the given ID",
      });
    }

    return NextResponse.json({
      status: 200,
      message: "Comment updated successfully",
      data: { _id: idComment, ...commentData },
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
 * /api/movies/comments/{idComment}:
 *   delete:
 *     description: Supprime un commentaire
 *     parameters:
 *       - in: path
 *         name: idComment
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du commentaire à supprimer
 *     responses:
 *       200:
 *         description: Commentaire supprimé avec succès
 *       400:
 *         description: ID de commentaire invalide
 *       404:
 *         description: Commentaire non trouvé
 *       500:
 *         description: Erreur serveur
 */
export async function DELETE(
  request: Request,
  { params }: { params: { idComment: string } },
): Promise<NextResponse> {
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

    const { idComment } = params;
    if (!ObjectId.isValid(idComment)) {
      return NextResponse.json({
        status: 400,
        message: "Invalid comment ID",
        error: "ID format is incorrect",
      });
    }

    const mongoClient = await client.connect();
    const db: Db = mongoClient.db("sample_mflix");

    const result = await db
      .collection("comments")
      .deleteOne({ _id: new ObjectId(idComment) });

    if (result.deletedCount === 0) {
      return NextResponse.json({
        status: 404,
        message: "Comment not found",
        error: "No comment found with the given ID",
      });
    }

    return NextResponse.json({
      status: 200,
      message: "Comment deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
