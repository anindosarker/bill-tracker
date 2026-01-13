import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for session cookie (NextAuth v5 uses 'authjs.session-token' by default)
  // Also check for secure variants and legacy v4 cookie names
  const sessionToken = 
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value ||
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  const hasSession = !!sessionToken;

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!hasSession) {
      const url = new URL("/", request.url);
      return NextResponse.redirect(url);
    }
  }

  // Redirect authenticated users away from login page
  if (pathname === "/" && hasSession) {
    const url = new URL("/dashboard", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
