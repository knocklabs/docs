import fs from "fs";
import { GetStaticProps } from "next";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import rehypeMdxCodeProps from "rehype-mdx-code-props";
import remarkGfm from "remark-gfm";

import { MDX_COMPONENTS } from "@/lib/mdxComponents";
import { CONTENT_DIR } from "@/lib/content.server";
import { CliReferenceLayout } from "@/layouts/CliReferenceLayout";
import AiChatButton from "@/components/AiChatButton";

interface CliIndexPageProps {
  source: MDXRemoteSerializeResult;
  frontmatter: {
    title: string;
    description: string;
  };
  sourcePath: string;
}

export default function CliIndexPage({
  source,
  frontmatter,
  sourcePath,
}: CliIndexPageProps) {
  return (
    <CliReferenceLayout frontMatter={frontmatter} sourcePath={sourcePath}>
      <MDXRemote {...source} components={MDX_COMPONENTS as any} />
      <AiChatButton />
    </CliReferenceLayout>
  );
}

export const getStaticProps: GetStaticProps<CliIndexPageProps> = async () => {
  // Render the overview content at the /cli index
  const contentPath = `${CONTENT_DIR}/cli/overview.mdx`;

  const fileContent = fs.readFileSync(contentPath, "utf-8");

  const mdx = await serialize(fileContent, {
    parseFrontmatter: true,
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeMdxCodeProps],
    },
  });

  const frontmatter = (mdx.frontmatter || {}) as {
    title: string;
    description: string;
  };

  return {
    props: {
      source: mdx,
      frontmatter: {
        title: frontmatter.title || "CLI reference",
        description:
          frontmatter.description ||
          "Learn more about the commands and flags available in the Knock CLI.",
      },
      sourcePath: contentPath,
    },
  };
};
