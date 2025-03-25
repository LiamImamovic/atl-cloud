import client from "@/lib/mongodb";
import { Db, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/theaters/{idTheater}:
 *   get:
 *     description: Récupère un théâtre spécifique
 *     parameters:
 *       - in: path
 *         name: idTheater
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du théâtre
 *     responses:
 *       200:
 *         description: Théâtre récupéré avec succès
 *       400:
 *         description: ID de théâtre invalide
 *       404:
 *         description: Théâtre non trouvé
 *       500:
 *         description: Erreur serveur
 */
export async function GET(
  request: Request,
  { params }: { params: { idTheater: string } },
): Promise<NextResponse> {
  try {
    const { idTheater } = params;
    if (!ObjectId.isValid(idTheater)) {
      return NextResponse.json({
        status: 400,
        message: "Invalid theater ID",
        error: "ID format is incorrect",
      });
    }

    const mongoClient = await client.connect();
    const db: Db = mongoClient.db("sample_mflix");

    const theater = await db
      .collection("theaters")
      .findOne({ _id: new ObjectId(idTheater) });

    if (!theater) {
      return NextResponse.json({
        status: 404,
        message: "Theater not found",
        error: "No theater found with the given ID",
      });
    }

    return NextResponse.json({
      status: 200,
      data: theater,
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
 * /api/theaters/{idTheater}:
 *   post:
 *     description: Ajoute un nouveau théâtre avec l'ID spécifié
 *     parameters:
 *       - in: path
 *         name: idTheater
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du théâtre à créer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Théâtre créé avec succès
 *       400:
 *         description: Données invalides
 *       409:
 *         description: Un théâtre avec cet ID existe déjà
 *       500:
 *         description: Erreur serveur
 */
export async function POST(
  request: Request,
  { params }: { params: { idTheater: string } },
): Promise<NextResponse> {
  try {
    const { idTheater } = params;
    if (!ObjectId.isValid(idTheater)) {
      return NextResponse.json({
        status: 400,
        message: "Invalid theater ID",
        error: "ID format is incorrect",
      });
    }

    const mongoClient = await client.connect();
    const db: Db = mongoClient.db("sample_mflix");

    const theaterData = await request.json();

    // Vérifier si le théâtre existe déjà
    const existingTheater = await db
      .collection("theaters")
      .findOne({ _id: new ObjectId(idTheater) });
    if (existingTheater) {
      return NextResponse.json({
        status: 409,
        message: "Conflict",
        error: "A theater with this ID already exists",
      });
    }

    // Ajouter _id à l'objet theaterData
    theaterData._id = new ObjectId(idTheater);

    await db.collection("theaters").insertOne(theaterData);

    return NextResponse.json({
      status: 201,
      message: "Theater created successfully",
      data: theaterData,
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
 * /api/theaters/{idTheater}:
 *   put:
 *     description: Modifie un théâtre existant
 *     parameters:
 *       - in: path
 *         name: idTheater
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du théâtre à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Théâtre modifié avec succès
 *       400:
 *         description: ID de théâtre invalide
 *       404:
 *         description: Théâtre non trouvé
 *       500:
 *         description: Erreur serveur
 */
export async function PUT(
  request: Request,
  { params }: { params: { idTheater: string } },
): Promise<NextResponse> {
  try {
    const { idTheater } = params;
    if (!ObjectId.isValid(idTheater)) {
      return NextResponse.json({
        status: 400,
        message: "Invalid theater ID",
        error: "ID format is incorrect",
      });
    }

    const mongoClient = await client.connect();
    const db: Db = mongoClient.db("sample_mflix");

    const theaterData = await request.json();
    delete theaterData._id; // Supprimer _id s'il est présent pour éviter les erreurs

    const result = await db
      .collection("theaters")
      .updateOne({ _id: new ObjectId(idTheater) }, { $set: theaterData });

    if (result.matchedCount === 0) {
      return NextResponse.json({
        status: 404,
        message: "Theater not found",
        error: "No theater found with the given ID",
      });
    }

    return NextResponse.json({
      status: 200,
      message: "Theater updated successfully",
      data: { _id: idTheater, ...theaterData },
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
 * /api/theaters/{idTheater}:
 *   delete:
 *     description: Supprime un théâtre
 *     parameters:
 *       - in: path
 *         name: idTheater
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du théâtre à supprimer
 *     responses:
 *       200:
 *         description: Théâtre supprimé avec succès
 *       400:
 *         description: ID de théâtre invalide
 *       404:
 *         description: Théâtre non trouvé
 *       500:
 *         description: Erreur serveur
 */
export async function DELETE(
  request: Request,
  { params }: { params: { idTheater: string } },
): Promise<NextResponse> {
  try {
    const { idTheater } = params;
    if (!ObjectId.isValid(idTheater)) {
      return NextResponse.json({
        status: 400,
        message: "Invalid theater ID",
        error: "ID format is incorrect",
      });
    }

    const mongoClient = await client.connect();
    const db: Db = mongoClient.db("sample_mflix");

    const result = await db
      .collection("theaters")
      .deleteOne({ _id: new ObjectId(idTheater) });

    if (result.deletedCount === 0) {
      return NextResponse.json({
        status: 404,
        message: "Theater not found",
        error: "No theater found with the given ID",
      });
    }

    return NextResponse.json({
      status: 200,
      message: "Theater deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
