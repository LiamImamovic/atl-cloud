import { getAuthFromRequest } from "@/lib/auth";
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

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",

    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
