import { NextRequest, NextResponse } from "next/server";

function isMarkdownRequest(request: NextRequest): boolean {
  const acceptHeader = request.headers.get("accept") || "";
  return acceptHeader.includes("text/markdown");
}

function isStaticAsset(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/videos") ||
    pathname.endsWith(".txt") ||
    pathname.endsWith(".json") ||
    pathname.endsWith(".xml") ||
    pathname.endsWith(".ico") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".mp4")
  );
}

function getMarkdownApiPath(pathname: string): string {
  // Handle special reference paths that should serve top-level files
  if (pathname === "/cli" || pathname.startsWith("/cli/")) {
    return "/api/md/cli";
  }
  if (pathname === "/api-reference" || pathname.startsWith("/api-reference/")) {
    return "/api/md/api-reference";
  }
  if (
    pathname === "/mapi-reference" ||
    pathname.startsWith("/mapi-reference/")
  ) {
    return "/api/md/mapi-reference";
  }

  // Remove trailing slash if present
  const cleanPath = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

  // Root path serves llms.txt (handled separately)
  if (cleanPath === "" || cleanPath === "/") {
    return "/llms.txt";
  }

  // For all other paths, route to the markdown API
  return `/api/md${cleanPath}`;
}

/**
 * Proxy to serve markdown versions of documentation pages.
 *
 * When a request includes `Accept: text/markdown` header, the proxy
 * routes to an API endpoint that serves markdown content with proper
 * 404 handling for agent recovery.
 *
 * Special cases:
 * - `/cli/*` paths serve `/cli.md`
 * - `/api-reference/*` paths serve `/api-reference.md`
 * - `/mapi-reference/*` paths serve `/mapi-reference.md`
 *
 * 404 responses include recovery links to sitemap, llms.txt, docs index,
 * and search API as required by Is Agentic guidelines.
 */
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip static assets
  if (isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  // Handle direct .md file requests - serve directly from public/
  if (pathname.endsWith(".md")) {
    return NextResponse.next();
  }

  // Skip API routes (except our markdown API which will be rewritten to)
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/md/")) {
    return NextResponse.next();
  }

  // Handle markdown content negotiation
  if (isMarkdownRequest(request)) {
    const markdownPath = getMarkdownApiPath(pathname);

    // For llms.txt, serve directly from public/
    if (markdownPath === "/llms.txt") {
      const url = request.nextUrl.clone();
      url.pathname = "/llms.txt";
      return NextResponse.rewrite(url);
    }

    // Route to the markdown API which handles 404s properly
    const url = request.nextUrl.clone();
    url.pathname = markdownPath;
    return NextResponse.rewrite(url);
  }

  // Let the request proceed normally
  return NextResponse.next();
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
