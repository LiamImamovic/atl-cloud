import { getAuthFromCookie } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/auth/verify:
 *   get:
 *     description: Vérifie si l'utilisateur est authentifié
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Utilisateur authentifié
 *       401:
 *         description: Utilisateur non authentifié
 */
export async function GET(): Promise<NextResponse> {
  try {
    const payload = await getAuthFromCookie();

    if (!payload) {
      return NextResponse.json(
        {
          status: 401,
          message: "Unauthorized",
          authenticated: false,
        },
        { status: 401 },
      );
    }

    return NextResponse.json({
      status: 200,
      message: "Authentication valid",
      authenticated: true,
      user: {
        userId: payload.userId,
        email: payload.email,
        name: payload.name,
        role: payload.role || "user",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 401,
        message: "Authentication failed",
        authenticated: false,
        error: error.message,
      },
      { status: 401 },
    );
  }
}
