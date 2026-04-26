import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// List of routes that require authentication
const PROTECTED_ROUTES = ["/dashboard"];
// List of routes that should only be accessible when NOT logged in
const AUTH_ROUTES = ["/login", "/register"];

export function middleware(request: NextRequest) {
  // Use cookies to check for token since localStorage is not available in Edge Runtime
  const token = request.cookies.get("sipelka_token")?.value;
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));

  // Redirect to login if trying to access protected route without token
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect to dashboard if trying to access auth routes while already logged in
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
