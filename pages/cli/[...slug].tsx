import fs from "fs";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import remarkGfm from "remark-gfm";
import rehypeMdxCodeProps from "rehype-mdx-code-props";

import { SidebarSection } from "@/data/types";
import MDXLayout from "../../layouts/MDXLayout";
import { CONTENT_DIR } from "../../lib/content.server";
import eventPayload from "../../data/code/sources/eventPayload";
import datadogDashboardJson from "../../content/integrations/extensions/datadog_dashboard.json";
import newRelicDashboardJson from "../../content/integrations/extensions/new_relic_dashboard.json";
import AiChatButton from "../../components/AiChatButton";
import { MDX_COMPONENTS } from "@/lib/mdxComponents";

import { cliContent as cliSidebarContent } from "@/data/sidebar";

export default function ContentPage({ source, sourcePath }) {
  return (
    <MDXLayout frontMatter={source.frontmatter} sourcePath={sourcePath}>
      <MDXRemote
        {...source}
        components={MDX_COMPONENTS}
        scope={{
          datadogDashboardJson,
          newRelicDashboardJson,
          eventPayload,
        }}
      />
      <AiChatButton />
    </MDXLayout>
  );
}

// Get the props for a single path
export async function getStaticProps() {
  const sourcePath = `${CONTENT_DIR}/cli.mdx`;

  // Read the source content file, checking for .mdx and .md files
  const preContent = fs.readFileSync(sourcePath);

  const mdx = await serialize(preContent, {
    parseFrontmatter: true,
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeMdxCodeProps] as any,
    },
  });

  return { props: { source: mdx, sourcePath } };
}

export async function getStaticPaths() {
  const paths: { params: { slug: string[] } }[] = [];
  const pages: SidebarSection[] = cliSidebarContent;

  for (const page of pages) {
    const slug = page.slug.split("/").pop() as string;
    paths.push({ params: { slug: [slug] } });

    for (const subPage of page.pages) {
      paths.push({
        params: { slug: [slug, subPage.slug.replace("/", "")] },
      });

      if ("pages" in subPage) {
        for (const subSubPage of subPage.pages ?? []) {
          paths.push({
            params: {
              slug: [
                slug,
                subPage.slug.replace("/", ""),
                subSubPage.slug.replace("/", ""),
              ],
            },
          });
        }
      }
    }
  }

  return {
    paths,
    fallback: false,
  };
}
