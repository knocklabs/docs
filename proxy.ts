import { NextRequest, NextResponse } from "next/server";

function isMarkdownRequest(request: NextRequest): boolean {
  const acceptHeader = request.headers.get("accept") || "";
  return acceptHeader.split(",").some((entry) => {
    const [type, ...parameters] = entry.trim().toLowerCase().split(";");
    const quality = parameters.find((parameter) =>
      parameter.trim().startsWith("q="),
    );
    return (
      type.trim() === "text/markdown" &&
      (!quality || Number(quality.trim().slice(2)) > 0)
    );
  });
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
    pathname.endsWith(".yaml") ||
    pathname.endsWith(".yml") ||
    pathname.endsWith(".xml") ||
    pathname.endsWith(".ico") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".mp4")
  );
}

function getMarkdownApiPath(pathname: string): string {
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
 * Reference paths map to their per-page generated files so an unknown
 * reference URL returns a 404 instead of an unrelated overview document.
 *
 * 404 responses include recovery links to sitemap, llms.txt, docs index,
 * and search API as required by Is Agentic guidelines.
 */
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip static assets
  if (
    isStaticAsset(pathname) ||
    pathname === "/api" ||
    pathname.startsWith("/api/")
  ) {
    return NextResponse.next();
  }

  // Handle markdown content negotiation
  if (isMarkdownRequest(request) || pathname.endsWith(".md")) {
    const markdownPath = getMarkdownApiPath(pathname.replace(/\.md$/, ""));

    // For llms.txt, serve directly from public/
    if (markdownPath === "/llms.txt") {
      const url = request.nextUrl.clone();
      url.pathname = "/llms.txt";
      const response = NextResponse.rewrite(url);
      response.headers.set("Content-Type", "text/markdown; charset=utf-8");
      response.headers.set("Vary", "Accept, Accept-Encoding");
      return response;
    }

    // Route to the markdown API which handles 404s properly
    const url = request.nextUrl.clone();
    url.pathname = markdownPath;
    // Do not let a slug query parameter replace the actual requested path.
    url.searchParams.delete("slug");
    const response = NextResponse.rewrite(url);
    response.headers.set("Vary", "Accept, Accept-Encoding");
    return response;
  }

  // Let the request proceed normally
  const response = NextResponse.next();
  response.headers.set("Vary", "Accept, Accept-Encoding");
  return response;
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
