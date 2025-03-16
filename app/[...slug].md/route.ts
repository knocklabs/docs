import { NextRequest } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string[] } },
) {
  try {
    // Remove the .md extension if it's in the slug
    const markdownPath = params.slug.join("/").replace(/\.md$/, "");

    const filePath = path.join(process.cwd(), "content", `${markdownPath}.md`);
    const markdown = await fs.readFile(filePath, "utf-8");

    return new Response(markdown, {
      headers: {
        "Content-Type": "text/markdown",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    return new Response("Not Found", { status: 404 });
  }
}
