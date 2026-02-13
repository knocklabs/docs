import fs from "fs";
import { GetStaticPaths, GetStaticProps } from "next";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import rehypeMdxCodeProps from "rehype-mdx-code-props";
import remarkGfm from "remark-gfm";

import { MDX_COMPONENTS } from "@/lib/mdxComponents";
import { CLI_SIDEBAR } from "@/data/sidebars/cliSidebar";
import { CONTENT_DIR } from "@/lib/content.server";
import { CliReferenceLayout } from "@/layouts/CliReferenceLayout";
import AiChatButton from "@/components/AiChatButton";

interface CliPageProps {
  source: MDXRemoteSerializeResult;
  frontmatter: {
    title: string;
    description: string;
  };
  sourcePath: string;
}

export default function CliResourcePage({
  source,
  frontmatter,
  sourcePath,
}: CliPageProps) {
  return (
    <CliReferenceLayout frontMatter={frontmatter} sourcePath={sourcePath}>
      <MDXRemote {...source} components={MDX_COMPONENTS as any} />
      <AiChatButton />
    </CliReferenceLayout>
  );
}

function getAllCliPaths(): { resource: string; slug?: string[] }[] {
  const paths: { resource: string; slug?: string[] }[] = [];

  for (const section of CLI_SIDEBAR) {
    // Extract resource name from the section slug (e.g., "/cli/workflow" -> "workflow")
    const resourceMatch = section.slug.match(/^\/cli\/(.+)$/);
    if (!resourceMatch) continue;

    const resource = resourceMatch[1];

    // Add the resource root path
    paths.push({ resource, slug: undefined });

    // Add all subpages - they all render the same resource page
    for (const page of section.pages || []) {
      if (page.slug === "/" || page.slug === "") {
        // Root page is already added above
        continue;
      }

      const pageSlug = page.slug.replace(/^\//, "");
      paths.push({ resource, slug: [pageSlug] });

      // Handle nested pages if any
      if ("pages" in page && page.pages) {
        for (const subPage of page.pages) {
          const subPageSlug = subPage.slug.replace(/^\//, "");
          paths.push({ resource, slug: [pageSlug, subPageSlug] });
        }
      }
    }
  }

  return paths;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const allPaths = getAllCliPaths();

  const paths = allPaths.map((p) => ({
    params: {
      resource: p.resource,
      slug: p.slug,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<CliPageProps> = async ({
  params,
}) => {
  const resource = params?.resource as string;

  // All subpaths render the same resource page (single page per resource)
  // The page content contains Section components for scroll-to-section
  const contentPath = `${CONTENT_DIR}/cli/${resource}.mdx`;

  // Check if file exists
  if (!fs.existsSync(contentPath)) {
    return { notFound: true };
  }

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
        title: frontmatter.title || resource,
        description: frontmatter.description || "",
      },
      sourcePath: contentPath,
    },
  };
};
