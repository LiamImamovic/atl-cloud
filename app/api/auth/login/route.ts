import client from "@/lib/mongodb";
import { rateLimit } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/schemas/auth";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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
export async function POST(request: Request) {
  // Appliquer le rate limiting
  const limiterResult = await rateLimit(request as unknown as NextRequest, {
    limit: 5,
    window: 60 * 15, // 15 minutes
  });

  if (!limiterResult.success) {
    return limiterResult.response;
  }

  try {
    const body = await request.json();

    // Validation avec Zod
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          message: "Données invalides",
          errors: result.error.formErrors.fieldErrors,
        },
        { status: 400 },
      );
    }

    const { email, password } = result.data;

    // Connexion à MongoDB
    const mongoClient = await client.connect();
    const db = mongoClient.db("sample_mflix");
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Email ou mot de passe incorrect" },
        { status: 401 },
      );
    }

    // Vérifier le mot de passe
    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { message: "Email ou mot de passe incorrect" },
        { status: 401 },
      );
    }

    // Créer et stocker le token JWT
    const token = sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" },
    );

    // Stocker le token dans un cookie avec des paramètres de sécurité renforcés
    const cookieStore = await cookies();
    cookieStore.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return NextResponse.json({
      message: "Connexion réussie",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Erreur lors de la connexion", error: error.message },
      { status: 500 },
    );
  }
}
