import { getAuthFromRequest } from "@/lib/auth";
import { verify } from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const publicPaths = [
  "/login",
  "/register",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/verify",
  "/api/auth/logout",
  "/",
  "/api-doc",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path),
  );

  if (isPublicPath) {
    if (
      (pathname === "/login" || pathname === "/register") &&
      !pathname.startsWith("/api")
    ) {
      const payload = await getAuthFromRequest(request);
      if (payload) {
        return NextResponse.redirect(new URL("/api-doc", request.url));
      }
    }
    return NextResponse.next();
  }

  const payload = await getAuthFromRequest(request);

  if (!payload) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        {
          status: 401,
          message: "Unauthorized",
          error: "Authentication required to access this API",
        },
        { status: 401 },
      );
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/admin") && payload.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  const authToken = request.cookies.get("auth_token")?.value;

  // Liste des chemins protégés nécessitant une authentification
  const protectedPaths = ["/dashboard", "/movies/"];

  // Liste des chemins pour utilisateurs non authentifiés
  const authPaths = ["/login"];

  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path),
  );
  const isAuthPath = authPaths.some((path) => pathname === path);

  // Vérifier si le token est valide
  const isAuthenticated = authToken ? await verifyToken(authToken) : false;

  // Rediriger les utilisateurs non authentifiés vers la page de connexion
  if (isProtectedPath && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Rediriger les utilisateurs déjà authentifiés vers le dashboard
  if (isAuthPath && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",

    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};

// Fonction utilitaire pour vérifier le token JWT
async function verifyToken(token: string) {
  try {
    verify(token, process.env.JWT_SECRET || "secret");
    return true;
  } catch (error) {
    // Ne pas exposer la raison spécifique de l'échec
    console.error("Token verification failed:", error);
    return false;
  }
}
