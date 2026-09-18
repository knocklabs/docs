import { NextApiRequest, NextApiResponse } from "next";
import { readFile } from "fs/promises";
import path from "path";

const NOT_FOUND_CONTENT = `# 404 - Page not found

The requested page does not exist or has been moved.

## Recovery options

- **Documentation home:** [/](/) - Start from the documentation homepage
- **Sitemap:** [/sitemap.xml](/sitemap.xml) - Browse all available pages
- **LLM index:** [/llms.txt](/llms.txt) - Machine-readable documentation index
- **Full documentation:** [/llms-full.txt](/llms-full.txt) - Complete documentation in plain text
- **Search API:** POST to [/api/search](/api/search) with \`{"query": "your search term"}\`

## Tips for agents

1. Check [/llms.txt](/llms.txt) for an index of all documentation pages
2. Each page is available in Markdown format by appending \`.md\` to the URL
3. Use the search API to find relevant content by keyword
`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.setHeader("Vary", "Accept");
  res.setHeader("Content-Type", "text/markdown; charset=utf-8");

  if (req.method !== "GET" && req.method !== "HEAD") {
    return res
      .status(405)
      .setHeader("Allow", "GET, HEAD")
      .setHeader("Content-Type", "text/markdown; charset=utf-8")
      .send(
        `# 405 - Method not allowed\n\nOnly GET and HEAD requests are supported.`,
      );
  }

  const { slug } = req.query;

  if (!slug || !Array.isArray(slug) || slug.length === 0) {
    return res
      .status(400)
      .setHeader("Content-Type", "text/markdown; charset=utf-8")
      .send(`# 400 - Bad request\n\nInvalid path.`);
  }

  // Validate decoded path segments, including query-string overrides of slug.
  if (
    slug.some(
      (part) => !part || part === "." || part === ".." || /[/\\\0]/.test(part),
    )
  ) {
    return res.status(400).send(`# 400 - Bad request\n\nInvalid path.`);
  }

  const requestedPath = slug.join("/");
  const publicDir = path.join(process.cwd(), "public");
  const filePath = path.join(publicDir, `${requestedPath}.md`);

  // Prevent directory traversal
  if (!filePath.startsWith(publicDir + path.sep)) {
    return res
      .status(403)
      .setHeader("Content-Type", "text/markdown; charset=utf-8")
      .send(`# 403 - Forbidden\n\nAccess denied.`);
  }

  // Nested API resources can have an index.md instead of a sibling .md file.
  const candidates = [
    filePath,
    path.join(publicDir, requestedPath, "index.md"),
  ];
  for (const candidate of candidates) {
    try {
      const content = await readFile(candidate, "utf-8");
      return res
        .status(200)
        .setHeader("Content-Type", "text/markdown; charset=utf-8")
        .setHeader("Cache-Control", "public, max-age=3600")
        .send(req.method === "HEAD" ? "" : content);
    } catch (error) {
      if (
        ["ENOENT", "ENOTDIR"].includes(
          (error as NodeJS.ErrnoException).code || "",
        )
      ) {
        continue;
      }
      console.error("Error reading markdown file:", error);
      return res.status(500).send(`# 500 - Unable to load documentation`);
    }
  }

  // File not found, return 404 with recovery content
  return res
    .status(404)
    .setHeader("Content-Type", "text/markdown; charset=utf-8")
    .send(req.method === "HEAD" ? "" : NOT_FOUND_CONTENT);
}
