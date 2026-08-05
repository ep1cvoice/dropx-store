import { NextResponse } from "next/server";

import { auth } from "@/auth/auth";

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
 * Use Auth.js `auth()` (same session path as RSC), not raw `getToken`.
 * Previously getToken missed the session cookie → /cart redirected to /login,
 * then login page saw a valid session and bounced to `/`.
 */
export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = Boolean(req.auth);

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
});

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
