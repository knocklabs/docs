export type RelatedPage = {
  title: string;
  url: string;
};

export function parseRelatedPages(data: unknown): RelatedPage[] {
  if (!data || typeof data !== "object" || !("results" in data)) return [];
  if (!Array.isArray(data.results)) return [];

  const pages: RelatedPage[] = [];
  const seen = new Set<string>();

  // Search output is generated externally and is not guaranteed to be links.
  for (const result of data.results) {
    if (
      !result ||
      typeof result.title !== "string" ||
      typeof result.url !== "string"
    ) {
      continue;
    }

    const title = result.title.trim();
    const url = result.url.trim();
    if (!title || !url || seen.has(url)) continue;

    const isLocalPath = url.startsWith("/") && !url.startsWith("//");
    if ((!isLocalPath && !/^https?:\/\//i.test(url)) || url.includes("\\")) {
      continue;
    }
    try {
      const parsed = new URL(url, "https://docs.knock.app");
      if (!["http:", "https:"].includes(parsed.protocol)) continue;
    } catch {
      continue;
    }

    pages.push({ title, url });
    seen.add(url);
    if (pages.length === 5) break;
  }

  return pages;
}

export async function fetchRelatedPages(
  query: string,
  signal: AbortSignal,
): Promise<RelatedPage[]> {
  try {
    const response = await fetch("/api/search", {
      method: "POST",
      body: JSON.stringify({ query }),
      headers: { "Content-Type": "application/json" },
      signal,
    });
    if (!response.ok) return [];
    return parseRelatedPages(await response.json());
  } catch {
    // Suggestions are optional: failed, malformed, and canceled requests must
    // leave the normal 404 page and its agent recovery metadata intact.
    return [];
  }
}
