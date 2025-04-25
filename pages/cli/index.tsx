import fs from "fs";
import path from "path";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import remarkSlug from "remark-slug";
import rehypeMdxCodeProps from "rehype-mdx-code-props";

import MDXLayout from "../../layouts/MDXLayout";
import { CONTENT_DIR, generateAlgoliaIndex } from "../../lib/content.server";
import eventPayload from "../../data/code/sources/eventPayload";
import datadogDashboardJson from "../../content/integrations/extensions/datadog_dashboard.json";
import newRelicDashboardJson from "../../content/integrations/extensions/new_relic_dashboard.json";
import AiChatButton from "../../components/AiChatButton";
import { FrontMatter } from "../../types";
import { MDX_COMPONENTS } from "../../lib/mdxComponents";

const CLI_DOC_PATH = path.join(CONTENT_DIR, "cli.mdx");

export default function CLIPage({ source, sourcePath }) {
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

export async function getStaticProps() {
  const source = fs.readFileSync(CLI_DOC_PATH, "utf-8");

  const mdxSource = await serialize<{}, FrontMatter>(source, {
    parseFrontmatter: true,
    mdxOptions: {
      remarkPlugins: [[remarkSlug], [remarkGfm]] as any[],
      rehypePlugins: [rehypeMdxCodeProps, rehypeAutolinkHeadings] as any[],
    },
  });

  // Optional: Index in Algolia
  await generateAlgoliaIndex(source, mdxSource.frontmatter);

  return {
    props: {
      source: mdxSource,
      sourcePath: CLI_DOC_PATH,
    },
  };
}
