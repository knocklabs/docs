import fs from "fs";
import { serialize } from "next-mdx-remote/serialize";
import rehypeMdxCodeProps from "rehype-mdx-code-props";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

export interface TypedocPage {
  path: string;
  slug: string;
  mdxSource: MDXRemoteSerializeResult;
}

const TYPEDOCS_DIR = "typedocs";

// Matches `<Typedoc file="react-core/hooks/use-feed" />` in MDX source.
const TYPEDOC_USAGE = /<Typedoc\b[^>]*?\bfile="([^"]+)"/g;

/**
 * Returns the slugs of the typedocs that an MDX page renders, so the page
 * only receives those.
 */
export function getTypedocSlugs(source: string): string[] {
  const slugs = Array.from(source.matchAll(TYPEDOC_USAGE), (match) => match[1]);
  return Array.from(new Set(slugs));
}

async function getTypedoc(slug: string): Promise<TypedocPage> {
  const path = `${TYPEDOCS_DIR}/${slug}.mdx`;
  const file = fs.readFileSync(path, "utf8");

  const mdxSource = await serialize(file, {
    parseFrontmatter: true,
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeSlug, rehypeMdxCodeProps, rehypeAutolinkHeadings],
    },
    blockJS: false,
    blockDangerousJS: true,
  });

  return { path, slug, mdxSource };
}

export async function getTypedocs(slugs: string[]): Promise<TypedocPage[]> {
  return Promise.all(slugs.map(getTypedoc));
}
