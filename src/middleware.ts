import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const guestOnlyRoutes = ["/login", "/register"];
const protectedRoutes = ["/account", "/checkout", "/orders"];

function matchesRoute(pathname: string, route: string): boolean {
  return pathname === route || pathname.startsWith(`${route}/`);
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET ?? process.env.BETTER_AUTH_SECRET,
  });
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

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
