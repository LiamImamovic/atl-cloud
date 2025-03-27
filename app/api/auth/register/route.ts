import client from "@/lib/mongodb";
import { registerSchema } from "@/lib/schemas/auth";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     description: Crée un nouveau compte utilisateur
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 10
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Compte créé avec succès
 *       400:
 *         description: Données invalides (Mot de passe doit contenir au moins 10 caractères, un chiffre et un caractère spécial)
 *       409:
 *         description: Email déjà utilisé
 *       500:
 *         description: Erreur serveur
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          message: `Données invalides`,
          errors: result.error.formErrors.fieldErrors,
        },
        { status: 400 },
      );
    }

    const { name, email, password } = result.data;

    // Connexion à MongoDB
    const mongoClient = await client.connect();
    const db = mongoClient.db("sample_mflix");

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Cet email est déjà utilisé" },
        { status: 400 },
      );
    }

    // Hacher le mot de passe
    const hashedPassword = await hash(password, 10);

    // Insérer l'utilisateur dans la base de données
    const resultInsert = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return NextResponse.json({
      message: "Inscription réussie",
      userId: resultInsert.insertedId,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Erreur lors de l'inscription", error: error.message },
      { status: 500 },
    );
  }
}
