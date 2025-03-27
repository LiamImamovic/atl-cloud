import { setAuthCookie } from "@/lib/auth";
import client from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { Db } from "mongodb";
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
 *                 minLength: 6
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Compte créé avec succès
 *       400:
 *         description: Données invalides
 *       409:
 *         description: Email déjà utilisé
 *       500:
 *         description: Erreur serveur
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { email, password, name } = await request.json();

    // Validation basique
    if (!email || !password || !name) {
      return NextResponse.json(
        {
          status: 400,
          message: "Missing required fields",
        },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          status: 400,
          message: "Password must be at least 6 characters long",
        },
        { status: 400 },
      );
    }

    const mongoClient = await client.connect();
    const db: Db = mongoClient.db("sample_mflix");
    const usersCollection = db.collection("users");

    // Vérifier si l'email existe déjà
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          status: 409,
          message: "Email already in use",
        },
        { status: 409 },
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer le nouvel utilisateur
    const newUser = {
      email,
      password: hashedPassword,
      name,
      createdAt: new Date(),
      role: "user", // Rôle par défaut
    };

    const result = await usersCollection.insertOne(newUser);

    // Définir le cookie d'authentification
    await setAuthCookie({
      userId: result.insertedId.toString(),
      email,
      name,
      role: "user",
    });

    return NextResponse.json(
      {
        status: 201,
        message: "User registered successfully",
        user: {
          id: result.insertedId,
          email,
          name,
          role: "user",
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Registration error:", error.message);
    return NextResponse.json(
      {
        status: 500,
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
