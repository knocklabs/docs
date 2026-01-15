import fs from "fs";
import { join } from "path";
import type { NextApiRequest, NextApiResponse } from "next";
import { CONTENT_DIR, DOCS_FILE_EXTENSIONS } from "@/lib/content.server";

/**
 * API route that serves raw markdown/MDX content for a given slug.
 * This enables content negotiation - when a client requests a page with
 * Accept: text/markdown, they receive the raw markdown instead of HTML.
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .setHeader("Allow", "GET")
      .json({ error: `${req.method} method is not accepted.` });
  }

  const { slug } = req.query;

  if (!slug || !Array.isArray(slug)) {
    return res.status(400).json({ error: "Invalid slug parameter" });
  }

  // Try to find the content file with .mdx or .md extension
  let source: Buffer | null = null;
  let sourcePath: string | null = null;

  for (const ext of DOCS_FILE_EXTENSIONS) {
    const candidatePath = join(
      CONTENT_DIR,
      ...slug.slice(0, slug.length - 1),
      `${slug[slug.length - 1]}${ext}`,
    );

    if (fs.existsSync(candidatePath)) {
      source = fs.readFileSync(candidatePath);
      sourcePath = candidatePath;
      break;
    }
  }

  // Skip API reference pages
  if (
    sourcePath &&
    (sourcePath.includes("content/__mapi-reference") ||
      sourcePath.includes("content/__api-reference"))
  ) {
    return res.status(404).json({ error: "Page not found" });
  }

  if (!source) {
    return res.status(404).json({ error: "Page not found" });
  }

  // Return the raw markdown content
  res.setHeader("Content-Type", "text/markdown; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
  res.status(200).send(source.toString());
}
