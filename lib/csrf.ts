import { NextRequest, NextResponse } from "next/server";

export const csrfProtection = (request: NextRequest) => {
  const origin = request.headers.get("Origin");
  const referer = request.headers.get("Referer");

  // Liste des origines autorisées
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_SITE_URL,
    "http://localhost:3000",
  ].filter(Boolean);

  // Vérifier l'origine
  if (origin && !allowedOrigins.includes(origin)) {
    return {
      success: false,
      response: NextResponse.json(
        { message: "CSRF check failed" },
        { status: 403 },
      ),
    };
  }

  // Vérifier le referer si présent
  if (referer) {
    const refererUrl = new URL(referer);
    if (!allowedOrigins.includes(refererUrl.origin)) {
      return {
        success: false,
        response: NextResponse.json(
          { message: "CSRF check failed" },
          { status: 403 },
        ),
      };
    }
  }

  return { success: true };
};
