import { setAuthCookie } from "@/lib/auth";
import client from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { Db } from "mongodb";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     description: Connecte un utilisateur
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
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Identifiants incorrects
 *       500:
 *         description: Erreur serveur
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { email, password } = await request.json();

    // Validation basique
    if (!email || !password) {
      return NextResponse.json(
        {
          status: 400,
          message: "Email and password are required",
        },
        { status: 400 },
      );
    }

    const mongoClient = await client.connect();
    const db: Db = mongoClient.db("sample_mflix");
    const usersCollection = db.collection("users");

    // Rechercher l'utilisateur par email
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          status: 401,
          message: "Invalid email or password",
        },
        { status: 401 },
      );
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          status: 401,
          message: "Invalid email or password",
        },
        { status: 401 },
      );
    }

    // Définir le cookie d'authentification
    await setAuthCookie({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role || "user",
    });

    return NextResponse.json({
      status: 200,
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role || "user",
      },
    });
  } catch (error: any) {
    console.error("Login error:", error.message);
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
