import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const guestOnlyRoutes = ["/login", "/register", "/forgot-password"];
const protectedRoutes = [
  "/account",
  "/cart",
  "/checkout",
  "/orders",
  "/wishlist",
];

function matchesRoute(pathname: string, route: string): boolean {
  return pathname === route || pathname.startsWith(`${route}/`);
}

/**
 * Lightweight JWT check only — do NOT import `@/auth/auth` here.
 * That pulls Prisma into the proxy graph and can balloon Turbopack RAM in `next dev`.
 */
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const secret = process.env.AUTH_SECRET ?? process.env.BETTER_AUTH_SECRET;
  const secureCookie =
    req.nextUrl.protocol === "https:" || process.env.NODE_ENV === "production";
  const sessionCookie = secureCookie
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

  let token = null;
  try {
    token = await getToken({
      req,
      secret,
      secureCookie,
      cookieName: sessionCookie,
      salt: sessionCookie,
    });
  } catch {
    token = null;
  }

  const isLoggedIn = Boolean(token);

  const isGuestOnlyRoute = guestOnlyRoutes.some((route) =>
    matchesRoute(pathname, route),
  );
  const isProtectedRoute = protectedRoutes.some((route) =>
    matchesRoute(pathname, route),
  );

  if (isGuestOnlyRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/forgot-password",
    "/account/:path*",
    "/cart",
    "/cart/:path*",
    "/checkout",
    "/checkout/:path*",
    "/orders",
    "/orders/:path*",
    "/wishlist",
    "/wishlist/:path*",
  ],
};
