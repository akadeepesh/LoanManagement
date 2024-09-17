import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

interface CustomToken {
  role?: string;
}

export async function middleware(request: NextRequest) {
  const token = (await getToken({ req: request })) as CustomToken | null;
  const path = request.nextUrl.pathname;

  // Allow access to signup route without authentication
  if (path.startsWith("/auth/signup")) {
    return NextResponse.next();
  }

  // For API routes, return a 401 response instead of redirecting
  if (path.startsWith("/api/")) {
    if (!token && !path.startsWith("/api/auth/")) {
      return new NextResponse(
        JSON.stringify({ message: "Authentication required" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    return NextResponse.next();
  }

  // For non-API routes, keep the existing logic
  if (!token && !path.startsWith("/auth/")) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  if (path.startsWith("/admin") && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    path.startsWith("/verifier") &&
    token?.role !== "verifier" &&
    token?.role !== "admin"
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
