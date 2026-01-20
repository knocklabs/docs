import fs from "fs";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import rehypeMdxCodeProps from "rehype-mdx-code-props";
import remarkGfm from "remark-gfm";

import { MDX_COMPONENTS } from "@/lib/mdxComponents";
import AiChatButton from "../../components/AiChatButton";
import datadogDashboardJson from "../../content/integrations/extensions/datadog_dashboard.json";
import newRelicDashboardJson from "../../content/integrations/extensions/new_relic_dashboard.json";
import eventPayload from "../../data/code/sources/eventPayload";
import MDXLayout from "../../layouts/MDXLayout";
import { CONTENT_DIR } from "../../lib/content.server";
import { useRouter } from "next/router";

function CliPage({ source, sourcePath }) {
  const router = useRouter();
  if (!router.isReady) return null;
  
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
  const sourcePath = `${CONTENT_DIR}/__cli/content.mdx`;

  const preContent = fs.readFileSync(sourcePath);

  const mdx = await serialize(preContent.toString(), {
    parseFrontmatter: true,
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeMdxCodeProps],
    },
  });

  return { props: { source: mdx, sourcePath } };
}

export default CliPage;
