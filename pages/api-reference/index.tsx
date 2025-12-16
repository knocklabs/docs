import fs from "fs";
import { MDXRemote } from "next-mdx-remote";
import rehypeMdxCodeProps from "rehype-mdx-code-props";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";

import { readOpenApiSpec, readStainlessSpec } from "@/lib/openApiSpec";
import { CONTENT_DIR } from "@/lib/content.server";
import { MDX_COMPONENTS } from "@/lib/mdxComponents";
import ApiReference from "@/components/ui/ApiReference/ApiReference";
import {
  RESOURCE_ORDER,
  API_REFERENCE_OVERVIEW_CONTENT,
} from "@/data/sidebars/apiOverviewSidebar";

function ApiReferencePage({ openApiSpec, stainlessSpec, preContentMdx }) {
  return (
    <ApiReference
      name="API reference"
      openApiSpec={openApiSpec}
      stainlessSpec={stainlessSpec}
      preContent={<MDXRemote {...preContentMdx} components={MDX_COMPONENTS} />}
      resourceOrder={RESOURCE_ORDER}
      preSidebarContent={API_REFERENCE_OVERVIEW_CONTENT}
    />
  );
}

export async function getStaticProps() {
  const openApiSpec = await readOpenApiSpec("api");
  const stainlessSpec = await readStainlessSpec("api");

  const preContent = fs.readFileSync(
    `${CONTENT_DIR}/__api-reference/content.mdx`,
  );

  const preContentMdx = await serialize(preContent.toString(), {
    parseFrontmatter: true,
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeMdxCodeProps],
    },
  });

  return { props: { openApiSpec, stainlessSpec, preContentMdx } };
}

export default ApiReferencePage;
