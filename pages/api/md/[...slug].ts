import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
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

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .setHeader("Allow", "GET")
      .setHeader("Content-Type", "text/markdown; charset=utf-8")
      .send(`# 405 - Method not allowed\n\nOnly GET requests are supported.`);
  }

  const { slug } = req.query;

  if (!slug || !Array.isArray(slug)) {
    return res
      .status(400)
      .setHeader("Content-Type", "text/markdown; charset=utf-8")
      .send(`# 400 - Bad request\n\nInvalid path.`);
  }

  const requestedPath = slug.join("/");
  const publicDir = path.join(process.cwd(), "public");
  const filePath = path.join(publicDir, `${requestedPath}.md`);

  // Prevent directory traversal
  if (!filePath.startsWith(publicDir)) {
    return res
      .status(403)
      .setHeader("Content-Type", "text/markdown; charset=utf-8")
      .send(`# 403 - Forbidden\n\nAccess denied.`);
  }

  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      return res
        .status(200)
        .setHeader("Content-Type", "text/markdown; charset=utf-8")
        .setHeader("Cache-Control", "public, max-age=3600")
        .send(content);
    }
  } catch (error) {
    console.error("Error reading markdown file:", error);
  }

  // File not found, return 404 with recovery content
  return res
    .status(404)
    .setHeader("Content-Type", "text/markdown; charset=utf-8")
    .send(NOT_FOUND_CONTENT);
}
