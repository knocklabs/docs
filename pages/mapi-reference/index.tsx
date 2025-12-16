import fs from "fs";
import { MDXRemote } from "next-mdx-remote";
import rehypeMdxCodeProps from "rehype-mdx-code-props";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";

import { readOpenApiSpec, readStainlessSpec } from "../../lib/openApiSpec";
import ApiReference from "../../components/ui/ApiReference/ApiReference";
import { CONTENT_DIR } from "../../lib/content.server";
import { MDX_COMPONENTS } from "@/lib/mdxComponents";
import {
  MAPI_REFERENCE_OVERVIEW_CONTENT,
  RESOURCE_ORDER,
} from "../../data/sidebars/mapiOverviewSidebar";

function ManagementApiReferenceNew({
  openApiSpec,
  stainlessSpec,
  preContentMdx,
}) {
  return (
    <ApiReference
      name="Management API"
      openApiSpec={openApiSpec}
      stainlessSpec={stainlessSpec}
      preContent={<MDXRemote {...preContentMdx} components={MDX_COMPONENTS} />}
      resourceOrder={RESOURCE_ORDER}
      preSidebarContent={MAPI_REFERENCE_OVERVIEW_CONTENT}
    />
  );
}

export async function getStaticProps() {
  const openApiSpec = await readOpenApiSpec("mapi");
  const stainlessSpec = await readStainlessSpec("mapi");

  const preContent = fs.readFileSync(
    `${CONTENT_DIR}/__mapi-reference/content.mdx`,
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

export default ManagementApiReferenceNew;
