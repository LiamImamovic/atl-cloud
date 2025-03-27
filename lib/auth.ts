import { SignJWT, jwtVerify } from "jose";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

// Type pour la payload JWT
export type JWTPayload = {
  userId: string;
  email: string;
  name: string;
  role?: string;
  iat?: number;
  exp?: number;
};

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = "auth-token";

export const TOKEN_EXPIRY = 60 * 60 * 24 * 7; // 7 jours en secondes

// Fonction pour signer un nouveau JWT
export async function signJWT(payload: JWTPayload): Promise<string> {
  const secret = new TextEncoder().encode(JWT_SECRET);

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_EXPIRY}s`) // Utiliser la constante
    .setNotBefore("0s")
    .setJti(crypto.randomUUID())
    .setSubject(payload.userId)
    .sign(secret);
}

// Fonction pour vérifier un JWT
export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as JWTPayload;
  } catch (error) {
    return null;
  }
}

// Fonction pour définir le cookie d'authentification
export async function setAuthCookie(payload: JWTPayload): Promise<void> {
  const token = await signJWT(payload);
  const cookieStore = await cookies();
  cookieStore.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: TOKEN_EXPIRY, // Utiliser la même constante
  });
}

// Fonction pour supprimer le cookie d'authentification
export async function removeAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// Fonction pour obtenir la payload du JWT à partir du cookie
export async function getAuthFromCookie(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = verify(
      token,
      process.env.JWT_SECRET || "secret",
    ) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

// Fonction pour obtenir la payload du JWT à partir d'une requête
export async function getAuthFromRequest(
  req: NextRequest,
): Promise<JWTPayload | null> {
  // Essayer d'obtenir le token à partir du cookie
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (token) return verifyJWT(token);

  // Sinon, essayer d'obtenir le token à partir de l'en-tête Authorization
  const authHeader = req.headers.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    return verifyJWT(token);
  }

  return null;
}

export type AuthUser = {
  id: string;
  name?: string;
  email: string;
};
