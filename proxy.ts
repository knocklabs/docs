import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy to serve markdown versions of documentation pages.
 *
 * When a request includes `Accept: text/markdown` header, the proxy
 * redirects to the pre-generated markdown file in the public directory.
 *
 * Special cases:
 * - `/cli/*` paths serve `/cli.md`
 * - `/api-reference/*` paths serve `/api-reference.md`
 * - `/mapi-reference/*` paths serve `/mapi-reference.md`
 */
export function proxy(request: NextRequest) {
  const acceptHeader = request.headers.get("accept") || "";

  // Only handle requests with Accept: text/markdown
  if (!acceptHeader.includes("text/markdown")) {
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname;

  // Skip static assets, API routes, and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/videos") ||
    pathname.endsWith(".md") ||
    pathname.endsWith(".txt") ||
    pathname.endsWith(".json") ||
    pathname.endsWith(".xml") ||
    pathname.endsWith(".ico") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".mp4")
  ) {
    return NextResponse.next();
  }

  let markdownPath: string;

  // Handle special reference paths that should serve top-level files
  if (pathname === "/cli" || pathname.startsWith("/cli/")) {
    markdownPath = "/cli.md";
  } else if (
    pathname === "/api-reference" ||
    pathname.startsWith("/api-reference/")
  ) {
    markdownPath = "/api-reference.md";
  } else if (
    pathname === "/mapi-reference" ||
    pathname.startsWith("/mapi-reference/")
  ) {
    markdownPath = "/mapi-reference.md";
  } else {
    // For all other paths, map to the corresponding .md file
    // Remove trailing slash if present
    const cleanPath = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

    // Root path serves llms.txt (index)
    if (cleanPath === "" || cleanPath === "/") {
      markdownPath = "/llms.txt";
    } else {
      markdownPath = `${cleanPath}.md`;
    }
  }

  // Rewrite to the markdown file in public directory
  const url = request.nextUrl.clone();
  url.pathname = markdownPath;

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
