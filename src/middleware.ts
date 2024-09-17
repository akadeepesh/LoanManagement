// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const path = request.nextUrl.pathname;

  // For API routes, return a 401 response instead of redirecting
  if (path.startsWith("/api/")) {
    if (!token) {
      return new NextResponse(
        JSON.stringify({ message: "Authentication required" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    // You can add more specific API route checks here if needed
    return NextResponse.next();
  }

  // For non-API routes, keep the existing logic
  if (!token) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  if (path.startsWith("/admin") && token.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    path.startsWith("/verifier") &&
    token.role !== "verifier" &&
    token.role !== "admin"
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/verifier/:path*",
    "/api/:path*",
  ],
};
