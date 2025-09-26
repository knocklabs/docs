import { glob } from "glob";
import fs from "fs";
import { serialize } from "next-mdx-remote/serialize";
import remarkSlug from "remark-slug";
import remarkGfm from "remark-gfm";
import rehypeMdxCodeProps from "rehype-mdx-code-props";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

export interface TypedocPage {
  path: string;
  slug: string;
  mdxSource: MDXRemoteSerializeResult;
}

export async function getAllTypedocs() {
  const typedocs = await glob("typedocs/**/*.mdx");

  const typedocMdx = await Promise.all(
    typedocs.map(async (typedoc): Promise<TypedocPage> => {
      const file = fs.readFileSync(typedoc, "utf8");

      const mdxSource = await serialize(file, {
        parseFrontmatter: true,
        mdxOptions: {
          remarkPlugins: [[remarkSlug], [remarkGfm]] as any[],
          rehypePlugins: [rehypeMdxCodeProps, rehypeAutolinkHeadings] as any[],
        },
      });

      return {
        path: typedoc,
        slug: typedoc.replace("typedocs/", "").replace(".mdx", ""),
        mdxSource,
      };
    }),
  );

  return typedocMdx;
}
