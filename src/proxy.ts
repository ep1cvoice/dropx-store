import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const guestOnlyRoutes = ["/login", "/register", "/forgot-password"];
const protectedRoutes = ["/account", "/cart", "/checkout", "/orders", "/wishlist"];

function matchesRoute(pathname: string, route: string): boolean {
  return pathname === route || pathname.startsWith(`${route}/`);
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  let token = null;
  try {
    token = await getToken({
      req,
      secret: process.env.AUTH_SECRET ?? process.env.BETTER_AUTH_SECRET,
    });
  } catch {
    // Bad/missing secret or corrupt cookie — treat as logged out.
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
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  return NextResponse.next();
}

// Only auth-gated routes — never run on /public assets (jpg, mp4, etc.).
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
