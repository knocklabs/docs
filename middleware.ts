import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware that handles content negotiation for markdown requests.
 * When a request includes Accept: text/markdown header, it rewrites
 * the request to the markdown API endpoint to return raw markdown content.
 */
export function middleware(request: NextRequest) {
  const acceptHeader = request.headers.get("accept") || "";

  // Check if the client is requesting markdown content
  const wantsMarkdown =
    acceptHeader.includes("text/markdown") ||
    acceptHeader.includes("text/x-markdown");

  if (!wantsMarkdown) {
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname;

  // Skip API routes, static files, and special paths
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/images/") ||
    pathname.includes(".") // Skip files with extensions (e.g., .png, .js, .css)
  ) {
    return NextResponse.next();
  }

  // Skip the root path
  if (pathname === "/") {
    return NextResponse.next();
  }

  // Rewrite to the markdown API endpoint
  const url = request.nextUrl.clone();
  url.pathname = `/api/markdown${pathname}`;

  return NextResponse.rewrite(url);
}

export const config = {
  // Match all paths except static files and API routes
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
